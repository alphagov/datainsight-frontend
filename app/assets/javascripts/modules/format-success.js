var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.pluralise = function (s, a) {
    if (a && a.length !== 1 && s && s.substr(s.length - 1) != 's') {
        s += 's';
    }
    return s;
};

GOVUK.Insights.formatSuccess = function() {
    
    if ($('.ie6, .ie7').length) {
        // content explorer is not compatible with IE6 or IE7 at the moment
        $('#content-explorer').remove();
        return;
    }
    
    var data = {};
    
    var onSuccess = function(data) {
        // convert data into required format, calculate aggregated
        var dataByFormat = {};
        
        $.each(data, function (key, value) {
            if (!dataByFormat[value.format]) {
                dataByFormat[value.format] = [];
            }
            dataByFormat[value.format].push(value);
        });
        
        var aggregatedDataByFormat = {};
        $.each(dataByFormat, function (format, artefacts) {
            
            $.each(artefacts, function (i, d) {
                if (d.successes && d.entries) {
                    d.percentage_of_success = 100 * d.successes / d.entries
                } else {
                    d.percentage_of_success = null;
                }
            });

            aggregatedDataByFormat[format] = {
                format: format,
                count: artefacts.length,
                entries: d3.sum(artefacts, function (d) {
                    return d.entries;
                }),
                artefacts: artefacts
            }
        });
        
        var currentData, currentVisualisation = 'table';
        var filteredArtefacts;
        var table, formatSuccess, graph;
        
        var onFilterChange = function (term, selectOptions) {
            if (currentVisualisation == 'table' && table) {
                table.data = $.extend([], selectOptions);
                table.resort();
                table.render();
            } else if (formatSuccess) {
                formatSuccess.filter(graph, term);
            }
        };
        
        var onFilterSelect = function (el) {
            if (currentVisualisation == 'graph' && formatSuccess) {
                formatSuccess.pulse(graph, el);
            }
        };
        
        
        var plotFormatSuccess = function () {
            if (table) {
                table.close();
                table = null;
            }
            
            GOVUK.Insights.formatData = GOVUK.Insights.formats[currentData.format];

            GOVUK.Insights.createFilter(currentData.artefacts, onFilterChange, onFilterSelect);
            
            GOVUK.Insights.updateEngagementCriteria();
            GOVUK.Insights.updateTagline(
                $('#format-success-module .tagline'),
                currentVisualisation,
                GOVUK.Insights.formatData
            );
            
            $('#format-success-wrapper').prop('className', currentVisualisation);
            
            if (currentVisualisation == 'table') {
                table = GOVUK.Insights.plotFormatSuccessTable(currentData);
            } else {
                formatSuccess = GOVUK.Insights.plotFormatSuccessDetail(currentData);
                graph = d3.select('#format-success');
            }
            if ($.combobox.instances.length) {
                $.combobox.instances[0].textInputElement.trigger('change');
            }
        };
        
        if (GOVUK.isSvgSupported()) {
            
            currentVisualisation = 'graph';
            
            var ul = $('<ul id="format-success-type"></ul>');
            $('#format-success-module .tagline').before(ul);
            
            var clickHandler = function (visualisation) {
                ul.find('li').removeClass('active');
                $(this).addClass('active');
                currentVisualisation = visualisation;
                plotFormatSuccess();
            };
            
            $('<li>chart</li>').addClass('active').on('click', function (e) {
                clickHandler.call(this, 'graph');
            }).appendTo(ul);
            $('<li>table</li>').on('click', function (e) {
                clickHandler.call(this, 'table');
            }).appendTo(ul);
        }
        
        
        
        var tabs = $('#format-success-tabs li');
        tabs.on('click', function (e) {
            tabs.removeClass('active');

            var $this = $(this);
            $this.addClass('active');

            var format = $this.data('format');

            $('#format-success').find('.scatterplot').empty();

            if (!format) {
                return;
            }
            
            currentData = aggregatedDataByFormat[format];
            currentArtefacts = currentData.artefacts;
            
            plotFormatSuccess();
        });
        
        tabs.eq(0).trigger('click');
    };
    
    var showError = function () {
        var el = $("#format-success");
        el.empty().removeClass('placeholder');
        el.append(GOVUK.Insights.Helpers.error_div);
    };
    
    $.ajax({
        url: GOVUK.Insights.contentEngagementUrl,
        success: function (response) {
            $("#format-success").removeClass('placeholder');
            if (response !== null) {
                onSuccess(response.details.data);
            } else {
                showError();
            }
        },
        error: function () {
            showError();
        }
    });
};

/**
 * Sorts columns containing numbers and nulls in the following order:
 * 1. Numeric values, either ascending or descending
 * 2. Null values, sorted alphabetically ascending by slug as fallback
 */
GOVUK.Insights.formatSuccessTableComparator = function (a, b, columnId, descending) {
    var aVal = a[columnId];
    var bVal = b[columnId];
    var aIsNumber = (typeof aVal === 'number');
    var bIsNumber = (typeof bVal === 'number');
    
    var compareTitles = false;
    if (aVal === null && bVal === null) {
        // no point comparing two null values,
        // sort alphabetically instead
        aVal = a.title || a.slug;
        bVal = b.title || b.slug;
        compareTitles = true;
    }
    
    if (aIsNumber && bIsNumber || compareTitles) {
        // a normal sort behaviour, sorts by numbers or alphabetically
        var res = 0;
        if (aVal < bVal) {
            res = -1;
        } else if (aVal > bVal) {
            res = 1;
        }
        if (descending && !compareTitles) {
            // don't sort descending when using the title fallback
            res *= -1;
        }
        return res;
    }
    
    // special cases - nulls are always lower than an actual value
    if (aIsNumber && bVal === null) {
        return -1;
    }
    if (bIsNumber && aVal === null) {
        return 1;
    }
    
    return 0;
};

GOVUK.Insights.plotFormatSuccessTable = function (data) {
    var colourRange = ["#BF1E2D", "#6A6A6A", "#4A7812"];
    var colourScale;
    if (window.d3 && d3.scale) {
        colourScale = d3.scale.linear().domain([0, 50, 100]).range(colourRange);
    }
    
    var table = new GOVUK.Insights.Table({
        lazyRender: true
    });
    
    table.columns = [
        {
            id: 'title',
            title: GOVUK.Insights.formatData.title,
            className: 'title',
            getValue: function (d, column) {
                // display title if available, fall back to slug
                var title = d.title || d.slug;
                
                // display as link if url is available
                if (d.url) {
                    return $('<a></a>').text(title).prop({
                        href: d.url,
                        rel: 'external',
                        target: '_blank'
                    });
                } else {
                    return title;
                }
            },
            sortable: true,
            comparator: function (a, b, column, descending) {
                var aVal = a.title || a.slug;
                var bVal = b.title || b.slug;
                
                var res = 0;
                if (aVal < bVal) {
                    res = -1;
                } else if (aVal > bVal) {
                    res = 1;
                }
                if (descending) {
                    res *= -1;
                }
                return res;
            }
        },
        {
            id: 'entries',
            title: 'Views',
            className: 'entries',
            getValue: function (d, column) {
                return d.entries || '&ndash;';
            },
            sortable: true,
            defaultDescending: true,
            comparator: function (a, b, column, descending) {
                return GOVUK.Insights.formatSuccessTableComparator(
                    a, b, 'entries', descending
                );
            }
        },
        {
            id: 'percentage_of_success',
            title: 'Engagement',
            getValue: function (d, column) {
                if (!d.successes || !d.entries) {
                    return '&ndash;';
                }
                
                var v = d.percentage_of_success;
                
                var span = $('<span></span>');
                if (colourScale) {
                    span.css('color', colourScale(v));
                }
                span.html(v.toFixed(1) + '%');
                return span;
            },
            className: 'engagement',
            sortable: true,
            defaultDescending: true,
            comparator: function (a, b, column, descending) {
                return GOVUK.Insights.formatSuccessTableComparator(
                    a, b, 'percentage_of_success', descending
                );
            }
        }
    ];
    
    table.data = data.artefacts;
    table.sortByColumn(table.columns[2], true);
    table.render();
    
    var el = $('#format-success').empty();
    el.append(table.el);
    
    return table;
};


GOVUK.Insights.plotFormatSuccessDetail = function(data) {
    
    $('#format-success').empty();
    
    var artefacts = data.artefacts;
    
    var successMin = Infinity, successMax = 0;

    var entriesMax = d3.max(artefacts, function (d) {
        return d.entries;
    });
    
    var allItemsCount = artefacts.length;
    
    // create alphabetical list of slugs for filter
    var filterArtefacts = $.extend([], artefacts).sort();
    
    // filter out pages with very low entries
    var entriesThreshold = 1000;
    artefacts = artefacts.filter(function(d) {
        return d.entries >= entriesThreshold;
    });
    
    var excludedItemsCount = Math.max(0, allItemsCount - artefacts.length);
    
    
    artefacts = artefacts.map(function(d) {
        
        successMin = Math.min(successMin, d.percentage_of_success);
        successMax = Math.max(successMax, d.percentage_of_success);
        var label = d.title || d.slug;
        if (d.url) {
            label = $('<a></a>').html($('<span></span>').text(label)).prop({
                href: d.url,
                target: '_blank',
                rel: 'external'
            });
        }

        return {
            x: d.percentage_of_success,
            y: d.entries,
            colour: d.percentage_of_success,
            label: label,
            id: d.slug
        };
    });
    
    var successMean = d3.mean(artefacts, function(d) {
        return d.x;
    });

    var successDeviation = Math.max(
        successMean - successMin, successMax - successMean
    );
    
    var xMargin = (successMax - successMin) * .01;
    
    var formatSuccess = GOVUK.Insights.scatterplotGraph()
        .xAxisLabels({
            description:"Engagement",
            left:"Less engaged",
            right:"More engaged",
            calloutValue: function (d, config) {
                return Math.abs(d.x).toFixed(1) + '%';
            },
            squares: false,
            scaleLabels: true,
            deviation: successDeviation / successMean
        })
        .yAxisLabels({
            description: "Views",
            bottom: "Fewer views",
            top: "More views",
            calloutValue: function (d, config) {
                return GOVUK.Insights.formatNumericLabel(config.y(d))
            }
        })
        .r(function (d) { return d.y; })
        .showCircleLabels(true)
        .circleStrokeWidth(1)
        .minRadius(2)
        .maxRadius(10)
        .xDomainBottom(successMin - xMargin)
        .xDomainTop(successMax + xMargin)
        .yDomainBottom(entriesThreshold)
        .cDomain([
            0, 50, 100
        ])
        .verticalOffsetForYAxisLabel(12);
    
    var graph = d3.select('#format-success');
    graph
        .datum(artefacts)
        .call(formatSuccess);
        
    var svg = $('#format-success svg');
    GOVUK.Insights.svg.adjustToParentWidth(svg);
    $(window).on('resize', function (e) {
        GOVUK.Insights.svg.adjustToParentWidth(svg);
    });
        
    return formatSuccess;
};


GOVUK.Insights.updateHeadline = function (el, term, selectOptions, formatData) {
    formatData = formatData || GOVUK.Insights.formatData;
    
    var title;
    if (selectOptions.length === 1) {
        title = formatData.headline;
    } else if (formatData.headlinePlural) {
        title = formatData.headlinePlural;
    } else {
        title = GOVUK.Insights.pluralise(
            formatData.headline, selectOptions
        );
    }
    
    var viewCount = 0;
    $.each(selectOptions, function (i, d) {
        if (d.entries > 0) {
            viewCount += d.entries;
        }
    });
    var currentVisualisation = $('#format-success-wrapper').prop('className');
    
    var headline = [
        '<em>' + selectOptions.length + '</em> ',
        title
    ];
    
    if (term) {
        headline.push(
            ' ',
            selectOptions.length == 1 ? 'contains' : 'contain',
            ' <em>&ldquo;',
            term,
            '&rdquo;</em>'
        );
    }
    
    if (currentVisualisation == 'graph') {
        var count;
        if (term) {
            count = $('#format-success circle.enabled').length;
        } else {
            count = $('#format-success circle').length;
        }
        headline.push(
            ' (',
            count,
            ' in chart view)'
        );
    }
    
    el.html(headline.join(''));
};

GOVUK.Insights.updateTagline = function (el, currentVisualisation, formatData) {
    
    var tagline;
    if (currentVisualisation == 'graph') {
        if (formatData && formatData.taglineGraph) {
            tagline = formatData.taglineGraph;
        } else {
            tagline = 'Items with fewer than 1000 views are not shown';
        }
    } else if (currentVisualisation == 'table') {
        if (formatData && formatData.taglineTable) {
            tagline = formatData.taglineTable;
        } else {
            tagline = 'Data not available for items with fewer than 1000 views';
        }
    }
    el.html(tagline);
};

GOVUK.Insights.createFilter = function (artefacts, onChange, onSelect) {
    
    var headlineEl = $('#format-success-module h3');
    
    var filterEl = $('#scatterplot-filter');
    
    
    var closeFilterEl = $('<div></div>').addClass('close hidden')
    closeFilterEl.on('click', function (e) {
        filterEl.val('').trigger('keyup');
    });
    
    
    if ($.combobox.instances.length) {
        $.combobox.instances[0].setSelectOptions(artefacts);
    } else {
        filterEl.combobox(artefacts, {
            accessor: function (d) {
                return d.title || d.slug;
            },
            noShowSelectorButton: true,
            summaryEntry: true,
            onSelect: onSelect
        }).on('change keyup', function (e) {
            var term = $(this).val();
            var selectOptions = $.combobox.instances[0].selector.selectOptions;
            
            // show / hide filter 'x' button
            closeFilterEl[(term ? 'remove':'add')+'Class']('hidden');
            
            onChange(term, selectOptions);
            
            GOVUK.Insights.updateHeadline(headlineEl, term, selectOptions);
        });
        filterEl.before(closeFilterEl);
    }
};

GOVUK.Insights.updateEngagementCriteria = function (formatData) {
    formatData = formatData || GOVUK.Insights.formatData;
    $('#engagement-criteria h4').html(formatData.title + ' engagement criteria');
    $('#engagement-criteria p').html(formatData.criteria);
};

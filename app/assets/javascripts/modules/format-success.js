var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.pluralise = function (s, a) {
    if (a && a.length !== 1 && s && s.substr(s.length - 1) != 's') {
        s += 's';
    }
    return s;
};

GOVUK.Insights.formatSuccess = function() {
    
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
                title: GOVUK.Insights.formatTitles[format],
                count: artefacts.length,
                entries: d3.sum(artefacts, function (d) {
                    return d.entries;
                }),
                artefacts: artefacts
            }
        });
        
        var currentData, currentVisualisation = 'table';
        
        var plotFormatSuccess = function () {
            if (currentVisualisation == 'table') {
                GOVUK.Insights.plotFormatSuccessTable(currentData);
            } else {
                GOVUK.Insights.plotFormatSuccessDetail(currentData);
            }
        };
        
        
        if (GOVUK.isSvgSupported()) {
            currentVisualisation = 'graph';
            
            var ul = $('<ul id="format-success-type"></ul>');
            $('#format-success').before(ul);
            
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
            
            plotFormatSuccess();
        });
        
        tabs.eq(0).trigger('click');
    };
    
    $.ajax({
        url: GOVUK.Insights.contentEngagementUrl,
        success: function (response) {
            if (response !== null) {
                $("#format-success").removeClass('placeholder');
                onSuccess(response.details.data);
            } else {
                // show error
                $("#format-success-module").append(GOVUK.Insights.Helpers.error_div);
            }
        },
        error: function () {
            console.log(arguments);
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
    var colourScale = d3.scale.linear().domain([0, 50, 100]).range(colourRange);
    
    var table = new GOVUK.Insights.Table({
        lazyRender: true
    });
    
    table.columns = [
        {
            id: 'title',
            title: data.title.slice(0, 1).toUpperCase() + data.title.slice(1),
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
                span.css('color', colourScale(v));
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
};


GOVUK.Insights.plotFormatSuccessDetail = function(data) {
    $('#format-success').empty();
    
    var artefacts = data.artefacts;
    
    var successMin = Infinity, successMax = 0;

    var entriesMax = d3.max(artefacts, function (d) {
        return d.entries;
    });
    
    var allItemsCount = artefacts.length;
    
    // filter out pages with very low entries
    var entriesThreshold = 1000;
    artefacts = artefacts.filter(function(d) {
        return d.entries >= entriesThreshold;
    });
    
    var excludedItemsCount = Math.max(0, allItemsCount - artefacts.length);
    
    // create alphabetical list of slugs for filter
    var slugs = artefacts.map(function (d) {
        return d.slug;
    }).sort();
    
    
    artefacts = artefacts.map(function(d) {
        
        successMin = Math.min(successMin, d.percentage_of_success);
        successMax = Math.max(successMax, d.percentage_of_success);

        return {
            x: d.percentage_of_success,
            y: d.entries,
            colour: d.percentage_of_success,
            label: d.slug,
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
            bottom: "Less views",
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
        
    // filter box
    var closeFilterEl = $('<div></div>').addClass('close hidden')
    
    
    var el = $('#format-success-module h3');
    
    GOVUK.Insights.formatTitle = data.title;
    
    var applyFilter = function (e) {
        var term = $(this).val();
        
        // show / hide filter 'x' button
        closeFilterEl[(term ? 'remove':'add')+'Class']('hidden');
        
        // apply filter
        formatSuccess.filter(graph, term);
        
        
        // update headline
        var enabledItems = graph.selectAll('circle.enabled');
        var enabledItemsViews = d3.sum(enabledItems.data(), function (d) {
            return d.y;
        });
        enabledItemsViews = GOVUK.Insights.formatNumericLabel(enabledItemsViews);
        
        var title = GOVUK.Insights.pluralise(
            GOVUK.Insights.formatTitle, enabledItems[0]
        );
        
        var headline = [
            '<em>' + enabledItems[0].length + '</em> ',
            title,
            term ? ' containing <em>&ldquo;' + term + '&rdquo;</em>' : '',
            ', viewed&nbsp;<em>' + enabledItemsViews + '&nbsp;times</em>'
        ].join('');
        
        el.html(headline);
    };
    
    var filterEl = $('#scatterplot-filter');
    
    if ($.combobox.instances.length) {
        $.combobox.instances[0].setSelectOptions(slugs);
    } else {
        filterEl.combobox(slugs, {
            noShowSelectorButton: true,
            summaryEntry: true,
            onSelect: function (el) {
                formatSuccess.pulse(graph, el);
            }
        }).on('change keyup', applyFilter);
        filterEl.before(closeFilterEl);
        closeFilterEl.on('click', function (e) {
            filterEl.val('').trigger('change');
        });
    }
    
    filterEl.trigger('change');
    
    GOVUK.Insights.updateExcludedItemsCount(
        excludedItemsCount, $('#format-success-module legend')
    );
};

GOVUK.Insights.updateExcludedItemsCount = function (count, el) {
    if (count > 0) {
        el.find('.num-items-excluded').text(count);
        el.find('.excluded-items').show();
    } else {
        el.find('.excluded-items').hide();
    }
    
};
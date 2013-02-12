var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.pluralise = function (s, a) {
    if (a && a.length !== 1 && s && s.substr(s.length - 1) != 's') {
        s += 's';
    }
    return s;
};

GOVUK.Insights.formatSuccess = function() {
    
    if (!GOVUK.isSvgSupported()) {
        return;
    };
    
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

            GOVUK.Insights.plotFormatSuccessDetail(
                aggregatedDataByFormat[format]
            );
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


GOVUK.Insights.plotFormatSuccessDetail = function(data) {
    
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
        
        var percentage = d.percentage_of_success = 100 * d.successes / d.entries
        
        successMin = Math.min(successMin, percentage);
        successMax = Math.max(successMax, percentage);

        return {
            x: percentage,
            y: d.entries,
            colour: percentage,
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
    
    // update tagline
    if (excludedItemsCount > 0) {
        el.find('.num-items-excluded').text(excludedItemsCount);
        el.find('.excluded-items').show();
    } else {
        el.find('.excluded-items').hide();
    }
    el.find('.num-views').text(
        GOVUK.Insights.formatNumericLabel(data.entries)
    );
};

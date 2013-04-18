var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.months_range = function (startDate, endDate, step) {
    function monthDiff(t1, t2) {
        return (t1.getYear() * 12 + t1.getMonth()) - (t2.getYear() * 12 + t2.getMonth());
    }

    var months = 0,
        time = new Date(+endDate),
        times = [];

    while (time >= startDate) {
        if (months % step == 0) {
            times.push(new Date(+time));
        }
        // move on by 'step' months, if the resulting month is not what's expected then it means the target month
        // doesn't have enough days in it. Step backwards day by day until we get the correct month.
        months -= step;
        time = new Date(+endDate);
        time.setMonth(time.getMonth() + months);
        while (monthDiff(time, endDate) != months) {
            time = new Date(time - 86400000);
        }
    }
    return times.reverse();
};

GOVUK.Insights.findClosestDataPointInSeries = function(mousePoint, series, getDataPoint) {
    return series.reduce(function(datum, closestDatum) {
        return getDataPoint(datum).distanceFrom(mousePoint) < getDataPoint(closestDatum).distanceFrom(mousePoint) ? datum : closestDatum;
    });
};

GOVUK.Insights.findClosestDataPoint = function(mousePoint, data, getDataPoint, preferredSeries) {
    var closest = {}

    var things = Object.keys(data).map(function(seriesName) {
        var closestPointInSeries = GOVUK.Insights.findClosestDataPointInSeries(mousePoint, data[seriesName], getDataPoint);
        return {
            seriesName: seriesName,
            dataPoint: getDataPoint(closestPointInSeries),
            datum: closestPointInSeries,
        };
    });

    var weightedDistanceOf = function(aThing) {
        if (!preferredSeries) return mousePoint.distanceFrom(aThing.dataPoint);
        return mousePoint.distanceFrom(aThing.dataPoint) * (aThing.seriesName === preferredSeries ? 1 : 3);
    };

    return things.reduce(function(aThing, anotherThing) {
        return weightedDistanceOf(aThing) < weightedDistanceOf(anotherThing) ? aThing : anotherThing;
    });

    return closest;
};



GOVUK.Insights.sixMonthTimeSeries = function (container, params) {
    var series = extractKeys(params.series),
        margins = {top:22, right:27, bottom:27, left:40},
        width = params.width || 462,
        height = params.height || (236 + 22),
        plottingAreaWidth = 378,
        plottingAreaHeight = 214,

        dateFormat = d3.time.format("%Y-%m-%d");

    function concat(data, keys) {
        var a = [];
        // TODO: improve this
        $(keys).each(function (i, key) {
            a = a.concat(data[key]);
        });
        return a
    }

    function sixMonthDateRange(now) {
        var lastDate = now.startOf("day").day(0);
        var firstDate = lastDate.clone().subtract("months", 6);
        return [firstDate.toDate(), lastDate.toDate()];
    }

    function createDatum(datum, site) {
        return {
            "endDate": dateFormat.parse(datum.end_at),
            "value": datum.value[site],
            "site": site,
            "startDate": dateFormat.parse(datum.start_at)
        };
    }

    function isWithinExtent(datum, extent) {
        var startDate = moment(datum.start_at),
            endDate = moment(datum.end_at);

        return startDate >= extent[0] && endDate <= extent[1];
    }

    function extractData(inputData) {
        var data = {
                "govuk":[],
                "directgov":[],
                "businesslink":[]
            };

        inputData.forEach(function(datum) {
            for (var site in datum.value) {
                if (isWithinExtent(datum, xExtent(site))) {
                    data[site].push(createDatum(datum, site));
                }
            }
        });
        return data;
    }

    function extractKeys(hash) {
        var keys = [];
        for (var key in hash) if (hash.hasOwnProperty(key)) {
            keys.push(key);
        }
        return keys
    }

    function lineGenerator(xScale, yScale) {
        return d3.svg.line()
            .x(function (d) {
                return xScale(d.endDate);
            })
            .y(function (d) {
                return yScale(d.value);
            });
    }

    function extentForLastYear(xExtent) {
        var extent = xExtent.map(function (date) {
            return moment(date).clone().subtract('years', 1).toDate();
        });
        extent.lastYear = true;
        return extent;
    }

    function xExtent(site) {
        if (xExtent.cache === undefined) {
            var currentExtent = sixMonthDateRange(moment()),
                previousExtent = extentForLastYear(currentExtent);
            xExtent.cache = {
                "govuk":        currentExtent,
                "businesslink": previousExtent,
                "directgov":    previousExtent
            };
        }
        return xExtent.cache[site];
    }

    function xScale(site) {
        var extent = xExtent(site);
        var range = d3.time
            .scale()
            .domain(extent)
            .range([0, width - margins.right - margins.left]);
        range.lastYear = extent.lastYear;
        return range;
    }

    return {
        dateRange: sixMonthDateRange,
        render:function (rawData) {
            var data = extractData(rawData);

            if (data == null) {
                throw "No data!";
            }
            var alldata = concat(data, series);
            if (alldata == null || alldata.length == 0) {
                throw "No data!";
            }


            var defaultXScale = xScale("govuk"),

            yMax = d3.max(alldata, function(d) { return d.value}),
            yTicks = GOVUK.Insights.calculateLinearTicks([0, yMax], 4),
            yScale = d3.scale.linear().domain(yTicks.extent).range([height - margins.top - margins.bottom, 0]),

            svg = d3.select(container)
                .append("svg:svg")
                .attr("width",width)
                .attr("height",height)
                .attr("viewBox","0 0 " + width + " " + height),

            graph = svg.append("svg:g")
                .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

            /* Set up X Axis */
            var xAxis = d3.svg.axis()
                .scale(defaultXScale)
                .ticks(GOVUK.Insights.months_range, 2)
                .tickPadding(4)
                .tickFormat(GOVUK.Insights.shortDateFormat);

            graph.append("svg:g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + (height - margins.top - margins.bottom + 5) + ")")
                .call(xAxis);

            /* Set Up Y-Axis */
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .tickValues(yTicks.values)
                .orient("left")
                .tickFormat(GOVUK.Insights.numberListFormatter(yTicks.values));
            graph.append("svg:g")
                .attr("class", "y-axis")
                .attr("transform", "translate(-3,0)")
                .call(yAxis);

            var plottingArea = graph.append("svg:g")
                .attr("class", "js-graph-area")
                .attr("height", "214");



            /* Add The Graph Lines */
            series.forEach(function(site) {
                var line = lineGenerator(xScale(site), yScale);
                plottingArea.append("svg:path")
                    .attr("d", line(data[site]))
                    .classed(params.series[site].lineClass, true)
                    .classed(site, true)
                    .classed("no-scale", true);
            });

            /* Label Placement */
            var seriesLastValue =
                $(series)
                    .filter(function (i, name) {
                        return data[name].length != 0;
                    })
                    .map(function (i, name) {
                        return {
                            "container":container,
                            "name":name,
                            "legend":params.series[name].legend
                        };
                    });

            function ypos(seriesName, dateString) {
                var series = data[seriesName];
                for (var i = 0; i < series.length; ++i) {
                    if (series[i].endDate.getTime() == dateFormat.parse(dateString).getTime()) {
                        return yScale(series[i].value);
                    }
                }
                return 0;
            }

            function createTextLabel(item) {
                var scale = xScale(item.name);
                var x = scale(dateFormat.parse(item.legend.anchor)) + (item.legend.xOffset || 0);
                var y = ypos(item.name, item.legend.anchor) + (item.legend.yOffset || 0);
                var text = plottingArea.append("svg:text")
                    .classed(item.name + "-label", true)
                    .classed("line-label", true)
                    .attr("x", x)
                    .attr("y", y)
                    .text(item.legend.text);

                if (scale.lastYear) {
                    text.append("svg:tspan")
                        .text(' (last year)');
                }
            }

            for (var i = 0; i < seriesLastValue.length; ++i) {
                createTextLabel(seriesLastValue[i]);
            }
            plottingArea.selectAll('text').each(function () { GOVUK.Insights.svg.createTextShade(this) });

            var currentCallout = null;
            var currentSelectedSeries;
            
            var resetPath = function(dontReset) {
                plottingArea.select(".highlight").classed("highlight", false);
                plottingArea.select("#dataPointHighlight").remove();
                
                if (currentCallout) {
                    currentCallout.close();
                    currentCallout = null;
                }
            };
            
            plottingArea.append("svg:rect")
                .attr("class", "callout-area")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", plottingAreaWidth)
                .attr("height", plottingAreaHeight)
                .on("mousemove", function () {
                    var mousePoint = GOVUK.Insights.point(d3.mouse(this));

                    var closest = GOVUK.Insights.findClosestDataPoint(mousePoint, data, function(d) {
                        return GOVUK.Insights.point(xScale(d.site)(d.endDate), yScale(d.value));
                    }, currentSelectedSeries);
                    
                    currentSelectedSeries = closest.seriesName;

                    plottingArea.select(".highlight").classed("highlight", false);
                    plottingArea.select("#dataPointHighlight").remove();

                    // bring line to front
                    this.parentNode.insertBefore(plottingArea.select('.' + closest.seriesName).node(),this);

                    plottingArea.insert("svg:circle", "rect")
                        .attr("cx", closest.dataPoint.x())
                        .attr("cy", closest.dataPoint.y())
                        .attr("r", 3.5)
                        .attr("id", "dataPointHighlight")
                        .attr("class", closest.seriesName);
                    plottingArea.select("." + closest.seriesName).classed("highlight", true);

                    // hide callout
                    if (currentCallout) {
                        currentCallout.close();
                    }
                    
                    // show callout
                    var boxWidth = 165,
                        boxHeight = 48,
                        xOffset = -20,
                        yOffset = -60,
                        intendedXPos = (closest.dataPoint.x() + margins.left + xOffset) - boxWidth,
                        xPos = (intendedXPos < margins.left) ? (closest.dataPoint.x() + margins.left - xOffset) : intendedXPos,
                        yPos = (closest.dataPoint.y() < height/2) ? (closest.dataPoint.y() + margins.top - yOffset) - boxHeight : (closest.dataPoint.y() + margins.top + yOffset),
                        calloutInfo = {
                            xPos: xPos,
                            yPos: yPos,
                            width: boxWidth,
                            height: boxHeight,
                            parent: container,
                            title: GOVUK.Insights.shortDateFormat(closest.datum.startDate) + " - " +
                                   GOVUK.Insights.shortDateFormat(closest.datum.endDate) + " " +
                                   closest.datum.endDate.getFullYear(),
                            rowData: [
                                {
                                    right: GOVUK.Insights.formatNumericLabel(closest.datum.value),
                                    left: params.series[closest.seriesName].legend.text
                                }
                            ],
                            boxClass: closest.seriesName,
                            callback: function (onTouch) {
                                // reset path appearance only when callback
                                // close was triggered by the document-wide
                                // touchend handler. desktop browsers are
                                // handled via mouseout.
                                if (onTouch) {
                                    resetPath();
                                }
                            }
                        };

                    currentCallout = new GOVUK.Insights.overlay.CalloutBox(calloutInfo);
                })
                .on("mouseout", function() {
                    var mousePoint = GOVUK.Insights.point(d3.mouse(this));
                    if ((mousePoint.x() < 0) || (mousePoint.x() > plottingAreaWidth) || (mousePoint.y() < 0) || (mousePoint.y() > plottingAreaHeight)) {
                        resetPath();
                    }
                });
            
            
            // ensure that graph is displayed in correct size in all browsers
            var adjustSize = function () {
                GOVUK.Insights.svg.adjustToParentWidth($(svg.node()));
            };
            // wait for reflow, ensures size is reported correctly
            setTimeout(adjustSize, 0);
            $(window).on('resize', adjustSize);
        }
    };
};

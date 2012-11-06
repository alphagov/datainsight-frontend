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

GOVUK.Insights.findClosestDataPoint = function(mousePoint, data, getDataPoint) {
    var closest = {}

    var things = Object.keys(data).map(function(seriesName) {
        var closestPointInSeries = GOVUK.Insights.findClosestDataPointInSeries(mousePoint, data[seriesName], getDataPoint);
        return {
            seriesName: seriesName,
            dataPoint: getDataPoint(closestPointInSeries),
            datum: closestPointInSeries,
        };
    });
    
    var currentSeriesName = 'none'
    
    var weightedDistanceOf = function(aThing) {
        return mousePoint.distanceFrom(aThing.dataPoint) * (aThing.seriesName === currentSeriesName ? 1 : 2);
    };
    
    return things.reduce(function(aThing, anotherThing) {
        // distance as function of geom distance and series name
        return weightedDistanceOf(aThing) < weightedDistanceOf(anotherThing) ? aThing : anotherThing;
    });

    // for (var seriesName in data) {
    //     var series = data[seriesName];
    //     
    //     var closestPointInSeries = GOVUK.Insights.findClosestDataPointInSeries(mousePoint, series, getDataPoint);
    //     
    //     if (!closest.dataPoint || getDataPoint(closestPointInSeries).distanceFrom(mousePoint) < closest.dataPoint.distanceFrom(mousePoint)) {
    //         closest.dataPoint = getDataPoint(closestPointInSeries);
    //         closest.seriesName = seriesName;
    //         closest.datum = closestPointInSeries;
    //     }
    // }

    return closest;
};



GOVUK.Insights.sixMonthTimeSeries = function (container, params) {
    function concat(data, keys) {
        var a = [];
        // TODO: improve this
        $(keys).each(function (i, key) {
            a = a.concat(data[key]);
        });
        return a
    }

    function extractKeys(hash) {
        var keys = [];
        for (var key in hash) if (hash.hasOwnProperty(key)) {
            keys.push(key);
        }
        return keys
    }

    var series = extractKeys(params.series),
        margins = {top:22, right:27, bottom:27, left:40},
        width = params.width || 462,
        height = params.height || (236 + 22),
        plottingAreaWidth = 378,
        plottingAreaHeight = 214,

        dateFormat = d3.time.format("%Y-%m-%d");

    return {
        dateRange:function (now) {
            var lastDate = now.startOf("day").day(0);
            var firstDate = lastDate.clone().subtract("months", 6);
            return [firstDate.toDate(), lastDate.toDate()];
        },
        render:function (rawData) {
            var data = {
                "govuk":[],
                "directgov":[],
                "businesslink":[]
            };
            for (var i = 0; i < rawData.length; i++) {
                for (var k in rawData[i].value) {
                    data[k].push({"date":rawData[i].end_at, "value":rawData[i].value[k], "startDate": rawData[i].start_at});
                }
            }
            if (data == null) {
                throw "No data!";
            }
            var alldata = concat(data, series);
            if (alldata == null || alldata.length == 0) {
                throw "No data!";
            }

            var xExtent = this.dateRange(moment()),
            xScale = d3.time.scale().domain(xExtent).range([0, width - margins.right - margins.left]),


            yMax = d3.max(alldata, function(d) { return d.value}),
            yTicks = GOVUK.Insights.calculateLinearTicks([0, yMax], 4),
            yScale = d3.scale.linear().domain(yTicks.extent).range([height - margins.top - margins.bottom, 0]),

            line = d3.svg.line()
                .x(function (d) {
                    return xScale(dateFormat.parse(d.date));
                })
                .y(function (d) {
                    return yScale(d.value);
                }),

            graph = d3.select(container)
                .append("svg:svg")
                .attr("width", width)
                .attr("height", height)
                .append("svg:g")
                    .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

            /* Set up X Axis */
            function formatDate(date) {
                return date.getDate() + " " + GOVUK.Insights.SHORT_MONTHS[date.getMonth()];
            }
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(GOVUK.Insights.months_range, 2)
                .tickPadding(4)
                .tickFormat(formatDate);

            graph.append("svg:g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + (height - margins.top - margins.bottom + 5) + ")")
                .call(xAxis);

            /* Set Up Y-Axis */
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .tickValues(yTicks.values)
                .orient("left")
                .tickFormat(GOVUK.Insights.numericLabelFormatterFor(yTicks.step));
            graph.append("svg:g")
                .attr("class", "y-axis")
                .attr("transform", "translate(-5,0)")
                .call(yAxis);

            var plottingArea = graph.append("svg:g")
                .attr("class", "js-graph-area")
                .attr("height", "214");



            /* Add The Graph Lines */
            $(series).each(function (i, name) {
                var path = plottingArea.append("svg:path")
                    .attr("d", line(data[name]))
                    .classed(params.series[name].lineClass, true)
                    .classed(name, true);
            });


            /* Label Placement */
            seriesLastValue =
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

            function ypos(seriesName, date) {
                var series = data[seriesName];
                for (var i = 0; i < series.length; ++i) {
                    if (series[i].date == date) {
                        return yScale(series[i].value);
                    }
                }
                return 0;
            }

            function createTextLabel(item) {
                var x = xScale(dateFormat.parse(item.legend.anchor)) + (item.legend.xOffset || 0);
                var y = ypos(item.name, item.legend.anchor) + (item.legend.yOffset || 0);
                plottingArea.append("svg:text")
                    .attr("style", "text-anchor: middle")
                    .attr("class", item.name + "-label " + item.legend.class)
                    .attr("x", x)
                    .attr("y", y)
                    .text(item.legend.text);
            }

            for (var i = 0; i < seriesLastValue.length; ++i) {
                createTextLabel(seriesLastValue[i]);
            }

            var currentCallout = null;
            plottingArea.append("svg:rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", plottingAreaWidth)
                .attr("height", plottingAreaHeight)
                .on("mousemove", function () {
                    var mousePoint = GOVUK.Insights.point(d3.mouse(this));

                    var closest = GOVUK.Insights.findClosestDataPoint(mousePoint, data, function(d) {
                        return GOVUK.Insights.point(xScale(dateFormat.parse(d.date)), yScale(d.value));
                    });

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
                    var boxWidth = 145,
                        xOffset = -20,
                        yOffset = -60,
                        intendedXPos = closest.dataPoint.x() + margins.left + xOffset - boxWidth,
                        xPos = (intendedXPos < margins.left) ? closest.dataPoint.x() + margins.left - xOffset : intendedXPos,
                        calloutInfo = {
                            xPos: xPos,
                            yPos: closest.dataPoint.y() + margins.top + yOffset,
                            width: 145,
                            parent: container,
                            title: formatDate(dateFormat.parse(closest.datum.startDate)) + " - " + formatDate(dateFormat.parse(closest.datum.date)),
                            rowData: [
                                {
                                    left: GOVUK.Insights.formatNumericLabel(closest.datum.value),
                                    right: params.series[closest.seriesName].legend.text
                                }
                            ],
                            boxClass: closest.seriesName
                        };

                    currentCallout = new GOVUK.Insights.overlay.CalloutBox(calloutInfo);
                })
                .on("mouseout", function() {
                    var mousePoint = GOVUK.Insights.point(d3.mouse(this));
                    if ((mousePoint.x() < 0) || (mousePoint.x() > plottingAreaWidth) || (mousePoint.y() < 0) || (mousePoint.y() > plottingAreaHeight)) {
                        plottingArea.select(".highlight").classed("highlight", false);
                        plottingArea.select("#dataPointHighlight").remove();
                        if (currentCallout) {
                            currentCallout.close();
                        }
                    }
                });
        }
    };
};

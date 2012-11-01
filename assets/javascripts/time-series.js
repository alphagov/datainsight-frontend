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
        margins = params.margins || [22, 27, 27, 40],
        width = params.width || 462,
        height = params.height || (236 + 22),

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
                    data[k].push({"date":rawData[i].end_at, "value":rawData[i].value[k]});
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
            xScale = d3.time.scale().domain(xExtent).range([0, width - margins[1] - margins[3]]),


            yMax = d3.max(alldata, function(d) { return d.value}),
            yTicks = GOVUK.Insights.calculateLinearTicks([0, yMax], 4),
            yScale = d3.scale.linear().domain(yTicks.extent).range([height - margins[0] - margins[2], 0]),

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
                    .attr("transform", "translate(" + margins[3] + "," + margins[0] + ")");

            var gradient = graph.append("svg:defs")
                .append("svg:linearGradient")
                .attr("id", "spike-gradient-" + $(container).attr("id"))
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");

            var STRONG_GREEN = "#74B74A";
            var CENTER_GREY = "#B3B3B3";
            var STRONG_RED = "#BF1E2D";

            gradient.append("svg:stop")
                .attr("offset", "0%")
                .attr("stop-color", data["highlight_spikes"] ? STRONG_GREEN : CENTER_GREY)
                .attr("stop-opacity", 1);

            gradient.append("svg:stop")
                .attr("offset", "20%")
                .attr("stop-color", CENTER_GREY)
                .attr("stop-opacity", 1);

            gradient.append("svg:stop")
                .attr("offset", "80%")
                .attr("stop-color", CENTER_GREY)
                .attr("stop-opacity", 1);

            gradient.append("svg:stop")
                .attr("offset", "100%")
                .attr("stop-color", data["highlight_troughs"] ? STRONG_RED : CENTER_GREY)
                .attr("stop-opacity", 1);

            /* Set up X Axis */
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(GOVUK.Insights.months_range, 2)
                .tickPadding(4)
                .tickFormat(function (date) {
                    return date.getDate() + " " + GOVUK.Insights.SHORT_MONTHS[date.getMonth()];
                }

            );

            graph.append("svg:g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + (height - margins[0] - margins[2] + 5) + ")")
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
                    .attr("class", params.series[name].lineClass);
                if (params.series[name].gradient) {
                    path.attr("style", "stroke: url(#spike-gradient-" + $(container).attr("id") + ") " + CENTER_GREY + ";");
                }
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
        }
    };
};

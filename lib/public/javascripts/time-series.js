var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.months_range = function(startDate, endDate, step) {
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

GOVUK.Insights.sixMonthTimeSeries = function(url, container, params, onError) {
    function concat(data, keys) {
        var a = [];
        // TODO: improve this
        $(keys).each(function(i, key) {
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
        margins = params.margins || [22, 27, 20, 54],
        width = params.width || 462,
        height = params.height || (236 + 15),
        yUnitScale = params.yUnitScale || 1000000,

        dateFormat = d3.time.format("%Y-%m-%d");

    return {
        render: function() {
            d3.json(url, function(data) {
                if (data == null)
                {
                    if (onError != undefined)
                    {
                        onError();
                    }
                    return;
                }
                var alldata = concat(data, series),
                    lastDate = Date.today().last().sunday(),
                    firstDate = lastDate.clone().add(-6).months(),
                    xExtent = [firstDate, lastDate],
                    yExtent = d3.extent(alldata, function(d) { return d.value; });
                yExtent = [0, Math.ceil(yExtent[1] / yUnitScale) * yUnitScale];

                var xScale = d3.time.scale().domain(xExtent).range([0, width - margins[1] - margins[3]]),
                    yScale = d3.scale.linear().domain(yExtent).range([height - margins[0] - margins[2], 0]),

                    line = d3.svg.line()
                        .x(function(d) {
                            return xScale(dateFormat.parse(d.date));
                        })
                        .y(function(d) {
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

                gradient.append("svg:stop")
                    .attr("offset", "0%")
                    .attr("stop-color", data["highlight_spikes"] ? "#74B74A" : "#c4c4c4")
                    .attr("stop-opacity", 1);

                gradient.append("svg:stop")
                    .attr("offset", "20%")
                    .attr("stop-color", "#c4c4c4")
                    .attr("stop-opacity", 1);

                gradient.append("svg:stop")
                    .attr("offset", "80%")
                    .attr("stop-color", "#c4c4c4")
                    .attr("stop-opacity", 1);

                gradient.append("svg:stop")
                    .attr("offset", "100%")
                    .attr("stop-color", data["highlight_troughs"] ? "#BF1E2D" : "#c4c4c4")
                    .attr("stop-opacity", 1);

                /* Set up X Axis */
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .ticks(GOVUK.Insights.months_range, 2)
                    .tickFormat(d3.time.format("%b %d"));

                graph.append("svg:g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(0," + (height - margins[0] - margins[2]) + ")")
                    .call(xAxis);

                /* Set Up Y-Axis */
                var yTickValues = [];
                for (var i = 0; i <= yExtent[1]; i+= yUnitScale) {
                    yTickValues.push(i);
                }
                // TODO: consider extracting parts of this
                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .tickValues(yTickValues)
                    .orient("left")
                    .tickFormat(function(d) {
                        d /= yUnitScale;
                        return d ? (d + "m") : d;
                    });
                graph.append("svg:g")
                    .attr("class", "y-axis")
                    .attr("transform", "translate(-10,0)")
                    .call(yAxis);

                /* Add The Graph Lines */
                $(series).each(function(i, name) {
                    var path = graph.append("svg:path")
                        .attr("d", line(data[name]))
                        .attr("class", params.series[name].lineClass)
                    if (params.series[name].gradient) {
                        path.attr("style", "stroke: url(#spike-gradient-" + $(container).attr("id") + ") #c4c4c4;")
                    }
                });


                /* Label Placement */
                seriesLastValue =
                  $(series)
                    .filter(function(i, name) { return data[name].length != 0; })
                    .map(function(i, name) {
                      var value = data[name][data[name].length - 1].value;
                      return {
                          "container": container,
                          "name": name,
                          "legend": params.series[name].legend,
                          "class": params.series[name].legendClass,
                          "value": value,
                          "ypos": yScale(value)
                      };
                  });
                seriesLastValue.sort(function(a, b) { return a.value - b.value; });

                function createTextLabel(item, ypos) {
                    graph.append("svg:text")
                        .attr("style", "text-anchor: end")
                        .attr("class", item.name + "-label " + item.class)
                        .attr("y", ypos)
                        .text(item.legend);
                    $(item.container + " ." + item.name + "-label").attr("x", width - margins[3]);
                }

                var legendHeight = 20;
                if (seriesLastValue.length == 1) {
                    createTextLabel(seriesLastValue[0], seriesLastValue[0].ypos - 5);
                }

                // place bottom legend
                if (seriesLastValue.length >= 2
                  && (seriesLastValue[0].ypos - seriesLastValue[1].ypos) < legendHeight) {
                    // place bottom above last but one
                    createTextLabel(seriesLastValue[0], seriesLastValue[1].ypos - 5);
                    createTextLabel(seriesLastValue[1], seriesLastValue[1].ypos - legendHeight - 5);
                } else {
                    createTextLabel(seriesLastValue[0], seriesLastValue[0].ypos - 5);
                    createTextLabel(seriesLastValue[1], seriesLastValue[1].ypos - 5);
                }

                // place the top one
                if (seriesLastValue.length >= 3
                  && seriesLastValue[2].ypos > legendHeight) {
                    createTextLabel(seriesLastValue[2], seriesLastValue[2].ypos - 5);
                } else {
                    createTextLabel(seriesLastValue[2], seriesLastValue[2].ypos + legendHeight - 5);
                }

            })
        }
    };
};

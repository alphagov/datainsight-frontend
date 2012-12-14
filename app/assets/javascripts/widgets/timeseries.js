var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.timeSeriesGraph = function () {
    var config = {
        width:960,
        height:400,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        xTicks: d3.time.saturdays,
        yTicks: 10,
        xScale: d3.time.scale(),
        yScale: d3.scale.linear(),
        x: function(d) { return d.x; },
        y: function(d) { return d.y; }
    };

    var AXIS_OFFSET = 40;

    var seriesDateFormat = d3.time.format("%Y-%m-%d");

    var min = function(array) { return array.reduce(function(a,b) { return a < b ? a : b; } ); };

    var max = function(array) { return array.reduce(function(a,b) { return a > b ? a : b; } ); };

    var instance = function (selection) {
        var container = this;

        selection.each(function (data) {

            var svg = d3.select(this).selectAll("svg").data([config]);

            svg.enter().append("svg")
                .attr("class", "time-series js-graph-area")
                .attr("width", function (d) { return d.width; })
                .attr("height", function (d) { return d.height; });

            var graphArea = svg.selectAll("g.graph-area")
                .data([config])
                .enter()
                .append("svg:g")
                .attr("class", "graph-area")
                .attr("transform", function (d) {
                    return "translate(" + d.marginLeft + "," + d.marginTop + ")";
                });


            var minX = min(data.map(function(d) {return config.x(d); }));
            var maxX = max(data.map(function(d) {return config.x(d); }));
            var maxY = max(data.map(function(d) {return config.y(d); }));

            var yTicks = GOVUK.Insights.calculateLinearTicks([0, maxY], 5);

            var xScale = config.xScale.domain([ minX, maxX ]).range([AXIS_OFFSET, config.width - config.marginLeft - config.marginRight ]);
            var yScale = config.yScale.domain(yTicks.extent).range([config.height - config.marginTop - config.marginBottom - AXIS_OFFSET, 0])

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(config.xTicks)
                .tickSize(5)
                .tickPadding(4)
                .tickFormat(GOVUK.Insights.shortDateFormat);

            graphArea.append("svg:g")
                .classed("x-axis", true)
                .attr("transform", "translate(0, " + (config.height - config.marginTop - config.marginBottom - AXIS_OFFSET + 3) + ")")
                .call(xAxis);

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(config.yTicks)
                .tickSize(5)
                .tickPadding(4)
                .tickFormat(GOVUK.Insights.numericLabelFormatterFor(yTicks.step));

            graphArea.append("svg:g")
                .classed("y-axis", true)
                .attr("transform", "translate(" + AXIS_OFFSET + ", 0)")
                .call(yAxis);

            var plottingArea = graphArea.selectAll("g.plotting-area")
                .data([config])
                .enter()
                .append("svg:g")
                .attr("class", "plotting-area");

            var line = d3.svg.line()
                .x(function(d) {
                    return xScale(config.x(d));
                })
                .y(function(d) {
                    return yScale(config.y(d));
                });

            var area = d3.svg.area()
                .x(function(d) {
                    return xScale(config.x(d));
                })
                .y0(function(d) {
                    return yScale(0);
                })
                .y1(function(d) {
                    return yScale(config.y(d));
                });

            plottingArea.append("svg:path")
                .classed("shade", true)
                .attr("d", area(data));

            plottingArea.append("svg:path")
                .classed("line", true)
                .attr("d", line(data));

            var currentCallout = null;
            
            svg.append("svg:rect")
                .attr("width", config.width)
                .attr("height", config.height)
                .on("mousemove", function () {
                    var mousePoint = GOVUK.Insights.point(d3.mouse(this));
                    var dataPoint = function(d) {
                        return GOVUK.Insights.point(xScale(config.x(d)), yScale(config.y(d)));
                    };
                    var highlightedDatum = GOVUK.Insights.findClosestDataPointInSeries(mousePoint, data, dataPoint);
                    var highlightedPoint = dataPoint(highlightedDatum);

                    plottingArea.select("#dataPointHighlight").remove();
                    plottingArea.insert("svg:circle", "rect")
                        .attr("cx", highlightedPoint.x())
                        .attr("cy", highlightedPoint.y())
                        .attr("r", 3.5)
                        .attr("id", "dataPointHighlight");

                    // hide callout
                    if (currentCallout) {
                        currentCallout.close();
                    }
                    // show callout
                    var boxWidth = 165,
                        boxHeight = 48,
                        xOffset = -20,
                        yOffset = -60,
                        intendedXPos = highlightedPoint.x() + config.marginLeft + xOffset - boxWidth,
                        xPos = (intendedXPos < config.marginLeft) ? highlightedPoint.x() + config.marginLeft - xOffset : intendedXPos,
                        yPos = (highlightedPoint.y() < config.height/2) ? highlightedPoint.y() + config.marginTop - (yOffset + boxHeight) : highlightedPoint.y() + config.marginTop + yOffset,
                        calloutInfo = {
                            xPos:xPos,
                            yPos:yPos,
                            width:boxWidth,
                            height:boxHeight,
                            parent:"#" + container.attr("id"),
                            title: GOVUK.Insights.shortDateFormat(seriesDateFormat.parse(highlightedDatum.start_at)) + " - " + GOVUK.Insights.shortDateFormat(seriesDateFormat.parse(highlightedDatum.end_at)),
                            rowData: [
                                {
                                    right: GOVUK.Insights.formatNumericLabel(highlightedDatum.value),
                                    left: "Visitors"
                                }
                            ]
                        };
                    
                    currentCallout = new GOVUK.Insights.overlay.CalloutBox(calloutInfo);
                })
                .on("mouseout", function() {
                    var mousePoint = GOVUK.Insights.point(d3.mouse(this));
                    if ((mousePoint.x() < 0) || (mousePoint.x() > config.width) || (mousePoint.y() < 0) || (mousePoint.y() > config.height)) {
                        plottingArea.select("#dataPointHighlight").remove();
                        if (currentCallout) {
                            currentCallout.close();
                        }
                    }
                });
        });
    };

    Object.keys(config).forEach(function (key) {
        instance[key] = function (newValue) {
            if (!arguments.length) return config[key];
            if (arguments.length === 1) config[key] = newValue;
            return instance;
        };
    });

    return instance;
};

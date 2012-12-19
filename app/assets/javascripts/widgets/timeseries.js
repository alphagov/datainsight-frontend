var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.timeSeriesGraph = function () {
    var config = {
        width:958,
        height:400,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        yTicks: 10,
        xScale: d3.time.scale(),
        yScale: d3.scale.linear(),
        xAxisLabelFormat: d3.time.format("%e %b"),
        x: function(d) { return d.x; },
        y: function(d) { return d.y; },
        callout: {
            width: 165,
            height: 48,
            xOffset: 15,
            yOffset: 15,
            content: function(d) { return d.label; }
        }
    };


    var X_AXIS_GAP = 3;
    var X_AXIS_HEIGHT = 22;
    var Y_AXIS_WIDTH = 45;

    var min = function(array) { return array.reduce(function(a,b) { return a < b ? a : b; } ); };
    var max = function(array) { return array.reduce(function(a,b) { return a > b ? a : b; } ); };

    var height = function() { return config.height - config.marginTop - config.marginBottom; };
    var width  = function() { return config.width - config.marginLeft - config.marginRight; };

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


            var minX = min(data.map(config.x));
            var maxX = max(data.map(config.x));
            var maxY = max(data.map(config.y));

            var yTicks = GOVUK.Insights.calculateLinearTicks([0, maxY], 5);

            var xScale = config.xScale.domain([ minX, maxX ]).range([Y_AXIS_WIDTH, width() ]);
            var yScale = config.yScale.domain(yTicks.extent).range([height() - (X_AXIS_HEIGHT + X_AXIS_GAP), 0])

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .tickValues(data.map(config.x))
                .tickPadding(4)
                .tickFormat(config.xAxisLabelFormat);

            graphArea.append("svg:g")
                .classed("x-axis", true)
                .attr("transform", "translate(0, " + (height() - X_AXIS_HEIGHT) + ")")
                .call(xAxis);

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(config.yTicks)
                .tickPadding(4)
                .tickFormat(GOVUK.Insights.numericLabelFormatterFor(yTicks.step));

            graphArea.append("svg:g")
                .classed("y-axis", true)
                .attr("transform", "translate(" + Y_AXIS_WIDTH + ", 0)")
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
                    var mouse = d3.mouse(this);
                    var mouseX = mouse[0];

                    var mouseDistanceFrom = function(d) { return Math.abs(xScale(config.x(d)) - mouseX); };

                    var highlightedDatum = data.reduce(function(d1, d2) { return mouseDistanceFrom(d1) < mouseDistanceFrom(d2) ? d1 : d2; });

                    var highlightedPointX = xScale(config.x(highlightedDatum));
                    var highlightedPointY = yScale(config.y(highlightedDatum));

                    plottingArea.select("#dataPointHighlight").remove();
                    plottingArea.insert("svg:circle", "rect")
                        .attr("cx", highlightedPointX)
                        .attr("cy", highlightedPointY)
                        .attr("r", 3.5)
                        .attr("id", "dataPointHighlight");

                    // hide callout
                    if (currentCallout) {
                        currentCallout.close();
                    }

                    // show callout
                    var boxWidth = config.callout.width || 165,
                        boxHeight= config.callout.height || 48,
                        xOffset  = config.callout.xOffset || 15,
                        yOffset  = config.callout.yOffset || 15,
                        xPositionLeftLimit = Y_AXIS_WIDTH + config.marginLeft,
                        xPositionLeftCandidate  = highlightedPointX + config.marginLeft - xOffset - boxWidth,
                        xPositionRightCandidate = highlightedPointX + config.marginLeft + xOffset,
                        yPositionTopLimit = config.marginTop,
                        yPositionAboveCandidate = highlightedPointY + config.marginTop - yOffset - boxHeight,
                        yPositionBelowCandidate = highlightedPointY + config.marginTop + yOffset,
                        calloutInfo = {
                            xPos:(xPositionLeftCandidate < xPositionLeftLimit ? xPositionRightCandidate : xPositionLeftCandidate),
                            yPos:(yPositionAboveCandidate < yPositionTopLimit ? yPositionBelowCandidate : yPositionAboveCandidate),
                            width:boxWidth,
                            height:boxHeight,
                            parent:"#" + container.attr("id"),
                            content: config.callout.content(highlightedDatum)
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

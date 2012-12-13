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
        xScale: d3.time.scale(),
        yScale: d3.scale.linear()
    };

    var AXIS_OFFSET = 40;

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

            var seriesDateFormat = d3.time.format("%Y-%m-%d");

            var minDate = data.details.data.map(function(d) {return seriesDateFormat.parse(d.end_at); }).reduce(function(a,b) { return a < b ? a : b; } );
            var maxDate = data.details.data.map(function(d) {return seriesDateFormat.parse(d.end_at); }).reduce(function(a,b) { return a > b ? a : b; } );
            var maxVisits = data.details.data.map(function(d) {return d.value; }).reduce(function(a,b) { return a > b ? a : b; } );

            var xScale = config.xScale.domain([ minDate, maxDate ]).range([AXIS_OFFSET, config.width - config.marginLeft - config.marginRight ]);
            var yScale = config.yScale.domain([0, maxVisits]).range([config.height - config.marginTop - config.marginBottom - AXIS_OFFSET, 0])

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(d3.time.saturdays, 2)
                .tickSize(5)
                .tickPadding(4)
                .tickFormat(GOVUK.Insights.shortDateFormat);

            graphArea.append("svg:g")
                .classed("x-axis", true)
                .attr("transform", "translate(0, " + (config.height - config.marginTop - config.marginBottom - AXIS_OFFSET) + ")")
                .call(xAxis);

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(10)
                .tickSize(5)
                .tickPadding(4)
                .tickFormat(GOVUK.Insights.numericLabelFormatterFor(maxVisits));

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
                    return xScale(seriesDateFormat.parse(d.end_at));
                })
                .y(function(d) {
                    return yScale(d.value);
                });

            var area = d3.svg.area()
                .x(function(d) {
                    return xScale(seriesDateFormat.parse(d.end_at));
                })
                .y0(function(d) {
                    return yScale(0);
                })
                .y1(function(d) {
                    return yScale(d.value);
                });

            plottingArea.append("svg:path")
                .classed("shade", true)
                .attr("d", area(data.details.data));

            plottingArea.append("svg:path")
                .classed("line", true)
                .attr("d", line(data.details.data));

            var currentCallout = null;
            
            svg.append("svg:rect")
                .attr("width", config.width)
                .attr("height", config.height)
                .on("mousemove", function () {
                    var mousePoint = GOVUK.Insights.point(d3.mouse(this));
                    var dataPoint = function(d) {
                        return GOVUK.Insights.point(xScale(seriesDateFormat.parse(d.end_at)), yScale(d.value));
                    };
                    var highlightedDatum = GOVUK.Insights.findClosestDataPointInSeries(mousePoint, data.details.data, dataPoint);
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

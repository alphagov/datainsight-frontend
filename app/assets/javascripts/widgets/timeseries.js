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
        annotations: [],
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
    var ANNOTATION_VERTICAL_OFFSET = -10;

    var min = function(array) { return array.reduce(function(a,b) { return a < b ? a : b; } ); };
    var max = function(array) { return array.reduce(function(a,b) { return a > b ? a : b; } ); };

    var height = function() { return config.height - config.marginTop - config.marginBottom; };
    var width  = function() { return config.width - config.marginLeft - config.marginRight; };

    var mouseOutside = function(svgRect) {
        var mouse = d3.mouse(svgRect), rect = svgRect.getBBox(), x = mouse[0], y = mouse[1];
        return x < rect.x || x >= rect.width + rect.x || y < rect.y || y >= rect.height + rect.y;
    }

    var instance = function (selection) {
        var container = this;

        selection.each(function (data) {

            var svg = d3.select(this).selectAll("svg").data([config]);

            svg.enter().append("svg")
                .attr("class", "time-series js-graph-area")
                .attr("width", function (d) { return d.width; })
                .attr("height", function (d) { return d.height; });

            GOVUK.Insights.svg.createShadowFilter("shadow", svg.node());

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
                .x(function(d) { return xScale(config.x(d)); })
                .y(function(d) { return yScale(config.y(d)); });

            var area = d3.svg.area()
                .x(function(d) { return xScale(config.x(d)); })
                .y0(function(d) { return yScale(0); })
                .y1(function(d) { return yScale(config.y(d)); });

            plottingArea.append("svg:path")
                .classed("shade", true)
                .attr("d", area(data));

            plottingArea.append("svg:path")
                .classed("line", true)
                .attr("d", line(data));

            function removeHighlight() {
                plottingArea.select(".highlighted").classed("highlighted", false);
                plottingArea.select("#dataPointHighlight").remove();
            }

            var annotationData = config.annotations.map(function (each) {
                var date = d3.time.format("%Y-%m-%d").parse(each.date);
                var dataPoints = data.map(function (d) { return {x: config.x(d), y: config.y(d)} });
                var dateRange = GOVUK.Insights.findDateRangeContaining(data.map(config.x), date);

                var referencePoints = dateRange.map(function (d) {
                    return {
                        x: config.xScale(d),
                        y: config.yScale(GOVUK.Insights.findY(dataPoints, d))
                    }
                });
                var y = GOVUK.Insights.interpolateY(config.xScale(date), referencePoints[0], referencePoints[1]);

                return {x: config.xScale(date), y: y, text: each.text, date: each.date};
            });

            var annotations = graphArea.selectAll("rect.annotation")
                .data(annotationData);

            var annotationMarker = annotations.enter()
                .append("svg:g")
                .attr("class", "annotation")
                .attr("transform", function (d) {
                    return GOVUK.Insights.svg.translate(d.x, d.y + ANNOTATION_VERTICAL_OFFSET);
                });

            annotationMarker.append("svg:path")
                .attr("d", "M0,0 L-10,-10 C-15,-15 -15,-25 -10,-30 C-5,-35 5,-35 10,-30 C15,-25 15,-15 10,-10 Z")
                .attr("filter", "url(#shadow)");
            annotationMarker.append("svg:line")
                .attr("x1", -8).attr("y1", -24)
                .attr("x2",  8).attr("y2", -24);
            annotationMarker.append("svg:line")
                .attr("x1", -8).attr("y1", -19)
                .attr("x2",  4).attr("y2", -19);
            annotationMarker.append("svg:line")
                .attr("x1", -8).attr("y1", -14)
                .attr("x2",  6).attr("y2", -14);

            var currentCallout = null;

            function removeCallout() {
                if (currentCallout) {
                    currentCallout.close();
                }
            }

            function annotationCalloutInfo(hoveredAnnotation) {
                var annotation = hoveredAnnotation.datum();

                var labelDateFormat = d3.time.format("%d %B %Y");

                var title = labelDateFormat(d3.time.format("%Y-%m-%d").parse(annotation.date));
                var rowData = [
                    {
                        right:"",
                        left:annotation.text
                    }
                ];

                // show callout
                var boxWidth = config.callout.width || 165,
                    boxHeight = config.callout.height || 48,
                    xOffset = -20,
                    yOffset = 15,
                    xPositionLeftLimit = Y_AXIS_WIDTH + config.marginLeft,
                    xPositionRightCandidate = annotation.x + config.marginLeft + xOffset,
                    xPositionLeftCandidate = annotation.x + config.marginLeft - xOffset - boxWidth,
                    yPositionAboveCandidate = annotation.y + config.marginTop - yOffset - boxHeight;

                var calloutInfo = {
                    xPos:(xPositionLeftCandidate < xPositionLeftLimit ? xPositionRightCandidate : xPositionLeftCandidate),
                    yPos:yPositionAboveCandidate,
                    width:boxWidth,
                    height:boxHeight,
                    parent:"#" + container.attr("id"),
                    content:GOVUK.Insights.overlay.calloutContent(title, rowData)
                };

                return calloutInfo;
            }

            function seriesCalloutInfo(datum) {
                var highlightedPointX = xScale(config.x(datum));
                var highlightedPointY = yScale(config.y(datum));

                // show callout
                var boxWidth = config.callout.width || 165,
                    boxHeight = config.callout.height || 48,
                    xOffset = config.callout.xOffset || 15,
                    yOffset = config.callout.yOffset || 15,
                    xPositionLeftLimit = Y_AXIS_WIDTH + config.marginLeft,
                    xPositionLeftCandidate = highlightedPointX + config.marginLeft - xOffset - boxWidth,
                    xPositionRightCandidate = highlightedPointX + config.marginLeft + xOffset,
                    yPositionTopLimit = config.marginTop,
                    yPositionAboveCandidate = highlightedPointY + config.marginTop - yOffset - boxHeight,
                    yPositionBelowCandidate = highlightedPointY + config.marginTop + yOffset;

                var calloutInfo = {
                    xPos:(xPositionLeftCandidate < xPositionLeftLimit ? xPositionRightCandidate : xPositionLeftCandidate),
                    yPos:(yPositionAboveCandidate < yPositionTopLimit ? yPositionBelowCandidate : yPositionAboveCandidate),
                    width:boxWidth,
                    height:boxHeight,
                    parent:"#" + container.attr("id"),
                    content:config.callout.content(datum)
                };
                return calloutInfo;
            }

            function highlight(highlightedDatum) {
                plottingArea.select(".line")
                    .classed("highlighted", true);
                plottingArea.insert("svg:circle", "rect")
                    .attr("cx", xScale(config.x(highlightedDatum)))
                    .attr("cy", yScale(config.y(highlightedDatum)))
                    .attr("r", 3.5)
                    .attr("id", "dataPointHighlight")
                    .classed("highlighted", true);
            }

            function findClosestDataPoint() {
                var mouse = d3.mouse(plottingArea.node());
                var mouseX = mouse[0];
                var mouseDistanceFrom = function (d) { return Math.abs(xScale(config.x(d)) - mouseX); };
                return data.reduce(function (d1, d2) { return mouseDistanceFrom(d1) < mouseDistanceFrom(d2) ? d1 : d2; });
            }

            svg.append("svg:rect")
                .attr("class", "callout-area")
                .attr("width", config.width)
                .attr("height", config.height)
                .on("mousemove", function () {
                    removeHighlight();
                    removeCallout();

                    var calloutInfo;
                    var hoveredAnnotation = d3.selectAll(".annotation").filter(function() { return !mouseOutside(this) });

                    if (!hoveredAnnotation.empty()) {
                        calloutInfo = annotationCalloutInfo(hoveredAnnotation);
                    } else {
                        var closestDataPoint = findClosestDataPoint.call(this);
                        highlight(closestDataPoint);
                        calloutInfo = seriesCalloutInfo(closestDataPoint);
                    }

                    currentCallout = new GOVUK.Insights.overlay.CalloutBox(calloutInfo);
                })
                .on("mouseout", function() {
                    console.log("mouseout")
                    if (mouseOutside(this)) {
                        removeHighlight();
                        removeCallout();
                    }
                });
        });
    };

    GOVUK.Insights.utils.createGettersAndSetters(config, instance);

    return instance;
};

var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.scatterplotGraph = function () {
    var config = {
        xAxisLabels:{description:"X", left:"", right:""},
        yAxisLabels:{description:"Y", bottom:"", top:""},
        width:958,
        height:450,
        maxRadius:30,
        marginTop:0,
        marginBottom:0,
        marginLeft:0,
        marginRight:0,
        x:function (d) {
            return d.x;
        },
        y:function (d) {
            return d.y;
        },
        r:function (d) {
            return 1;
        },
        colour:function (d) {
            return d.colour;
        },
        circleLabel:function (d) {
            return d.label;
        },
        circleId: function(d) {
            return d.id;
        },
        xScale:d3.scale.linear(),
        yScale:d3.scale.linear(),
        rScale:d3.scale.linear(),
        colourScale:d3.scale.linear()
    };

    var RED = "#BF1E2D",
        GREEN = "#74B74A",
        GRAY = "#B3B3B3";

    var verticalOffsetForYAxisLabel = 7;

    var plottingAreaOffsetTop = function() {
        return Math.max(config.maxRadius, 36);
    };

    var plottingAreaHeight = function(config) {
        return config.height - plottingAreaOffsetTop();
    };

    var getScales = function(data) {
        return {
            X: config.xScale.domain([0,d3.max(data, config.x)]).range([50, config.width - 50]),
            Y: config.yScale.domain([0,100]).range([plottingAreaHeight(config) - verticalOffsetForYAxisLabel, 0]),
            R: config.rScale.domain([0,d3.max(data, config.r)]).range([1,config.maxRadius]),
            C: config.colourScale.domain([0, 50, 100]).range([RED, GRAY, GREEN])
        }
    };

    var instance = function (selection) {
        selection.each(function (data) {
            var scales = getScales(data),
                X = scales.X,
                Y = scales.Y,
                R = scales.R,
                C = scales.C,
                bottomOverflow = function (d) {
                    var overflow = Y(config.y(d)) + R(config.r(d)) - plottingAreaHeight(config);
                    return overflow > 0 ? overflow : 0;
                },
                width = (config.width + config.marginLeft + config.marginRight),
                height = (config.height + config.marginTop + config.marginBottom + d3.max(data, bottomOverflow));

            var svg = d3.select(this).selectAll("svg").data([config]);

            svg
                .enter().append("svg")
                .attr("class", "scatterplot js-graph-area");

            svg
                .attr("viewBox", "0 0 " +  width + " " + height)
                .attr("height", height)
                .attr("width", width);

            GOVUK.Insights.svg.resizeIfPossible(svg, width, height);

            var plotArea = svg.selectAll("g.plot-area").data([config]);

            plotArea
                .enter().append("svg:g").attr("class", "plot-area");

            plotArea
                .attr("transform", function (d) {
                    return "translate(" + d.marginLeft + "," + d.marginTop + ")";
                });

            var graphArea = plotArea.selectAll("g.graph-area").data([config]);

            graphArea
                .enter().append("svg:g").attr("class", "graph-area");

            graphArea
                .attr("transform", "translate(0, " + plottingAreaOffsetTop() + ")");

            var yAxisTitle = plotArea.selectAll("text.title-y").data([config]);

            yAxisTitle.enter().append("svg:text");

            yAxisTitle
                .text(config.yAxisLabels.description)
                .attr("class", "title-y")
                .attr("y", 11)
                .attr("x", function (d) {
                    return d.width / 2;
                })
                .attr("dy", ".35em");

            var axesGroup = graphArea.append("svg:g").classed("axes", true);
            var circlesGroup = graphArea.append("svg:g").classed("data-area", true);
            var axesLabelsGroup = graphArea.append("svg:g").classed("axesLabels", true);

            drawAxes(axesGroup, axesLabelsGroup);

            var doHover = function (d, element, optionalCallback) {
                var scaleFactor = $(svg.node()).width() / config.width,
                    title = config.circleLabel(d),
                    boxWidth = 170,
                    boxHeight = 66,
                    label = d3.select('#label-' + d3.select(element).attr('data-point-label')),
                    labelX = parseFloat(label.attr('x')) + config.marginLeft,
                    labelY = parseFloat(label.attr('y')) + config.marginTop + plottingAreaOffsetTop(),
                    labelBoundingBox = label.node().getBBox(),
                    xPos = (labelX > parseFloat(d3.select(element).attr('cx'))) ? labelX - 3 : labelX - (boxWidth - labelBoundingBox.width - 3),
                    yPos = (labelY < parseFloat(d3.select(element).attr('cy'))) ? labelY - (boxHeight - labelBoundingBox.height / 2) : labelY - labelBoundingBox.height / 2,
                    rowData = [
                        {right:GOVUK.Insights.formatNumericLabel(config.x(d)), left:config.xAxisLabels.description},
                        {right:config.y(d).toFixed(0) + '%', left:config.yAxisLabels.description}
                    ],
                    boxInfo = {
                        xPos:GOVUK.Insights.clamp(xPos * scaleFactor, 0, (width + 3) * scaleFactor - boxWidth),
                        yPos:GOVUK.Insights.clamp(yPos * scaleFactor, 0, height * scaleFactor - boxHeight) + GOVUK.Insights.geometry.gap(svg.node(), svg.node().parentNode),
                        title:title,
                        rowData:rowData,
                        parent:"#" + selection.attr("id"),
                        closeDelay:200,
                        callback:(optionalCallback) ? optionalCallback : undefined,
                        width:boxWidth,
                        height:boxHeight
                    };
                d.callout = new GOVUK.Insights.overlay.CalloutBox(boxInfo);
                element.parentNode.insertBefore(element, null);

                var darkerStrokeColor = new GOVUK.Insights.colors(d3.select(element).attr('fill')).multiplyWithSelf().asCSS();
                d3.select(element).attr("stroke", darkerStrokeColor);
            };

            var endHover = function (d, element) {
                if (d.callout !== undefined) {
                    d.callout.close();
                }
                delete d.callout;
                d3.select(element).attr("stroke", "white");
            };

            var circles = circlesGroup.selectAll("circle").data(data);

            circles.enter().append("svg:circle");

            circles
                .on('mouseover', function (d) {
                    if (d.callout !== undefined) {
                        d.callout.cancelClose();
                    } else {
                        var self = this;
                        doHover(d, self, function () {
                            endHover(d, self);
                        });
                    }
                })
                .on('mouseout', function (d) {
                    if (d.callout !== undefined) {
                        d.callout.close();
                    }
                })
                .attr("class", "data-point js-fixed")
                .style("opacity", 0.9)
                .attr("stroke", "white")
                .attr("stroke-width", 2)
                .attr("r", function (d) {
                    return R(config.r(d));
                })
                .attr("cy", function (d) {
                    return Y(config.y(d));
                })
                .attr("cx", function (d) {
                    return X(config.x(d));
                })
                .attr("fill", function (d) {
                    return C(config.colour(d));
                })
                .attr("data-point-label", function (d) {
                    return config.circleId(d);
                });

            circles.exit().remove();

            var circlesLabels = circlesGroup.selectAll("text.circle-label").data(data);

            circlesLabels.enter().append("svg:text")
                .attr("class", "circle-label js-floating");

            circlesLabels
                .text(function (d) {
                    return config.circleLabel(d);
                })
                .attr("id", function (d) {
                    return "label-" + config.circleId(d);
                })
                .attr("data-point-label", function (d) {
                    return config.circleId(d);
                })
                .attr("text-anchor", "start")
                .attr("x", function (d) {
                    return X(config.x(d));
                })
                .attr("y", function (d) {
                    return Y(config.y(d));
                })
                .attr("dy", ".35em")
                .on('mouseover', function () {
                    var circleElement = d3.select('circle[data-point-label=' + d3.select(this).attr('data-point-label') + ']'),
                        d = circleElement.datum();

                    if (d.callout !== undefined) {
                        d.callout.cancelClose();
                    } else {
                        doHover(d, circleElement.node(), function () {
                            endHover(d, circleElement.node());
                        });
                    }
                })
                .on("mouseout", function (d) {
                    if (d.callout !== undefined) {
                        d.callout.close();
                    }
                });

            circlesLabels.exit().remove();

            function drawAxes(group, labelsGroup) {

                var left    = 0,
                    right   = config.width,
                    top     = Y(100),
                    bottom  = Y(0),
                    centerX = (right - left) / 2,
                    centerY = (bottom - top) / 2;

                function drawSemiAxis(group) {
                    return group.append("svg:line")
                        .classed("domain", true)
                        .attr("stroke", "black")
                        .style("stroke-dashoffset", "2px");
                }

                var xAxis = group.append("g")
                    .attr("class", "x axis");

                drawSemiAxis(xAxis)
                    .classed("x-left", true)
                    .classed("no-scale", true)
                    .attr("x1", centerX)
                    .attr("y1", centerY)
                    .attr("x2", left)
                    .attr("y2", centerY);

                drawSemiAxis(xAxis)
                    .classed("x-right", true)
                    .classed("no-scale", true)
                    .attr("x1", centerX)
                    .attr("y1", centerY)
                    .attr("x2", right)
                    .attr("y2", centerY);

                var yAxis = group.append("g")
                    .attr("class", "y axis");

                drawSemiAxis(yAxis)
                    .classed("y-top", true)
                    .classed("no-scale", true)
                    .attr("x1", centerX)
                    .attr("y1", centerY)
                    .attr("x2", centerX)
                    .attr("y2", top);

                drawSemiAxis(yAxis)
                    .classed("y-bottom", true)
                    .classed("no-scale", true)
                    .attr("x1", centerX)
                    .attr("y1", centerY)
                    .attr("x2", centerX)
                    .attr("y2", bottom);

                // Place X axis tick labels
                var leftXAxisLabel = labelsGroup.selectAll("text.label-x-left").data([config]);

                leftXAxisLabel.enter().append("svg:text");

                leftXAxisLabel.text(config.xAxisLabels.left)
                    .attr("class", "label-x-left")
                    .attr("x", left)
                    .attr("y", centerY + 9)
                    .attr("dy", ".71em");

                var rightXAxisLabel = labelsGroup.selectAll("text.label-x-right").data([config]);

                rightXAxisLabel.enter().append("svg:text");

                rightXAxisLabel.text(config.xAxisLabels.right)
                    .attr("class", "label-x-right")
                    .attr("x", right)
                    .attr("y", centerY + 9)
                    .attr("dy", ".71em");

                // Place Y axis tick labels
                function drawYAxisLabelSquare(parent) {
                    return parent.append("rect")
                        .classed("js-fixed", true)
                        .attr("stroke", "white")
                        .attr("stroke-width", 1)
                        .attr("height", 12)
                        .attr("width", 12);
                }

                drawYAxisLabelSquare(labelsGroup)
                    .classed("label-y-bottom", true)
                    .attr("fill", RED)
                    .attr("y", bottom - 6)
                    .attr("x", centerX + 7);

                var bottomYAxisLabel = labelsGroup.selectAll("text.label-y-bottom").data([config]);

                bottomYAxisLabel.enter().append("svg:text");

                bottomYAxisLabel
                    .text(config.yAxisLabels.bottom)
                    .attr("class", "label-y-bottom")
                    .attr("y", bottom)
                    .attr("x", centerX - 5)
                    .attr("dy", ".35em");

                drawYAxisLabelSquare(labelsGroup)
                    .classed("label-y-top", true)
                    .attr("fill", GREEN)
                    .attr("y", -6)
                    .attr("x", centerX + 7);

                var topYAxisLabel = labelsGroup.selectAll("text.label-y-top").data([config]);

                topYAxisLabel.enter().append("svg:text");

                topYAxisLabel
                    .text(config.yAxisLabels.top)
                    .attr("class", "label-y-top")
                    .attr("y", top)
                    .attr("x", centerX - 5)
                    .attr("dy", ".35em");

            }
        });
    };

    GOVUK.Insights.utils.createGettersAndSetters(config, instance);

    // Add function to render legend
    instance.legend = function(selection) {
        selection.each(function(data) {
            var scales = getScales(data),
                X = scales.X,
                R = scales.R;

            var dataForLegend = X.ticks(4).slice(1, 4);

            if (dataForLegend.length > 2) {
                dataForLegend = [
                    dataForLegend[0],
                    dataForLegend[dataForLegend.length - 1]
                ];
            }

            var width = 250,
                height = 80,
                marginTop = 5
                maxCircleRadius = R(dataForLegend.slice(-1)),
                offset = 15;

            var numberFormatter = GOVUK.Insights.numericLabelFormatterFor(d3.max(dataForLegend))

            var legend = d3.select(this).selectAll("svg").data([config]);

            legend
                .enter().append("svg")
                .attr("width", width)
                .attr("height", height + marginTop)
                .attr("class", "scatterplot-legend")
                .append("g")
                .attr("transform", "translate(0, 3)");

            var legendText = legend.selectAll("text.circle-legend").data(dataForLegend);

            legendText.enter().append("svg:text")
                .attr("class", "circle-legend")
                .attr("dy", ".35em")
                .attr("text-anchor", "end");

            legendText
                .attr("x", width - 2 * maxCircleRadius - 2 * offset)
                .attr("y", function (d) {
                    return 2 * R(d) - 5 + marginTop; // offset text to bottom of circles
                })
                .text(function(d) {
                    return numberFormatter(d) + " " + config.xAxisLabels.description.toLowerCase();
                });

            var legendCircles = legend.selectAll("circle.legend").data(dataForLegend);

            legendCircles.enter().append("svg:circle")
                .attr("class", "legend");

            legendCircles
                .attr("r", function (d) {
                    return R(d);
                })
                .attr("cx", function () {
                    return width - maxCircleRadius - offset;
                })
                .attr("cy", function (d) {
                    return R(d) + marginTop;
                });
        });
    };

    return instance;
};
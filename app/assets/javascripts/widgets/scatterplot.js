var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.scatterplotGraph = function () {
    var config = {
        xAxisLabels:{description:"X", left:"", right:""},
        yAxisLabels:{description:"Y", bottom:"", top:""},
        width:960,
        height:400,
        maxRadius:30,
        marginTop:10,
        marginBottom:40,
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
        xScale:d3.scale.linear(),
        yScale:d3.scale.linear(),
        rScale:d3.scale.linear(),
        colourScale:d3.scale.linear()
    };

    var instance = function (selection) {
        selection.each(function (data) {
            var scaleTemplate = function (scale, variableExtractorFn) {
                return (scale || d3.scale.linear().domain(d3.extent(data.map(variableExtractorFn))));
            };

            var X = config.xScale.domain([0,d3.max(data, config.x)]).range([0,config.width*0.95]),
                Y = config.yScale.domain([0,100]).range([config.height, 0]),
                R = config.rScale.domain([0,d3.max(data, config.r)]).range([1,config.maxRadius]),
                C = config.colourScale.domain([0, 50, 100]).range(["#BF1E2D", "#B3B3B3", "#74B74A"]),
                overlayBottom = function (d) {
                    var overlay = config.y(d) + R(config.r(d)) - config.height;
                    return overlay > 0 ? overlay : 0;
                };

            var svg = d3.select(this).selectAll("svg").data([config]);

            svg
                .enter().append("svg")
                .attr("class", "scatterplot js-graph-area");

            svg
                .attr("width", function (d) {
                return d.width + d.marginLeft + d.marginRight;
            })
                .attr("height", function (d) {
                    return d.height + d.marginTop + d.marginBottom + d3.max(data, overlayBottom);
                });

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
                .attr("transform", "translate(0, 30)");

            var yAxisTitle = plotArea.selectAll("text.title-y").data([config]);

            yAxisTitle.enter().append("svg:text");

            yAxisTitle
                .text(config.yAxisLabels.description)
                .attr("class", "title-y")
                .attr("y", 5)
                .attr("x", function (d) {
                    return d.width / 2;
                })
                .attr("dy", ".35em");

            var doHover = function (d, element, optionalCallback) {
                var title = config.circleLabel(d),
                    boxWidth = 170,
                    boxHeight = 66,
                    label = d3.select('#label-' + d3.select(element).attr('data-point-label')),
                    labelX = parseFloat(label.attr('x')) + config.marginLeft,
                    labelY = parseFloat(label.attr('y')) + config.marginTop + 30,
                    labelBoundingBox = label.node().getBBox(),
                    xPos = (labelX > parseFloat(d3.select(element).attr('cx'))) ? labelX : labelX - (boxWidth - labelBoundingBox.width - 3),
                    yPos = (labelY < parseFloat(d3.select(element).attr('cy'))) ? labelY - (boxHeight - labelBoundingBox.height / 2) : labelY - labelBoundingBox.height / 2,
                    rowData = [
                        {right:GOVUK.Insights.formatNumericLabel(config.x(d)), left:config.xAxisLabels.description},
                        {right:config.y(d).toFixed(0) + '%', left:config.yAxisLabels.description}
                    ],
                    boxInfo = {
                        xPos:GOVUK.Insights.clamp(xPos, 0, config.width - boxWidth + 3),
                        yPos:GOVUK.Insights.clamp(yPos, 0, config.height + config.marginTop + 20 - boxHeight + labelBoundingBox.height / 2),
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

            var circles = graphArea.selectAll("circle").data(data);

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
                    return config.circleLabel(d).idify();
                });

            circles.exit().remove();

            var circlesLabels = graphArea.selectAll("text.circle-label").data(data);

            circlesLabels.enter().append("svg:text")
                .attr("class", "circle-label js-floating");

            circlesLabels
                .text(function (d) {
                return config.circleLabel(d);
            })
                .attr("id", function (d) {
                    return "label-" + config.circleLabel(d).idify();
                })
                .attr("data-point-label", function (d) {
                    return config.circleLabel(d).idify();
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

            var xAxis = graphArea.selectAll("g.x").data([config]);

            xAxis.enter().append("g");

            xAxis
                .attr("class", "x axis");

            var xAxisLeft = xAxis.selectAll("line.x-left").data([config]);

            xAxisLeft.enter().append("line");

            xAxisLeft
                .attr("class", "domain x-left")
                .attr("x1", function (d) {
                    return d.width / 2;
                })
                .attr("x2", 0)
                .attr("y1", function (d) {
                    return d.height / 2;
                })
                .attr("y2", function (d) {
                    return d.height / 2;
                })
                .attr("stroke", "black")
                .style("stroke-dashoffset", "2px");

            var xAxisRight = xAxis.selectAll("line.x-right").data([config]);

            xAxisRight.enter().append("line");

            xAxisRight
                .attr("class", "domain x-right")
                .attr("x1", function (d) {
                    return d.width / 2;
                })
                .attr("x2", function (d) {
                    return d.width;
                })
                .attr("y1", function (d) {
                    return d.height / 2;
                })
                .attr("y2", function (d) {
                    return d.height / 2;
                })
                .attr("stroke", "black")
                .style("stroke-dashoffset", "2px");

            var yAxis = graphArea.selectAll("g.y").data([config]);

            yAxis.enter().append("g");

            yAxis
                .attr("class", "y axis");

            var yAxisTop = yAxis.selectAll("line.y-top").data([config]);

            yAxisTop.enter().append("line");

            yAxisTop
                .attr("class", "domain y-top")
                .attr("x1", function (d) {
                    return d.width / 2;
                })
                .attr("x2", function (d) {
                    return d.width / 2;
                })
                .attr("y1", function (d) {
                    return d.height / 2;
                })
                .attr("y2", function (d) {
                    return 0;
                })
                .attr("stroke", "black")
                .style("stroke-dashoffset", "2px");

            var yAxisBottom = yAxis.selectAll("line.y-bottom").data([config]);

            yAxisBottom.enter().append("line");

            yAxisBottom
                .attr("class", "domain y-bottom")
                .attr("x1", function (d) {
                    return d.width / 2;
                })
                .attr("x2", function (d) {
                    return d.width / 2;
                })
                .attr("y1", function (d) {
                    return d.height / 2;
                })
                .attr("y2", function (d) {
                    return d.height;
                })
                .attr("stroke", "black")
                .style("stroke-dashoffset", "2px");

            // Place X axis tick labels
            var leftXAxisLabel = graphArea.selectAll("text.label-x-left").data([config]);

            leftXAxisLabel.enter().append("svg:text");

            leftXAxisLabel.text(config.xAxisLabels.left)
                .attr("class", "label-x-left")
                .attr("x", 0)
                .attr("y", function (d) {
                    return d.height / 2 + 9
                })
                .attr("dy", ".71em");

            var rightXAxisLabel = graphArea.selectAll("text.label-x-right").data([config]);

            rightXAxisLabel.enter().append("svg:text");

            rightXAxisLabel.text(config.xAxisLabels.right)
                .attr("class", "label-x-right")
                .attr("x",
                function (d) {
                    return d.width;
                })
                .attr("y", function (d) {
                    return d.height / 2 + 9;
                })
                .attr("dy", ".71em");

            // Place Y axis tick labels
            var bottomYAxisLabel = graphArea.selectAll("text.label-y-bottom").data([config]);

            bottomYAxisLabel.enter().append("svg:text");

            bottomYAxisLabel
                .text(config.yAxisLabels.bottom)
                .attr("class", "label-y-bottom")
                .attr("y", function (d) {
                    return d.height;
                })
                .attr("x", function (d) {
                    return d.width / 2 - 5;
                })
                .attr("dy", ".35em");

            var bottomYAxisLabelSquare = graphArea.selectAll("rect.label-y-bottom").data([config]);

            bottomYAxisLabelSquare.enter().append("rect");

            bottomYAxisLabelSquare
                .attr("fill", "#BF1E2D")
                .attr("class", "label-y-bottom")
                .attr("height", 12)
                .attr("width", 12)
                .attr("y", function (d) {
                    return d.height - 6;
                })
                .attr("x", function (d) {
                    return d.width / 2 + 7;
                });

            var topYAxisLabel = graphArea.selectAll("text.label-y-top").data([config]);

            topYAxisLabel.enter().append("svg:text");

            topYAxisLabel
                .text(config.yAxisLabels.top)
                .attr("class", "label-y-top")
                .attr("y", 0)
                .attr("x", function (d) {
                    return d.width / 2 - 5;
                })
                .attr("dy", ".35em");

            var topYAxisLabelSquare = graphArea.selectAll("rect.label-y-top").data([config]);

            topYAxisLabelSquare.enter().append("rect");

            topYAxisLabelSquare
                .style("fill", "#74B74A")
                .attr("class", "label-y-top")
                .attr("height", 12)
                .attr("width", 12)
                .attr("y", -6)
                .attr("x", function (d) {
                    return d.width / 2 + 7;
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
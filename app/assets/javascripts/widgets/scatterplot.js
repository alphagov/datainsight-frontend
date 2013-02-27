var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

if (window.d3 && d3.selection) {
    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };
}

GOVUK.Insights.getDarkerColor = function (c) {
    return new GOVUK.Insights.colors(c).multiplyWithSelf().asCSS()
};

GOVUK.Insights.scatterplotGraph = function () {
    var config = {
        xAxisLabels:{description:"X", left:"", right:"", squares: true},
        yAxisLabels:{description:"Y", bottom:"", top:""},
        width:956,
        height:450,
        minRadius:2,
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
        showCircleLabels: true,
        circleStrokeWidth: 1,
        circleStrokeColor: "white",
        circleId: function(d) {
            return d.id;
        },
        click: function(d) {
            return null;
        },
        xScale:d3.scale.linear(),
        yScale:d3.scale.linear(),
        rScale:d3.scale.linear(),
        colourScale:d3.scale.linear(),
        xDomainBottom: 0,
        xDomainTop: null,
        yDomainBottom: 0,
        yDomainTop: null,
        rDomainBottom: 0,
        rDomainTop: null,
        verticalOffsetForYAxisLabel: 20,
        margin: [20, 5, 20, 5],
        cDomain: null,
        cRange: null,
        overlayDistance: 5
    };
    
    var circleStrokeWidth = 2.5;
    
    var plotInsetMax = config.maxRadius / 2 + circleStrokeWidth * 2;
    var plotInsetMin = config.minRadius / 2 + circleStrokeWidth * 2;
    var plotAreaMargin = [
        config.margin[0] + plotInsetMax,
        config.margin[1] + plotInsetMax,
        config.margin[2] + plotInsetMin,
        config.margin[3] + plotInsetMax
    ];

    var getScales = function(data) {

        var cDomain = config.cDomain || [0, 50, 100];
        var cRange = config.cRange || ["#BF1E2D", "#B3B3B3", "#74B74A"];
        var xDomain = [config.xDomainBottom, config.xDomainTop === null ? d3.max(data, config.x) : config.xDomainTop],
            yDomain = [config.yDomainBottom, config.yDomainTop === null ? d3.max(data, config.y) : config.yDomainTop],
            rDomain = [config.rDomainBottom, config.rDomainTop === null ? d3.max(data, config.r) : config.rDomainTop];
        return {
            X: config.xScale.domain(xDomain).range([
                plotAreaMargin[3],
                config.width - plotAreaMargin[1]
            ]),
            Y: config.yScale.domain(yDomain).range([
                config.height - plotAreaMargin[2],
                plotAreaMargin[0]
            ]),
            R: config.rScale.domain(rDomain).range([config.minRadius, config.maxRadius]),
            C: config.colourScale.domain(cDomain).range(cRange)
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
                    var overflow = Y(config.y(d)) + R(config.r(d)) - config.height;
                    overflow = Math.max(overflow , 0);
                    return overflow;
                };
                
            var yTop = config.margin[0];
            var yBottom = config.height - config.margin[2];
            var yCentre = (yTop + yBottom) / 2;

            var svg = d3.select(this).selectAll("svg").data([config]);

            svg
                .enter().append("svg")
                .attr("class", "scatterplot js-graph-area");
            
            svg
                .attr("viewBox", function (d) {
                    return "0 0 " +  (d.width + d.marginLeft + d.marginRight) + " " + (d.height + d.marginTop + d.marginBottom + d3.max(data, bottomOverflow));
                })
                .style("width","100%")
                .style("height","100%");

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

            var doHover, endHover, lastCallback;
            if (config.showCircleLabels) {
                doHover = function (d, element, optionalCallback) {
                    
                    if (lastCallback) {
                        // ensure that existing callout is closed
                        lastCallback();
                        lastCallback = null;
                    }
                    
                    if (optionalCallback) {
                        lastCallback = optionalCallback;
                    }
                    
                    // get circle centre
                    var bbox = element.getBBox();
                    var radius = bbox.width / 2;
                    var circleX = bbox.x + radius;
                    var circleY = bbox.y + radius;
                    
                    var scaleFactor = GOVUK.Insights.svg.scaleFactor(svg, config.width)
                    
                    // calculate point on circle at 45 degrees
                    var boxPivotDist = scaleFactor * (
                        config.overlayDistance + radius * Math.cos(Math.PI / 4)
                    );
                    
                    var boxXPos = circleX * scaleFactor;
                    var boxYPos = circleY * scaleFactor;
                    
                    var title = config.circleLabel(d),
                        boxWidth = 200,
                        boxHeight = 66,
                        topShift = 125, // a fudge factor for the box y position
                        label = d3.select('#label-' + d3.select(element).attr('data-point-label')),
                        labelX = parseFloat(label.attr('x')) + config.marginLeft,
                        labelY = parseFloat(label.attr('y')) + config.marginTop + topShift,
                        labelBoundingBox = label.node().getBBox(),
                        xPos = (labelX > parseFloat(d3.select(element).attr('cx'))) ? labelX : labelX - (boxWidth - labelBoundingBox.width - 3),
                        yPos = (labelY < parseFloat(d3.select(element).attr('cy'))) ? labelY - (boxHeight - labelBoundingBox.height / 2) : labelY - labelBoundingBox.height / 2,
                        rowData = [
                            {
                                left: config.yAxisLabels.description,
                                right: config.yAxisLabels.calloutValue ? config.yAxisLabels.calloutValue(d, config) : config.y(d).toFixed(0) + '%'
                            },
                            {
                                left: config.xAxisLabels.description,
                                right: config.xAxisLabels.calloutValue ? config.xAxisLabels.calloutValue(d, config) : GOVUK.Insights.formatNumericLabel(config.x(d))
                                
                            }
                        ],
                        boxInfo = {
                            width:boxWidth,
                            height:boxHeight,
                            xPos:boxXPos,
                            yPos:boxYPos,
                            title:title,
                            rowData:rowData,
                            url: 'http://www.gov.uk/' + title,
                            parent:"#" + selection.attr("id"),
                            closeDelay:200,
                            callback:(optionalCallback) ? optionalCallback : undefined,
                            pivot: {
                                constrainToBounds: true,
                                horizontal: 'left',
                                vertical: 'bottom',
                                xOffset: boxPivotDist,
                                yOffset: -boxPivotDist
                            }
                        };
                        
                    d.callout = new GOVUK.Insights.overlay.CalloutBox(boxInfo);
                    element.parentNode.insertBefore(element, null);

                    d3.select(element).attr('stroke-width', 2.5);
                };

                endHover = function (d, element) {
                    if (d.callout !== undefined) {
                        d.callout.close();
                    }
                    delete d.callout;
                    d3.select(element).attr('stroke-width', config.circleStrokeWidth);
                };
            }

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
                .attr("class", "data-point js-fixed enabled")
                .attr("stroke", function (d) {
                    var fill = C(config.colour(d));
                    return GOVUK.Insights.getDarkerColor(fill);
                })
                .attr("stroke-width", config.circleStrokeWidth)
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
                })
                .on("click", config.click);
            
            circles.exit().remove();

            if (config.showCircleLabels) {
                var circlesLabels = graphArea.selectAll("text.circle-label").data(data);

                circlesLabels.enter().append("svg:text")
                    .attr("class", "circle-label js-floating");

                circlesLabels
                    .text(function (d) {
                        return "";
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
            }

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
                    return yCentre;
                })
                .attr("y2", function (d) {
                    return yCentre;
                })
                .attr("stroke", "black")
                // .style("stroke-dashoffset", "2px");

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
                    return yCentre;
                })
                .attr("y2", function (d) {
                    return yCentre;
                })
                .attr("stroke", "black")
                // .style("stroke-dashoffset", "2px");

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
                    
                    return yCentre;
                })
                .attr("y2", function (d) {
                    return yTop;
                })
                .attr("stroke", "black")
                // .style("stroke-dashoffset", "2px");

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
                    return yCentre;
                })
                .attr("y2", function (d) {
                    return yBottom;
                })
                .attr("stroke", "black")
                // .style("stroke-dashoffset", "2px");

            // Place X axis tick labels
            var leftXAxisLabel = graphArea.selectAll("text.label-x-left").data([config]);

            leftXAxisLabel.enter().append("svg:text");

            leftXAxisLabel.text(config.xAxisLabels.left)
                .attr("class", "label-x-left")
                .attr("x", 0)
                .attr("y", function (d) {
                    return yCentre
                })
                .attr("dy", "1.3em");

            var rightXAxisLabel = graphArea.selectAll("text.label-x-right").data([config]);

            rightXAxisLabel.enter().append("svg:text");

            rightXAxisLabel.text(config.xAxisLabels.right)
                .attr("class", "label-x-right")
                .attr("x", function (d) {
                    return d.width;
                })
                .attr("y", function (d) {
                    return yCentre;
                })
                .attr("dy", "1.3em");
            
            if (config.xAxisLabels.squares) {
                var leftXAxisLabelSquare = graphArea.selectAll("rect.label-x-left").data([config]);

                leftXAxisLabelSquare.enter().append("rect");

                leftXAxisLabelSquare
                    .attr("fill", "#BF1E2D")
                    .attr("class", "label-x-left")
                    .attr("height", 12)
                    .attr("width", 12)
                    .attr("y", function (d) {
                        return yCentre - 20;
                    })
                    .attr("x", 0);

                var rightXAxisLabelSquare = graphArea.selectAll("rect.label-x-right").data([config]);

                rightXAxisLabelSquare.enter().append("rect");

                rightXAxisLabelSquare
                    .style("fill", "#74B74A")
                    .attr("class", "label-x-right")
                    .attr("height", 12)
                    .attr("width", 12)
                    .attr("y", function (d) {
                        return yCentre - 20;
                    })
                    .attr("x", function (d) {
                        return d.width - 12;
                    });
            
            }
            
            var scaleLabelDeviation = Math.ceil(100 * config.xAxisLabels.deviation);
            
            if (config.xAxisLabels.scaleLabels) {
                var leftXAxisScaleLabel = graphArea.selectAll("text.label-scale-x-left").data([config]);
                leftXAxisScaleLabel.enter().append("svg:text");
                leftXAxisScaleLabel.text(config.xDomainBottom.toFixed(0) + '%')
                    .attr("class", "label-scale-x-left")
                    .attr("x", 0)
                    .attr("y", function (d) {
                        return yCentre
                    })
                    .attr("dy", "2.8em");

                var rightXAxisScaleLabel = graphArea.selectAll("text.label-scale-x-right").data([config]);
                rightXAxisScaleLabel.enter().append("svg:text");
                rightXAxisScaleLabel.text(config.xDomainTop.toFixed(0) + '%')
                    .attr("class", "label-scale-x-right")
                    .attr("x", function (d) {
                        return d.width;
                    })
                    .attr("y", function (d) {
                        return yCentre
                    })
                    .attr("dy", "2.8em");
            }

            

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
                });
            
            
            var topYAxisLabel = graphArea.selectAll("text.label-y-top").data([config]);

            topYAxisLabel.enter().append("svg:text");
            
            topYAxisLabel
                .text(config.yAxisLabels.top)
                .attr("class", "label-y-top")
                .attr("y", '1em')
                .attr("x", function (d) {
                    return d.width / 2 - 5;
                });

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

            var numberFormatter = GOVUK.Insights.numberListFormatter(dataForLegend);

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

    instance.filter = function (selection, term) {
        selection.each(function(data) {
            var scales = getScales(data);
            
            var svg = selection.selectAll("svg");
            var plotArea = svg.selectAll("g.plot-area");
            var graphArea = plotArea.selectAll("g.graph-area");
            var circles = graphArea.selectAll("circle");
            
            var setEnabled = function (selection) {
                selection
                    .attr('fill', function (d) {
                        return scales.C(d.colour);
                    })
                    .attr('stroke', function (d) {
                        return GOVUK.Insights.getDarkerColor(scales.C(d.colour));
                    })
                    .attr('stroke-width', config.circleStrokeWidth);
            };
            
            var setDisabled = function (selection) {
                selection
                    .attr('fill', '#eee')
                    .attr('stroke', '#ddd')
                    .attr('stroke-width', config.circleStrokeWidth);
            };
            
            var setHighlight = function (selection) {
                selection
                    .attr('fill', '#44C3DF')
                    .attr('stroke', '#097F96')
                    .attr('stroke-width', config.circleStrokeWidth);
            };
            
            if (term) {
                // search case insensitive
                term = term.toLowerCase();

                circles.attr('class', function (d) {
                    var label = d.label;
                    if (label instanceof $) {
                        label = label.text();
                    }
                    
                    return label.toLowerCase().indexOf(term) == -1 ? 'disabled' : 'enabled';
                });
                
                // disable circles that don't match the term
                setDisabled(circles.filter('.disabled'));
                
                // highlight remaining circles
                var enabledCircles = circles.filter('.enabled');
                setHighlight(enabledCircles);
                enabledCircles.moveToFront();
                
            } else {
                circles.attr('class', 'enabled');
                setEnabled(circles);
            }
        });
    };
    
    instance.pulse = function (selection, el) {
        
        selection.each(function () {
            var svg = selection.selectAll("svg");
            var plotArea = svg.selectAll("g.plot-area");
            var graphArea = plotArea.selectAll("g.graph-area");
            var circles = graphArea.selectAll("circle");
            
            circles.transition().attr('stroke-width', config.circleStrokeWidth);
            
            if (!el) {
                return;
            }
        
            var slug = el.html();
        
            var selected = circles.filter(function(data) {
                return data.id === slug;
            });
        
            selected.transition().ease('quad-out').duration(300).attr('stroke-width', 3.5);
        })
    };
    
    return instance;
};
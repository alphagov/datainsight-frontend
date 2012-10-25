var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.formatSuccess = function () {
    function showError() {
        $("#format-success-module").append(GOVUK.Insights.Helpers.error_div);
    }

    $.ajax({
        url:'/performance/graphs/format-success.json',
        success:function (data) {
            if (data !== null) {
                if (GOVUK.isSvgSupported()) {
                    $('#format-success-module img').remove();
                    GOVUK.Insights.plotFormatSuccessGraph(data);
                    $('#format-success-module .datainsight-hidden').removeClass('datainsight-hidden');
                }
            } else {
                showError();
            }
        }});
};

GOVUK.Insights.plotFormatSuccessGraph = function (data) {

    // - Constants -
    var MIN_Y = 0,
        MAX_Y = 100,
        MAX_RADIUS = 30,
        GUTTER_FOR_BUBBLES = 40,
        HEIGHT = 400,
        GUTTER_X = 32,
        GUTTER_Y_TOP = 25;

    // - Derived Constants -
    var WIDTH = 924 - GUTTER_X * 2;



    var values = data.map(
        function (formatEvents) {
            return {
                formatName:formatEvents["format"],
                total:formatEvents["entries"],
                percentageOfSuccess:formatEvents["percentage_of_success"]
            };
        });

    var MAX_X = d3.max(values, function (formatData) {
        return formatData["total"];
    });

    var radiusScale = d3.scale.linear()
        .domain([0, MAX_X])
        .range([0, Math.PI * Math.pow(MAX_RADIUS, 2)]);

    var radius = function (total) {
        return Math.sqrt(radiusScale(total) / Math.PI);
    };

    var x = d3.scale.linear()
            .domain([0, MAX_X])
            .range([GUTTER_FOR_BUBBLES + MAX_RADIUS / 2, WIDTH - (GUTTER_FOR_BUBBLES + MAX_RADIUS / 2)]),
        y = d3.scale.linear()
            .domain([MIN_Y, MAX_Y])
            .range([HEIGHT, 0]);

    var overlayBottom = function (d) {
        var overlay = y(d.percentageOfSuccess) + radius(d.total) - HEIGHT;
        return overlay > 0 ? overlay : 0;
    }

    var GUTTER_Y_BOTTOM = GUTTER_Y_TOP + d3.max(values, overlayBottom);

    var colorScale = d3.scale.linear()
        .domain([MIN_Y, MIN_Y + (MAX_Y - MIN_Y) / 2, MAX_Y])
        .range(["#BF1E2D", "#B3B3B3", "#74B74A"]);

    var svg = d3.select("#format-success")
        .data(values)
        .append("svg:svg")
        .attr("width", WIDTH + GUTTER_X * 2)
        .attr("height", HEIGHT + GUTTER_Y_TOP + GUTTER_Y_BOTTOM);

    var panel = svg
        .append("svg:g")
        .attr("transform", "translate(" + 0 + "," + 20 + ")");

    var graph = panel
        .append("svg:g")
        .attr("transform", "translate(" + GUTTER_X + "," + GUTTER_Y_TOP + ")");

    var plotData = function (graph) {
        // Draw xy scatterplot
        graph.selectAll("circle.format")
            .data(values)
            .enter().append("svg:circle")
            .attr("class", "format")
            .attr("fill", function (d) {
                return colorScale(d.percentageOfSuccess);
            })
            .style("opacity", 0.9)
            .attr("cx", function (d) {
                return x(d.total);
            })
            .attr("cy", function (d) {
                return y(d.percentageOfSuccess);
            })
            .attr("r", function (d) {
                // add half the circle stroke width
                return radius(d.total) + 1;
            });
    };

    var drawAxis = function (graph) {
        // Draw grid lines
        var xaxis = graph.append("g")
            .attr("class", "x axis");

        xaxis.append("line")
            .attr("class", "domain")
            .attr("x1", WIDTH / 2)
            .attr("x2", 0)
            .attr("y1", HEIGHT / 2)
            .attr("y2", HEIGHT / 2)
            .attr("style", "stroke-dashoffset: 2px");

        xaxis.append("line")
            .attr("class", "domain")
            .attr("x1", WIDTH / 2)
            .attr("x2", WIDTH)
            .attr("y1", HEIGHT / 2)
            .attr("y2", HEIGHT / 2);

        var yaxis = graph.append("g")
            .attr("class", "y axis");

        yaxis.append("line")
            .attr("class", "domain")
            .attr("x1", WIDTH / 2)
            .attr("x2", WIDTH / 2)
            .attr("y1", HEIGHT / 2)
            .attr("y2", 0);
        yaxis.append("line")
            .attr("class", "domain")
            .attr("x1", WIDTH / 2)
            .attr("x2", WIDTH / 2)
            .attr("y1", HEIGHT / 2)
            .attr("y2", HEIGHT)
            .attr("style", "stroke-dashoffset: 2px");

        var drawTickLabels = function (graph) {
            // Place X axis tick labels
            graph.append("svg:text")
                .text("Least used")
                .attr("class", "label-x-left")
                .attr("x", 0)
                .attr("y", HEIGHT / 2 + 9)
                .attr("dy", ".71em");

            graph.append("svg:text")
                .text("Most used")
                .attr("class", "label-x-right")
                .attr("x", function () {
                    return WIDTH - $(this).width()
                })
                .attr("y", HEIGHT / 2 + 9)
                .attr("dy", ".71em");

            // Place Y axis tick labels
            panel.append("svg:text")
                .text("Used successfully")
                .attr("class", "title-y")
                .attr("y", 5)
                .attr("x", WIDTH / 2 + GUTTER_X)
                .attr("dy", ".35em");

            graph.append("svg:text")
                .text(MIN_Y + "%")
                .attr("class", "label-y-bottom")
                .attr("y", HEIGHT)
                .attr("x", WIDTH / 2 - 5)
                .attr("dy", ".35em");

            graph.append("rect")
                .attr("height", 12)
                .attr("width", 12)
                .attr("y", HEIGHT - 6)
                .attr("x", WIDTH / 2 + 7)
                .attr("style", "fill: #BF1E2D");

            graph.append("svg:text")
                .text(MAX_Y + "%")
                .attr("class", "label-y-top")
                .attr("y", 0)
                .attr("x", WIDTH / 2 - 5)
                .attr("dy", ".35em");

            graph.append("rect")
                .attr("height", 12)
                .attr("width", 12)
                .attr("y", -6)
                .attr("x", WIDTH / 2 + 7)
                .attr("style", "fill: #74B74A");
        };
        drawTickLabels(graph);
    };

    var drawLabels = function (graph) {
        graph
            .selectAll("text.circle-format")
            .data(values)
            .enter().append("svg:text")
            .text(function (d) {
                return d.formatName;
            })
            .attr("class", "circle-format")
            .attr("text-anchor", "middle")
            .attr("x", function (d) {
                return x(d.total);
            })
            .attr("y", function (d) {
                return y(d.percentageOfSuccess) + radius(d.total) + 15;
            })
            .attr("dy", ".35em");
    };


    var drawLegend = function () {
        var estimatedWidthOfLegendText = 80;
        var dataForLegend = x.ticks(4).slice(1, 4);

        if (dataForLegend.length > 2) dataForLegend = dataForLegend.slice(0,2);

        var maxCircleRadius = radius(dataForLegend.slice(-1));

        var legend = d3.select("#format-success-legend")
            .append("svg")
            .attr("width", 180)
            .attr("height", 80)
            .append("g")
            .attr("transform", "translate(" + (maxCircleRadius + estimatedWidthOfLegendText) + ", 3)");

        legend
            .selectAll("circle.legend")
            .data(dataForLegend)
            .enter().append("svg:circle")
            .attr("class", "legend")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("cx", function () {
                return maxCircleRadius;
            })
            .attr("cy", function (d) {
                return radius(d);
            })
            .attr("r", function (d) {
                return radius(d);
            });

        legend
            .selectAll("text.circle-legend")
            .data(dataForLegend)
            .enter().append("svg:text")
            .attr("class", "circle-legend")
            .attr("x", -5)
            .attr("y", function (d, index) {
                return 2*radius(d) - 5; // offset text to bottom of circles
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .text(function (d) {
                return GOVUK.Insights.formatNumericLabel(d) + " times used";
            });
    };

    // - Actually draw the graph -
    plotData(graph);
    drawAxis(graph);
    drawLabels(graph);
    drawLegend();
};

// register with jQuery's autorun.
$(GOVUK.Insights.formatSuccess);

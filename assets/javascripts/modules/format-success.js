var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.formatSuccess = function () {
    function showError() {
        $("#format-success-module").append(GOVUK.Insights.Helpers.error_div);
    }

    $.ajax({
        url:'/performance/format-success.json',
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
    var values =
        data.map(
            function (formatEvents) {
                return {
                    formatName:formatEvents["format"],
                    total:formatEvents["entries"],
                    percentageOfSuccess:formatEvents["percentage_of_success"]
                };
            });

    var maxX = d3.max(values, function (formatData) {
        return formatData["total"];
    });

    var minY = 0;
    var maxY = 100;

    var maxRadius = 35;
    var radiusScale = d3.scale.linear()
        .domain([0, maxX])
        .range([0, Math.PI * Math.pow(maxRadius, 2)]);
    var radius = function (total) {
        return Math.sqrt(radiusScale(total) / Math.PI);
    };

    var gutterForBubbles = 40;
    var h = 400,
        gutterX = 32,
        w = 924 - gutterX * 2,
        gutterYTop = 25,
        x = d3.scale.linear()
            .domain([0, maxX])
            .range([gutterForBubbles + maxRadius / 2, w - (gutterForBubbles + maxRadius / 2)]),
        y = d3.scale.linear()
            .domain([minY, maxY])
            .range([h, 0]);

    var overlayBottom = function (d) {
        var overlay = y(d.percentageOfSuccess) + radius(d.total) - h;
        return overlay > 0 ? overlay : 0;
    }
    var gutterYBottom = gutterYTop + d3.max(values, overlayBottom);

    var colorScale = d3.scale.linear()
        .domain([minY, minY + (maxY - minY) / 2, maxY])
        .range(["#BF1E2D", "#B3B3B3", "#74B74A"]);

    var svg = d3.select("#format-success")
        .data(values)
        .append("svg:svg")
        .attr("width", w + gutterX * 2)
        .attr("height", h + gutterYTop + gutterYBottom);

    var panel = svg
        .append("svg:g")
        .attr("transform", "translate(" + 0 + "," + 20 + ")");

    var graph = panel
        .append("svg:g")
        .attr("transform", "translate(" + gutterX + "," + gutterYTop + ")");

    var legend = panel
        .append("svg:g")
        .attr("transform", "translate(" + gutterX + ", 0)");

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
            return radius(d.total);
        });

    // Draw grid lines
    var xaxis = graph.append("g")
        .attr("class", "x axis");

    xaxis.append("line")
        .attr("class", "domain")
        .attr("x1", w / 2)
        .attr("x2", 0)
        .attr("y1", h / 2)
        .attr("y2", h / 2)
        .attr("style", "stroke-dashoffset: 2px");

    xaxis.append("line")
        .attr("class", "domain")
        .attr("x1", w / 2)
        .attr("x2", w)
        .attr("y1", h / 2)
        .attr("y2", h / 2);

    var yaxis = graph.append("g")
        .attr("class", "y axis");

    yaxis.append("line")
        .attr("class", "domain")
        .attr("x1", w / 2)
        .attr("x2", w / 2)
        .attr("y1", h / 2)
        .attr("y2", 0);
    yaxis.append("line")
        .attr("class", "domain")
        .attr("x1", w / 2)
        .attr("x2", w / 2)
        .attr("y1", h / 2)
        .attr("y2", h)
        .attr("style", "stroke-dashoffset: 2px")
    ;

    // Place X axis tick labels
    graph.append("svg:text")
        .text("Least used")
        .attr("class", "label-x-left")
        .attr("x", 0)
        .attr("y", h / 2 + 9)
        .attr("dy", ".71em");

    graph.append("svg:text")
        .text("Most used")
        .attr("class", "label-x-right")
        .attr("x", function () {
            return w - $(this).width()
        })
        .attr("y", h / 2 + 9)
        .attr("dy", ".71em");

    // Place Y axis tick labels
    panel.append("svg:text")
        .text("Used successfully")
        .attr("class", "title-y")
        .attr("y", 5)
        .attr("x", w / 2 + gutterX)
        .attr("dy", ".35em");

    graph.append("svg:text")
        .text(minY + "%")
        .attr("class", "label-y-bottom")
        .attr("y", h)
        .attr("x", w / 2 - 5)
        .attr("dy", ".35em");

    graph.append("svg:text")
        .text(maxY + "%")
        .attr("class", "label-y-top")
        .attr("y", 0)
        .attr("x", w / 2 - 5)
        .attr("dy", ".35em");

    var shouldFlipLabelToLeft = function (d) {
        return d.total / maxX > 0.75;
    };

    graph
        .selectAll("text.circle-format")
        .data(values)
        .enter().append("svg:text")
        .text(function (d) {
            return d.formatName
        })
        .attr("class", "circle-format")
        .attr("text-anchor", function (d) {
            return shouldFlipLabelToLeft(d) ? "end" : "start";
        })
        .attr("x", function (d) {
            var shiftText = (radius(d.total) + 10);
            if (shouldFlipLabelToLeft(d)) {
                shiftText = -shiftText - $(this).width();
            }
            return x(d.total) + shiftText;
        })
        .attr("y", function (d) {
            return y(d.percentageOfSuccess);
        })
        .attr("dy", ".35em");

    var dataForLegend = x.ticks(4).slice(1, 4);

    var maxCircleRadius = radius(dataForLegend.slice(-1));


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
        .attr("x", 2 * maxCircleRadius + 5)
        .attr("y", function (d, index) {
            return 15 * index + maxCircleRadius / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .text(function (d) {
            return GOVUK.convertToLabel(d) + " times used";
        });
};

// register with jQuery's autorun.
$(GOVUK.Insights.formatSuccess);
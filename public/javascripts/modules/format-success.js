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
                    GOVUK.Insights.plotFormatSuccessGraph(data);
                } else {
                    $("#format-success-module").html("<img src='/performance/format-success.png' />");
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
    })

    var minY = d3.min(values, function (formatData) {
        return Math.round(formatData["percentageOfSuccess"]);
    });
    var maxY = d3.max(values, function (formatData) {
        return Math.round(formatData["percentageOfSuccess"]);
    });

    var maxRadius = 25;
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
            .range([h - gutterForBubbles, gutterForBubbles]);

    var colorScale = d3.scale.linear()
        .domain(d3.range(0, 10).map(function (i) {
        return 10 * i;
    }))
        .range(["#BF1E2D", "#C18F9E", "#CCAAB0", "#D3C8CB", "#CFCACB", "#CACBC5", "#C3CBBA", "#C6CEBA", "#A0C184", "#74B74A"]);

    var svg = d3.select("#format-success")
        .data(values)
        .append("svg:svg")
        .attr("width", w + gutterX * 2)
        .attr("height", h + gutterYTop * 2)

    var panel = svg
        .append("svg:g")
        .attr("transform", "translate(" + gutterX + "," + gutterYTop + ")");

    var graph = panel
        .append("svg:g")
        .attr("transform", "translate(" + 0 + "," + 20 + ")");

    // Draw grid lines
    graph
        .append("svg:line")
        .attr("stroke", "#808080")
        .attr("x1", 0)
        .attr("x2", w)
        .attr("y1", h / 2)
        .attr("y2", h / 2);

    graph
        .append("svg:line")
        .attr("stroke", "#808080")
        .style("width", "1px")
        .attr("x1", w / 2)
        .attr("x2", w / 2)
        .attr("y1", 0)
        .attr("y2", h);

    // Place X axis tick labels
    graph.append("svg:text")
        .text("Least visited")
        .attr("x", 0)
        .attr("y", h / 2 + 15)
        .attr("dy", ".71em")

    graph.append("svg:text")
        .text("Most visited")
        .attr("x", function () {
            return w - $(this).width()
        })
        .attr("y", h / 2 + 15)
        .attr("dy", ".71em")

    // Place Y axis tick labels
    panel.append("svg:text")
        .text("Successful interactions")
        .attr("y", 0)
        .attr("x", w / 2 + 70)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")

    graph.append("svg:text")
        .attr("y", h)
        .attr("x", w / 2 - 5)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(minY + "%");

    graph.append("svg:text")
        .attr("y", 0)
        .attr("x", w / 2 - 5)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(maxY + "%");

    // Draw xy scatterplot
    graph.selectAll("circle.format")
        .data(values)
        .enter().append("svg:circle")
        .attr("class", "format")
        .attr("fill", function (d) {
            return colorScale(d.percentageOfSuccess);
        })
        .style("opacity", 0.6)
        .attr("cx", function (d) {
            return x(d.total);
        })
        .attr("cy", function (d) {
            return y(d.percentageOfSuccess);
        })
        .attr("r", function (d) {
            return radius(d.total);
        })

    graph
        .selectAll("text.circle-format")
        .data(values)
        .enter().append("svg:text")
        .text(function (d) {
            return d.formatName
        })
        .attr("class", "circle-format")
        .attr("text-anchor", "start")
        .attr("x", function (d) {
            var shiftText = (radius(d.total) + 10);
            if (d.total / maxX > 0.75) {
                var shiftText = -shiftText - $(this).width();
            }
            return x(d.total) + shiftText;
        })
        .attr("y", function (d) {
            return y(d.percentageOfSuccess);
        })
        .attr("dy", ".35em");

    var dataForLegend = x.ticks(4).slice(1, 4);

    var maxCircleRadius = radius(dataForLegend.slice(-1));

    var legend = panel.append("svg:g").attr("transform", "translate(0, 0)");

    legend
        .selectAll("circle.legend")
        .data(dataForLegend)
        .enter().append("svg:circle")
        .attr("class", "legend")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("cx", function (d) {
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
            return GOVUK.convertToLabel(d) + " visits";
        });
};

// register with jQuery's autorun.
$(GOVUK.Insights.formatSuccess);
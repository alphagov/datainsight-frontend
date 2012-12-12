var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.timeSeriesGraph = function () {
    var config = {
        width:960,
        height:400,
        marginTop: 10,
        marginBottom: 40,
        marginLeft: 0,
        marginRight: 0,
        xScale: d3.time.scale()
    };

    var AXIS_OFFSET = 40;

    var instance = function (selection) {
        selection.each(function (data) {

            var svg = d3.select(this).selectAll("svg").data([config]);

            svg.enter().append("svg")
                .attr("class", "time-series js-graph-area")
                .attr("width", function (d) { return d.width + d.marginLeft + d.marginRight; })
                .attr("height", function (d) { return d.height + d.marginTop + d.marginBottom; });

            var graphArea = svg.selectAll("g.graph-area")
                .data([config])
                .enter()
                .append("svg:g")
                .attr("class", "graph-area")
                .attr("transform", function (d) {
                    return "translate(" + d.marginLeft + "," + d.marginTop + ")";
                });

            var format = d3.time.format("%Y-%m-%d");

            var minDate = data.details.data.map(function(d) {return format.parse(d.end_at); }).reduce(function(a,b) { return a < b ? a : b; } );
            var maxDate = data.details.data.map(function(d) {return format.parse(d.end_at); }).reduce(function(a,b) { return a > b ? a : b; } );
            var maxVisits = data.details.data.map(function(d) {return d.value; }).reduce(function(a,b) { return a > b ? a : b; } );

            var xScale = config.xScale.domain([ minDate, maxDate ]).range([AXIS_OFFSET, config.width ]);
            var yScale = d3.scale.linear().domain([0, maxVisits]).range([config.height - AXIS_OFFSET, 0])

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(d3.time.weeks, 2)
                .tickSize(5)
                .tickPadding(4)
                .tickFormat(d3.time.format("%d %b"));

            graphArea.append("svg:g")
                .classed("x-axis", true)
                .attr("transform", "translate(0, " + (config.height - AXIS_OFFSET) + ")")
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
                    return xScale(format.parse(d.end_at));
                })
                .y(function(d) {
                    return yScale(d.value);
                });

            var path = plottingArea.append("svg:path")
                .attr("stroke", "#000")
                .attr("d", line(data.details.data));
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

GOVUK.Insights.Reach = GOVUK.Insights.Reach || {};

function plot_traffic(id, raw_data) {
    // Prepare data
    var yesterdaysData = $.map(raw_data, function(item) {
            return item.visitors.yesterday;
        }),
        averageData = $.map(raw_data, function(item) {
            return item.visitors.last_week_average;
        }),
        maxValue = d3.max([].concat(yesterdaysData).concat(averageData));

    // Colours
    var colours = {
            STRONG_GREEN: "#74B74A",
            MIDDLE_GREEN: "#9CB072",
            WEAK_GREEN: "#B2B3AF",

            STRONG_RED: "#BF1E2D",
            MIDDLE_RED: "#A56667",
            WEAK_RED: "#D3C8CB",

            CENTER_GREY: "#B3B3B3"
        },
        calculateFill = GOVUK.Insights.Reach.fillCalculator(averageData, colours);

    // Dimensions
    var margin = [15, 10, 24, 40],
        width = 924,
        height = 300,
        chartWidth = width - margin[1] - margin[3],
        chartHeight = height - margin[0] - margin[2],
        numberOfYTicks = 6,
        barWidth = Math.floor(chartWidth / 24),
        barPadding = Math.floor(barWidth / 5);

    // Create the svg panel
    var svg = d3.select("#" + id)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var chart = svg.append("g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

    // Set up scales
    var xScale = d3.scale.linear()
        .domain([0, 24])
        .rangeRound([0, chartWidth]);

    var yScale = d3.scale.linear()
        .domain([0, maxValue])
        .rangeRound([chartHeight, 0]);

    // Create the bars
    chart.selectAll(".bar")
        .data(yesterdaysData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) {
            return xScale(i) + barPadding
        })
        .attr("y", yScale)
        .attr("fill", calculateFill)
        .attr("width", barWidth - barPadding * 2)
        .attr("height", function(d) {
            return chartHeight - yScale(d);
        });

    // Create the average line
    var line = d3.svg.line()
        .x(function(d, i) { return xScale(i) + barWidth / 2 })
        .y(yScale)
        .interpolate("monotone");

    chart.append("path")
        .attr("d", line(averageData))
        .attr("class", "dashed-line pink");

    // Create the Y-Axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickValues(get_tick_values(maxValue, numberOfYTicks).map(Math.ceil))
        .tickFormat(function(label) {
            return format_tick_label(label, maxValue / numberOfYTicks);
        });

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (margin[3] - 5) + "," + margin[0] + ")")
        .call(yAxis);

    // Create the X-Axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickValues([4, 8, 12, 16, 20])
        .tickFormat(function(v) {
            return v > 12 ? (v-12) + "pm" : v + "am";
        });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin[3] + "," + (height - margin[2] + 3) + ")")
        .call(xAxis);
}

function get_tick_values(maxValue, numberOfTicks) {
    var step = maxValue / (numberOfTicks - 1);

    return d3.range(0, maxValue + 1, step);
}

function plot_legend_for_yesterday(id) {
    var svg = d3.select('#' + id)
        .append("svg")
        .attr("width", 20)
        .attr("height", 20);

    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 13)
        .attr("height", 26)
        .attr("fill", "url(#gradient_for_yesterday)");
}

function plot_legend_for_monthly_average(id) {
    var svg = d3.select('#' + id)
        .append("svg")
        .attr("width", 20)
        .attr("height", 20);

    var line = d3.svg.line();
    svg.append("svg:path")
        .attr("d", line([
            [0, 8],
            [13, 8]
        ]))
        .attr("class", "dashed-line pink");
}

function format_tick_label(tick_value, tick_step) {
    if (tick_step >= 1000000) {
        return Math.ceil(tick_value / 1000000) + "m";
    }
    if (tick_step >= 1000) {
        return Math.ceil(tick_value / 1000) + "k";
    }
    return "" + tick_value;
}

GOVUK.Insights.Reach.fillCalculator = function(averageData, colours) {
    var zeroScale = d3.scale.linear()
        .domain([0, 1])
        .range([colours.WEAK_GREEN, colours.STRONG_GREEN])
        .clamp(true),

        greens = [colours.WEAK_GREEN, colours.MIDDLE_GREEN, colours.STRONG_GREEN],
        reds = [colours.WEAK_RED, colours.MIDDLE_RED, colours.STRONG_RED];

    function colourScale(average, minFactor, maxFactor, percent, colours) {
        var minRange = average * minFactor,
            maxRange = average * maxFactor,
            midRange = minRange + (percent * (maxRange - minRange));

        return d3.scale.linear()
            .domain([minRange, midRange, maxRange])
            .range(colours)
            .clamp(true);
    }

    return function(datum, index) {
        var average = averageData[index];
        if (average === 0) {
            return zeroScale(datum)
        } else if (datum > (average * 1.2)) {
            return colourScale(average, 1.2, 1.5, 0.7, greens)(datum);
        } else if (datum < (average * 0.8)) {
            return colourScale(average, 0.5, 0.8, 0.7, reds)(datum);
        } else {
            return colours.CENTER_GREY;
        }
    }
};

function plot_traffic(id, raw_data) {
    var data_to_plot = today_yesterday_to_plot(raw_data);
    var average_plot_data = monthly_average_to_plot(raw_data);

    // Colours
    var STRONG_GREEN = "#74B74A",
        MIDDLE_GREEN = "#9CB072",
        WEAK_GREEN = "#B2B3AF",

        STRONG_RED = "#BF1E2D",
        MIDDLE_RED = "#A56667",
        WEAK_RED = "#D3C8CB",

        CENTER_GREY = "#B3B3B3";

    // Sizing
    var margin = [15, 10, 24, 40],
        width = 924,
        height = 300,
        chartWidth = width - margin[1] - margin[3],
        chartHeight = height - margin[0] - margin[2],
        numberOfYTicks = 6;

    var barWidth = Math.floor(chartWidth / 24),
        barPadding = Math.floor(barWidth / 5);

    var maxValue = d3.max([].concat(data_to_plot).concat(average_plot_data));

    function get_fill(datum, index) {
        if (index < get_todays_hour(raw_data)) {
            var monthly_average = get_monthly_average(raw_data, index);
            if (monthly_average === 0) {
                return fill_for_spike_from_zero(datum)
            } else if (datum > (monthly_average * 1.2)) {
                return fill_for_spike(datum, monthly_average);
            } else if (datum < (monthly_average * 0.8)) {
                return fill_for_trough(datum, monthly_average);
            } else {
                return CENTER_GREY;
            }
        } else {
            return "url(#gradient_for_yesterday)"
        }
    }

    function fill_for_spike_from_zero(datum) {
        var colorScale = d3.scale.linear()
            .domain([0, 1])
            .range([WEAK_GREEN, STRONG_GREEN]);
        colorScale.clamp(true);
        return colorScale(datum);
    }

    function fill_for_spike(datum, monthly_average_at) {
        var maxRange = monthly_average_at * 1.5;
        var minRange = monthly_average_at * 1.2;
        var midRange = percentOfRange(0.7, minRange, maxRange);
        var colorScale = linear3PointGradient(colourValue(WEAK_GREEN, minRange), colourValue(MIDDLE_GREEN, midRange), colourValue(STRONG_GREEN, maxRange));
        return colorScale(datum);
    }

    function colourValue(colour, value) {
        return { 'colour':colour, 'value':value};
    }

    function percentOfRange(val, min, max) {
        return min + (val * (max - min))
    }

    function linear3PointGradient(colourValue1, colourValue2, colourValue3) {
        var colorScale = d3.scale.linear()
            .domain([colourValue1['value'], colourValue2['value'], colourValue3['value']])
            .range([colourValue1['colour'], colourValue2['colour'], colourValue3['colour']]);
        colorScale.clamp(true);
        return colorScale;
    }

    function fill_for_trough(datum, monthly_average_at) {
        var maxRange = monthly_average_at * 0.8;
        var minRange = monthly_average_at * 0.5;
        var midRange = percentOfRange(0.7, minRange, maxRange);
        var colorScale = linear3PointGradient(colourValue(WEAK_RED, minRange), colourValue(MIDDLE_RED, midRange), colourValue(STRONG_RED, maxRange));
        return colorScale(datum);
    }

    var svg = d3.select("#" + id)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var chart = svg.append("g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

    var xScale = d3.scale.linear()
        .domain([0, 24])
        .rangeRound([0, chartWidth]);

    var yScale = d3.scale.linear()
        .domain([0, maxValue])
        .rangeRound([chartHeight, 0]);

    chart.selectAll(".bar")
        .data(data_to_plot)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) {
            return xScale(i) + barPadding
        })
        .attr("y", yScale)
        .attr("fill", get_fill)
        .attr("width", barWidth - barPadding * 2)
        .attr("height", function(d) {
            return chartHeight - yScale(d);
        });

    var line = d3.svg.line()
        .x(function(d, i) { return xScale(i) + barWidth / 2 })
        .y(yScale)
        .interpolate("monotone");

    chart.append("path")
        .attr("d", line(average_plot_data))
        .attr("class", "dashed-line pink");

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

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickValues([4, 8, 12, 16, 20])
        .tickFormat(function(v) {
            var ext = "am";
            if (v > 12) {
                v -= 12;
                ext = "pm";
            }
            return v + ext;
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

function get_monthly_average(raw_data, index) {
    return raw_data[index].visitors.monthly_average;
}

function get_today(raw_data, index) {
    return raw_data[index].visitors.today;
}

function get_yesterday(raw_data, index) {
    return raw_data[index].visitors.yesterday;
}

function get_todays_hour(raw_data) {
    var hour;
    for (hour = 0; hour < raw_data.length; hour++) {
        if (raw_data[hour].visitors.today === undefined) {
            break
        }
    }
    return hour;
}

function data_to_plot(raw_data, extractor) {
    var result = [];
    for (var hour = 0; hour < raw_data.length; hour++) {
        result.push(extractor(raw_data, hour));
    }
    return result;

}

function today_yesterday_to_plot(raw_data) {
    var plot_data = [],
        stop_today = get_todays_hour(raw_data);

    var hour;
    for (hour = 0; hour < stop_today; hour++) {
        plot_data.push(get_today(raw_data, hour));
    }
    for (; hour < raw_data.length; hour++) {
        plot_data.push(get_yesterday(raw_data, hour));
    }
    return plot_data;
}

function monthly_average_to_plot(raw_data) {
    return data_to_plot(raw_data, get_monthly_average);
}

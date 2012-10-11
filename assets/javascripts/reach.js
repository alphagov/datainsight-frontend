function plot_traffic(id, raw_data) {

    var data_to_plot = today_yesterday_to_plot(raw_data);
    var average_plot_data = monthly_average_to_plot(raw_data);

    var STRONG_GREEN = "#74B74A";
    var MIDDLE_GREEN = "#9CB072";
    var WEAK_GREEN = "#B2B3AF";

    var STRONG_RED = "#BF1E2D";
    var MIDDLE_RED = "#A56667";
    var WEAK_RED = "#D3C8CB";

    var CENTER_GREY = "#B3B3B3";

    // var target = $('#' + id);
    var top_gutter = 8;
    var width = 924; //$(target).width();
    var height = 300;
    var yesterdays_height = 30;

    var barwidth = 20;
    var axesheight = 30;
    var axeswidth = 45;

    var maxValue = d3.max([].concat(data_to_plot).concat(average_plot_data));

    var svg = d3.select('#' + id)
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height + top_gutter)
        .append("svg:g")
        .attr("transform", "translate(8, " + top_gutter + ")");

    var x = d3.scale.linear()
        .domain([0, 24])
        .rangeRound([0 + axeswidth, width]);
    var y = d3.scale.linear()
        .domain([0, maxValue])
        .rangeRound([0, height - axesheight]);


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

    svg.selectAll(".bar")
        .data(data_to_plot)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (datum, index) {
            return x(index) - barwidth / 2;
        })
        .attr("y", function (datum) {
            return height - axesheight - y(datum);
        })
        .attr("fill", get_fill)
        .attr("width", barwidth)
        .attr("height", function (datum, index) {
            if (index < get_todays_hour(raw_data)) {
                return y(datum);
            } else {
                if (y(datum) < yesterdays_height) {
                    return y(datum);
                } else {
                    return y(datum);
                }
            }
        });


    var yscale_for_axis = d3.scale.linear()
        .domain([0, maxValue])
        .rangeRound([height - axesheight, 0]);

    var numberOfTicks = 6;
    var tick_values = get_tick_values(maxValue, numberOfTicks).map(Math.ceil);
    var yAxis = d3.svg.axis().scale(yscale_for_axis)
        .orient("left")
        .tickValues(tick_values)
        .tickFormat(function (each) {
            return format_tick_label(each, maxValue / numberOfTicks);
        });

    svg.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(40,0)")
        .call(yAxis);

    var xAxis = d3.svg.axis()
            .scale(x)
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
        .attr("class", "xaxis")
        .attr("transform", "translate(-" + barwidth + ", " + (height - axesheight) + ")")
        .call(xAxis);

//    trend

    var line = d3.svg.line()
        .x(function (d, index) {
            return x(index);
        })
        .y(function (d) {
            return yscale_for_axis(d);
        });

    line.interpolate("monotone");
    svg.append("svg:path")
        .attr("d", line(average_plot_data))
        .attr("class", "dashed-line pink");

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

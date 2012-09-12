function plot_traffic(id, raw_data) {

    var data_to_plot = today_yesterday_to_plot(raw_data);
    var average_plot_data = monthly_average_to_plot(raw_data);

    var target = $('#' + id);
    var top_gutter = 8;
    var width = $(target).width();
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
            if (monthly_average == 0) {
                return fill_for_spike_from_zero(datum)
            } else if (datum > (monthly_average * 1.2)) {
                return fill_for_spike(datum, monthly_average);
            } else if (datum < (monthly_average * 0.8)) {
                return fill_for_trough(datum, monthly_average);
            } else {
                return "#C4C4C4";
            }
        } else {
            return "url(#gradient_for_yesterday)"
        }
    }

    function fill_for_spike_from_zero(datum) {
        var colorScale = d3.scale.linear()
            .domain([0, 1])
            .range(["#C3CBBA", "#74B74A"]);
        colorScale.clamp(true);
        return colorScale(datum);
    }

    function fill_for_spike(datum, monthly_average_at) {
        var colorScale = d3.scale.linear()
            .domain([monthly_average_at * 1.2, monthly_average_at * 1.5])
            .range(["#C3CBBA", "#74B74A"]);
        colorScale.clamp(true);
        return colorScale(datum);
    }

    function fill_for_trough(datum, monthly_average_at) {
        var colorScale = d3.scale.linear()
            .domain([monthly_average_at * 0.8, monthly_average_at * 0.5])
            .range(["#D3C8CB", "#BF1E2D"]);
        colorScale.clamp(true);
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
                    return yesterdays_height;
                }
            }
        });


    var yscale_for_axis = d3.scale.linear()
        .domain([0, maxValue])
        .rangeRound([height - axesheight, 0]);

    var numberOfTicks = 6;
    var tick_values = get_tick_values(maxValue, numberOfTicks).map(Math.ceil);
    yAxis = d3.svg.axis().scale(yscale_for_axis)
        .orient("left")
        .tickValues(tick_values)
        .tickFormat(function (each) {
            return format_tick_label(each, maxValue / numberOfTicks);
        });

    svg.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(40,0)")
        .call(yAxis);

    var x_ticks = d3.scale.ordinal()
        .domain(d3.range(0, 28, 4))
        .range(["01.00", "04.00", "08.00", "12.00", "16.00", "20.00", "24.00"]);

    svg.selectAll("text.xaxis")
        .data(d3.range(0, 25))
        .enter().append("svg:text")
        .attr("x", function (datum) {
            if (datum == 0) return x(datum) + 8; else return x(datum) - 30;
        })
        .attr("y", height)
        .attr("text-anchor", "middle")
        .attr("class", "xaxis")
        .attr("style", "font-family:sans-serif;font-size:14px;")
        .text(function (datum) {
            if (datum % 4 == 0) {
                return x_ticks(datum);
            }
        });


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

function plot_legend(id) {
    var svg = d3.select('#' + id)
        .append("svg")
        .attr("width", 20)
        .attr("height", 20);

    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 13)
        .attr("height", 13)
        .attr("fill", "url(#gradient_for_yesterday)");
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
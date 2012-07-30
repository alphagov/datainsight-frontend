var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};


GOVUK.Insights.months_range = function(startDate, endDate, step) {
    function monthDiff(t1, t2) {
        return (t1.getYear() * 12 + t1.getMonth()) - (t2.getYear() * 12 + t2.getMonth());
    }
    var months = 0,
        time = new Date(+startDate),
        times = [];

    if (step > 1) {
        while (time <= endDate) {
            if (months % 2 == 0) {
                times.push(new Date(+time));
            }
            months += 2;
            time = new Date(+startDate);
            time.setMonth(time.getMonth() + months);
            while (monthDiff(time, startDate) != months) {
                time = new Date(time - 86400000);
            }
        }
    }
    return times;

};

$(function() {
    d3.json("/visits.json", function(data){
        var margins = [22, 27, 15, 54],
            width = 462 - margins[1] - margins[3],
            height = 236 + 15 - margins[0] - margins[2],
            df = d3.time.format("%Y-%m-%d"),

            alldata = data["govuk"].concat(data["directgov"],data["businesslink"]),

            visit_extent = d3.extent(alldata, function(d) { return d.visits}),
            time_extent = d3.extent(alldata, function(d) { return df.parse(d.date)}),

            largest_million = Math.ceil(visit_extent[1]/1000000),
            y_scale = d3.scale.linear().domain([0, largest_million * 1000000]).range([height, 0]),
            x_scale = d3.time.scale().domain(time_extent).range([0,width]),

            line = d3.svg.line()
                .x(function(d) { return x_scale(df.parse(d.date))})
                .y(function(d) { return y_scale(d.visits)}),

            graph = d3.select("#visits")
                .append("svg:svg")
                .attr("width", width + margins[1] + margins[3])
                .attr("height", height + margins[0] + margins[2])
                .append("svg:g")
                .attr("transform", "translate(" + margins[3] + "," + margins[0] + ")");


        /* Set Up X-Axis */

        var xAxis = d3.svg.axis()
            .scale(x_scale)
            .ticks(GOVUK.Insights.months_range, 2)
            .tickFormat(d3.time.format("%b %d"));

        graph.append("svg:g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + (height-5) + ")")
            .call(xAxis);


        /* Set Up Y-Axis */
        var y_tick_values = [];
        for (var i = 0; i <= largest_million; i++) {
            y_tick_values.push(i*1000000);
        }
        var yAxis = d3.svg.axis()
            .scale(y_scale)
            .tickValues(y_tick_values)
            .orient("left")
            .tickFormat(function(d) {
                d = d / 1000000;
                return d ? (d + "m") : d;
            });
        graph.append("svg:g")
            .attr("class", "y-axis")
            .attr("transform", "translate(-10,0)")
            .call(yAxis);


        /* Add The Graph Lines */
        $(["govuk", "directgov", "businesslink"]).each(function(i, name) {
            graph.append("svg:path")
                .attr("d", line(data[name]))
                .attr("class", name);
        });
    });
});
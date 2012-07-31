var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};


GOVUK.Insights.months_range = function(startDate, endDate, step) {
    function monthDiff(t1, t2) {
        return (t1.getYear() * 12 + t1.getMonth()) - (t2.getYear() * 12 + t2.getMonth());
    }
    var months = 0,
        time = new Date(+startDate),
        times = [];

    while (time <= endDate) {
        if (months % step == 0) {
            times.push(new Date(+time));
        }
        // move on by 'step' months, if the resulting month is not what's expected then it means the target month
        // doesn't have enough days in it. Step backwards day by day until we get the correct month.
        months += step;
        time = new Date(+startDate);
        time.setMonth(time.getMonth() + months);
        while (monthDiff(time, startDate) != months) {
            time = new Date(time - 86400000);
        }
    }
    return times;

};

$(function() {
    var type = jQuery.grep(window.location.search.substr(1).split('&'), function(value) { return value.substr(0, 5) == "type="; }),
        url = "/visits.json";
    if (type.length) {
        url += "?" + type;
    }
    d3.json(url, function(data){
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

        // TODO: consider moving these lookups to the json response when this function needs to be made generic.
        var textClasses = {
            "govuk": "",
            "directgov": "brown-text",
            "businesslink": "purple-text"
        };
        var legendText = {
            "govuk": "GOV.UK",
            "directgov": "Directgov",
            "businesslink": "BusinessLink"
        };
        var last_visits = $(["govuk", "directgov", "businesslink"]).map(function(i, name) {
            var visits = data[name][data[name].length-1].visits;
            return {
                "name": name,
                "legend": legendText[name],
                "class": textClasses[name],
                "visits": visits,
                "ypos": y_scale(visits)
            };
        });
        last_visits.sort(function(a, b) { return a.visits - b.visits; });

        function createTextLabel(item, ypos) {
            graph.append("svg:text")
                .attr("id", item.name + "-label")
                .attr("class", item.class)
                .attr("text-anchor", "middle")
                .attr("y", ypos)
                .text(item.legend);
            var element = $("#" + item.name + "-label");
            element.attr("x", width + margins[1] - (element.width()/2));
        }

        // place bottom legend
        if ((last_visits[0].ypos - last_visits[1].ypos) < 20) {
            // place bottom above last but one
            createTextLabel(last_visits[0], last_visits[1].ypos - 5);
            createTextLabel(last_visits[1], last_visits[1].ypos - 25);
        } else {
            createTextLabel(last_visits[0], last_visits[0].ypos - 5);
            createTextLabel(last_visits[1], last_visits[1].ypos - 5);
        }

        // place the top one
        if (last_visits[2].ypos > 20) {
            createTextLabel(last_visits[2], last_visits[2].ypos - 5);
        } else {
            createTextLabel(last_visits[2], last_visits[2].ypos + 15);
        }
    });
});
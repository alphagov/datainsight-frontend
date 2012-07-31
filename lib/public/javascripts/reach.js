function plot_traffic(id, data) {
    var target = $('#' + id);
    var width=$(target).width();
    var height=$(target).height();

    var barwidth = 20;
    var axesheight = 30;
    var axeswidth = 40;

    var svg = d3.select('#'+id)
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height);

    var x = d3.scale.linear()
        .domain([0, 24])
        .rangeRound([0+axeswidth, width]);

    var y = d3.scale.linear()
        .domain([0, d3.max(data)])
        .rangeRound([0,height-axesheight]);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(datum, index) {return x(index);})
        .attr("y", function(datum) {return height - axesheight - y(datum);})
        .attr("fill", "#C4C4C4")
        .attr("width", barwidth)
        .attr("height", function(datum) {return y(datum);});


    var yscale_for_axis = d3.scale.linear()
        .domain([0, d3.max(data)])
        .rangeRound([height-axesheight, 0]);


    var tick_values = get_tick_values(data, 6);
    yAxis = d3.svg.axis().scale(yscale_for_axis)
        .orient("left")
        .tickValues(tick_values)
        .tickFormat(function(datum) {
            return datum/1000 + "k";
        });

    svg.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(30,0)")
        .call(yAxis);

    var x_ticks = d3.scale.ordinal()
        .domain(d3.range(0, 28, 4))
        .range(["00.00", "04.00", "08.00", "12.00", "16.00", "20.00", "24.00"]);

    svg.selectAll("text.xaxis")
        .data(d3.range(0,25))
        .enter().append("svg:text")
        .attr("x", function(datum) { if (datum == 24) return x(datum)-20; else return x(datum) + 20;})
        .attr("y", function(datum) {return height;})
        .attr("text-anchor", "middle")
        .attr("class", "xaxis")
        .attr("style", "font-family:sans-serif;font-size:14px;")
        .text(function(datum) { if (datum%4 == 0) {return x_ticks(datum);} });

}


function get_tick_values(data, intobits) {
    var upper = Math.ceil(d3.max(data)/1000);
    var step = Math.ceil(upper/intobits);
    var labels = d3.range(0, upper+1, step);
    var output = [];
    for (var i = 0; i<labels.length; i++){
        output.push(labels[i]*1000);
    }

    return output;
}
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


    var x_ticks = d3.scale.ordinal()
        .domain(d3.range(0, 28, 4))
        .range(["00.00", "04.00", "08.00", "12.00", "16.00", "20.00", "24.00"]);

    svg.selectAll("text")
        .data(d3.range(0,25))
        .enter().append("svg:text")
        .attr("x", function(datum) { if (datum == 24) return x(datum)-20; else return x(datum) + 20;})
        .attr("y", function(datum) {return height;})
        .attr("text-anchor", "middle")
        .attr("style", "font-family:sans-serif;font-size:14px;")
        .text(function(datum) { if (datum%4 == 0) {return x_ticks(datum);} });

}

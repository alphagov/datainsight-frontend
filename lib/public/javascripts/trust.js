function trust_barchart(id, data) {
    var target = $('#' + id);
    var height = width = $(target).width();

    var barwidth = 15;
    var axesheight = 20;

    var svg = d3.select('#'+id)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var x = d3.scale.linear()
        .domain([0, data.length])
        .rangeRound([0, width]);

    var y = d3.scale.linear()
        .domain([0, 100])
        .rangeRound([0, height-axesheight]);

    var colorScale = d3.scale.ordinal()
        .domain(d3.range(5))
        .range(["#C18F9E", "#CCAAB0", "#D3C8CB", "#C3CBBA", "#A0C184"]);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(datum, index) {return x(index);})
        .attr("y", function(datum) {return height - axesheight - y(datum);})
        .attr("fill", function(datum, index) { return colorScale(index);})
        .attr("width", barwidth)
        .attr("height", function(datum) {return y(datum);});

    svg.selectAll("text")
        .data([0, data.length - 1])
        .enter().append("svg:text")
        .attr("x", function(datum) { return x(datum) + barwidth;})
        .attr("y", height)
        .attr("dx", -barwidth/2)
        .attr("text-anchor", "middle")
        .attr("class", "label")
        .text(function(datum) { return datum + 1;});
}

function trust_circle(id, trustLevel) {
    var width = height = 86;
    var maxRadius = width/2;

    var svg = d3.select('#' + id)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    var radiusScale = d3.scale.linear()
        .domain([1,100])
        .range([Math.PI * Math.pow(maxRadius, 2) * 0.05, Math.PI * Math.pow(maxRadius, 2)]);

    var colorScale = d3.scale.linear()
        .domain(d3.range(0, 10).map(function(i) { return 10*i; }))
        .range(["#BF1E2D", "#C18F9E", "#CCAAB0", "#D3C8CB", "#CFCACB", "#CACBC5", "#C3CBBA", "#C6CEBA", "#A0C184", "#74B74A"]);

    svg.append("circle")
        .attr("cx", width/2)
        .attr("cy", height/2)
        .attr("r", Math.sqrt(radiusScale(trustLevel)/Math.PI))
        .attr("fill", colorScale(trustLevel));

    svg.append("text")
        .text(trustLevel + "%")
        .attr("x", width/2)
        .attr("y", height/2)
        .attr("dy", "0.4em")
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold");

}

function trust_barchart(id, data) {
    var target = $('#' + id);
    var width=$(target).width();
    var height=width;

    var barwidth=15;
    var axesheight = 20;

    var svg = d3.select('#'+id)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var x = d3.scale.linear()
        .domain([0, data.length])
        .rangeRound([0, width]);

    var y = d3.scale.linear()
        .domain([0, d3.max(data)])
        .rangeRound([0,height-axesheight]);

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
        .data(data)
        .enter().append("svg:text")
        .attr("x", function(datum, index) { if (index == 0 || index == (data.length - 1)) return x(index) + barwidth;})
        .attr("y", function(datum) {return height;})
        .attr("dx", -barwidth/2)
        .attr("text-anchor", "middle")
        .attr("class", "label")
        .text(function(datum, index) { if (index == 0 || index == (data.length - 1)) return index + 1;});
}


function weighted_average(data) {
    var sum = 0;
    var weightedsum = 0;
    for (var i=0; i< data.length; i++) {
        weightedsum=weightedsum+(data[i]*(i+1));
        sum = sum + data[i];
    }
    return weightedsum/sum;
}

function trust_circle(id, data, label) {
    var target = $('#' + id);
    var width=$(target).width();
    var height=width;
    var maxRadius = width * 0.86/2;

    var average = weighted_average(data);


    var svg = d3.select('#' + id)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    var radiusScale = d3.scale.linear()
        .domain([1,data.length])
        .range([maxRadius*0.2,maxRadius]);

    var colorScale = d3.scale.ordinal()
        .domain(d3.range(1,6,0.5))
        .range(["#BF1E2D", "#C18F9E", "#CCAAB0", "#D3C8CB", "#CACBC5", "#C3CBBA", "#C6CEBA", "#A0C184", "#74B74A"]);

    svg.append("circle")
        .attr("cx", width/2)
        .attr("cy", height/2)
        .attr("r", radiusScale(average))
        .attr("fill", colorScale(average));

    svg.append("text")
        .text(average)
        .attr("x", width/2)
        .attr("y", height/2)
        .attr("dy", "0.4em")
        .attr("text-anchor", "middle");

    svg.append("text")
        .text(label)
        .attr("x", width/2)
        .attr("y", height)
        .attr("text-anchor", "middle")
        .attr("class", "label");
}

function trust_legend(id) {
    var target = $('#' + id);
    var width=$(target).width();
    var height=$(target).height();

    var svg = d3.select('#'+id)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("text")
        .text("More")
        .attr("x", width/2)
        .attr("y", 20)
        .attr("text-anchor", "middle");

    svg.append("rect")
        .attr("x", width-33)
        .attr("y", 10)
        .attr("width", 13)
        .attr("height", 13)
        .attr("fill", "#74B74A");

    svg.append("text")
        .text("Less")
        .attr("x", width/2)
        .attr("y", 40)
        .attr("text-anchor", "middle");

    svg.append("rect")
        .attr("x", width-33)
        .attr("y", 30)
        .attr("width", 13)
        .attr("height", 13)
        .attr("fill", "#BF1E2D");
}
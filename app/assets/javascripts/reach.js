var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.Reach = GOVUK.Insights.Reach || {};

GOVUK.Insights.Reach.COLOURS = colours = {
    STRONG_GREEN: "#74B74A",
    MIDDLE_GREEN: "#9CB072",
    WEAK_GREEN: "#B2B3AF",

    STRONG_RED: "#BF1E2D",
    MIDDLE_RED: "#A56667",
    WEAK_RED: "#D3C8CB",

    CENTER_GREY: "#B3B3B3"
};

GOVUK.Insights.Reach.plotTraffic = function (id, raw_data) {
    var Callout = GOVUK.Insights.overlay.CalloutBox;
    var callouts = {};
    var circleHighlights = {};
    
    // Prepare data
    var yesterdaysData = $.map(raw_data, function(item) {
            return item.visitors;
        }),
        averageData = $.map(raw_data, function(item) {
            return item.historical_average;
        }),
        maxValue = d3.max([].concat(yesterdaysData).concat(averageData)),
        maxLast4 = d3.max([d3.max(averageData.slice(-4)), d3.max(yesterdaysData.slice(-4))]);

    // Colours
    var calculateFill = GOVUK.Insights.Reach.fillCalculator(averageData, GOVUK.Insights.Reach.COLOURS);

    var SPACE_OF_AVG_LABEL = 20;
    var extraTopForAvgLabel = (maxValue - maxLast4)/maxValue < 0.1 ? SPACE_OF_AVG_LABEL : 0;

    // Dimensions
    var margin = {top: 15 + extraTopForAvgLabel, right: 10,  bottom: 24, left: 45},
        width = 960,
        height = 300,
        chartWidth = width - margin.right - margin.left,
        chartHeight = height - margin.top - margin.bottom,
        numberOfYTicks = 5,
        barWidth = Math.floor(chartWidth / 24),
        barPadding = Math.floor(barWidth / 5),
        xAxisOffset = 3;

    // Create the svg panel
    var svg = d3.select("#" + id)
        .append("svg")
        .attr("viewBox","0 0 " + width + " " + height)
        .attr("width",width)
        .attr("height",height);

    GOVUK.Insights.svg.resizeIfPossible(svg, width, height);

    var chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up scales
    var xScale = d3.scale.linear()
        .domain([0, 24])
        .rangeRound([0, chartWidth]);

    var yTicks = GOVUK.Insights.calculateLinearTicks([0, maxValue], numberOfYTicks);
    var yScale = d3.scale.linear()
        .domain(yTicks.extent)
        .rangeRound([chartHeight, 0])
        .nice();

    // Create the bars
    chart.selectAll(".bar")
        .data(yesterdaysData)
        .enter().append("rect")
        .attr("shape-rendering", "crispEdges")
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
        .attr("class", "dashed-line pink")
        .classed("no-scale", true);

    // Create the Y-Axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickValues(yTicks.values)
        .tickFormat(GOVUK.Insights.numericLabelFormatterFor(d3.max(yTicks.values)));

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis);

    // Create the X-Axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickValues([4, 8, 12, 16, 20])
        .tickFormat(function(hour) {
            return {
                4: "4am",
                8: "8am",
                12: "12pm",
                16: "4pm",
                20: "8pm"
            }[hour];
        });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom + xAxisOffset) + ")")
        .call(xAxis);

    // Add average line label
    var xPos = xScale(averageData.length - 1),
        yStart = d3.mean(averageData.slice(-2).map(yScale));
    chart.append("line")
        .attr("x1", xPos)
        .attr("x2", xPos)
        .attr("y1", yStart - 5)
        .attr("y2", yScale(maxLast4) - 10)
        .attr("class", "label-line vertical pink")
        .classed("no-scale", true);
    
    chart.append("svg:text")
        .attr("class", "pink")
        .attr("width", 110)
        .attr("height", 80)
        .attr("x", xPos - 80)
        .attr("y", yScale(maxLast4) - 25)
        .text("The average");

    var reverseBarLookUp = function (hour) {
        return d3.select(d3.selectAll('.bar')[0][hour]);
    };
    
    var reverseAveragePointLookUp = function (d, hour) {
        return {
            x: xScale(hour) + barWidth/2,
            y: yScale(averageData[hour])
        }
    };
        
    // Add the hover panels
    chart.selectAll('.hover-panel')
        .data(yesterdaysData).enter()
        .append('svg:rect')
        .attr("class", "hover-panel")
        .attr('x', function (d,i) { return xScale(i); })
        .attr('y',0 - margin.bottom - margin.top + xAxisOffset)
        .attr('width',barWidth)
        .attr('height',height)
        .attr('stroke','none')
        .attr('fill', '#000')
        .attr('opacity',0.0)
        .on('mouseover',function (d,hour) {
            var scaleFactor = GOVUK.Insights.svg.scaleFactor(svg, width),
                boxWidth = 170,
                boxHeight = 66,
                offsetSoTheUserCantCatchTheBox = 5,
                boxShadow = 4,
                xPos = (xScale(hour) - offsetSoTheUserCantCatchTheBox)*scaleFactor - boxWidth,
                yPos = (d3.mouse(this)[1] + 60)*scaleFactor,
                actualXPos = (xPos > 0) ? xPos : xPos + boxWidth + barWidth*scaleFactor + offsetSoTheUserCantCatchTheBox + boxShadow,
                calloutInfo = {
                    xPos: actualXPos + margin.left*scaleFactor,
                    yPos: GOVUK.Insights.clamp(yPos - boxHeight, boxShadow, height - margin.bottom*scaleFactor - boxHeight),
                    parent: '#reach',
                    title: GOVUK.Insights.convertTo12HourTime(hour) + ' to ' + GOVUK.Insights.convertTo12HourTime(hour+1),
                    rowData: [
                        {right:GOVUK.Insights.formatNumericLabel(d),left:'Unique visitors'},
                        {right:GOVUK.Insights.formatNumericLabel(averageData[hour]),left:'<span class="pink">The average</span>'}
                    ],
                    width: boxWidth,
                    height: boxHeight,
                    closeDelay: 0
                };
            callouts[hour] = new Callout(calloutInfo);
            
            var barElement = reverseBarLookUp(hour);
            barElement.attr('stroke',new GOVUK.Insights.colors(barElement.style('fill')).multiplyWithSelf().asCSS()).attr('stroke-width','3');
            
            var pointLocation = reverseAveragePointLookUp(d, hour);
            
            circleHighlights[hour] = chart.insert('svg:circle','.label-line')
                .attr('cx',pointLocation.x)
                .attr('cy',pointLocation.y)
                .attr('r',3.5)
                .attr('stroke-width','3.5')
                .attr('fill','#fff')
                .attr('class','pink js-temp');
            
            d3.select(this).attr('opacity',0.08);
        })
        .on('mouseout', function(d,hour) {
           callouts[hour].close();
           d3.selectAll('.js-temp').remove(); 
           reverseBarLookUp(hour).attr('stroke-width','0');
           d3.select(this).attr('opacity',0.0);
        });
    chart.selectAll('text').each(function () { GOVUK.Insights.svg.createTextShade(this) });
};

GOVUK.Insights.Reach.fillCalculator = function(averageData, colours) {
    var zeroScale = d3.scale.linear()
        .domain([0, 1])
        .range([colours.WEAK_GREEN, colours.STRONG_GREEN])
        .clamp(true),

        greens = [colours.WEAK_GREEN, colours.MIDDLE_GREEN, colours.STRONG_GREEN],
        reds = [colours.STRONG_RED, colours.MIDDLE_RED, colours.WEAK_RED];

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
            return colourScale(average, 1.2, 2.0, 0.7, greens)(datum);
        } else if (datum < (average * 0.8)) {
            return colourScale(average, 0.5, 0.8, 0.3, reds)(datum);
        } else {
            return colours.CENTER_GREY;
        }
    }
};

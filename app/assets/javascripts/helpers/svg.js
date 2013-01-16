var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};
GOVUK.Insights.svg = GOVUK.Insights.svg || {};

// Source: http://stackoverflow.com/questions/654112/how-do-you-detect-support-for-vml-or-svg-in-a-browser
GOVUK.isSvgSupported = function () {
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
};

GOVUK.Insights.svg.createTextShade = function(textElement) {
    var shade = document.createElementNS("http://www.w3.org/2000/svg", "text");
    var text = d3.select(textElement);
    d3.select(shade)
        .attr("x", text.attr("x"))
        .attr("y", text.attr("y"))
        .attr("dx", text.attr("dx"))
        .attr("dy", text.attr("dy"))
        .attr("class", (text.attr("class") || "") + " text-shade")
        .attr("text-anchor", text.attr("text-anchor"))
        .text(text.text())
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);
    textElement.parentNode.insertBefore(shade, textElement);
};

GOVUK.Insights.svg.createShadowFilter = function(filterId, svgElement) {
    var svg = d3.select(svgElement);
    var defs = svg.select("defs");

    if (defs.empty()) {
        defs = svg.append("svg:defs");
    }

    var filter = defs.append("filter")
        .attr("id", filterId)
        .attr("height", "130%");

    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", "2");

    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");
}

GOVUK.Insights.svg.translate = function(x, y) {
    return "translate(" + x + "," + y + ")";
}

GOVUK.Insights.svg.supportsResizing = function () {
    return !($('#wrapper').hasClass("ie9"));
};

GOVUK.Insights.svg.resizeIfPossible = function (svg, width, height) {
    if (GOVUK.Insights.svg.supportsResizing()) {
        console.log("addin' classes", svg.node())
        svg
            .attr("width","100%")
            .attr("height","100%")
            .style("max-width",width + 'px')
            .style("max-height",height + 'px');
    }
};

GOVUK.Insights.svg.scaleFactor = function (svg, fullWidth) {
    return GOVUK.Insights.svg.supportsResizing() ? ($(svg.node()).parent().width() / fullWidth) : 1;
};
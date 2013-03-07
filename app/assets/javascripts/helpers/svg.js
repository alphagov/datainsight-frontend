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
};

/**
 * Normalises to from d3 selection, native node or jQuery reference to jQuery reference
 * @param {Object} el jQuery reference, d3 selection or native node
 * @returns jQuery reference
 */
GOVUK.Insights.svg.getJQueryReference = function (el) {
    return (typeof el.node === 'function') ? $(el.node()) : $(el);
};

/**
 * Calculates ratio of current display width to width defined in SVG viewbox
 * @param {Object} svg jQuery, d3 selection or native node of SVG to be measured
 * @returns {Number} scale factor
 */
GOVUK.Insights.svg.scaleFactor = function (svg) {
    svg = GOVUK.Insights.svg.getJQueryReference(svg);
    return svg.parent().width() / svg.prop('viewBox').baseVal.width;
};

/**
 * Resizes SVG element to parent container width, taking aspect ratio into
 * account. This works around bugs in some Webkit builds and IE10.
 * @param {Object} svg jQuery, d3 selection or native node of SVG element to be resized
 */
GOVUK.Insights.svg.adjustToParentWidth = function (svg) {
    svg = GOVUK.Insights.svg.getJQueryReference(svg);
    var baseVal = svg.prop('viewBox').baseVal;
    var aspectRatio = baseVal.width / baseVal.height;
    svg.height(Math.ceil(svg.parent().width() / aspectRatio));
};

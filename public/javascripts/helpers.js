var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.Helpers = {
    error_div:'<div id="error-msg" style="color: red">Sorry, there has been an error.</div>'
};

// Source: http://stackoverflow.com/questions/654112/how-do-you-detect-support-for-vml-or-svg-in-a-browser
GOVUK.isSvgSupported = function () {
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
};

GOVUK.formatTickLabel = function (tickValue, tickStep) {
    if (tickStep >= 1000000) {
        return Math.ceil(tickValue / 1000000) + "m";
    }
    if (tickStep >= 1000) {
        return Math.ceil(tickValue / 1000) + "k";
    }
    return "" + tickValue;
}


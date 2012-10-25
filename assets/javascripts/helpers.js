var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.Helpers = {
    error_div:'<div id="error-msg" style="color: red">Sorry, there has been an error.</div>'
};

GOVUK.Insights.SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

// Source: http://stackoverflow.com/questions/654112/how-do-you-detect-support-for-vml-or-svg-in-a-browser
GOVUK.isSvgSupported = function () {
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
};

GOVUK.Insights.labelFormatter = function (tickStep) {
    return function(tickValue) {
        if(tickValue == 0){
            return '0';
        }
        if (tickStep >= 1000000) {
            return Math.ceil(tickValue / 1000000) + "m";
        }
        if (tickStep >= 1000) {
            return Math.ceil(tickValue / 1000) + "k";
        }
        return "" + tickValue;
    }
};

GOVUK.Insights.convertToLabel = function (val) {
    var magnitudeOfValue = Math.round(Math.log(val) / Math.LN10);

    var isValueWholeNumber = !(val % Math.pow(10, magnitudeOfValue) > 0);

    if (magnitudeOfValue <= 2) return val.toString();

    var oneThousand = 1000;
    var oneMillion = 1000000;

    if (magnitudeOfValue >= 7) return Math.round(val / oneMillion) + "m";

    if (magnitudeOfValue >= 6) return (isValueWholeNumber ? (val / oneMillion) : (val / oneMillion).toFixed(1)) + "m";

    if (magnitudeOfValue >= 4) return Math.round(val / oneThousand) + "k";

    if (magnitudeOfValue >= 3) return (isValueWholeNumber ? (val / oneThousand) : (val / oneThousand).toFixed(1)) + "k";
};


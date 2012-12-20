var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.shortDateFormat = function(date) {
    var SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    return date.getDate() + " " + SHORT_MONTHS[date.getMonth()];
};

GOVUK.Insights.numericLabelFormatterFor = function (maxValue) {
    var oneThousand = 1000,
        oneMillion = 1000000;
    return function (tickValue) {
        if (tickValue == 0) {
            return '0';
        }
        if (maxValue >= oneMillion) {
            return (Math.ceil(tickValue / 100000) / 10).toFixed(1).replace(".0", "") + "m";
        }
        if (maxValue >= oneThousand) {
            return (Math.ceil(tickValue / 100) / 10).toFixed(1).replace(".0", "") + "k";
        }
        return "" + tickValue;
    }
};

/**
 * Format a number to be displayed with abbreviated suffixes.
 * This function is more complicated than it one would think it need be,
 * this is due to lack of predictability in Number.toPrecision, Number.toFixed
 * and some rounding issues.
 *
 * TESTS: See tests in formattersSpec.js for boundaries and limits.
 * RUBY: a similar function exists in number_format.rb: NumberFormat.human_readable_number
 *
 */
GOVUK.Insights.formatNumericLabel = function(value) {
    if (value == 0) return "0";
    var magnitude = function(num, n) {
            return Math.pow(10, n - Math.ceil(Math.log(num < 0 ? -num : num) / Math.LN10));
        },
        roundToSignificantFigures = function(num, n) {
            return Math.round(num * magnitude(num, n)) / magnitude(num, n);
        },
        oneThousand = 1000,
        oneMillion = 1000000,
        thresholds = [
            {value: oneMillion, suffix:"m"},
            {value: oneThousand, suffix:"k"}
        ],
        roundedValue = roundToSignificantFigures(value, 3),
        significantFigures = null;

    for (var i = 0; i < thresholds.length; i++) {
        if (roundedValue >= (thresholds[i].value / 2)) {
            if (roundedValue < thresholds[i].value) {
                significantFigures = 2;
            } else {
                significantFigures = 3;
                value = roundedValue;
            }
            value = roundToSignificantFigures(value, significantFigures) / thresholds[i].value;
            return value.toPrecision(value < 1 ? 2 : 3) + thresholds[i].suffix;
        }
    }
    return roundedValue.toString();
};

GOVUK.Insights.colors = function () {
    function HexColor(hex) {
        var startsWith = hex.substring(0, 3);
        if (startsWith === "rgb") {
            var colors = hex.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            this.red = parseInt(colors[1]);
            this.green = parseInt(colors[2]);
            this.blue = parseInt(colors[3]);
        } else {
            var hex = parseInt('0x' + hex.replace('#', ''), 16);
            this.red = hex >> 16;
            this.green = hex >> 8 & 0xff;
            this.blue = hex & 0xff;
        }
        return this;
    }

    HexColor.prototype.multiplyWithSelf = function () {
        this.red = this.red * this.red / 255;
        this.green = this.green * this.green / 255;
        this.blue = this.blue * this.blue / 255;
        return this;
    };

    HexColor.prototype.asCSS = function () {
        // todo: make this nicer
        var hexValue = (this.blue | (this.green << 8) | (this.red << 16)).toString(16);
        var paddingNeeded = 6 - hexValue.length;
        if (paddingNeeded > 0) {
            for (var i = 0; i < paddingNeeded; i++) {
                hexValue = '0' + hexValue;
            }
        }
        return '#' + hexValue;
    };

    return HexColor;
}();

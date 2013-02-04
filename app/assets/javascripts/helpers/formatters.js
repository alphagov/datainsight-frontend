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
 * Returns a number formatting function whose actual format depends on the values passed as argument.
 * The formatter can then be used to format all the number in the series applying the same format, regardless of the
 * individual values. This is especially useful for graph axes, where a homogeneous formatting of the labels is
 * required.
 *
 * @param values
 * @return {Function}
 */
GOVUK.Insights.numberListFormatter = function (values) {

    function format(value, magnitude, decimalPlaces) {
        magnitude = magnitude || 1;
        decimalPlaces = decimalPlaces || 0;
        var unit = (magnitude === 1000000) ? "m" : (magnitude === 1000) ? "k" : "";
        return (value / magnitude).toFixed(decimalPlaces).toString() + unit;
    }

    function exactMultipleOf(value) {
        return function(n) {
            return n % value === 0;
        };
    }

    var max = values.reduce(function(a,b) {return a > b ? a : b});

    var magnitude = (max >= 1000000) ? 1000000 : (max >= 1000) ? 1000 : 1;
    var decimalPlaces = values.every(exactMultipleOf(magnitude)) ? 0 : 1;

    return function(value) {
        if (value === 0) return "0"
        return format(value, magnitude, decimalPlaces);
    };
}

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

GOVUK.Insights.convertTo12HourTime = function (hour) {
    if (hour >= 24) {
        hour = 0;
    }

    var suffix = (hour >= 12) ? 'pm' : 'am';

    if (hour > 12) {
        hour = hour - 12;
    };

    if (hour === 0) {
        hour = 12;
    }

    return hour + suffix;
};
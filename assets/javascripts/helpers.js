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

GOVUK.Insights.numericLabelFormatterFor = function (tickStep) {
    return function (tickValue) {
        if (tickValue == 0) {
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

GOVUK.Insights.formatNumericLabel = function (val) {
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


GOVUK.Insights.calculateLinearTicks = function(extent, minimumTickCount) {
    if (extent[0] >= extent[1]) {
        throw new Error("Upper bound must be larger than lower.");
    }
    var targetTickCount = minimumTickCount - 1,
        span = extent[1] - extent[0],
        step = Math.pow(10, Math.floor(Math.log(span / targetTickCount) / Math.LN10)),
        err = targetTickCount / span * step;

    // Filter ticks to get closer to the desired count.
    if (err <= .15) step *= 10;
    else if (err <= .35) step *= 5;
    else if (err <= .75) step *= 2;

    // Round start and stop values to step interval.
    var first = Math.ceil(extent[0] / step) * step,
        last = Math.ceil(extent[1] / step) * step,
        lastInclusive = last + step / 2;

    return {
        values:d3.range.apply(d3, [first, lastInclusive, step]),
        extent:[first, last],
        step:step
    };
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
            ;
        }
        return '#' + hexValue;
    }

    return HexColor;
}();

GOVUK.Insights.extensions = function () {
    if (String.prototype.idify === undefined) {
        String.prototype.idify = function () {
            var result = this.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]+/g,'');
            if (result.length === 0) throw new Error('Resulting ID of ['+ this + '] would be empty');
            return result;
        };
    } else {
        throw new Error('Trying to overwrite existing prototypal function');
    }
}();

GOVUK.Insights.geometry = function () {
    function CollisionBox(rectangle) {
        this.top = rectangle.y;
        this.bottom = rectangle.y + rectangle.height;
        this.left = rectangle.x;
        this.right = rectangle.x + rectangle.width;
        this.center = {
            x: rectangle.x + (rectangle.width / 2),
            y: rectangle.y + (rectangle.height / 2)
        };
    };

    CollisionBox.prototype.collidesWith = function (box) {
        if (this.bottom < box.top) return false;
        if (this.top > box.bottom) return false;
        if (this.left > box.right) return false;
        if (this.right < box.left) return false;
        return true;
    };

    CollisionBox.prototype.outsideOf = function (box) {
       if (this.right > box.right) return true;
       if (this.left < box.left) return true;
       if (this.top < box.top) return true;
       if (this.bottom > box.bottom) return true;
       return false;
    };

    return {
        CollisionBox: CollisionBox
    };
}();
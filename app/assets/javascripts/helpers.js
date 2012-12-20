var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.Helpers = {
    error_div:'<div id="error-msg" style="color: red">Sorry, there has been an error.</div>'
};

// Source: http://stackoverflow.com/questions/654112/how-do-you-detect-support-for-vml-or-svg-in-a-browser
GOVUK.isSvgSupported = function () {
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
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

    CollisionBox.prototype.extendBy = function (value) {
        this.bottom += value;
        this.top -= value;
        this.left -= value;
        this.right += value;
    };

    return {
        CollisionBox: CollisionBox
    };
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

GOVUK.Insights.clamp = function (value, min, max) {
    if (value > max) return max;
    if (value < min) return min;
    return value;
};

GOVUK.Insights.createTextShade = function(textElement) {
    var shade = document.createElementNS("http://www.w3.org/2000/svg", "text");
    var text = d3.select(textElement);
    d3.select(shade)
        .attr("x", text.attr("x"))
        .attr("y", text.attr("y"))
        .attr("dx", text.attr("dx"))
        .attr("dy", text.attr("dy"))
        .attr("class", text.attr("class") + " text-shade")
        .attr("text-anchor", text.attr("text-anchor"))
        .text(text.text())
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);
    textElement.parentNode.insertBefore(shade, textElement);
};
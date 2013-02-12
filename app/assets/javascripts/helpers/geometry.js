var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

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
    }

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

    function gap(anElement, otherElement) {
        function top(element) {
            return $(element).offset().top;
        }
        return Math.abs(top(anElement) - top(otherElement));
    }

    return {
        CollisionBox: CollisionBox,
        gap: gap
    };
}();

GOVUK.Insights.clamp = function (value, min, max) {
    if (value > max) return max;
    if (value < min) return min;
    return value;
};

GOVUK.Insights.point = function(x, y) {

    var _x, _y;

    if (jQuery.isArray(x)) {
        _x = x[0];
        _y = x[1];
    } else {
        _x = x;
        _y = y;
    }

    return {
        x: function() { return _x; },

        y: function() { return _y; },

        distanceFrom: function(otherPoint) {
            return Math.sqrt(Math.pow(_x - otherPoint.x(), 2) + Math.pow(_y - otherPoint.y(), 2));
        },
        
        add: function (other) {
            return GOVUK.Insights.point(_x + other.x(), _y + other.y());
        },

        toString: function() {
            return "point {" + _x + "," + _y + "}";
        }
    }
};
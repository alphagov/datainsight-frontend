var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

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

        toString: function() {
            return "point {" + _x + "," + _y + "}";
        }
    }
}
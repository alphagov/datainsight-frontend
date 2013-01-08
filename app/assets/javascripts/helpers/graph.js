var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.Helpers = {
    error_div:'<div id="error-msg" style="color: red">Sorry, there has been an error.</div>'
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

GOVUK.Insights.findDateRangeContaining = function (datePoints, date) {
    for (var i = 0; i < datePoints.length; i++) {
        if (date > datePoints[i] && date < datePoints[i + 1]) {
            return [datePoints[i], datePoints[i + 1]];
        }
    }
    throw new Error("Date `" + date + "` is not within a range.");
};

GOVUK.Insights.findY = function (data, x) {
    var xToY = {};
    data.forEach(function (d) {
       xToY[d.x] = d.y;
    });
    return xToY[x];
};

GOVUK.Insights.interpolateY = function (x, point1, point2) {
    return (point2.y - point1.y) / (point2.x - point1.x) * (x - point1.x) + point1.y;
};

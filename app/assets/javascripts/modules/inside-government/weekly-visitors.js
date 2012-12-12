var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};
GOVUK.Insights.InsideGovernment = GOVUK.Insights.InsideGovernment || {};

GOVUK.Insights.InsideGovernment.weeklyVisitors = function (RAW_DATA) {
    var weeklyVisitors = GOVUK.Insights.timeSeriesGraph()
        .marginRight(30);

    d3.select('#inside-gov-weekly-visitors')
        .datum(RAW_DATA)
        .call(weeklyVisitors);
}

$(function() {
    $.ajax({
        url: "/performance/dashboard/government/visitors/weekly.json",
        success: function (response) {
            GOVUK.Insights.InsideGovernment.weeklyVisitors(response);
        }
    });
});
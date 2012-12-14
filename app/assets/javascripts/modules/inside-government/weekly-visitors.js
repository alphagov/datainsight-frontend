var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};
GOVUK.Insights.InsideGovernment = GOVUK.Insights.InsideGovernment || {};

GOVUK.Insights.InsideGovernment.weeklyVisitors = function (weeklyVisitorsData) {

    var seriesDateFormat = d3.time.format("%Y-%m-%d");

    var weeklyVisitors = GOVUK.Insights.timeSeriesGraph()
        .marginRight(30)
        .x(function(d) { return seriesDateFormat.parse(d.end_at); })
        .y(function(d) { return d.value; });

    d3.select('#inside-gov-weekly-visitors')
        .datum(weeklyVisitorsData.details.data)
        .call(weeklyVisitors);
}

$(function() {
    $.ajax({
        url: "/performance/dashboard/government/visitors/weekly.json",
        success: function (response) {
            if (response !== null) {
                if (GOVUK.isSvgSupported()) {
                    $("#weekly-visitors-module img").remove();
                    $("#weekly-visitors-module .datainsight-hidden").removeClass("datainsight-hidden");
                    GOVUK.Insights.InsideGovernment.weeklyVisitors(response);
                }
            } else {
                $("#weekly-visitors-module").append(GOVUK.Insights.Helpers.error_div);
            }
        }
    });
});
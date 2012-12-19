var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};
GOVUK.Insights.InsideGovernment = GOVUK.Insights.InsideGovernment || {};

GOVUK.Insights.InsideGovernment.weeklyVisitors = function (weeklyVisitorsData) {

    var seriesDateFormat = d3.time.format("%Y-%m-%d");
    var labelDateFormat = GOVUK.Insights.shortDateFormat;

    var calloutContent = function(d) {
        var title = labelDateFormat(seriesDateFormat.parse(d.start_at)) + " - " + labelDateFormat(seriesDateFormat.parse(d.end_at));
        var rowData = [
            {
                right: GOVUK.Insights.formatNumericLabel(d.value || 0),
                left: "Visitors"
            }
        ];
        return GOVUK.Insights.overlay.calloutContent(title, rowData);
    };

    var weeklyVisitors = GOVUK.Insights.timeSeriesGraph()
        .marginRight(30)
        .marginTop(10)
        .height(290)
        .yTicks(5)
        .xAxisLabelFormat(labelDateFormat)
        .x(function(d) { return seriesDateFormat.parse(d.end_at); })
        .y(function(d) { return d.value; })
        .callout({
            content: calloutContent
        });

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
var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.todaysActivity = function () {
    function showError() {
        $("#reach").append(GOVUK.Insights.Helpers.error_div);
    }

    if (GOVUK.isSvgSupported()) {
        plot_legend_for_yesterday("yesterday");
        plot_legend_for_monthly_average("monthly-average");
    }

    $.ajax({
        url:"/performance/todays-activity.json",
        dataType:"json",
        success:function (data) {
            if (data !== null) {
                if (GOVUK.isSvgSupported()) {
                    plot_traffic("reach", data.values);
                    $('#todays-activity-module img').remove();
                    $('#todays-activity-module .datainsight-hidden').removeClass('datainsight-hidden');
                }
                var timezone = "GMT";
                var date = moment(data.live_at, "YYYY-MM-DDThh:mm:ss ZZ").utc();
                $("#live_at").text(date.format("dddd Do MMMM, HH:mm \\G\\M\\T"));
            } else {
                showError();
            }
        },
        error:showError
    });
}


// Get jQuery to call this on page ready event...
$(GOVUK.Insights.todaysActivity);
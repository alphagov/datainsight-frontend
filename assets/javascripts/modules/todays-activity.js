var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.todaysActivity = function () {
    function showError() {
        $("#reach").append(GOVUK.Insights.Helpers.error_div);
    }

    $.ajax({
        url:"/performance/dashboard/todays-activity.json",
        dataType:"json",
        success:function (response) {
            if (response !== null) {
                if (GOVUK.isSvgSupported()) {
                    GOVUK.Insights.Reach.plotTraffic("reach", response.details.data);
                    $('#todays-activity-module img').remove();
                    $('#todays-activity-module .datainsight-hidden').removeClass('datainsight-hidden');
                }
                var for_date = moment(response.details.for_date, "YYYY-MM-DD");
                $("#todays-activity-module .for_date").text(for_date.format("D MMMM"));
            } else {
                showError();
            }
        },
        error:showError
    });
};


// Get jQuery to call this on page ready event...
$(GOVUK.Insights.todaysActivity);

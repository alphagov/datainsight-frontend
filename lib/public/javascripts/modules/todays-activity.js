var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.todaysActivity = function () {
    function showError() {
        $("#reach").append(GOVUK.Insights.Helpers.error_div);
    }
    $.ajax({
        url:"/todays-activity.json",
        dataType:"json",
        success:function (data) {
            if (data == null) {
                showError();
            } else if (GOVUK.isSvgSupported()) {
                plot_traffic("reach", data.values);
            } else {
                $("#todays-activity-module").append("<img src='/todays-activity.png'></img>")
            }
        },
        error:showError
    });
}


// Get jQuery to call this on page ready event...
$(GOVUK.Insights.todaysActivity);

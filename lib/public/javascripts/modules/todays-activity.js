var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.todaysActivity = function () {
    function parseDateCompatibleWithIE6(data) {
        return Date.parseExact(data.live_at.slice(0,-6), "yyyy-MM-ddTHH:mm:ss")
    }

    function showError() {
        $("#reach").append(GOVUK.Insights.Helpers.error_div);
    }

    if (GOVUK.isSvgSupported()) {
        plot_legend("yesterday");
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
            var date = parseDateCompatibleWithIE6(data);
            $("#live_at").text(date.toString("dddd ddXX MMMM, H:mm").replace("XX", date.getOrdinal()));
        },
        error:showError
    });
}


// Get jQuery to call this on page ready event...
$(GOVUK.Insights.todaysActivity);

var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.todaysActivity = function () {
    function parseDateCompatibleWithIE6(data, timezone) {
        return Date.parseExact(data.live_at.slice(0, -6), "yyyy-MM-ddTHH:mm:ss").setTimezone(timezone)
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
            if (data !== null) {
                if (GOVUK.isSvgSupported()) {
                    plot_traffic("reach", data.values);
                } else {
                    $("#todays-activity-module").html("<img src='/todays-activity.png'></img>");
                }
                var timezone = "GMT";
                var date = parseDateCompatibleWithIE6(data, timezone);
                $("#live_at").text(date.toString("dddd ddXX MMMM, H:mm EE").replace("XX", date.getOrdinal()).replace("EE", timezone));
            } else {
                showError();
            }
        },
        error:showError
    });
}


// Get jQuery to call this on page ready event...
$(GOVUK.Insights.todaysActivity);

var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.hourlyTraffic = function () {
    function showError() {
        $("#reach").append(GOVUK.Insights.Helpers.error_div);
    }

    $.ajax({
        url:"/performance/dashboard/hourly-traffic.json",
        dataType:"json",
        success:function (response) {
            if (response !== null) {
                if (GOVUK.isSvgSupported()) {
                    GOVUK.Insights.Reach.plotTraffic("reach", response.details.data);
                    $('#hourly-traffic-module img').remove();
                    $('#hourly-traffic-module .datainsight-hidden').removeClass('datainsight-hidden');
                }
                var for_date = moment(response.details.for_date, "YYYY-MM-DD");
                $("#hourly-traffic-module .for_date").text(for_date.format("D MMMM"));
                $("#hourly-traffic-module .graph-heading strong").text("average of the previous six " + for_date.format("dddd") + "s");
            } else {
                showError();
            }
        },
        error:showError
    });
};


// Get jQuery to call this on page ready event...
$(GOVUK.Insights.hourlyTraffic);

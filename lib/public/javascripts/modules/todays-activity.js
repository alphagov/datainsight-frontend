$(function () {
    function parseDateCompatibleWithIE6(data) {
        return Date.parseExact(data.live_at.slice(0, -6), "yyyy-MM-ddTHH:mm:ss");
    }

    function showError() {
        $("#reach").append(GOVUK.Insights.Helpers.error_div);
    }

    if (is_svg_supported()) {
        plot_legend("yesterday");
    } else {
        $("#yesterday").append("<img src='/yesterday-legend.png'></img>")
    }
    $.ajax({
        url:"/todays-activity.json",
        dataType:"json",
        success:function (data) {
            if (data == null) {
                showError();
            } else if (is_svg_supported()) {
                plot_traffic("reach", data.values);
            } else {
                $("#reach").append("<img src='/todays-activity.png'></img>")
            }
            var date = parseDateCompatibleWithIE6(data);
            $("#live_at").text(date.toString("dddd ddXX MMMM, H:mm").replace("XX", date.getOrdinal()))
        },
        error:showError
    });
});

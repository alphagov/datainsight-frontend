$(function () {
    $.getJSON("/todays-activity.json", function (data) {
        if (data == null) {
            $("#reach").append(GOVUK.Insights.Helpers.error_div);
            return;
        }
        if (is_svg_supported()) {
            plot_traffic("reach", data.values);
            plot_legend("yesterday");
        } else {
            $("#reach").append("<img src='/todays-activity.png'></img>")
            $("#yesterday").append("<img src='/yesterday-legend.png'></img>")
        }
        var date = Date.parseExact(data.live_at.slice(0, -6), "yyyy-MM-ddTHH:mm:ss");
        $("#live_at").text(date.toString("dddd ddXX MMMM, H:mm").replace("XX", date.getOrdinal()))
    });
});

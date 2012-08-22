$(function () {
    d3.json("/todays-activity.json", function (data) {
        if (data == null) {
            $("#reach").append(GOVUK.Insights.Helpers.error_div);
            return;
        }
        if (is_svg_supported()) {
            plot_traffic("reach", data.values);
        } else {
            $("#reach").append("<img src='/todays-activity.png'></img>")
        }
        plot_legend("yesterday");
        var date = new Date(data.live_at);
        $("#live_at").text(date.toString("dddd ddXX MMMM, H:mm").replace("XX", date.getOrdinal()))
    });
});

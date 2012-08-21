$(function () {
    d3.json("/todays-activity.json", function (data) {
        if (data == null) {
            $("#reach").append('<%= error_div %>');
            return;
        }
        plot_traffic("reach", data.values);
        plot_legend("yesterday");
        var date = new Date(data.live_at);
        $("#live_at").text(date.toString("dddd ddXX MMMM, H:mm").replace("XX", date.getOrdinal()))
    });
});
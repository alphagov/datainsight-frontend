$(function () {
    if (is_svg_supported()) {
        var graph = GOVUK.Insights.sixMonthTimeSeries("/unique-visitors.json", "#unique-visitors", {
            "series":{
                "govuk":{
                    "lineClass":"main-line",
                    "gradient":true,
                    "legendClass":"",
                    "legend":"GOV.UK"
                },
                "directgov":{
                    "lineClass":"dashed-line brown",
                    "legendClass":"brown-text",
                    "legend":"Directgov"
                },
                "businesslink":{
                    "lineClass":"dashed-line purple",
                    "legendClass":"purple-text",
                    "legend":"Business Link"
                }
            },
            "width":$("#unique-visitors").width()
        }, function () {
            $("#unique-visitors").append(GOVUK.Insights.Helpers.error_div)
        });
        graph.render();
    } else {
        $("#unique-visitors").append("<img src='/unique-visitors.png' style='max-width: none'></img>")
    }
});
$(function () {
    if (is_svg_supported()) {
        var graph = GOVUK.Insights.sixMonthTimeSeries("/visits.json", "#visits", {
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
            "width":$("#visits").width()
        }, function () {
            $("#visits").append('<%= error_div %>')
        });
        graph.render();
    } else {
        $("#visits").append("<img src='/visits.png' style='max-width: none'></img>")
    }
});
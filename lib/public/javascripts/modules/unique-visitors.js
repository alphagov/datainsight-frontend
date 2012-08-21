$(function () {
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
        "width": $("#unique-visitors").width()
    }, function () { $("#unique-visitors").append('<%= error_div %>') });
    graph.render();
});
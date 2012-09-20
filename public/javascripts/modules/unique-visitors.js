var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.uniqueVisitors = function() {
    function showError() {
        $("#unique-visitors").append(GOVUK.Insights.Helpers.error_div);
    }

    $.ajax({
        url:"/performance/unique-visitors.json",
        dataType:"json",
        success:function (data) {
            if (data == null) {
                showError();
            } else if (GOVUK.isSvgSupported()) {
                var graph = GOVUK.Insights.sixMonthTimeSeries("#unique-visitors", {
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
                });
                graph.render(data);
            } else {
                $("#unique-visitors-module").html("<img src='/performance/unique-visitors.png' style='max-width: none'></img>");
            }
        },
        error:showError
    });
}

// Register with jQuery's document.ready event
$(GOVUK.Insights.uniqueVisitors);
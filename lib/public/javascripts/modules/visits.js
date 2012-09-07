var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.visits = function () {
    function showError() {
        $("#visits").append(GOVUK.Insights.Helpers.error_div);
    }

    $.ajax({
        url:"/visits.json",
        dataType:"json",
        success:function (data) {
            if (data == null) {
                showError();
            } else if (GOVUK.isSvgSupported()) {
                var graph = GOVUK.Insights.sixMonthTimeSeries("#visits", {
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
                });
                graph.render(data);
            } else {
                $("#visits-module").html("<img src='/visits.png' style='max-width: none'></img>");
            }
        },
        error:showError
    });
}

// Register with jQuery's document.ready event
$(GOVUK.Insights.visits);
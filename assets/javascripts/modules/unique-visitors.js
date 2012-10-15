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
                $('#unique-visitors-module img').remove();
                var graph = GOVUK.Insights.sixMonthTimeSeries("#unique-visitors", {
                    "series":{
                        "govuk":{
                            "lineClass":"main-line",
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
                    "width":444
                });
                graph.render(data);
                $('#unique-visitors-module .datainsight-hidden').removeClass('datainsight-hidden');
            }
        },
        error:showError
    });
}

// Register with jQuery's document.ready event
$(GOVUK.Insights.uniqueVisitors);
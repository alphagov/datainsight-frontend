var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.visits = function () {
    function showError() {
        $("#visits").append(GOVUK.Insights.Helpers.error_div);
        $('#visits-module img').remove();
        $('#visits-module .datainsight-hidden').removeClass('datainsight-hidden');
    }

    $.ajax({
        url:"/performance/dashboard/visits.json",
        dataType:"json",
        success:function (response) {
            if (GOVUK.isSvgSupported()) {
                $('#visits-module img').remove();
                var graph = GOVUK.Insights.sixMonthTimeSeries("#visits", {
                    "series":{
                        "directgov":{
                            "lineClass":"dashed-line brown",
                            "legend": {
                                "text": "Directgov",
                                "anchor": "2012-04-01",
                                "xOffset": 10,
                                "yOffset": 30
                            }
                        },
                        "businesslink":{
                            "lineClass":"dashed-line purple",
                            "legend": {
                                "text": "Business Link",
                                "anchor": "2012-04-01",
                                "xOffset": 10,
                                "yOffset": -10
                            }
                        },
                        "govuk":{
                            "lineClass":"main-line",
                            "legend": {
                                "text":"GOV.UK",
                                "anchor": "2013-04-6",
                                "xOffset": 0,
                                "yOffset": 25
                            }
                        }
                    },
                    "width":444
                });
                try {
                    graph.render(response.details.data);
                    $('#visits-module .datainsight-hidden').removeClass('datainsight-hidden');
                } catch (err) {
                    console.error(err);
                    showError();
                }
            }
        },
        error:showError
    });
}

// Register with jQuery's document.ready event
$(GOVUK.Insights.visits);
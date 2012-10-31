var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.visits = function () {
    function showError() {
        $("#visits").append(GOVUK.Insights.Helpers.error_div);
        $('#visits-module img').remove();
        $('#visits-module .datainsight-hidden').removeClass('datainsight-hidden');
    }

    $.ajax({
        url:"/performance/graphs/visits.json",
        dataType:"json",
        success:function (data) {
            if (GOVUK.isSvgSupported()) {
                $('#visits-module img').remove();
                var graph = GOVUK.Insights.sixMonthTimeSeries("#visits", {
                    "series":{
                        "directgov":{
                            "lineClass":"dashed-line brown",
                            "legend": {
                                "class":"brown-text",
                                "text": "Directgov",
                                "anchor": "2012-10-07",
                                "yOffset": -5
                            }
                        },
                        "businesslink":{
                            "lineClass":"dashed-line purple",
                            "legend": {
                                "class":"purple-text",
                                "text": "Business Link",
                                "anchor": "2012-09-16",
                                "yOffset": -10
                            }
                        },
                        "govuk":{
                            "lineClass":"main-line",
                            "legend": {
                                "class":"",
                                "text":"GOV.UK",
                                "anchor": "2012-10-20",
                                "xOffset": -35,
                                "yOffset": 30
                            }
                        }
                    },
                    "width":444
                });
                try {
                    graph.render(data);
                    $('#visits-module .datainsight-hidden').removeClass('datainsight-hidden');
                } catch (err) {
                    console.log(err);
                    showError();
                }
            }
        },
        error:showError
    });
}

// Register with jQuery's document.ready event
$(GOVUK.Insights.visits);
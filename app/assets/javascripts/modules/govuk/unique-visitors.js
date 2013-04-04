var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.uniqueVisitors = function () {
    function showError() {
        $("#unique-visitors").append(GOVUK.Insights.Helpers.error_div);
        $('#visits-module img').remove();
        $('#visits-module .datainsight-hidden').removeClass('datainsight-hidden');
    }

    $.ajax({
        url:"/performance/dashboard/unique-visitors.json",
        dataType:"json",
        success:function (response) {
            if (GOVUK.isSvgSupported()) {
                $('#unique-visitors-module img').remove();
                var graph = GOVUK.Insights.sixMonthTimeSeries("#unique-visitors", {
                    "series":{
                        "directgov":{
                            "lineClass":"dashed-line brown",
                            "legend": {
                                "class": "brown-text",
                                "text": "Directgov",
                                "anchor": "2012-11-11",
                                "xOffset": 5,
                                "yOffset": -15
                            }
                        },
                        "businesslink":{
                            "lineClass":"dashed-line purple",
                            "legend": {
                                "class": "purple-text",
                                "text": "Business Link",
                                "anchor": "2013-02-03",
                                "yOffset": -10
                            }
                        },
                        "govuk":{
                            "lineClass":"main-line",
                            "legend":{
                                "class": "",
                                "text": "GOV.UK",
                                "anchor": "2012-11-24",
                                "xOffset": 0,
                                "yOffset": -5
                            }
                        }
                    },
                    "width":444
                });
                try {
                    graph.render(response.details.data);
                    $('#unique-visitors-module .datainsight-hidden').removeClass('datainsight-hidden');
                } catch (err) {
                    showError();
                }
            }
        },
        error:showError
    });
}

// Register with jQuery's document.ready event
$(GOVUK.Insights.uniqueVisitors);
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
                                "text": "Directgov",
                                "anchor": "2012-07-01",
                                "xOffset": 160,
                                "yOffset": 100
                            }
                        },
                        "businesslink":{
                            "lineClass":"dashed-line purple",
                            "legend": {
                                "text": "Business Link",
                                "anchor": "2012-07-01",
                                "xOffset": 180,
                                "yOffset": 180
                            }
                        },
                        "govuk":{
                            "lineClass":"main-line",
                            "legend":{
                                "text": "GOV.UK",
                                "anchor": "2013-07-06",
                                "xOffset": 150,
                                "yOffset": 25
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
};

// Register with jQuery's document.ready event
$(GOVUK.Insights.uniqueVisitors);

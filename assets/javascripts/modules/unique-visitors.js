var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.uniqueVisitors = function () {
    function showError() {
        $("#unique-visitors").append(GOVUK.Insights.Helpers.error_div);
        $('#visits-module img').remove();
        $('#visits-module .datainsight-hidden').removeClass('datainsight-hidden');
    }

    $.ajax({
        url:"/performance/graphs/unique-visitors.json",
        dataType:"json",
        success:function (data) {
            if (GOVUK.isSvgSupported()) {
                $('#unique-visitors-module img').remove();
                var graph = GOVUK.Insights.sixMonthTimeSeries("#unique-visitors", {
                    "series":{
                        "directgov":{
                            "lineClass":"dashed-line brown",
                            "legendClass":"brown-text",
                            "legend":"Directgov"
                        },
                        "businesslink":{
                            "lineClass":"dashed-line purple",
                            "legendClass":"purple-text",
                            "legend":"Business Link"
                        },
                        "govuk":{
                            "lineClass":"main-line",
                            "legendClass":"",
                            "legend":"GOV.UK"
                        }
                    },
                    "width":444
                });
                try {
                    graph.render(data);
                    $('#unique-visitors-module .datainsight-hidden').removeClass('datainsight-hidden');
                    $("#unique-visitors-module .govuk-label").attr("x", 310).attr("y", 160).css('text-anchor', 'start');
                    $("#unique-visitors-module .directgov-label").attr("x", 170).attr("y", 45).css('text-anchor', 'start');
                    $("#unique-visitors-module .businesslink-label").attr("x", 200).attr("y", 185).css('text-anchor', 'start');
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
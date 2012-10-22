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
                try {
                    graph.render(data);
                    $('#visits-module .datainsight-hidden').removeClass('datainsight-hidden');
                    $('#visits-module .datainsight-hidden').removeClass('datainsight-hidden');
                    $("#visits-module .govuk-label").attr("x", 310).attr("y", 160).css('text-anchor', 'start');
                    $("#visits-module .directgov-label").attr("x", 245).attr("y", 30).css('text-anchor', 'start');
                    $("#visits-module .businesslink-label").attr("x", 200).attr("y", 185).css('text-anchor', 'start');
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
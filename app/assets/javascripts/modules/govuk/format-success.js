var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.formatSuccess = function () {
    function showError() {
        $("#format-success-module").append(GOVUK.Insights.Helpers.error_div);
    }

    $.ajax({
        url:'/performance/dashboard/content-engagement.json',
        success:function (response) {
            if (response !== null) {
                if (GOVUK.isSvgSupported()) {
                    $('#format-success-module img').remove();
                    $('#format-success-module .datainsight-hidden').removeClass('datainsight-hidden');
                    GOVUK.Insights.plotFormatSuccessGraph(response.details.data);
                }
            } else {
                showError();
            }
        }});
};

GOVUK.Insights.plotFormatSuccessGraph = function (data) {

    var getFormatName = function(formatId) {
        return {
            "guide": "Guides",
            "programme": "Benefits",
            "answer": "Answers",
            "smart_answer": "Smart answers",
            "transaction": "Transaction"
        }[formatId] || formatId;
    };

    var data = data.map(function (d) {
        return {
            x:d.entries,
            y:d.percentage_of_success,
            colour:d.percentage_of_success,
            label:getFormatName(d.format),
            id:d.format
        };
    });

    var formatSuccess = GOVUK.Insights.scatterplotGraph()
        .xAxisLabels({description:"Views", left:"Least viewed", right:"Most viewed"})
        .yAxisLabels({description:"Engagement level", bottom:"0%", top:"100%"})
        .r(function (d) { return d.x; })
        .rScale(d3.scale.pow().exponent(0.5));

    d3.select('#format-success')
        .datum(data)
        .call(formatSuccess);
    d3.select('#format-success-legend')
        .datum(data)
        .call(formatSuccess.legend);
    GOVUK.Insights.forcePosition.apply("#format-success");
    d3.select("#format-success-module").selectAll('text').each(function () { GOVUK.Insights.svg.createTextShade(this) });
};

// register with jQuery's autorun.
$(GOVUK.Insights.formatSuccess);

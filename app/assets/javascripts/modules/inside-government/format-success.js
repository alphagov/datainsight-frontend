var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};
GOVUK.Insights.InsideGovernment = GOVUK.Insights.InsideGovernment || {};

GOVUK.Insights.InsideGovernment.formatSuccess = function(RAW_DATA) {

        var getFormatName = function (format) {
            return {
                "news":"News",
                "detailed_guidance":"Detailed guidance",
                "policy":"Policies"
            }[format] || format;
        };

        var data = RAW_DATA.details.data.map(function (d) {
            return {
                x:d.entries,
                y:d.percentage_of_success,
                colour:d.percentage_of_success,
                label:getFormatName(d.format)
            };
        });

        var formatSuccess = GOVUK.Insights.scatterplotGraph()
            .xAxisLabels({description:"Views", left:"Least viewed", right:"Most viewed"})
            .yAxisLabels({description:"Engagement level", bottom:"0%", top:"100%"})
            .r(function (d) { return d.x; })
            .rScale(d3.scale.pow().exponent(0.5));

        d3.select('#inside-gov-format-success')
            .datum(data)
            .call(formatSuccess);
        d3.select('#inside-gov-format-success-legend')
            .datum(data)
            .call(formatSuccess.legend);
        d3.select("#format-success-module").selectAll('text').each(function () { GOVUK.Insights.createTextShade(this) });

        GOVUK.Insights.forcePosition.apply("#inside-gov-format-success");
};

$(function () {
    $.ajax({
        url: "/performance/dashboard/government/content-engagement.json",
        success: function (response) {
            if (response !== null) {
                if (GOVUK.isSvgSupported()) {
                    $("#format-success-module img").remove();
                    $("#format-success-module .datainsight-hidden").removeClass("datainsight-hidden");
                    GOVUK.Insights.InsideGovernment.formatSuccess(response);
                }
            } else {
                $("#format-success-module").append(GOVUK.Insights.Helpers.error_div);
            }
        }
    });
});

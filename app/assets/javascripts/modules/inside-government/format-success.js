var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};
GOVUK.Insights.InsideGovernment = GOVUK.Insights.InsideGovernment || {};

GOVUK.Insights.InsideGovernment.formatSuccess = function(RAW_DATA) {

        var getFormatName = function (format) {
            return {
                "news":"News",
                "detailed_guidance":"Detailed guidance",
                "policy":"Policy"
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
            .xAxisLabels({description:"Times used", left:"Least used", right:"Most used"})
            .yAxisLabels({description:"Used successfully", bottom:"0%", top:"100%"})
            .r(function (d) { return d.x; })
            .rScale(d3.scale.pow().exponent(0.5));

        d3.select('#inside-gov-format-success')
            .datum(data)
            .call(formatSuccess);
        d3.select('#inside-gov-format-success-legend')
            .datum(data)
            .call(formatSuccess.legend);

        GOVUK.Insights.forcePosition.apply("#inside-gov-format-success");
};

$(function () {
    $.ajax({
        url: "/performance/dashboard/government/format-success.json",
        success: function (response) {
            GOVUK.Insights.InsideGovernment.formatSuccess(response);
        }
    });
});

var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};
GOVUK.Insights.InsideGovernment = GOVUK.Insights.InsideGovernment || {};

GOVUK.Insights.InsideGovernment.formatSuccess = function () {
    $(function () {
        var RAW_DATA = {
            "response_info":{"status":"ok"},
            "id":"http://datainsight-frontend.dev.gov.uk/performance/dashboard/format-success.json",
            "web_url":"http://datainsight-frontend.dev.gov.uk/performance/dashboard/format-success",
            "details":{
                "source":["Google Analytics"],
                "data":[
                    { "format":"news", "entries":57000, "percentage_of_success":35 },
                    { "format":"detailed_guidance", "entries":120000, "percentage_of_success":40},
                    { "format":"policy", "entries":100000, "percentage_of_success":65}
                ]
            },
            "updated_at":"2012-10-30T09:27:34+00:00"
        };

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
                r:d.entries,
                colour:d.percentage_of_success,
                label:getFormatName(d.format)
            };
        });
        var formatSuccess = GOVUK.Insights.scatterplotGraph()
            .xAxisLabels({description:"Times used", left:"Least used", right:"Most used"})
            .yAxisLabels({description:"Used successfully", bottom:"0%", top:"100%"})
            .xScale(d3.scale.linear().domain([0, d3.max(data, function (d) {
            return d.x;
        })]))
            .yScale(d3.scale.linear().domain([0, 100]))
            .rScale(d3.scale.linear().domain([0, d3.max(data, function (d) {
            return d.r;
        })]))
            .colourScale(d3.scale.linear().domain([100, 50, 0]));

        d3.select('#inside-gov-format-success')
            .datum(data)
            .call(formatSuccess);
        GOVUK.Insights.forcePosition.apply("#inside-gov-format-success");
    });
}();
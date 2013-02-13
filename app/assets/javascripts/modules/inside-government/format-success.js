var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.formatSuccessInsidegov = function () {
    GOVUK.Insights.formatTitles = {
        news: "news",
        detailed_guidance: "detailed guidance",
        policy: "policies"
    };
    GOVUK.Insights.contentEngagementUrl = '/performance/dashboard/government/content-engagement-detail.json';
    GOVUK.Insights.formatSuccess();
};

// register with jQuery's autorun.
$(GOVUK.Insights.formatSuccessInsidegov);

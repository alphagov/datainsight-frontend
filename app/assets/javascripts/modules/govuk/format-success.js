var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.formatSuccessGovuk = function () {
    GOVUK.Insights.formatTitles = {
        guide: 'guide',
        answer: 'answer',
        smart_answer: 'smart answer',
        programme: 'benefit'
    };
    GOVUK.Insights.contentEngagementUrl = '/datainsight-frontend/fixtures/govuk.json';
    GOVUK.Insights.formatSuccess();
};

// register with jQuery's autorun.
$(GOVUK.Insights.formatSuccessGovuk);

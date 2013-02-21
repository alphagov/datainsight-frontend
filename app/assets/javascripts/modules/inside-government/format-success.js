var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.formatSuccessInsidegov = function () {
    GOVUK.Insights.formats = {
        news: {
            title: 'News',
            headline: 'news item',
            criteria: 'User spends at least 30 seconds on the page, or clicks on a link within the body of the page.'
        },
        detailed_guidance: {
            title: 'Detailed guidance',
            headline: 'item of detailed guidance',
            headlinePlural: 'items of detailed guidance',
            criteria: 'User spends at least 30 seconds on the page, or clicks on a link within the body of the page or on related detailed guidance.'
        },
        policy: {
            title: 'Policy',
            headline: 'policy',
            headlinePlural: 'policies',
            criteria: 'User spends at least 30 seconds on the page, or clicks on a link within the body of the page, excluding anchor links on first page.'
        }
    };
    GOVUK.Insights.contentEngagementUrl = '/performance/dashboard/government/content-engagement-detail.json';
    GOVUK.Insights.formatSuccess();
};

// register with jQuery's autorun.
$(GOVUK.Insights.formatSuccessInsidegov);

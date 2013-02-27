var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.formatSuccessGovuk = function () {
    GOVUK.Insights.formats = {
        guide: {
            title: 'Guide',
            headline: 'guide',
            criteria: 'User spends at least 7 seconds on the page, or clicks a link within the body of the page.'
        },
        answer: {
            title: 'Answer',
            headline: 'answer',
            criteria: 'User spends at least 7 seconds on the page, or clicks a link within the body of the page.'
        },
        smart_answer: {
            title: 'Smart answer',
            headline: 'smart answer',
            criteria: 'User arrives at smart answer, clicks on &lsquo;Start now&rsquo;, answers all of the questions and arrives at the final result page.'
        },
        programme: {
            title: 'Benefit',
            headline: 'benefit',
            criteria: 'User spends at least 7 seconds on the page, or clicks a link within the body of the page.'
        }
    };
    GOVUK.Insights.contentEngagementUrl = '/performance/dashboard/content-engagement-detail.json';
    GOVUK.Insights.formatSuccess();
};

// register with jQuery's autorun.
$(GOVUK.Insights.formatSuccessGovuk);

var GOVUK = GOVUK || {};

GOVUK.performance = GOVUK.performance || {};

GOVUK.performance.sendGoogleAnalyticsEvent = function (action) {
  _gaq.push(['_trackEvent', 'stagePrompt', action, undefined, undefined, true]);
};

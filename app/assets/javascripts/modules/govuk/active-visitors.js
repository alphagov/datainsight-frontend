var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.activeVisitors = function() {
  $.ajax({
    url: "http://www.dev.gov.uk:3038/active_visitors?sort_by=_timestamp:descending&limit=1",
    dataType: "json",
    success: function(response) {
      if (response !== null) {
        var el = $("#active-visitors");

        el.html(response.data[0].activeVisitors);
        el.parent().removeClass("hidden");
      }
    }
  })
};

$(GOVUK.Insights.activeVisitors);
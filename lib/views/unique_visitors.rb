<% content_for :head do %>
  <script type="text/javascript" src="/javascripts/time-series.js"></script>
  <script type="text/javascript">
    $(function() {
      var graph = GOVUK.Insights.sixMonthTimeSeries("/unique-visitors.json", "#unique-visitors", {
        "series": {
          "govuk": {
            "lineClass": "main-line",
            "legendClass": "",
            "legend": "GOV.UK"
          },
          "directgov": {
            "lineClass": "dashed-line brown",
            "legendClass": "brown-text",
            "legend": "Directgov"
          },
          "businesslink": {
            "lineClass": "dashed-line purple",
            "legendClass": "purple-text",
            "legend": "Business Link"
          }
        }
      });
      graph.render();
    });
  </script>
<% end %>

<div class="module">
  <div class="module-header">
    <div class="info"></div>
    <div>
      <div class="small-text">Reach</div>
      <div>Weekly Unique Visitors for the last half year</div>
    </div>
  </div>
  <div style="clear: both"></div>
  <div id="unique-visitors"></div>
  <div class="small-text" style="padding: 18px 0">
    <span class="blue-text">Sources: Google Analytics, Celebrus, Omniture</span>
  </div>
</div>

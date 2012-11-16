

class DashboardController < ApplicationController

  def api(config)
    @api ||= ClientAPI.new(config)
  end

  def get_narrative()
    if (DataInsightSettings.feature_toggles[:show_weekly_visitors_in_narrative])
      weekly_visitors_narrative
    else
      todays_activity_narrative
    end
  end

  def weekly_visitors_narrative
    weekly_visitors = api(DataInsightSettings).weekly_visitors("url is irrelevant")
    Narrative.new(weekly_visitors).content unless weekly_visitors == :error
  end

  def todays_activity_narrative
    # we don't care about the id / web_url fields because it's not being published from here
    response = api(DataInsightSettings).narrative("do not care")
    if response == :error
      ""
    else
      response["details"]["data"]["content"]
    end
  end


  def index

  end

  def narrative
    @narrative = get_narrative
  end

end

class DashboardController < ApplicationController

  def index
    @narrative = get_narrative
  end

  def narrative
    respond_to do |format|
      format.html { @narrative = get_narrative }
      format.json { serve_json { api.narrative.merge(uris_for_action("narrative")) } }
    end
  end

  def visits
    respond_to do |format|
      format.html
      format.json { serve_json { api.weekly_visits.merge(uris_for_action("visits")) } }
      format.png { serve_image("visits") }
    end
  end

  def unique_visitors
    respond_to do |format|
      format.html
      format.json { serve_json { api.weekly_visitors.merge(uris_for_action("unique_visitors")) } }
      format.png { serve_image("unique-visitors") }
    end
  end

  def format_success
    respond_to do |format|
      format.html
      format.json { serve_json { api.format_success.merge(uris_for_action("format_success")) } }
      format.png { serve_image("format-success") }
    end
  end

  def hourly_traffic
    respond_to do |format|
      format.html
      format.json { serve_json { api.hourly_traffic.merge(uris_for_action("hourly_traffic")) } }
      format.png { serve_image("hourly-traffic") }
    end
  end


  private

  def get_narrative
    if (Settings.feature_toggles[:show_weekly_visitors_in_narrative])
      weekly_visitors_narrative
    else
      todays_activity_narrative
    end
  end

  def weekly_visitors_narrative
    weekly_visitors = api.weekly_visitors
    GovukNarrative.new(weekly_visitors).content
  rescue Songkick::Transport::UpstreamError
    ""
  end

  def todays_activity_narrative
    response = api.narrative
    response["details"]["data"]["content"]
  rescue Songkick::Transport::UpstreamError
    ""
  end

  def uris_for_action(action)
    {
        "id" => url_for(controller: "dashboard", action: action, format: :json)
    }
  end


end

class DashboardController < ApplicationController

  def index
    @narrative = get_narrative
  end

  def narrative
    respond_to do |format|
      format.html { @narrative = get_narrative }
      format.json {
        serve_json do
          json = api.narrative
          json["id"] = url_for :controller => "dashboard", :action => "narrative", :format => :json
          json["web_url"] = url_for :controller => "dashboard", :action => "narrative"
          json
        end
      }
    end
  end

  def visits
    respond_to do |format|
      format.html
      format.json {
        serve_json do
          json = api.weekly_visits
          json["id"] = url_for :controller => "dashboard", :action => "visits", :format => :json
          json["web_url"] = url_for :controller => "dashboard", :action => "visits"
          json
        end
      }
      format.png { serve_image("visits") }
    end
  end

  def unique_visitors
    respond_to do |format|
      format.html
      format.json {
        serve_json do
          json = api.weekly_visitors
          json["id"] = url_for :controller => "dashboard", :action => "unique_visitors", :format => :json
          json["web_url"] = url_for :controller => "dashboard", :action => "unique_visitors"
          json
        end
      }
      format.png { serve_image("unique-visitors") }
    end
  end

  def format_success
    respond_to do |format|
      format.html
      format.json {
        serve_json do
          json = api.format_success
          json["id"] = url_for :controller => "dashboard", :action => "format_success", :format => :json
          json["web_url"] = url_for :controller => "dashboard", :action => "format_success"
          json
        end
      }
      format.png { serve_image("format-success") }
    end
  end

  def hourly_traffic
    respond_to do |format|
      format.html
      format.json {
        serve_json do
          json = api.hourly_traffic
          json["id"] = url_for :controller => "dashboard", :action => "hourly_traffic", :format => :json
          json["web_url"] = url_for :controller => "dashboard", :action => "hourly_traffic"
          json
        end
      }
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
    Narrative.new(weekly_visitors).content
  rescue Songkick::Transport::UpstreamError
    ""
  end

  def todays_activity_narrative
    response = api.narrative
    response["details"]["data"]["content"]
  rescue Songkick::Transport::UpstreamError
    ""
  end

  def serve_image(image_name)
    headers['X-Slimmer-Skip'] = "true"
    send_data File.read("#{Settings.graphs_images_dir}/#{image_name}.png"), type: "image/png", disposition: "inline"
  end

end

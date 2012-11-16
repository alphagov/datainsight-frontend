

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

  def visits
    respond_to do |format|
      format.html do
        # get weekly visits
      end
      format.png { serve_image("visits") }
    end
  end

  def unique_visitors
    respond_to do |format|
      format.html do
        # get weekly visits
      end
      format.png { serve_image("unique-visitors") }
    end
  end

  def format_success
    respond_to do |format|
      format.html do
        # get weekly visits
      end
      format.png { serve_image("format-success") }
    end
  end

  def hourly_traffic
    respond_to do |format|
      format.html do
        # get weekly visits
      end
      format.png { serve_image("hourly-traffic") }
    end
  end

  def serve_image(image_name)
    headers['X-Slimmer-Skip'] = "true"
    send_data File.read("#{DataInsightSettings::GRAPHS_IMAGES_DIR}/#{image_name}.png"), type: "image/png", disposition: "inline"
  end

  def narrative
    @narrative = get_narrative
  end

end

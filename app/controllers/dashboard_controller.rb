class DashboardController < ApplicationController

  def api(config)
    @api ||= create_client_api(config)
  end

  def get_narrative()
    if (Settings.feature_toggles[:show_weekly_visitors_in_narrative])
      weekly_visitors_narrative
    else
      todays_activity_narrative
    end
  end

  def weekly_visitors_narrative
    weekly_visitors = api(Settings).weekly_visitors("url is irrelevant")
    Narrative.new(weekly_visitors).content unless weekly_visitors == :error
  end

  def todays_activity_narrative
    # we don't care about the id / web_url fields because it's not being published from here
    response = api(Settings).narrative("do not care")
    if response == :error
      ""
    else
      response["details"]["data"]["content"]
    end
  end


  def index
    @narrative = get_narrative
  end

  def visits
    respond_to do |format|
      format.html
      format.json { serve_json("weekly_visits") }
      format.png { serve_image("visits") }
    end
  end

  def unique_visitors
    respond_to do |format|
      format.html
      format.json { serve_json("weekly_visitors") }
      format.png { serve_image("unique-visitors") }
    end
  end

  def format_success
    respond_to do |format|
      format.html
      format.json { serve_json("format_success") }
      format.png { serve_image("format-success") }
    end
  end

  def hourly_traffic
    respond_to do |format|
      format.html
      format.json { serve_json("hourly_traffic") }
      format.png { serve_image("hourly-traffic") }
    end
  end

  def serve_image(image_name)
    headers['X-Slimmer-Skip'] = "true"
    send_data File.read("#{Settings::GRAPHS_IMAGES_DIR}/#{image_name}.png"), type: "image/png", disposition: "inline"
  end

  def narrative
    respond_to do |format|
      format.html { @narrative = get_narrative }
      format.json { serve_json("narrative") }
    end
  end

  def serve_json(endpoint)
    request_url = "#{request.scheme}://#{request.host}#{request.path}".chomp(".json")
    api = api(Settings)
    result = api.send(endpoint.to_sym, request_url)
    if result == :error
      render status: 500
    else
      render json: result
    end
  end

end

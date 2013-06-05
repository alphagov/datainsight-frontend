class ApplicationController < ActionController::Base
  protect_from_forgery

  # use 'homepage' template to remove global navigation element
  include Slimmer::Template
  slimmer_template :homepage

  def create_client_api(config)
    client_api_class.new(config)
  end

  def serve_json
    json = yield
    render json: json.merge(id: json_url)
  rescue Exception => e
    Airbrake.notify(e)
    render status: 500, nothing: true
  end

  def serve_image(image_name)
    headers['X-Slimmer-Skip'] = "true"
    send_data File.read("#{Settings.graphs_images_dir}/#{image_name}.png"), type: "image/png", disposition: "inline"
  end

  def api
    @api ||= create_client_api(Settings.api_urls)
  end

  private

  def client_api_class
    Settings.use_stub_api ? ClientStub : ClientAPI
  end

  def json_url
    url_for(controller: params["controller"], action: params["action"], format: :json)
  end
end

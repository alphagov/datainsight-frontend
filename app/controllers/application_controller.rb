class ApplicationController < ActionController::Base
  protect_from_forgery

  def create_client_api(config)
    client_api_class.new(config)
  end

  def serve_json
    json = yield
    render json: json
  rescue Exception => e
    Airbrake.notify(e)
    render status: 500, nothing: true
  end

  def api
    @api ||= create_client_api(Settings.api_urls)
  end

  private

  def client_api_class
    Settings.use_stub_api ? ClientStub : ClientAPI
  end

end

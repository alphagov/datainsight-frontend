class ApplicationController < ActionController::Base
  protect_from_forgery

  def create_client_api(config)
    client_api_class.new(config)
  end

  def serve_json(endpoint)
    request_url = "#{request.scheme}://#{request.host}#{request.path}".chomp(".json")
    api = api(Settings.api_urls)
    result = api.send(endpoint.to_sym, request_url)
    if result == :error
      render status: 500, nothing: true
    else
      render json: result
    end
  end

  def serve_json_from(base_url, path)
    request_url = "#{request.scheme}://#{request.host}#{request.path}".chomp(".json")
    api = api(Settings.api_urls)
    result = api.get_json(request_url, base_url, path)
    if result == :error
      render status: 500, nothing: true
    else
      render json: result
    end
  end

  def api(config)
    @api ||= create_client_api(config)
  end

  private

  def client_api_class
    Settings.use_stub_api ? ClientStub : ClientAPI
  end

end

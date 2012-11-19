class ApplicationController < ActionController::Base
  protect_from_forgery

  def create_client_api(config)
    client_api_class.new(config)
  end

  private

  def client_api_class
    if DataInsightFrontend::Application.config.respond_to?(:client_api)
      DataInsightFrontend::Application.config.client_api
    else
      ClientAPI
    end
  end

end

class ApplicationController < ActionController::Base
  protect_from_forgery

  def create_client_api(config)
    client_api_class.new(config)
  end

  private

  def client_api_class
    Settings.use_stub_api ? ClientStub : ClientAPI
  end

end

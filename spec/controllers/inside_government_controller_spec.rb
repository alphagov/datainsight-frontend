require "spec_helper"

describe InsideGovernmentController do

  describe "index" do

    it "should retrieve most visited policies from api" do
      client_api = double("client_api")
      client_api.should_receive(:get_json).with(anything(), Settings.api_urls['inside_government_base_url'], '/most-visited-policies')

      ClientAPI.stub(:new).and_return(client_api)

      get :index
    end

  end

end
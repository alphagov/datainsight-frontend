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

  describe "most visited policies api" do
    it "should return 500 if upstream server fails" do
      ClientAPI.any_instance.stub(:most_visited_policies).and_raise

      get :most_visited_policies

      response.status.should == 500
    end
  end

  describe "format success api" do
    it "should return 500 if upstream server fails" do
      ClientAPI.any_instance.stub(:inside_gov_format_success).and_raise

      get :format_success

      response.status.should == 500
    end
  end

end
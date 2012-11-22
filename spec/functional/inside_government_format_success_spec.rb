require_relative "test_helper"

describe "Inside Government" do
  include Rack::Test::Methods

  def app
    DataInsightFrontend::Application
  end

  it "should expose the format success api endpoint" do
    # stub recorder to return {}

    get "/performance/dev/inside-government/format-success.json"

    last_response.status.should == 200
    last_response.content_type.should include "application/json"
    last_response.body.should == "{}"
  end
end
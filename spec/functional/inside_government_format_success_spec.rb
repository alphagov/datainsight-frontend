require_relative "rack_test_helper"

describe "Inside Government" do

  it "should expose the format success api endpoint" do
    FakeWeb.register_uri(
        :get,
        "http://datainsight-inside-government-recorder.dev.gov.uk/format-success",
        :body => {my: "json"}.to_json)

    get "/performance/dev/inside-government/format-success.json"

    last_response.status.should == 200
    last_response.content_type.should include "application/json"

    json_result = JSON.parse(last_response.body)
    json_result["my"].should == "json"
    json_result["id"].should == "http://datainsight-frontend.dev.gov.uk/performance/dev/inside-government/format-success.json"
    json_result["web_url"].should == "http://datainsight-frontend.dev.gov.uk/performance/dev/inside-government/format-success"
  end
end
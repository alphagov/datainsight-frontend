require "functional/rack_test_helper"

describe "Inside Government API" do

  BASE_URL = Settings.api_urls['inside_government_base_url']

  it "should expose the format success api endpoint" do
    FakeWeb.register_uri(
      :get,
      "#{BASE_URL}/format-success/weekly",
      :body => {my: "json"}.to_json)

    get "/performance/dashboard/government/content-engagement.json"

    last_response.status.should == 200
    last_response.content_type.should include "application/json"

    json_result = JSON.parse(last_response.body)
    json_result["my"].should == "json"
    json_result["id"].should == "http://datainsight-frontend.dev.gov.uk/performance/dashboard/government/content-engagement.json"
    json_result["web_url"].should == "http://datainsight-frontend.dev.gov.uk/performance/dashboard/government#format-success-module"
  end

  it "should expose most entered policies api endpoint" do
    most_entered_policies = JsonBuilder.most_entered_policies([{}, {}, {}, {}, {}])

    FakeWeb.register_uri(
      :get,
      "#{BASE_URL}/entries/weekly/policies",
      :body => most_entered_policies.to_json)

    get "/performance/dashboard/government/most-entered-policies.json"

    last_response.status.should == 200
    last_response.content_type.should include "application/json"

    json_result = JSON.parse(last_response.body)
    json_result["details"].should == most_entered_policies["details"]
    json_result["id"].should == "http://datainsight-frontend.dev.gov.uk/performance/dashboard/government/most-entered-policies.json"
    json_result["web_url"].should == "http://datainsight-frontend.dev.gov.uk/performance/dashboard/government#most-entered-policies-module"
  end

  it "should expose visitors api endpoint" do
    FakeWeb.register_uri(
      :get,
      "#{BASE_URL}/visitors/weekly?limit=12",
      :body => {data: "some data"}.to_json
    )

    get "/performance/dashboard/government/visitors/weekly.json"

    last_response.status.should == 200
    last_response.content_type.should include "application/json"

    json_result = JSON.parse(last_response.body)
    json_result["data"].should == "some data"
    json_result["id"].should == "http://datainsight-frontend.dev.gov.uk/performance/dashboard/government/visitors/weekly.json"
    json_result["web_url"].should == "http://datainsight-frontend.dev.gov.uk/performance/dashboard/government"
  end

  it "should expose annotations api endpoint" do
    get "/performance/dashboard/government/annotations.json"

    last_response.status.should == 200
    last_response.content_type.should include "application/json"

    json_result = JSON.parse(last_response.body)
    json_result["response_info"]["status"].should == "ok"
    json_result["id"].should == "http://datainsight-frontend.dev.gov.uk/performance/dashboard/government/annotations.json"
    json_result["web_url"].should == "http://datainsight-frontend.dev.gov.uk/performance/dashboard/government"
    lambda { DateTime.parse(json_result["updated_at"]) }.should_not raise_error
    json_result["details"].should have(2).annotations

  end
end
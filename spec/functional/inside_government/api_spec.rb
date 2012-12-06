require "functional/rack_test_helper"

describe "Inside Government API" do

  BASE_URL = Settings.api_urls['inside_government_base_url']

  it "should expose the format success api endpoint" do
    FakeWeb.register_uri(
      :get,
      "#{BASE_URL}/format-success",
      :body => {my: "json"}.to_json)

    get "/performance/dev/inside-government/format-success.json"

    last_response.status.should == 200
    last_response.content_type.should include "application/json"

    json_result = JSON.parse(last_response.body)
    json_result["my"].should == "json"
    json_result["id"].should == "http://datainsight-frontend.dev.gov.uk/performance/dev/inside-government/format-success.json"
    json_result["web_url"].should == "http://datainsight-frontend.dev.gov.uk/performance/dev/inside-government#format-success-module"
  end

  it "should expose most visited policies api endpoint" do
    most_visited_policies = JsonBuilder.most_visited_policies([{}, {}, {}, {}, {}])

    FakeWeb.register_uri(
      :get,
      "#{BASE_URL}/most-visited-policies",
      :body => most_visited_policies.to_json)

    get "/performance/dev/inside-government/most-visited-policies.json"

    last_response.status.should == 200
    last_response.content_type.should include "application/json"

    json_result = JSON.parse(last_response.body)
    json_result["details"].should == most_visited_policies["details"]
    json_result["id"].should == "http://datainsight-frontend.dev.gov.uk/performance/dev/inside-government/most-visited-policies.json"
    json_result["web_url"].should == "http://datainsight-frontend.dev.gov.uk/performance/dev/inside-government#most-visited-policies-module"
  end

  it "should expose visitors api endpoint" do
    FakeWeb.register_uri(
      :get,
      "#{BASE_URL}/visitors/weekly",
      :body => {data: "some data"}.to_json
    )

    get "/performance/dev/inside-government/visitors/weekly.json"

    last_response.status.should == 200
    last_response.content_type.should include "application/json"

    json_result = JSON.parse(last_response.body)
    json_result["data"].should == "some data"
    json_result["id"].should == "http://datainsight-frontend.dev.gov.uk/performance/dev/inside-government/visitors/weekly.json"
    json_result["web_url"].should == "http://datainsight-frontend.dev.gov.uk/performance/dev/inside-government"
  end
end
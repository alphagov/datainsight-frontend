require "functional/test_helper"

def policies_json
  <<-HERE
{
	"response_info":{
		"status":"ok"
	},
	"id":"https://www.gov.uk/performance/dashboard/visits.json",
	"web_url":"https://www.gov.uk/performance/dashboard/visits",
	"details":{
		"source":["Google Analytics","Celebrus","Omniture"],
		"start_at":"2012-05-20",
		"end_at":"2012-06-03",
		"data":[
			{
				"policy": {
					"title": "Developing a new high speed rail network",
					"department": "DFT",
					"updated_at": "2012-11-20G16:00:07+00:00",
					"web_url": "https://www.gov.uk/government/policies/developing-a-new-high-speed-rail-network"
				},
				"visits": 539000
			}
		]
	},
	"updated_at":"2012-11-26G16:00:07+00:00"
}
  HERE
end

describe "Most Visited Policies" do

  it "should show most visited policies" do
    FakeWeb.register_uri(
        :get,
        "#{Settings.api_urls['inside_government_base_url']}/most-visited-policies",
        :body => policies_json)

    visit "/performance/dev/inside-government"

    page.find("#most-visited-policies-module h2").text.should == "Most visited policies"
  end

  it "should show 5 most visited policies" do
    FakeWeb.register_uri(
        :get,
        "#{Settings.api_urls['inside_government_base_url']}/most-visited-policies",
        :body => policies_json)

    visit "/performance/dev/inside-government"

    page.all("#most-visited-policies-module table tr").count.should == 5

    page.all("#most-visited-policies-module table tr .policy-title").first.text.should == "Developing a new high speed rail network"
  end

end

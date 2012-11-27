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
					"title": "Most visited policy"
				}
      },
      {
				"policy": {
					"title": "Second most visited policy"
				}
      },
      {
				"policy": {
					"title": "#3 most visited policy"
				}
      },
      {
				"policy": {
					"title": "#4 most visited policy"
				}
      },
      {
				"policy": {
					"title": "#5 most visited policy"
				}
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

    page.all("#most-visited-policies-module table tr .policy-title").first.text.should == "Most visited policy"
    page.all("#most-visited-policies-module table tr .policy-title").second.text.should == "Second most visited policy"
    page.all("#most-visited-policies-module table tr .policy-title")[2].text.should == "#3 most visited policy"
    page.all("#most-visited-policies-module table tr .policy-title")[3].text.should == "#4 most visited policy"
    page.all("#most-visited-policies-module table tr .policy-title")[4].text.should == "#5 most visited policy"
  end

end

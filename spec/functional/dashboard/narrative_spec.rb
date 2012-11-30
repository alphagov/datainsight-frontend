require "functional/test_helper"
require "json"

weekly_reach_json = <<-HERE
{
  "response_info": {
    "status": "ok"
  },
  "id": "https://datainsight-frontend.preview.alphagov.co.uk/performance/dashboard/unique-visitors.json",
  "web_url": "https://datainsight-frontend.preview.alphagov.co.uk/performance/dashboard/unique-visitors",
  "details": {
    "source": [
      "Google Analytics",
      "Celebrus",
      "Omniture"
    ],
    "data": [
      {
        "start_at": "2012-10-21",
        "end_at": "2012-10-27",
        "value": {
          "govuk": 3945072
        }
      },
      {
        "start_at": "2012-10-28",
        "end_at": "2012-11-03",
        "value": {
          "govuk": 3505337
        }
      }
    ]
  },
  "updated_at": "2012-11-06T16:00:16+00:00"
}
HERE

describe "The Narrative" do
  it "should show the narrative on the narrative end point" do
    FakeWeb.register_uri(:get, "#{Settings.api_urls['weekly_reach_base_url']}/weekly-visitors", :body => weekly_reach_json)
    visit "/performance/dashboard/narrative"
    page.find("#narrative").text.should == "GOV.UK had 3.5 million visitors last week, a decrease of 11% from the week before"
  end

  it "should NOT show the narrative if there was an error" do
    FakeWeb.register_uri(:get, "#{Settings.api_urls['weekly_reach_base_url']}/weekly-visitors", :status => 500)
    visit "/performance/dashboard/narrative"
    page.status_code.should == 200
    page.should_not have_css("#narrative")
  end

end

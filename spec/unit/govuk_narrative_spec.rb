require_relative "../spec_helper"

describe GovukNarrative do

  def build_narrative(data)
    weekly_visitors_data = <<-HERE
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
              "start_at": "2012-10-14",
              "end_at": "2012-10-20",
              "value": {
                "govuk": 0
              }
            },
            {
              "start_at": "2012-10-21",
              "end_at": "2012-10-27",
              "value": {
                "govuk": 0
              }
            },
            {
              "start_at": "2012-10-22",
              "end_at": "2012-10-28",
              "value": {
                "directgov": 0,
                "businesslink": 0
              }
            },
            {
              "start_at": "2012-10-28",
              "end_at": "2012-11-03",
              "value": {
                "govuk": 0
              }
            }
          ]
        },
        "updated_at": "2012-11-06T16:00:16+00:00"
      }
    HERE

    visitors = JSON.parse(weekly_visitors_data)
    visitors['details']['data'][1]['value']['govuk'] = data[:week_before]
    visitors['details']['data'][3]['value']['govuk'] = data[:last_week]

    visitors
  end

  it "should create a narrative from weekly visitors" do
    narrative = GovukNarrative.new(build_narrative(week_before:3945072, last_week:3505337))
    narrative.content.should == 'GOV.UK had 3.51 million visitors last week, <red>a decrease of 11%</red> from the week before'
  end

  it "should mark up the content correctly for a percentage increase" do
    narrative = GovukNarrative.new(build_narrative(week_before:3000000, last_week:3300000))
    narrative.content.should == "GOV.UK had 3.30 million visitors last week, <green>an increase of 10%</green> from the week before"
  end

  it "should not mark up the content when the increase is less than 1%" do
    narrative_for_increase_below_1 = GovukNarrative.new(build_narrative(week_before:3000000, last_week:3014900))
    narrative_for_increase_below_1.content.should == "GOV.UK had 3.01 million visitors last week, about the same as the week before"
  end

  it "should not mark up the content when the decrease is less than 1%" do
    narrative_for_decrease_below_1 = GovukNarrative.new(build_narrative(week_before:3000000, last_week:2985001))
    narrative_for_decrease_below_1.content.should == "GOV.UK had 2.99 million visitors last week, about the same as the week before"
  end

  it "should be empty when data is nil" do
    narrative = GovukNarrative.new(nil)
    narrative.content.should == ""
  end

  it "should be empty when data is empty" do
    narrative = GovukNarrative.new({})
    narrative.content.should == ""
  end

  it "should be empty when data does not contain expected properties" do
    narrative = GovukNarrative.new({"unexpected_property" => "a_value"})
    narrative.content.should == ""
  end

  it "should be empty when data does not contain GOV.UK samples" do
    data = {
        "details" => {
            "data" => [
                {
                    "value" => {
                        "non-gov-uk" => 0
                    }
                }
            ]
        }
    }
    narrative = GovukNarrative.new(data)
    narrative.content.should == ""
  end

  it "should be empty when data contains invalid samples" do
    data = {
        "details" => {
            "data" => [
                {"invalid_sample" => ""}
            ]
        }
    }
    narrative = GovukNarrative.new(data)
    narrative.content.should == ""
  end

end
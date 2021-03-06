require "functional/test_helper"

describe "Most Visited Policies" do

  def serve_most_entered_policies(policy_data)
    most_entered_policies = JsonBuilder.most_entered_policies(policy_data)
    FakeWeb.register_uri(
        :get,
        "#{find_api_url('inside_government_base_url')}/entries/weekly/policies",
        :body => most_entered_policies.to_json)
  end

  before :each do
    serve_most_entered_policies([
        {
            "policy" => {
                "title" => "Most entered policy",
                "organisations" => [{"abbreviation" => "ABC", "name" => "The A B C"}],
                "updated_at" => "2012-11-25T16:00:07+00:00",
                "web_url"=>"https://www.gov.uk/most-entered-policies"
            },
            "entries" => 567000
        },
        {"policy" => {
            "title" => "Second most entered policy",
            "organisations" => "invalid",
            "updated_at" => "invalid",
            "web_url"=>"https://www.gov.uk/second-most-entered-policy"
          }
        },
        {"policy" => {
            "title" => "#3 most entered policy",
            "web_url"=>"https://www.gov.uk/three-most-entered-policy"
          }
        },
        {"policy" => {
            "title" => "#4 most entered policy",
            "web_url"=>"https://www.gov.uk/four-most-entered-policy"
          }
        },
        {"policy" => {
            "title" => "#5 most entered policy",
            "web_url"=>"https://www.gov.uk/five-most-entered-policy"
          }
        },
        {"policy" => {
          "title" => "#6 most entered policy",
          "web_url"=>"https://www.gov.uk/six-most-entered-policy"
        }
        },
        {"policy" => {
          "title" => "#7 most entered policy",
          "web_url"=>"https://www.gov.uk/seven-most-entered-policy"
        }
        },
        {"policy" => {
          "title" => "#8 most entered policy",
          "web_url"=>"https://www.gov.uk/eight-most-entered-policy"
        }
        },
        {"policy" => {
          "title" => "#9 most entered policy",
          "web_url"=>"https://www.gov.uk/nine-most-entered-policy"
        }
        },
        {"policy" => {
          "title" => "#10 most entered policy",
          "web_url"=>"https://www.gov.uk/ten-most-entered-policy"
        }
        }
    ])
  end

  it "should show most entered policies article if everything went okay" do
    visit "/performance/dashboard/government"

    page.find("#most-entered-policies-module h1")
  end

  it "should show entered policies" do
    visit "/performance/dashboard/government"
    page.status_code.should == 200

    within("#most-entered-policies-module") do
      page.all(".policy-title").count.should == 10

      page.all(".policy-title")[0].should have_link("Most entered policy", href: "https://www.gov.uk/most-entered-policies")
      page.all("abbr.policy-department")[0].text.should == "ABC"
      page.all("abbr.policy-department")[0][:title].should == "The A B C"
      page.all(".policy-update-date")[0].text.should == "Updated 25 November 2012"
      page.all(".policy-visits")[0].text.should == "0.57m"

      page.all(".policy-title")[2].should have_link "Second most entered policy"
      page.all(".policy-title")[4].should have_link "#3 most entered policy"
      page.all(".policy-title")[6].should have_link "#4 most entered policy"
      page.all(".policy-title")[8].should have_link "#5 most entered policy"
    end
  end

  it "should not show the update date if not available" do
    serve_most_entered_policies( [ { "policy" => { "updated_at" => nil } } ] )

    visit "/performance/dashboard/government"
    page.status_code.should == 200

    within("#most-entered-policies-module") do
      page.find(".policy-title").should be_visible
      page.should_not have_selector ".policy-update-date"
    end
  end

  it "should not fail if there has been an upstream error" do
    FakeWeb.register_uri(
        :get,
        "#{find_api_url('inside_government_base_url')}/entries/weekly/policies",
        :status => 500)

    visit "/performance/dashboard/government"

    page.status_code.should == 200
  end

end

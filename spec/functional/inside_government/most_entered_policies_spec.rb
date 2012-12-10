require "functional/test_helper"

describe "Most Visited Policies" do

  def serve_most_entered_policies(policy_data)
    most_entered_policies = JsonBuilder.most_entered_policies(policy_data)
    FakeWeb.register_uri(
        :get,
        "#{Settings.api_urls['inside_government_base_url']}/entries/weekly/policies",
        :body => most_entered_policies.to_json)
  end

  before :each do
    serve_most_entered_policies([
        {
            "policy" => {
                "title" => "Most entered policy",
                "department" => "ABC",
                "updated_at" => "2012-11-25T16:00:07+00:00",
                "web_url"=>"https://www.gov.uk/most-entered-policies"
            },
            "entries" => 567000
        },
        {"policy" => {
            "title" => "Second most entered policy",
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
        }
    ])
  end

  it "should show most entered policies" do
    visit "/performance/dev/inside-government"

    page.find("#most-entered-policies-module h2").text.should == "Top policies last week"
  end

  it "should show 5 most entered policies" do
    visit "/performance/dev/inside-government"
    page.status_code.should == 200

    page.all("#most-entered-policies-module .policy").count.should == 5

    page.all("#most-entered-policies-module .policy-title").first.should have_link("https://www.gov.uk/most-entered-policies", href: "https://www.gov.uk/most-entered-policies")
    page.all("#most-entered-policies-module .policy-entries").first.text.should == "567k"

    page.all("#most-entered-policies-module .policy-title").second.should have_link "https://www.gov.uk/second-most-entered-policy"

    page.all("#most-entered-policies-module .policy-title")[2].should have_link "https://www.gov.uk/three-most-entered-policy"
    page.all("#most-entered-policies-module .policy-title")[3].should have_link "https://www.gov.uk/four-most-entered-policy"
    page.all("#most-entered-policies-module .policy-title")[4].should have_link "https://www.gov.uk/five-most-entered-policy"
  end

  it "should not fail if there has been an upstream error" do
    FakeWeb.register_uri(
        :get,
        "#{Settings.api_urls['inside_government_base_url']}/entries/weekly/policies",
        :status => 500)

    visit "/performance/dev/inside-government"

    page.status_code.should == 200
  end

end

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

  it "should show most entered policies" do
    visit "/performance/dashboard/government"

    page.find("#most-entered-policies-module h2").text.should == "Top policies last week"
  end

  it "should show 5 most entered policies" do
    visit "/performance/dashboard/government"
    page.status_code.should == 200

    page.all("#most-entered-policies-module .policy-title").count.should == 10

    page.all("#most-entered-policies-module .policy-title").first.should have_link("https://www.gov.uk/most-entered-policies".gsub("/", "/\u200B"), href: "https://www.gov.uk/most-entered-policies")
    page.all("#most-entered-policies-module .policy-visits").first.text.should == "567k"

    page.all("#most-entered-policies-module .policy-title").second.should have_link "https://www.gov.uk/six-most-entered-policy".gsub("/", "/\u200B")

    page.all("#most-entered-policies-module .policy-title")[2].should have_link "https://www.gov.uk/second-most-entered-policy".gsub("/", "/\u200B")
    page.all("#most-entered-policies-module .policy-title")[3].should have_link "https://www.gov.uk/seven-most-entered-policy".gsub("/", "/\u200B")
    page.all("#most-entered-policies-module .policy-title")[4].should have_link "https://www.gov.uk/three-most-entered-policy".gsub("/", "/\u200B")
  end

  it "should not fail if there has been an upstream error" do
    FakeWeb.register_uri(
        :get,
        "#{Settings.api_urls['inside_government_base_url']}/entries/weekly/policies",
        :status => 500)

    visit "/performance/dashboard/government"

    page.status_code.should == 200
  end

end

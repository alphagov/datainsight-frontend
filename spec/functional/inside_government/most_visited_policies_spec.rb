require "functional/test_helper"

describe "Most Visited Policies" do

  def serve_most_visited_policies(policy_data)
    most_visited_policies = JsonBuilder.most_visited_policies(policy_data)
    FakeWeb.register_uri(
        :get,
        "#{Settings.api_urls['inside_government_base_url']}/most-visited-policies",
        :body => most_visited_policies.to_json)
  end

  before :each do
    serve_most_visited_policies([
        {
            "policy" => {
                "title" => "Most visited policy",
                "department" => "ABC",
                "updated_at" => "2012-11-25T16:00:07+00:00",
                "web_url"=>"https://www.gov.uk/most_visited_policy"
            },
            "visits" => 567000
        },
        {"policy" => {"title" => "Second most visited policy"}},
        {"policy" => {"title" => "#3 most visited policy"}},
        {"policy" => {"title" => "#4 most visited policy"}},
        {"policy" => {"title" => "#5 most visited policy"}}
    ])
  end

  it "should show most visited policies" do
    visit "/performance/dev/inside-government"

    page.find("#most-visited-policies-module h2").text.should == "Top policies last week"
  end

  it "should show 5 most visited policies" do
    visit "/performance/dev/inside-government"

    page.all("#most-visited-policies-module .policy").count.should == 5

    page.all("#most-visited-policies-module .policy-title").first.should have_link("Most visited policy", href: "https://www.gov.uk/most_visited_policy")
    page.all("#most-visited-policies-module .policy-department").first.text.should == "ABC"
    page.all("#most-visited-policies-module .policy-updated-at").first.text.should == "Updated 25 November 2012"
    page.all("#most-visited-policies-module .policy-visits").first.text.should == "567k"

    page.all("#most-visited-policies-module .policy-title").second.should have_link "Second most visited policy"

    page.all("#most-visited-policies-module .policy-title")[2].should have_link "#3 most visited policy"
    page.all("#most-visited-policies-module .policy-title")[3].should have_link "#4 most visited policy"
    page.all("#most-visited-policies-module .policy-title")[4].should have_link "#5 most visited policy"
  end

  it "should not fail if there has been an upstream error" do
    FakeWeb.register_uri(
        :get,
        "#{Settings.api_urls['inside_government_base_url']}/most-visited-policies",
        :status => 500)

    visit "/performance/dev/inside-government"

    page.status_code.should == 200
  end

end

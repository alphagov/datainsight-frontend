require "functional/test_helper"

describe "Most Visited Policies" do

  it "should show most visited policies" do
    visit "/performance/dev/inside-government"

    page.find("#most-visited-policies-module h2").text.should == "Most visited policies"
  end

end

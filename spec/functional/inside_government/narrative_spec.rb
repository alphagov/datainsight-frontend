require "functional/test_helper"
require "json"

describe "The narrative" do
  include StubApiFromFixtures

  it "should show the narrative on the dashboard" do
    visit "/performance/dashboard/government"

    page.status_code.should == 200
    page.find("#narrative").text.should == "Inside Government had 124k visitors last week, a decrease of 7% from the week before"
  end
end
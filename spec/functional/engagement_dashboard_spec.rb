require_relative "test_helper"

describe "Engagement Dashboard" do
  it "should show the narrative" do
    Capybara.app = App.new
    visit "/narrative"
    # d3.js should insert an svg element
    # strange xpath syntax is used to get around fact that svg elements are not visible to xpath normally.
    # see: http://stackoverflow.com/questions/5433825/having-trouble-using-capybara-and-selenium-to-find-an-svg-tag-on-a-page
    page.should have_css("#narrative")
  end

  it "should NOT show the narrative if it is empty" do
    Capybara.app = StubApp.new(ClientAPIStubFromMap.new({:narrative => ""}))
    visit "/narrative"
    page.should_not have_css("#narrative")
  end

  it "should NOT show the narrative if there was an error" do
    Capybara.app = StubApp.new(ClientAPIStubFromMap.new({:narrative => ""}))
    visit "/narrative"
    page.should_not have_css("#narrative")
  end
end

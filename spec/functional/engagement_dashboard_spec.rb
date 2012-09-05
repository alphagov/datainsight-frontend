require_relative "test_helper"

describe "Engagement Dashboard" do
  include CommonSetup

  it "should show the narrative" do
    visit "/narrative"
    # d3.js should insert an svg element
    # strange xpath syntax is used to get around fact that svg elements are not visible to xpath normally.
    # see: http://stackoverflow.com/questions/5433825/having-trouble-using-capybara-and-selenium-to-find-an-svg-tag-on-a-page
    page.should have_css("#narrative")
  end
end
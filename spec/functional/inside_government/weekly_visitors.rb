require "functional/test_helper"

describe "Inside Gov Weekly Visitors graph" do
  include StubApiFromFixtures

  describe "svg rendering" do
    it "should be visible" do
      visit "/performance/dashboard/government"
      wait_until do
        all("#inside-gov-weekly-visitors *[name()='svg'").count == 1
      end

      page.find("#inside-gov-weekly-visitors *[name()='svg'").visible?.should be_true
    end
  end
end
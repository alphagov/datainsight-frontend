require "functional/test_helper"

describe "Inside Gov Format success graph" do
  include StubApiFromFixtures

  describe "svg rendering" do
    it "should be visible" do
      visit "/performance/dashboard/government"
      wait_until do
        all("#inside-gov-format-success *[name()='svg']").count == 1
      end

      page.find("#inside-gov-format-success *[name()='svg']").visible?.should be_true
    end

  end
end
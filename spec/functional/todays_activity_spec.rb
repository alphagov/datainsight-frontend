require_relative "test_helper"

describe "Today's Activity Graph" do
  include CommonSetup

  describe "hover" do
    it "should show callout box on mouseover" do
      page = DashboardPage.new.visit
      graph = page.todays_activity_graph
      graph.columns.first.hover_over

      page.get_callout_boxes.should_not be_empty
    end
  end
end

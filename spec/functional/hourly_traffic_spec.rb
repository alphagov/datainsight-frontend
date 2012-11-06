require_relative "test_helper"

describe "Hourly traffic Graph" do
  include CommonSetup

  describe "hover" do
    it "should show callout box on mouseover" do
      page = DashboardPage.new.visit
      graph = page.hourly_traffic_graph
      graph.columns.first.hover_over

      page.get_callout_boxes.should_not be_empty
      page.get_callout_boxes.should have(1).callout_box
    end
  end
end

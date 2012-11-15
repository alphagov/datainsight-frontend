require_relative "test_helper"

describe "Hourly traffic Graph" do
  include CommonSetup

  describe "hover" do
    pending "until timeout issue on Jenkins is fixed" do
      it "should show callout box on mouseover" do
        page = DashboardPage.new.visit
        graph = page.hourly_traffic_graph
        graph.columns.first.trigger(:mouseover)

        page.wait_for_callout_box
        page.get_callout_boxes.should have(1).callout_box
      end

      it "should show ONLY one callout box on mouseover" do
        page = DashboardPage.new.visit
        graph = page.hourly_traffic_graph
        graph.columns.first.trigger(:mouseover)
        graph.columns.first.trigger(:mouseout)
        graph.columns.second.trigger(:mouseover)

        page.wait_for_callout_box
        page.get_callout_boxes.should have(1).callout_box
      end

      it "should hide callout box on mouseout" do
        page = DashboardPage.new.visit
        graph = page.hourly_traffic_graph
        graph.columns.first.trigger(:mouseover)
        graph.columns.first.trigger(:mouseout)

        page.wait_for_no_callout_box
      end
    end
  end
end

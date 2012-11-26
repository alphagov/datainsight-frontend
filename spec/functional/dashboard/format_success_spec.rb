require "functional/test_helper"

describe "Format success graph" do
  include StubApiFromFixtures

  describe "hover" do
    it "should show callout box when hovering over a circle" do
      page = DashboardPage.new.visit
      graph = page.format_success_graph
      graph.circles.first.trigger(:mouseover)

      page.wait_for_callout_box
      page.get_callout_boxes.should have(1).callout_box
    end

    it "should always show ONLY one callout box" do
      page = DashboardPage.new.visit
      graph = page.format_success_graph
      first = graph.circles.first
      second = graph.circles.second

      first.trigger(:mouseover)
      first.trigger(:mouseout)
      second.trigger(:mouseover)

      page.wait_for_callout_box
      page.get_callout_boxes.should have(1).callout_box

    end

    it "should hide callout box on mouseout" do
      page = DashboardPage.new.visit
      graph = page.format_success_graph
      a_circle = graph.circles.first

      a_circle.trigger(:mouseover)
      a_circle.trigger(:mouseout)

      page.wait_for_no_callout_box
    end

    it "should show callout box when mousein happens soon after mouseout" do
      page = DashboardPage.new.visit
      graph = page.format_success_graph
      a_circle = graph.circles.first

      a_circle.trigger(:mouseover)
      page.wait_for_callout_box
      a_circle.trigger(:mouseout)
      a_circle.trigger(:mouseover)

      sleep(0.3)
      page.wait_for_callout_box
      page.get_callout_boxes.should have(1).callout_box
    end
  end
end
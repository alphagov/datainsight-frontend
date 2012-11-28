require_relative "../spec_helper"

describe DashboardHelper do
  describe "render_date" do
    it "should render a date" do
      helper.render_date(Date.new(2012, 10, 10)).should == "10 October 2012"
    end

    it "should render yesterday's date as 'yesterday'" do
      helper.render_date(Date.yesterday).should == "yesterday"
    end

    it "should render yesterday's time as 'yesterday'" do
      yesterday = Time.now - (60 * 60 * 24)
      helper.render_date(yesterday).should == "yesterday"
    end

    it "should render today's time as 'today'" do
      helper.render_date(Time.now).should == "today"
    end

    it "should render nil as an empty string" do
      helper.render_date(nil).should == ""
    end
  end
end
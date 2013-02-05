require "functional/test_helper"

describe "Inside Government Annotations" do
  before do
    FakeWeb.register_uri(
        :get,
        "#{find_api_url('inside_government_base_url')}/visitors/weekly?limit=25",
        :body => JsonBuilder.inside_gov_weekly_visitors(start_date: "2012-12-02", end_date: "2013-01-19").to_json
    )
  end

  it "should serve up the annotations json" do
    visit "/performance/dashboard/government/annotations"
    page.status_code.should == 200
  end

  it "should render table of annotations" do
    visit "/performance/dashboard/government"

    page.should have_selector("#inside-gov-annotations")
  end

  it "should hide annotations table by default" do
    visit "/performance/dashboard/government"

    page.find("#inside-gov-annotations").should_not be_visible
  end

  it "should populate table correctly" do
    visit "/performance/dashboard/government"

    # will be invisible because of SVG support
    page.execute_script("$('#inside-gov-annotations').show()")

    annotations = page.all("#inside-gov-annotations tbody tr").map do |tr|
      {
          date: tr.find("td:nth-child(1)"),
          comment: tr.find("td:nth-child(2)"),
      }
    end

    annotations.first[:date].should have_content "12 December 2012"
    annotations.first[:comment].should have_link "this is the first comment", href: "bar"

    annotations.second[:date].should have_content "13 December 2012"
    annotations.second[:comment].should have_link "this is the second comment", href: "foobar"

  end
end
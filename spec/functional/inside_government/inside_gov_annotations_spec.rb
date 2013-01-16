require "functional/test_helper"

describe "Inside Government Annotations" do
  it "should serve up the annotations json" do
    visit "/performance/dashboard/government/annotations"
    page.status_code.should == 200
  end

  it "should render table of annotations" do
    visit "/performance/dashboard/government"

    page.should have_selector("#inside-gov-annotations table")
  end

  it "should populate table correctly" do
    visit "/performance/dashboard/government"

    # will be invisible because of SVG support
    page.execute_script("$('#inside-gov-annotations').show()")

    comments = page.all("#inside-gov-annotations table tbody td:nth-child(2)").map(&:text)
    dates = page.all("#inside-gov-annotations table tbody td:nth-child(1)").map(&:text)
    links = page.all("#inside-gov-annotations table tbody td:nth-child(2) a").map{|link| link["href"]}

    comments[0].should  include("this is the first comment")
    dates[0].should == "12 December 2012"
    links[0].should == "bar"

    comments[1].should include("this is the second comment")
    dates[1].should == "13 December 2012"
    links[1].should == "foobar"
  end
end
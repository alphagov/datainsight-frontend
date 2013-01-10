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
    pending "Design for the table is needed"
    visit "/performance/dashboard/government"

    # will be invisible because of SVG support
    page.execute_script("$('#inside-gov-annotations').show()")

    comments = page.find("#inside-gov-annotations table tbody").all(".comment_col").map(&:text)
    dates = page.find("#inside-gov-annotations table tbody").all(".date_col").map(&:text)
    links = page.find("#inside-gov-annotations table tbody").all(".comment_col a").map{|link| link["href"]}

    pp comments[0]
    comments[0].should  include("this is the first comment")
    dates[0].should == "12/12/12"
    links[0].should == "bar"

    comments[1].should include("this is the second comment")
    dates[1].should == "13/12/12"
    links[1].should == "foobar"
  end
end
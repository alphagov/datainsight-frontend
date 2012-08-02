require_relative "../test_helper"
require "helpers"

describe "Time" do

  it "should calculate correct suffix for 1st" do
    date_with_1 = Time.new(2011,2,1, 0,0,0, "+00:00")
    suffix = date_with_1.day_ordinal_suffix
    suffix.should == "st"
  end

  it "should calculate correct suffix for 2nd" do
    date_with_2 = Time.new(2011,2,2, 0,0,0, "+00:00")
    suffix = date_with_2.day_ordinal_suffix
    suffix.should == "nd"
  end

  it "should calculate correct suffix for 3rd" do
    date_with_3 = Time.new(2011,2,3, 0,0,0, "+00:00")
    suffix = date_with_3.day_ordinal_suffix
    suffix.should == "rd"
  end

  it "should calculate correct suffix for 14th" do
    date_with_14 = Time.new(2011,2,14, 0,0,0, "+00:00")
    suffix = date_with_14.day_ordinal_suffix
    suffix.should == "th"
  end

  it "should calculate correct suffix for 11th" do
    date_with_11 = Time.new(2011,2,11, 0,0,0, "+00:00")
    suffix = date_with_11.day_ordinal_suffix
    suffix.should == "th"
  end

  it "should calculate correct suffix for 12th" do
    date_with_12 = Time.new(2011,2,12, 0,0,0, "+00:00")
    suffix = date_with_12.day_ordinal_suffix
    suffix.should == "th"
  end

end

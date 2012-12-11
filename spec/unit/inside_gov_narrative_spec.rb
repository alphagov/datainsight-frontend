require_relative "../spec_helper"

describe InsideGovNarrative do
  def build_narrative(data)
    visitors = JSON.parse(File.read("spec/fixtures/inside-government-visitors-weekly.json"))
    visitors['details']['data'][-2]['value'] = data[:week_before]
    visitors['details']['data'][-1]['value'] = data[:last_week]
    visitors
  end

  it "should create a narrative from weekly visitors" do
    narrative = InsideGovNarrative.new(build_narrative(week_before:3945072, last_week:3505337))
    narrative.content.should == 'Inside Government had 3.5 million visitors last week, <red>a decrease of 11%</red> from the week before'
  end

  it "should mark up the content correctly for a percentage increase" do
    narrative = InsideGovNarrative.new(build_narrative(week_before:3000000, last_week:3300000))
    narrative.content.should == "Inside Government had 3.3 million visitors last week, <green>an increase of 10%</green> from the week before"
  end

  it "should not mark up the content when the increase is less than 1%" do
    narrative_for_increase_below_1 = InsideGovNarrative.new(build_narrative(week_before:3000000, last_week:3014900))
    narrative_for_increase_below_1.content.should == "Inside Government had 3 million visitors last week, about the same as the week before"
  end

  it "should not mark up the content when the decrease is less than 1%" do
    narrative_for_decrease_below_1 = InsideGovNarrative.new(build_narrative(week_before:3000000, last_week:2985001))
    narrative_for_decrease_below_1.content.should == "Inside Government had 3 million visitors last week, about the same as the week before"
  end

  it "should be empty when data is nil" do
    narrative = InsideGovNarrative.new(nil)
    narrative.content.should == ""
  end

  it "should be empty when data is empty" do
    narrative = InsideGovNarrative.new({})
    narrative.content.should == ""
  end

  it "should be empty when data does not contain expected properties" do
    narrative = InsideGovNarrative.new({"unexpected_property" => "a_value"})
    narrative.content.should == ""
  end

end
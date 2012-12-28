require "spec_helper"

describe Policy do
  before(:each) do
    @policy_data = {
      title: "A title",
      organisations: [{"abbreviation" => "ABC", "name" => "The a b c"}],
      updated_at: "2012-11-25T16:00:07+00:00",
      web_url: "http://foo-bar"
    }
    @policy = Policy.new(@policy_data)
  end

  it "should expose the policy title" do
    @policy.title.should == "A title"
  end

  it "should expose the first organisation abbreviation as the department" do
    @policy.department.should == "ABC"
  end

  it "should expose the updated_at as a Date" do
    @policy.update_date.should == Date.new(2012, 11, 25)
  end

  it "should expose the url" do
    @policy.url.should == "http://foo-bar"
  end

  it "should return an empty string for the department if it is invalid" do
    @policy_data[:organisations] = "invalid"
    @policy = Policy.new(@policy_data)

    @policy.department.should == ""
  end

end
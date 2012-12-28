require "spec_helper"

describe PolicyEntries do

  it "should build a list of policy entries from json data" do
    policy = {
      "policy" => {
        "title" => "a policy",
        "organisations" => [{"abbreviation" => "ABC", "name" => "The A B C"}],
        "updated_at" => "2012-11-25T16:00:07+00:00",
        "web_url" => "https://www.gov.uk/most-entered-policies"
      },
      "entries" => "100"
    }
    json_data = JsonBuilder.most_entered_policies [policy]

    policy_entries_list = PolicyEntries.build(json_data)

    policy_entries_list.should have(1).element

    policy = policy_entries_list.first.policy
    policy.title.should == "a policy"
    policy.url.should == "https://www.gov.uk/most-entered-policies"
    policy.department.should == "ABC"
    policy.update_date.should == DateTime.new(2012, 11, 25)
    policy_entries_list.first.entries.should == 100
  end

  it "should build an empty list if json is nil" do
    PolicyEntries.build(nil).should have(0).element
  end

  it "should build an empty list if json is not an object" do
    PolicyEntries.build([]).should have(0).element
  end

  it "should build an empty list if json does not have a details attribute" do
    PolicyEntries.build({}).should have(0).element
  end

  it "should build an empty list if json does not have a data attribute" do
    data = {
        "details" => {}
    }
    PolicyEntries.build(data).should have(0).element
  end

  it "should build an empty list if data attribute is not an array" do
    data = {
        "details" => {
            "data" => {}
        }
    }
    PolicyEntries.build(data).should have(0).element
  end

  it "should build an empty list if data is an empty array" do
    data = {
        "details" => {
            "data" => []
        }
    }
    PolicyEntries.build(data).should have(0).element
  end
end
require "spec_helper"

describe PolicyEntries do

  it "should build a list of policy entries from json data" do
    json_data = JsonBuilder.most_entered_policies [{"policy" => { "title" => "a policy"}, "entries" => "100" }]

    policy_entries_list = PolicyEntries.build(json_data)

    policy_entries_list.should have(1).element
    policy_entries_list.first.policy.title.should == "a policy"
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
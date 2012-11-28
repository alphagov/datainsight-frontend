require "spec_helper"

describe PolicyVisits do

  it "should build a list of policy visits from json data" do
    json_data = JsonBuilder.most_visited_policies [{"policy" => { "title" => "a policy"}, "visits" => "100" }]

    policy_visits_list = PolicyVisits.build(json_data)

    policy_visits_list.should have(1).element
    policy_visits_list.first.policy.title.should == "a policy"
    policy_visits_list.first.visits.should == 100
  end


  it "should build an empty list if json is nil" do
    PolicyVisits.build(nil).should have(0).element
  end

  it "should build an empty list if json is not an object" do
    PolicyVisits.build([]).should have(0).element
  end

  it "should build an empty list if json does not have a details attribute" do
    PolicyVisits.build({}).should have(0).element
  end

  it "should build an empty list if json does not have a data attribute" do
    data = {
        "details" => {}
    }
    PolicyVisits.build(data).should have(0).element
  end

  it "should build an empty list if data attribute is not an array" do
    data = {
        "details" => {
            "data" => {}
        }
    }
    PolicyVisits.build(data).should have(0).element
  end

  it "should build an empty list if data is an empty array" do
    data = {
        "details" => {
            "data" => []
        }
    }
    PolicyVisits.build(data).should have(0).element
  end
end
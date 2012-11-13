require_relative "../test_helper"
require_relative "../../lib/number_format"

describe NumberFormat do

  it "should format human readable numbers" do
    NumberFormat.human_readable_number(1).should == "1"
    NumberFormat.human_readable_number(100).should == "100"

    NumberFormat.human_readable_number(200).should == "0.2 thousand"
    NumberFormat.human_readable_number(949).should == "0.9 thousand"
    NumberFormat.human_readable_number(950).should == "1 thousand"
    NumberFormat.human_readable_number(1_000).should == "1 thousand"
    NumberFormat.human_readable_number(1_100).should == "1.1 thousand"

    NumberFormat.human_readable_number(10_000).should == "10 thousand"
    NumberFormat.human_readable_number(10_100).should == "10 thousand"
    NumberFormat.human_readable_number(999_000).should == "999 thousand"

    NumberFormat.human_readable_number(999_500).should == "1 million"
    NumberFormat.human_readable_number(1_000_000).should == "1 million"
    NumberFormat.human_readable_number(1_100_000).should == "1.1 million"

    NumberFormat.human_readable_number(123_456_789).should == "123 million"
  end

end

RSpec::Matchers
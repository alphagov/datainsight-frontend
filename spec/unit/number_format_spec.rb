require_relative "../spec_helper"

# These tests mirror those found in spec/javascripts/graphHelperSpec.js
describe NumberFormat do

  describe "format numbers" do
    it "should display entire numbers from 0 499" do
      NumberFormat.human_readable_number(0).should == "0"
      NumberFormat.human_readable_number(1).should == "1"
      NumberFormat.human_readable_number(9).should == "9"
      NumberFormat.human_readable_number(10).should == "10"
      NumberFormat.human_readable_number(77).should == "77"
      NumberFormat.human_readable_number(100).should == "100"
      NumberFormat.human_readable_number(398).should == "398"
      NumberFormat.human_readable_number(499).should == "499"
    end

    it "should display numbers from 500 to 499499 as fractions of 1k" do
      NumberFormat.human_readable_number(500).should == "0.50k"
      NumberFormat.human_readable_number(777).should == "0.78k"
      NumberFormat.human_readable_number(994).should == "0.99k"
      NumberFormat.human_readable_number(995).should == "1.00k"
      NumberFormat.human_readable_number(996).should == "1.00k"
      NumberFormat.human_readable_number(999).should == "1.00k"
      NumberFormat.human_readable_number(1000).should == "1.00k"
      NumberFormat.human_readable_number(1005).should == "1.01k"
      NumberFormat.human_readable_number(1006).should == "1.01k"
      NumberFormat.human_readable_number(100000).should == "100k"
      NumberFormat.human_readable_number(234568).should == "235k"
      NumberFormat.human_readable_number(499499).should == "499k"
    end

    it "should display numbers from 499500 and above as fractions of 1m" do
      NumberFormat.human_readable_number(499500).should == "0.50 million"
      NumberFormat.human_readable_number(500000).should == "0.50 million"
      NumberFormat.human_readable_number(777777).should == "0.78 million"
      NumberFormat.human_readable_number(994999).should == "0.99 million"
      NumberFormat.human_readable_number(995000).should == "1.00 million"
      NumberFormat.human_readable_number(995001).should == "1.00 million"
      NumberFormat.human_readable_number(999900).should == "1.00 million"
      NumberFormat.human_readable_number(1000000).should == "1.00 million"
      NumberFormat.human_readable_number(1005000).should == "1.01 million"
      NumberFormat.human_readable_number(1005001).should == "1.01 million"
      NumberFormat.human_readable_number(100000000).should == "100 million"
      NumberFormat.human_readable_number(234568234).should == "235 million"
      NumberFormat.human_readable_number(499499999).should == "499 million"
    end

    describe "generative tests" do
      it "should correctly format numbers in the range 0-20" do
        (0...20).each do |number|
          NumberFormat.human_readable_number(number).should == number.to_s
        end
      end

      it "should correctly format numbers in the range 500-600" do
        (500...600).each do |number|
          expected = "0.#{(number.to_f / 10).round}k"
          NumberFormat.human_readable_number(number).should == expected
        end
      end

      it "should correctly format numbers in the range 980-995" do
        (980...995).each do |number|
          expected = "0.#{(number.to_f / 10).round}k"
          NumberFormat.human_readable_number(number).should == expected
        end
      end

      it "should correctly format numbers in the range 995-1000" do
        (995...1000).each do |number|
          expected = "1.#{(number.to_f / 10).round - 100}"
          if expected.length < 4
            expected += "0"
          end
          expected += "k"
          NumberFormat.human_readable_number(number).should == expected
        end
      end

      it "should correctly format numbers in the range 1000-1100" do
        (1000...1100).each do |number|
          expected = "#{sprintf("%.2f", (number.to_f / 10).round.to_f / 100)}k"
          NumberFormat.human_readable_number(number).should == expected
        end
      end

      it "should correctly format numbers in the range 9400-10000" do
        (9400...10000).step(10).each do |number|
          expected = (number.to_f / 10).round.to_f / 100
          expected = "#{sprintf("%.#{expected >= 10 ? 1 : 2}f", expected)}k"
          NumberFormat.human_readable_number(number).should == expected
        end
      end

      it "should correctly format numbers in the range 50450-50500" do
        (50450...50500).step(10).each do |number|
          expected = "#{sprintf("%.1f", (number.to_f / 10).round.to_f / 100)}k"
          NumberFormat.human_readable_number(number).should == expected
        end
      end

      it "should correctly format numbers in the range 700000-800000" do
        (700000...800000).step(100).each do |number|
          expected = "#{sprintf("%.2f", (number.to_f / 10000).round.to_f / 100)} million"
          NumberFormat.human_readable_number(number).should == expected
        end
      end

      it "should correctly format numbers in the range 999999-1999999" do
        (999999...1999999).step(1000).each do |number|
          expected = "#{sprintf("%.2f", (number.to_f / 10000).round.to_f / 100)} million"
          NumberFormat.human_readable_number(number).should == expected
        end
      end
    end
  end

  it "should format human readable numbers with short suffix" do
    NumberFormat.short_human_readable_number(1).should == "1"
    NumberFormat.short_human_readable_number(1_000).should == "1.00k"
    NumberFormat.short_human_readable_number(1_000_000).should == "1.00m"
  end
end

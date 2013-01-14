RSpec::Matchers.define :represent_a_valid do |expected|
  match do |actual|
    begin
      expected.parse(actual)
    rescue
      false
    end
  end
end

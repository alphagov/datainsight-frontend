require_relative "../spec_helper"

describe "Annotation files:" do

  Dir[Rails.root.join("config/annotations/*")].each do |path|
    describe File.basename(path) do
      it "should have the expected structure" do
        json = JSON.parse(File.read(path), symbolize_names: true)
        json[:data].should be_an(Array)
        json[:data].each { |annotation|
          annotation[:date].should match /^\d{4}-\d{2}-\d{2}$/
          annotation[:date].should represent_a_valid Date
          annotation[:text].should_not be_nil
          annotation[:link].should_not be_nil
        }
        json[:updated_at].should match /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
        json[:updated_at].should represent_a_valid DateTime
      end
    end
  end

end
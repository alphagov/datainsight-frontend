require "spec_helper"

describe "Annotations" do

  it "should load annotations from filesystem" do
    annotations = Annotations.load
    annotations.should == JSON.parse(File.read(File.expand_path("../../../config/annotations/inside_government_annotations.test.json", __FILE__)))
  end

  it "should lookup annotation file using current environment" do
    stub_env "production" do
      annotations = Annotations.load
      annotations.should == JSON.parse(File.read(File.expand_path("../../../config/annotations/inside_government_annotations.production.json", __FILE__)))
    end
  end
end
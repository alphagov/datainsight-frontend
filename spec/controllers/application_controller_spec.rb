require "spec_helper"

describe ApplicationController do
  describe "serve_json" do
    controller do
      def index
        serve_json { {"foo" => "bar"} }
      end
    end

    before do
      ApplicationController.any_instance.stub(:url_for).and_return("blah")
    end

    it "should return an upstream json resource" do
      get :index

      assert_response :ok
      response.content_type.should == "application/json"
    end

    it "should contain an id field" do
      get :index

      assert_response :ok
      response.content_type.should == "application/json"
      JSON.parse(response.body)["id"].should == "blah"
    end
  end


  describe "handle upstream server failure" do
    controller do
      def index
        serve_json { raise Exception.new }
      end
    end

    it "should return 500 when api returns an error" do
      get :index

      response.status.should == 500
    end

    it "should log an error to errbit if the upstream server fails" do
      Airbrake.should_receive(:notify)

      get :index
    end
  end
end
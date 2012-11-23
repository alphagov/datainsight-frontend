require "spec_helper"

describe ApplicationController do
  describe "serve_json" do
    controller do
      def index
        serve_json_from "http://upstream-server", "/resource"
      end
    end

    it "should return an upstream json resource" do
      ClientAPI.any_instance.stub(:get_json).and_return({})

      get :index

      assert_response :ok
      response.content_type.should == "application/json"
    end


    it "should return 500 when api returns an error" do
      ClientAPI.any_instance.stub(:get_json).and_return(:error)

      get :index

      assert_response :error
    end
  end
end
require "spec_helper"

describe ApplicationController do
  describe "serve_json" do
    controller do
      def index
        serve_json { '{}' }
      end
    end

    it "should return an upstream json resource" do
      get :index

      assert_response :ok
      response.content_type.should == "application/json"
    end
  end


  describe "serve_json" do
    controller do
      def index
        serve_json { raise Exception }
      end
    end

    it "should return 500 when api returns an error" do
      ClientAPI.any_instance.stub(:get_json).and_return(:error)

      get :index

      response.status.should == 500
    end
  end
end
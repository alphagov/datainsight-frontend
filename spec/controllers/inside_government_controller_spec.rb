require "spec_helper"

describe InsideGovernmentController do

  describe "index" do

    it "should retrieve most entered policies from api" do
      client_api = double("client_api")
      client_api.should_receive(:most_entered_policies)

      ClientAPI.stub(:new).and_return(client_api)

      get :index
    end

    it "should pass nil policies to view when the upstream server fails" do
      ClientAPI.any_instance.stub(:most_entered_policies).and_raise(Songkick::Transport::UpstreamError.new "test")

      get :index

      assigns(:policies).should == nil
    end

    it "should assign annotations included in the time range of visible weekly visitors" do

      Annotations.stub(:load).and_return(AnnotationsBuilder.new
                                            .add_annotation("date" => "2013-12-15")
                                            .add_annotation("date" => "2013-01-06")
                                            .add_annotation("date" => "2013-01-23")
                                            .add_annotation("date" => "2013-02-02")
                                            .add_annotation("date" => "2013-02-15").build)

      ClientAPI.any_instance.stub(:inside_gov_weekly_visitors).and_return(JsonBuilder.inside_gov_weekly_visitors("2013-01-06", "2013-02-02"))

      get :index

      annotations2 = assigns(:annotations)

      annotations2.should have(3).annotations
      annotations2.first[:date].should == "2013-01-06"
      annotations2.second[:date].should == "2013-01-23"
      annotations2.third[:date].should == "2013-02-02"
    end
  end

end

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
      Annotations.stub(:load).and_return(AnnotationsBuilder.new.add_annotation("date" => "2013-12-15").add_annotation("date" => "2013-01-06").add_annotation("date" => "2013-01-23").add_annotation("date" => "2013-02-02").add_annotation("date" => "2013-02-15").build)

      ClientAPI.any_instance.stub(:inside_gov_weekly_visitors).and_return(JsonBuilder.inside_gov_weekly_visitors(start_date: "2013-01-06", end_date: "2013-02-02"))

      get :index

      annotations = assigns(:annotations)

      annotations.should have(3).annotations
      annotations.first[:date].should == "2013-01-06"
      annotations.second[:date].should == "2013-01-23"
      annotations.third[:date].should == "2013-02-02"
    end

    it "should assign empty annotations if load fails" do
      Annotations.stub(:load).and_raise

      ClientAPI.any_instance.stub(:inside_gov_weekly_visitors).and_return(JsonBuilder.inside_gov_weekly_visitors(start_date: "2013-01-06", end_date: "2013-02-02"))

      get :index

      assigns(:annotations).should == []
    end

    it "should assign empty annotations if retrieval of weekly visitors data fails" do
      Annotations.stub(:load).and_return(AnnotationsBuilder.new.add_annotation.build)

      ClientAPI.any_instance.stub(:inside_gov_weekly_visitors).and_raise(Songkick::Transport::UpstreamError.new(nil))

      get :index

      assigns(:annotations).should == []
    end

    it "should assign empty annotations if weekly visitors are empty" do
      Annotations.stub(:load).and_return(AnnotationsBuilder.new.add_annotation.build)

      ClientAPI.any_instance.stub(:inside_gov_weekly_visitors).and_return(JsonBuilder.inside_gov_weekly_visitors(values: []))

      get :index

      assigns(:annotations).should == []
    end

  end

  if Settings.feature_toggles[:annotations_from_backdrop]
    describe "annotations" do
      it "should redirect to backdrop URL" do
        Settings.stub(:annotation_url).and_return('http://my.annotation.target')

        get :annotations

        response.code.should eq("302")
        response.location.should eq("http://my.annotation.target")
      end
    end
  end
end

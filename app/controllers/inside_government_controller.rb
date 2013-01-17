class InsideGovernmentController < ApplicationController

  def index
    @policies = get_policies
    @narrative = get_narrative
    if Settings.feature_toggles[:inside_government_annotations]
      @annotations = get_annotations
    end
  rescue Exception => e
    logger.error(e)
    nil
  end

  def narrative
    respond_to do |format|
      format.html { @narrative = get_narrative }
      format.json { redirect_to :controller => "inside_government", :action => "visitors_weekly", :format => :json }
    end
  end

  def visitors_weekly
    respond_to do |format|
      format.json do
        serve_json do
          json = api.inside_gov_weekly_visitors
          json["id"] = url_for :controller => "inside_government", :action => "visitors_weekly", :format => :json
          json["web_url"] = url_for :controller => "inside_government", :action => "index"
          json
        end
      end
      format.png { serve_image("insidegov-weekly-visitors") }
    end
  end

  def format_success
    respond_to do |format|
      format.json do
        serve_json do
          json = api.inside_gov_format_success
          json["id"] = url_for :controller => 'inside_government', :action => 'format_success', :format => :json
          json["web_url"] = url_for :controller => 'inside_government', :action => 'index', :anchor => "format-success-module"
          json
        end
      end
      format.png { serve_image("insidegov-format-success") }
    end
  end

  def most_entered_policies
    serve_json do
      json = api.most_entered_policies
      json["id"] = url_for :controller => 'inside_government', :action => 'most_entered_policies', :format => :json
      json["web_url"] = url_for :controller => 'inside_government', :action => 'index', :anchor => "most-entered-policies-module"
      json
    end
  end

  def annotations
    serve_json do
      json = Annotations.load
      json["response_info"] = {"status" => "ok"}
      json["id"] = url_for controller: "inside_government", action: "annotations", format: :json
      json["web_url"] = url_for controller: "inside_government", action: "index"
      json
    end
  end


  private
  def get_narrative
    weekly_visitors = api.inside_gov_weekly_visitors
    InsideGovNarrative.new(weekly_visitors).content
  rescue Songkick::Transport::UpstreamError => e
    logger.error(e)
    ""
  end

  def get_annotations
    Annotations.load
  rescue Exception => e
    logger.error(e)
  end

  def get_policies
    policies_json = api.most_entered_policies
    PolicyEntries.build(policies_json)
  rescue Songkick::Transport::UpstreamError => e
    logger.error(e)
    nil
  end
end

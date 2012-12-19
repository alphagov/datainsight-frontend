class InsideGovernmentController < ApplicationController

  def index
    policies_json = api.most_entered_policies
    @policies = PolicyEntries.build(policies_json)
    @narrative = get_narrative
    @annotations = get_annotations
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
      json = get_annotations
      json["id"] = url_for controller: "inside_government", action: "annotations", format: :json
      json["web_rul"] = url_for controller: "inside_government", action: "index", anchor: "inside-gov-annotations"
      json
    end
  end



  private
  def get_narrative
    weekly_visitors = api.inside_gov_weekly_visitors
    InsideGovNarrative.new(weekly_visitors).content
  rescue Songkick::Transport::UpstreamError
    ""
  end

  def get_annotations
    JSON.parse(File.read(Rails.root.join("config", "annotations", "inside_government_annotations.#{Rails.env}.json")), symbolize_keys: true)
  rescue Exception => e
    logger.error(e)
  end
end

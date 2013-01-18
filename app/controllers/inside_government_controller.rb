class InsideGovernmentController < ApplicationController

  def index
    @policies = get_policies
    @narrative = get_narrative
    if Settings.feature_toggles[:inside_government_annotations]
      @annotations = current_annotations
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

  def current_annotations
    annotations_in_range(weekly_visitors_date_range)
  rescue Exception => e
    logger.error(e)
    []
  end

  def annotations_in_range(date_range)
    get_annotations.select { |annotation| date_range.cover? Date.parse(annotation["date"]) }
  end

  def weekly_visitors_date_range
    weekly_visitors_data = api.inside_gov_weekly_visitors
    start_date = weekly_visitors_data["details"]["data"].map { |d| Date.parse(d["start_at"]) }.min
    end_date = weekly_visitors_data["details"]["data"].map { |d| Date.parse(d["end_at"]) }.max
    (start_date..end_date)
  end

  def get_narrative
    weekly_visitors = api.inside_gov_weekly_visitors
    InsideGovNarrative.new(weekly_visitors).content
  rescue Songkick::Transport::UpstreamError => e
    logger.error(e)
    ""
  end

  def get_annotations
    Annotations.load["details"]
  end

  def get_policies
    policies_json = api.most_entered_policies
    PolicyEntries.build(policies_json)
  rescue Songkick::Transport::UpstreamError => e
    logger.error(e)
    nil
  end
end

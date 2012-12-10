class InsideGovernmentController < ApplicationController

  def index
    policies_json = api.most_entered_policies
    @policies = PolicyEntries.build(policies_json)
  rescue Exception => e
    logger.error(e)
    nil
  end

  def visitors_weekly
    serve_json do
      json = api.inside_gov_weekly_visitors
      json["id"] = url_for :controller => "inside_government", :action => "visitors_weekly", :format => :json
      json["web_url"] = url_for :controller => "inside_government", :action => "index"
      json
    end
  end

  def format_success
    serve_json do
      json = api.inside_gov_format_success
      json["id"] = url_for :controller => 'inside_government', :action => 'format_success', :format => :json
      json["web_url"] = url_for :controller => 'inside_government', :action => 'index', :anchor => "format-success-module"
      json
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

end

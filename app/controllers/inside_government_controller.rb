class InsideGovernmentController < ApplicationController

  def index
    json = api.most_visited_policies
    @policies = PolicyVisits.build(json)
  rescue Exception => e
    @policies = nil
  end

  def format_success
    serve_json do
      json = api.inside_gov_format_success
      json["id"] = url_for :controller => 'inside_government', :action => 'format_success', :format => :json
      json["web_url"] = url_for :controller => 'inside_government', :action => 'index', :anchor => "format-success-module"
      json
    end
  end

  def most_visited_policies
    serve_json do
      json = api.most_visited_policies
      json["id"] = url_for :controller => 'inside_government', :action => 'most_visited_policies', :format => :json
      json["web_url"] = url_for :controller => 'inside_government', :action => 'index', :anchor => "most-visited-policies-module"
      json
    end
  end

end

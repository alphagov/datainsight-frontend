class InsideGovernmentController < ApplicationController

  def index
    json = get_json(Settings.api_urls['inside_government_base_url'], "/most-visited-policies")
    @policies = PolicyVisits.build(json)
  end

  def format_success
    json = api(Settings.api_urls).inside_gov_format_success

    json["id"] = url_for :controller => 'inside_government', :action => 'format_success', :format => :json
    json["web_url"] = url_for :controller => 'inside_government', :action => 'index', :anchor => "format-success-module"

    render json: json
  rescue
    render status: 500, nothing: true
  end

  def most_visited_policies
    json = api(Settings.api_urls).most_visited_policies

    json["id"] = url_for :controller => 'inside_government', :action => 'most_visited_policies', :format => :json
    json["web_url"] = url_for :controller => 'inside_government', :action => 'index', :anchor => "most-visited-policies-module"

    render json: json
  rescue
    render status: 500, nothing: true
  end

end

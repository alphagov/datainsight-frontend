class InsideGovernmentController < ApplicationController

  rescue_from Songkick::Transport::UpstreamError, with: :handle_upstream_error

  def index
    json = api(Settings.api_urls).most_visited_policies
    @policies = PolicyVisits.build(json)
  end

  def format_success
    json = api(Settings.api_urls).inside_gov_format_success

    json["id"] = url_for :controller => 'inside_government', :action => 'format_success', :format => :json
    json["web_url"] = url_for :controller => 'inside_government', :action => 'index', :anchor => "format-success-module"

    render json: json
  end

  def most_visited_policies
    json = api(Settings.api_urls).most_visited_policies

    json["id"] = url_for :controller => 'inside_government', :action => 'most_visited_policies', :format => :json
    json["web_url"] = url_for :controller => 'inside_government', :action => 'index', :anchor => "most-visited-policies-module"

    render json: json
  end

  private
  def handle_upstream_error(e)
    Airbrake.notify(e)
    render status: 500, nothing: true
  end

end

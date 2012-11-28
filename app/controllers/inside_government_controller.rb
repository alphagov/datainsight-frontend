class InsideGovernmentController < ApplicationController

  def index
    json = get_json(Settings.api_urls['inside_government_base_url'], '/most-visited-policies')
    @policies = PolicyVisits.build(json)
  end

  def format_success
    serve_json_from(Settings.api_urls['inside_government_base_url'], "/format-success")
  end
  
end

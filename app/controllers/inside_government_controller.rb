class InsideGovernmentController < ApplicationController

  def index

    json = get_json(Settings.api_urls['inside_government_base_url'], '/most-visited-policies')
    data = json["details"]["data"] if json and json["details"]

    if data
      @policies = data.map {|d| [Policy.new(d["policy"].symbolize_keys), d["visits"].to_i] }
    end
  end

  def format_success
    serve_json_from(Settings.api_urls['inside_government_base_url'], "/format-success")
  end
end

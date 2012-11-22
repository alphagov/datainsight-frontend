class InsideGovernmentController < ApplicationController
  def index
  end

  def format_success
    serve_json_from(Settings.api_urls['inside_government_base_url'], "/format-success")
  end
end
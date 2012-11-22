class InsideGovernmentController < ApplicationController
  def index
  end

  def format_success
    serve_json("inside_government_format_success")
  end
end
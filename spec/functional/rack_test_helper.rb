require_relative "../spec_helper"

module Rack
  module Test
    DEFAULT_HOST = "datainsight-frontend.dev.gov.uk"
  end
end

RSpec.configure do |config|
  config.include Rack::Test::Methods

  def app
    DataInsightFrontend::Application
  end
end
require "bundler"
Bundler.require
require 'sinatra/content_for'
require_relative "helpers"
require_relative "api"

unless defined?(USE_STUB_DATA)
  USE_STUB_DATA = false
end

class App < Sinatra::Base
  helpers Sinatra::ContentFor
  helpers Insight::Helpers
  GRAPHS_IMAGES_DIR = "/var/tmp/graphs"

  configure :development do
    if USE_STUB_DATA
      include Insight::API::StubApiMethod
    else
      include Insight::API::ApiMethod
    end
  end

  configure :production do
    include Insight::API::ApiMethod
  end

  configure :test do
    include Insight::API::StubApiMethod
  end

  def api_result_to_json(result)
    result == :error ? 500 : result.to_json
  end

  get "/" do
    redirect to "/engagement"
  end

  get "/engagement" do
    @narrative = api.narrative
    @trust = api.user_trust

    erb :engagement
  end

  get "/narrative" do
    @narrative = api.narrative
    erb :narrative
  end

  get "/visits.json" do
    content_type :json
    api_result_to_json(api.weekly_visits)
  end

  get "/visits" do
    erb :visits
  end

  get "/visits.png" do
    content_type "image/png"
    send_file "#{GRAPHS_IMAGES_DIR}/visits.png"
  end

  get "/unique-visitors.json" do
    content_type :json
    api_result_to_json(api.weekly_visitors)
  end

  get "/unique-visitors" do
    erb :unique_visitors
  end

  get "/unique-visitors.png" do
    content_type "image/png"
    send_file "#{GRAPHS_IMAGES_DIR}/unique-visitors.png"
  end

  get "/trust.json" do
    content_type :json
    api.user_trust.to_json
  end

  get "/trust" do
    @trust = api.user_trust

    erb :trust
  end

  get "/todays-activity.json" do
    content_type :json
    api_result_to_json(api.todays_activity)
  end

  get "/todays-activity" do
    erb :todays_activity
  end

  get "/todays-activity.png" do
    content_type "image/png"
    send_file "#{GRAPHS_IMAGES_DIR}/todays-activity.png"
  end

  get "/yesterday-legend.png" do
    content_type "image/png"
    send_file "#{GRAPHS_IMAGES_DIR}/yesterday-legend.png"
  end
end

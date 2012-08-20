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
  include Insight::API

  configure :development do
  end

  configure :production do
  end

  configure :test do
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

  get "/unique-visitors.json" do
    content_type :json
    api_result_to_json(api.weekly_visitors)
  end

  get "/unique-visitors" do
    erb :unique_visitors
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
end

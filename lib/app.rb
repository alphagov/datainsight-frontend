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
    if api.todays_activity == :error
      500
    else
      api.weekly_visits.to_json
    end
  end

  get "/visits" do
    erb :visits
  end

  get "/unique-visitors.json" do
    content_type :json
    if api.todays_activity == :error
      500
    else
      api.weekly_visitors.to_json
    end
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
    if api.todays_activity == :error
      500
    else
      api.todays_activity.to_json
    end
  end
  get "/todays-activity" do
    erb :todays_activity
  end
end

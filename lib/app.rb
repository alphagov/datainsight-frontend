require "bundler"
Bundler.require

require 'sinatra/content_for'

require_relative "config"
require_relative "helpers"
require_relative "api"

unless defined?(USE_STUB_DATA)
  USE_STUB_DATA = false
end

class App < Sinatra::Base
  helpers Sinatra::ContentFor
  helpers Insight::Helpers
  GRAPHS_IMAGES_DIR = "/var/tmp/graphs"

  configure do
    set :public_folder, File.expand_path(File.dirname(__FILE__) + "/../public")
  end

  def api_urls
    settings.api_urls
  end

  def api_result_to_json(result)
    result == :error ? 500 : result.to_json
  end

  get "/" do
    @narrative = api(api_urls).narrative
    @trust = api(api_urls).user_trust

    erb :engagement
  end

  get "/narrative" do
    @narrative = api(api_urls).narrative
    erb :narrative
  end

  get "/visits.json" do
    content_type :json
    api_result_to_json(api(api_urls).weekly_visits)
  end

  get "/visits" do
    erb :visits
  end

  get "/visits.png" do
    content_type "image/png"
    headers['X-Slimmer-Skip'] = "true"
    send_file "#{GRAPHS_IMAGES_DIR}/visits.png"
  end

  get "/unique-visitors.json" do
    content_type :json
    api_result_to_json(api(api_urls).weekly_visitors)
  end

  get "/unique-visitors" do
    erb :unique_visitors
  end

  get "/unique-visitors.png" do
    content_type "image/png"
    headers['X-Slimmer-Skip'] = "true"
    send_file "#{GRAPHS_IMAGES_DIR}/unique-visitors.png"
  end

  get "/trust.json" do
    content_type :json
    api(api_urls).user_trust.to_json
  end

  get "/trust" do
    @trust = api(api_urls).user_trust

    erb :trust
  end

  get "/todays-activity.json" do
    content_type :json
    api_result_to_json(api(api_urls).todays_activity)
  end

  get "/todays-activity" do
    erb :todays_activity
  end

  get "/todays-activity.png" do
    content_type "image/png"
    headers['X-Slimmer-Skip'] = "true"
    send_file "#{GRAPHS_IMAGES_DIR}/todays-activity.png"
  end

  error do
    logger.error env['sinatra.error']

    erb :error
  end

  get "/format-success" do
    erb :format_success
  end

  get "/format-success.json" do
    content_type :json
    api_result_to_json(api(api_urls).format_success)
  end
end

require "bundler"
Bundler.require

require 'sinatra/content_for'

require_relative "../config/initializers/asset_host" if File.exists?(File.dirname(__FILE__) + '/../config/initializers/asset_host.rb')
require_relative "config"
require_relative "sprocket_env"
require_relative "helpers"
require_relative "api"

unless defined?(USE_STUB_DATA)
  USE_STUB_DATA = false
end

class App < Sinatra::Base
  helpers Padrino::Helpers
  helpers Sinatra::ContentFor
  helpers Insight::Helpers

  configure do
    set :public_folder, File.expand_path(File.dirname(__FILE__) + "/../public")
    set :uri_root, '/performance'
    if defined?(ASSET_HOST)
      set :asset_host, ASSET_HOST
    else
      set :asset_host, production? ? (Plek.current.find("cdn") + "/datainsight-frontend") : settings.uri_root
    end
    set :asset_dir, 'public/datainsight-frontend/assets'
    set :asset_path, '/assets'
    set :sprocket_env, SprocketEnvHolder.instance.environment
    set :graphs_images_dir, "/var/tmp/graphs"
    # JSON CSRF is only relevant, if you have non-public data of editing something
    # http://flask.pocoo.org/docs/security/#json-security
    set :protection, :except => :json_csrf
  end

  def api_urls
    settings.api_urls
  end

  def asset_host
    settings.asset_host
  end

  def api_result_to_json(result)
    result == :error ? 500 : result.to_json
  end

  def self.serve_graph_image(image_filename)
    get "/graphs/#{image_filename}" do
      content_type "image/png"
      headers['X-Slimmer-Skip'] = "true"
      send_file "#{settings.graphs_images_dir}/#{image_filename}"
    end
  end

  def get_narrative()
    response = api(api_urls).narrative("http://datainsight-frontend.dev.gov.uk/performance/dashboard/narrative")
    if response == :error
      ""
    else
      response["details"]["data"]["content"]
    end
  end

  get "/" do
    erb :index, :locals => {:page => 'index'}
  end

  get "/dashboard" do
    @narrative = get_narrative

    erb :engagement
  end

  get "/dashboard/narrative.json" do
    content_type :json
    api_result_to_json(api(api_urls).narrative("http://datainsight-frontend.dev.gov.uk/performance/dashboard/narrative"))
  end

  get "/dashboard/narrative" do
    @narrative = get_narrative

    erb :narrative
  end

  get "/dashboard/visits.json" do
    content_type :json
    api_result_to_json(api(api_urls).weekly_visits("http://datainsight-frontend.dev.gov.uk/performance/dashboard/visits"))
  end

  get "/dashboard/visits" do
    erb :visits
  end

  serve_graph_image "visits.png"

  get "/dashboard/unique-visitors.json" do
    content_type :json
    api_result_to_json(api(api_urls).weekly_visitors("http://datainsight-frontend.dev.gov.uk/performance/dashboard/unique-visitors"))
  end

  get "/dashboard/unique-visitors" do
    erb :unique_visitors
  end

  serve_graph_image "unique-visitors.png"

  get "/dashboard/todays-activity.json" do
    content_type :json
    api_result_to_json(api(api_urls).todays_activity(("http://datainsight-frontend.dev.gov.uk/performance/dashboard/todays-activity")))
  end

  get "/dashboard/todays-activity" do
    erb :todays_activity
  end

  serve_graph_image "todays-activity.png"

  error do
    logger.error env['sinatra.error']

    erb :error
  end

  get "/dashboard/format-success" do
    erb :format_success
  end

  serve_graph_image "format-success.png"

  get "/dashboard/format-success.json" do
    content_type :json
    api_result_to_json(api(api_urls).format_success("http://datainsight-frontend.dev.gov.uk/performance/dashboard/format-success"))
  end
end

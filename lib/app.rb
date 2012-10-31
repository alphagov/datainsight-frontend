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

  def asset_host
    settings.asset_host
  end

  def self.serve_graph_image(image_filename)
    get "/graphs/#{image_filename}" do
      content_type "image/png"
      headers['X-Slimmer-Skip'] = "true"
      send_file "#{settings.graphs_images_dir}/#{image_filename}"
    end
  end

  def self.serve_api_response(path, method)
    get "#{path}" do
      content_type :json
      request_url = "#{request.scheme}://#{request.host}#{request.path}"
      api = api(settings.api_urls)
      result = api.send(method, request_url)
      result == :error ? 500 : result.to_json
    end
  end

  def get_narrative()
    # we don't care about the id / web_url fields because it's not being published from here
    response = api(settings.api_urls).narrative("do not care")
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

  serve_api_response "/dashboard/narrative.json", :narrative

  get "/dashboard/narrative" do
    @narrative = get_narrative

    erb :narrative
  end

  serve_api_response "/dashboard/visits.json", :weekly_visits

  get "/dashboard/visits" do
    erb :visits
  end

  serve_graph_image "visits.png"
  serve_api_response "/dashboard/unique-visitors.json", :weekly_visitors

  get "/dashboard/unique-visitors" do
    erb :unique_visitors
  end

  serve_graph_image "unique-visitors.png"
  serve_api_response "/dashboard/todays-activity.json", :todays_activity

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
  serve_api_response "/dashboard/format-success.json", :format_success

end

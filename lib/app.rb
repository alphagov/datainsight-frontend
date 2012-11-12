require "bundler"
Bundler.require

require 'sinatra/content_for'

Dir.glob("#{File.dirname(__FILE__)}/../config/initializers/*.rb").each do |initializer|
  require_relative "#{initializer}"
end
require_relative "config"
require_relative "sprocket_env"
require_relative "helpers"
require_relative "api"
require_relative "narrative"

unless defined?(USE_STUB_DATA)
  USE_STUB_DATA = false
end

class App < Sinatra::Base
  use Airbrake::Rack
  enable :raise_errors

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
    get "/dashboard/#{image_filename}" do
      content_type "image/png"
      headers['X-Slimmer-Skip'] = "true"
      send_file "#{settings.graphs_images_dir}/#{image_filename}"
    end
  end

  def self.serve_api_response(path, method)
    get "#{path}" do
      content_type :json
      request_url = "#{request.scheme}://#{request.host}#{request.path}".chomp(".json")
      api = api(settings.api_urls)
      result = api.send(method, request_url)
      result == :error ? 500 : result.to_json
    end
  end

  def get_narrative()
    if (FEATURE[:show_weekly_visitors_in_narrative])
      weekly_visitors_narrative
    else
      todays_activity_narrative
    end
  end

  def weekly_visitors_narrative
    weekly_visitors = api(settings.api_urls).weekly_visitors("url is irrelevant")
    Narrative.new(weekly_visitors).content unless weekly_visitors == :error
  end

  def todays_activity_narrative
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
  serve_graph_image "visits.png"
  get "/dashboard/visits" do
    erb :visits
  end

  serve_api_response "/dashboard/unique-visitors.json", :weekly_visitors
  serve_graph_image "unique-visitors.png"
  get "/dashboard/unique-visitors" do
    erb :unique_visitors
  end

  serve_api_response "/dashboard/hourly-traffic.json", :hourly_traffic
  serve_graph_image "hourly-traffic.png"
  get "/dashboard/hourly-traffic" do
    erb :hourly_traffic
  end

  serve_api_response "/dashboard/format-success.json", :format_success
  serve_graph_image "format-success.png"
  get "/dashboard/format-success" do
    erb :format_success
  end

  error do
    logger.error env['sinatra.error']

    erb :error
  end

end

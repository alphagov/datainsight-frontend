require_relative "api"

def config_for(kind)
  YAML.load_file(File.expand_path("../../config/#{kind}.yml", __FILE__))
end

class App < Sinatra::Base
  helpers Datainsight::Logging::Helpers

  configure do
    set :api_urls, config_for(:api_urls)[ENV["RACK_ENV"]]
    enable :logging
    unless test?
      Datainsight::Logging.configure
    end
  end

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
end

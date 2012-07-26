require "bundler"
Bundler.require
#require 'sinatra/content_for'

class App < Sinatra::Base
  #helpers Sinatra::ContentFor

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
    erb :engagement
  end
end

require "bundler"
Bundler.require
require 'sinatra/content_for'

class App < Sinatra::Base
  helpers Sinatra::ContentFor

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

  get "/visits.json" do
    content_type :json
    start_date = Date.today.prev_month(6)
    #start_date = Date.new(start_date.year, start_date.month, 1)
    end_date   = Date.today
    response = {}
    response["govuk"] = (start_date..end_date).step(7).map do |date|
      {"date" => date, "visits" => 1000000 + (rand * 4000000).to_i }
    end
    response["directgov"] = (start_date..end_date).step(7).map do |date|
      {"date" => date, "visits" => 500000 + (rand * 2500000).to_i }
    end
    response["businesslink"] = (start_date..end_date).step(7).map do |date|
      {"date" => date, "visits" => 300000 + (rand * 700000).to_i }
    end
    response.to_json
  end

  get "/visits" do
    erb :visits
  end

  get "/trust" do
    erb :trust
  end
end

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

    class Maker
      def initialize(start_date, end_date)
        @start_date = start_date
        @end_date = end_date
      end

      def make(&code)
        (@start_date..@end_date).step(7).each_with_index.map do |date, i|
          {:date => date, :visits => code.call(i, date)}
        end
      end
    end
    content_type :json
    type = (params[:type] || :before).to_sym
    start_date = Date.today.prev_month(6)
    end_date   = Date.today
    maker = Maker.new(start_date, end_date)
    response = {}
    case type
    when :before
      response[:govuk] = maker.make { 500 + (rand * 1000).to_i }
      response[:directgov] = maker.make { 2000000 + (rand * 2000000).to_i }
      response[:businesslink] = maker.make { 100000 + (rand * 300000).to_i }
    when :during
      response[:govuk] = maker.make {|i| i < 26 ? 500 + (rand * 1000).to_i : 3000000 + (rand * 2000000).to_i}
      response[:directgov] = maker.make {|i| i < 26 ? 2000000 + (rand * 2000000).to_i : 0 }
      response[:businesslink] = maker.make {|i| i < 26 ? 100000 + (rand * 300000).to_i : 0}
    when :after
      response[:govuk] = maker.make { 3000000 + (rand * 2000000).to_i }
      response[:directgov] = maker.make { 0 }
      response[:businesslink] = maker.make { 0 }
    end

    response.to_json
  end

  get "/visits" do
    erb :visits
  end

  get "/trust" do
    erb :trust
  end

  get "/reach" do
    erb :reach
  end


end

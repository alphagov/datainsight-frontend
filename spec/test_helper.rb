require 'sinatra/base'
Sinatra::Base.set :environment, :test
require File.dirname(__FILE__) + "/../lib/app"
Datainsight::Logging.configure(:env => :test)
require "rspec"

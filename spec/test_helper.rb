require 'sinatra/base'
Sinatra::Base.set :environment, :test

require File.dirname(__FILE__) + "/../lib/app"
require "rspec"

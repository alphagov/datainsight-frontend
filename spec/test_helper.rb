require "rspec"
require 'sinatra/base'
require_relative "../config/feature_toggles"
Sinatra::Base.set :environment, :test

FeatureToggles.configure(:test)
require File.dirname(__FILE__) + "/../lib/app"
Datainsight::Logging.configure(:env => :test)

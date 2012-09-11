require_relative "../test_helper"

require "capybara"
require "capybara/dsl"
require "capybara/poltergeist"

require "rspec/core/shared_context"

RSpec.configure do |config|
  config.include Capybara::DSL
  Capybara.default_driver = :poltergeist
  Capybara.server do |app, port|
    require 'rack/handler/webrick'
    Rack::Handler::WEBrick.run(app, :Port => port, :AccessLog => [], :Logger => WEBrick::Log::new("log/capybara_test.log"))
  end
end

module CommonSetup
  extend RSpec::Core::SharedContext

  before(:all) do
    Capybara.app = App.new
  end
end

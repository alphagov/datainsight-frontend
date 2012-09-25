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
    Capybara.app = Rack::URLMap.new(
        {
            "/performance" => App,
            "/performance/assets" => SprocketEnvHolder.instance.environment,
        }
    )
  end
end

class ClientAPIStubFromMap
  def initialize(map)
    @map = map
  end

  def method_missing(m, *args, &block)
    @map[m.to_sym]
  end
end

class StubApp < App
  def initialize(api = Insight::API::ClientStub.new)
    super
    @api = api
  end

  def api(config)
    @api
  end
end

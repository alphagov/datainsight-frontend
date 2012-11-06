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

module SessionAware
  def get_session
    Capybara.current_session
  end
end

class DashboardPage
  include SessionAware

  def visit
    get_session.visit "/performance/dashboard"
    get_session.wait_until do
      get_session.all("*[name()='svg']").count >= 4
    end
    self
  end

  def todays_activity_graph
    TodaysActivityGraph.new
  end

  def get_callout_boxes
    get_session.wait_until do
      get_session.all(".format-success-hover").count >= 1
    end
    get_session.all(".format-success-hover")
  end
end

class TodaysActivityGraph
  include SessionAware

  def columns
    get_session.find("#reach").all(".hover-panel").map { |bar|
      Bar.new(bar)
    }
  end
end

class Bar
  include SessionAware

  def initialize(element)
    @element = element
  end

  def hover_over
    @element.trigger(:mouseover)
  end
end
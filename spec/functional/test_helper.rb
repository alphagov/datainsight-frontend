require_relative "../spec_helper"

require "slimmer/test"

require "plek"

require "capybara"
require 'capybara/rails'
require "capybara/dsl"
require "capybara/poltergeist"

require "rspec/core/shared_context"

RSpec.configure do |config|
  config.include Capybara::DSL

  Capybara.default_driver = :poltergeist
end

def find_api_url(name)
  Plek.new.find(Settings.api_urls[name])
end

module StubApiFromFixtures
  extend RSpec::Core::SharedContext

  before(:each) do
    ClientAPI.stub(:new).and_return(ClientStub.new)
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

  def hourly_traffic_graph
    HourlyTrafficGraph.new
  end

  def visits_graph
    VisitsGraph.new
  end

  def format_success_graph
    FormatSuccessGraph.new
  end

  def wait_for_callout_boxes(n)
    get_session.wait_until do
      get_session.all(".callout-box").count == n
    end
  end

  def wait_for_callout_box
    wait_for_callout_boxes(1)
  end

  def wait_for_no_callout_box
    wait_for_callout_boxes(0)
  end

  def get_callout_boxes
    get_session.all(".callout-box")
  end
end

class HourlyTrafficGraph
  include SessionAware

  def columns
    get_session.find("#reach").all(".hover-panel")
  end
end

class VisitsGraph
  include SessionAware

  def area
    get_session.find("#visits .js-graph-area")
  end
end

class FormatSuccessGraph
  include SessionAware

  def circles
    get_session.find("#format-success").all(".data-point")
  end
end
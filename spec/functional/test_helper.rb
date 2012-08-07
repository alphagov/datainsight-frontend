require_relative "../test_helper"

require "capybara"
require "capybara/dsl"
require "capybara/poltergeist"
require "capybara/webkit"

require "rspec/core/shared_context"

RSpec.configure do |config|
  config.include Capybara::DSL
  Capybara.default_driver = :poltergeist
end

module CommonSetup
  extend RSpec::Core::SharedContext

  before(:all) do
    Capybara.app = App.new
  end
end
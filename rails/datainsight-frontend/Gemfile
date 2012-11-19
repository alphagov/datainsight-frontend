source "https://rubygems.org"
source "https://gems.gemfury.com/vo6ZrmjBQu5szyywDszE/"

gem "rails", "3.2.9"

gem "datainsight_logging"
gem "slimmer"
gem "songkick-transport", :git => "git://github.com/songkick/transport.git"
gem "httparty"
gem "airbrake", "3.1.5"

group :assets do
  gem "sass-rails",   "~> 3.2.3"
  gem "uglifier", ">= 1.0.3"
end

group :router do
  gem "router-client", "3.1.0", :require => "router"
end

group :test, :development do
  gem "rspec-rails"
  gem "capybara"
  gem "eventmachine" # Ubuntu precise bugfix, needed for poltergeist, see: https://github.com/eventmachine/eventmachine/commit/9473a1b181ed1997e3156d960b2bb2783f508191
  gem "poltergeist"
  gem "ci_reporter"

  gem "jasmine"
  gem "jasmine-phantom"
end

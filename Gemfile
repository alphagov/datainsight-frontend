source "https://rubygems.org"
source "https://BnrJb6FZyzspBboNJzYZ@gem.fury.io/govuk/"

gem "rails", "3.2.13"

gem "datainsight_logging", "~> 0.0.3"
gem "slimmer", "~> 3.10.0"
gem "songkick-transport", "~> 0.1.6", :git => "git://github.com/songkick/transport.git"
gem "httparty", "~> 0.10.0"
gem "airbrake", "3.1.5"
gem "unicorn", "~> 4.4.0"
gem "whenever", "~> 0.8.0"
gem "plek", "~> 1.1.0"

group :assets do
  gem "sass-rails", "~> 3.2.3"
  gem "uglifier", "~> 1.3.0"
end

group :router do
  gem "router-client", "3.1.0", :require => "router"
end

group :test, :development do
  gem "rspec-rails", "~> 2.11.0"
  gem "capybara", "~> 1.1.3"
  # Ubuntu precise bugfix, needed for poltergeist
  #   see: https://github.com/eventmachine/eventmachine/commit/9473a1b181ed1997e3156d960b2bb2783f508191
  gem "eventmachine", "~> 1.0.0"
  gem "poltergeist", "~> 0.7.0"
  gem "ci_reporter", "~> 1.7.3"

  gem "jasmine", "~> 1.2.0"
  gem "jasmine-phantom", "~> 0.0.6"

  gem "fakeweb", "~> 1.3.0"
end

USE_STUB_DATA = ENV["USE_STUB_DATA"] || false

require "./lib/app"

# Write the access log to a file. We're not using the normal logger, as the format is different.
use Rack::CommonLogger, File.new('log/rack-access.log', 'a')

# To force Slimmer to use preview
# use(Slimmer::App, :asset_host => "http://static.preview.alphagov.co.uk") unless ENV["SLIMMER_OFF"]
# only show "info" or higher messages on STDOUT using the Basic layout
use Slimmer::App unless ENV["SLIMMER_OFF"]

run Rack::URLMap.new(
        {
            "/performance" => App,
            "/" => Sinatra.new { get('/') { redirect "/performance" } }
        }
    )
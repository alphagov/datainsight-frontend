
USE_STUB_DATA = ENV["USE_STUB_DATA"] || false

require "./lib/app"
# To force Slimmer to use preview
# use(Slimmer::App, :asset_host => "http://static.preview.alphagov.co.uk") unless ENV["SLIMMER_OFF"]
use Slimmer::App unless ENV["SLIMMER_OFF"]
run App

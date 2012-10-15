require 'rake/sprocketstask'
require_relative '../sprocket_env'

namespace :sprockets do
  Rake::SprocketsTask.new do |t|
    t.environment = SprocketEnvHolder.instance.environment
    if ENV['RACK_ENV'] == 'production'
      require 'yui/compressor'
      require 'uglifier'
      t.environment.js_compressor = Uglifier.new
      t.environment.css_compressor = YUI::CssCompressor.new
    end
    t.output = './public/datainsight-frontend/assets'
    t.assets = %w{performance.css *.png *.js}
  end
end
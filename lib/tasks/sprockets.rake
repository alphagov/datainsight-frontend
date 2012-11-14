require 'rake/sprocketstask'
require_relative '../sprocket_env'
require_relative '../../config/feature_toggles'

namespace :sprockets do

  def deployment_environment
    ENV['RACK_ENV'] || 'production'
  end

  task :init_feature_toggles do
    FeatureToggles.configure(deployment_environment)
  end

  # tasks 'assets', 'clean_assets' & 'clobber_assets'
  Rake::SprocketsTask.new do |t|
    t.environment = SprocketEnvHolder.instance.environment
    if deployment_environment == 'production'
      require 'yui/compressor'
      require 'uglifier'
      t.environment.js_compressor = Uglifier.new
      t.environment.css_compressor = YUI::CssCompressor.new
    end
    t.output = './public/datainsight-frontend/assets'
    t.assets = %w{performance.css *.png *.js}
  end

  task :assets => :init_feature_toggles
end
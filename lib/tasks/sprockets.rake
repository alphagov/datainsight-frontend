require 'rake/sprocketstask'
require_relative '../sprocket_env'

namespace :sprockets do
  Rake::SprocketsTask.new do |t|
    t.environment = SprocketEnvHolder.instance.environment
    t.output = './public/datainsight-frontend/assets'
    t.assets = %w{*.css *.png *.js}
  end
end
namespace :router do
  task :router_environment do
    Bundler.require :router, :default

    require 'logger'
    @logger = Logger.new STDOUT
    @logger.level = Logger::DEBUG

    @router = Router.new("http://router.cluster:8080/router", @logger)
  end

  task :register_application => :router_environment do
    platform = ENV['FACTER_govuk_platform']
    backend_url = "datainsight.#{platform}.alphagov.co.uk"
    @router.update_application("datainsight-web", backend_url)
  end

  task :register_routes => :router_environment do
    @router.create_route("performance", :full, "datainsight-web")
  end

  desc "Register Data Insight with the router (run this task on server in cluster)"
  task :register => [ :register_application, :register_routes ]
end

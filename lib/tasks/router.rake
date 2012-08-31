namespace :router do
  task :router_environment do
    Bundler.require :router, :default

    require 'logger'
    @logger = Logger.new STDOUT
    @logger.level = Logger::DEBUG

    @router = Router::Client.new :logger => @logger
  end

  task :register_application => :router_environment do
    platform = ENV['FACTER_govuk_platform']
    url = "datainsight-web.#{platform}.alphagov.co.uk/"
    @router.applications.update application_id: "datainsight-web", backend_url: url
  end

  task :register_routes => :router_environment do
    @router.routes.update application_id: "datainsight-web", route_type: :full,
      incoming_path: "/performance"
  end

  desc "Register Data Insight with the router (run this task on server in cluster)"
  task :register => [ :register_application, :register_routes ]
end

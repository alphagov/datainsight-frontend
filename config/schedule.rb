require File.expand_path("../schedule_conf", __FILE__)

root_path = File.expand_path(File.dirname(__FILE__) + "/../")
set :output, {
    :standard => "#{root_path}/log/cron.out.log",
    :error => "#{root_path}/log/cron.err.log"
}
job_type :ruby, "cd :path && bundle exec ruby :task :base_url :output"

every 1.hour, :at => "00:31" do
  ruby "bin/save_graphs_as_images.rb", :environment => 'production', :base_url => DATAINSIGHT_BASE_URL
end

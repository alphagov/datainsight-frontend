def cron_command
  root_path = File.expand_path(File.dirname(__FILE__) + "/../")

  "cd #{root_path} && RACK_ENV=production bundle exec ruby bin/save_graphs_as_images.rb" +
      " >> #{root_path}/log/cron.out.log 2>> #{root_path}/log/cron.err.log"
end

job_type :custom_script, ":task :port"

every 5.minutes do
  custom_script cron_command
end

job_type :custom_script, ":task :port"

every 5.minutes do
  custom_script "cd #{File.expand_path(File.dirname(__FILE__) + "/../")} && RACK_ENV=production bundle exec ruby bin/save_graphs_as_images.rb"
end

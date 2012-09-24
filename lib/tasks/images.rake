namespace :images do
  desc "Generate all images initially"
  task :generate do
    rack_env = ENV.fetch('RACK_ENV', 'development')
    root_path = File.expand_path(File.dirname(__FILE__) + "/../../")
    sh %{cd #{root_path} && RACK_ENV=#{rack_env} bundle exec bin/save_graphs_as_images.rb 3027}
  end
end
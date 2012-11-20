namespace :images do
  desc "Generate all images initially"
  task :generate do
    root_path = File.expand_path(File.dirname(__FILE__) + "/../../")
    sh %{cd #{root_path} && bundle exec bin/save_graphs_as_images.rb 3027}
  end
end
namespace :images do
  desc "Generate all images initially"
  task :generate do
    root_path = File.expand_path(File.dirname(__FILE__) + "/../../")
    base_url = ENV['BASE_URL'] || "http://datainsight-frontend.dev.gov.uk"
    sh %{cd #{root_path} && bundle exec bin/save_graphs_as_images.rb "#{base_url}"}
  end
end
namespace :test do
  desc "run all tests"
  task :all => ["spec", "jasmine:phantom:ci"]
end
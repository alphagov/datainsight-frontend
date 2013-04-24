namespace :test do
  desc "run all tests"
  task :all => ["spec", "jasmine:phantom:ci"]
end

task :default => ["test:all"]

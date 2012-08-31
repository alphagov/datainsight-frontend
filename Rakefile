require 'rubygems'
require 'rspec/core/rake_task' unless ENV["RACK_ENV"] == "production"
require 'ci/reporter/rake/rspec' unless ENV["RACK_ENV"] == "production"
load 'jasmine-phantom/tasks.rake'

Dir.glob('lib/tasks/*.rake').each { |r| import r }

task :default => :spec

unless ENV["RACK_ENV"] == "production"
  RSpec::Core::RakeTask.new do |task|
    task.pattern    = 'spec/**/*_spec.rb'
    task.rspec_opts = ["--format documentation"]
  end

  namespace :spec do
    desc "Run RSpec unit code examples"
    RSpec::Core::RakeTask.new (:unit) do |task|
      task.pattern    = "spec/unit/*_spec.rb"
      task.rspec_opts = ["--format documentation"]
    end

    desc "Run RSpec functional code examples"
    RSpec::Core::RakeTask.new(:functional)  do |task|
      task.pattern = "spec/functional/*_spec.rb"
      task.rspec_opts = ["--format documentation"]
    end
  end

  begin
    require 'jasmine'
    load 'jasmine/tasks/jasmine.rake'
  rescue LoadError
    task :jasmine do
      abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
    end
  end
end

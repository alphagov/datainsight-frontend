#! /usr/bin/env ruby
require "logger"
require "airbrake"
require_relative "../config/initializers/errbit"

LOGGER = Logger.new(STDOUT)
PORT = ARGV[0]
OUTPUT_DIR = ARGV[1] || "/var/tmp/graphs"

def save_as_image(route, output_filename, div_selector)
  url = "http://localhost:#{PORT}/#{route}"
  output_location = "#{OUTPUT_DIR}/#{output_filename}.png"
  LOGGER.info("Generating image for #{url}")
  phantomjs_bin = "/usr/local/bin/phantomjs"
  system("#{phantomjs_bin} bin/rasterize.js #{url} #{output_location} '#{div_selector}'")
  case $?.exitstatus
    when 0
      # do nothing
    when 1
      LOGGER.error("Timeout error when trying to generate an image for `#{route}`.")
      exit 1
    when 2
      LOGGER.error("Cannot save image to #{output_location}")
      exit 2
    else
      LOGGER.error("Error when trying to generate an image.")
      exit 128
  end
  LOGGER.info("Saved image to #{output_location}")
end

begin
  save_as_image("performance/dashboard", "hourly-traffic", "#hourly-traffic-module")
  save_as_image("performance/dashboard", "visits", "#visits-module")
  save_as_image("performance/dashboard", "unique-visitors", "#unique-visitors-module")
  save_as_image("performance/dashboard", "format-success", "#format-success-module")
rescue Exception => e
  Airbrake.notify(e)
  raise e
end

require 'logger'

LOGGER = Logger.new(STDOUT)
PORT = ARGV[0]
OUTPUT_DIR = ARGV[1] || "/var/tmp"

def save_as_image(route, output_filename, div_selector)
  url = "http://localhost:#{PORT}/#{route}"
  output_location = "#{OUTPUT_DIR}/#{output_filename}.png"
  LOGGER.info("Generating image for #{url}")
  `phantomjs rasterize.js #{url} #{output_location} "#{div_selector}"`
  case $?.exitstatus
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

save_as_image("todays-activity", "todays-activity", "#reach")
save_as_image("todays-activity", "yesterday-legend", "#yesterday")
save_as_image("visits", "visits", "#visits")
save_as_image("unique-visitors", "unique-visitors", "#unique-visitors")


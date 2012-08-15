require 'logger'

LOGGER = Logger.new(STDOUT)
PORT = ARGV[0]
OUTPUT_DIR = ARGV[1] || "/var/tmp"

def save_as_image(route, div_selector)
  url = "http://localhost:#{PORT}/#{route}"
  output_location = "#{OUTPUT_DIR}/#{route}.png"
  LOGGER.info("Generating image for #{url}")
  `phantomjs rasterize.js #{url} #{output_location} "#{div_selector}"`
  if $? != 0
    LOGGER.error("Timeout error when trying to generate image for `#{route}`.")
    exit 1
  end
  LOGGER.info("Saved image to #{output_location}")
end

save_as_image("todays-activity", "#reach")
save_as_image("visits", "#visits")
save_as_image("unique-visitors", "#unique-visitors")


require "mime/types"

namespace :assets do
  desc "Generate a data url for a file"
  task :data_url, :file do |t, args|
    fail "Please provide a valid file as argument" unless File.exists?(args[:file])

    type = MIME::Types.of(args[:file]).first
    content = File.read(args[:file])

    base64 = Base64.encode64(content).gsub(/\s+/, "")
    puts "data:#{type};base64,#{base64}"
  end
end
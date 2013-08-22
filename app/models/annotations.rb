require "songkick/transport"

module Annotations
  Transport = Songkick::Transport::HttParty

  def self.load
    uri = URI(Settings.annotation_url)
    Transport.new(
      uri.host,
      :user_agent => "Data Insight Web", :timeout => 5
    ).get(uri.path).data
  end

  private

  def self.annotation_filepath
    Rails.root.join("config", "annotations", "inside_government_annotations.#{Rails.env}.json")
  end

end

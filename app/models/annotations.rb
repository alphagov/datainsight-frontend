module Annotations

  def self.load
    if Settings.feature_toggles[:annotations_from_backdrop]
      uri = URI(Settings.annotation_url)
      Transport.new(
        uri.host,
        :user_agent => "Data Insight Web", :timeout => 5
      ).get(uri.path).data
    else
      JSON.parse(File.read(annotation_filepath), symbolize_keys: true)
    end
  end

  private

  def self.annotation_filepath
    Rails.root.join("config", "annotations", "inside_government_annotations.#{Rails.env}.json")
  end

end

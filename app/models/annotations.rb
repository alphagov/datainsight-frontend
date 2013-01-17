module Annotations

  def self.load
    JSON.parse(File.read(annotation_filepath), symbolize_keys: true)
  end

  private

  def self.annotation_filepath
    Rails.root.join("config", "annotations", "inside_government_annotations.#{Rails.env}.json")
  end

end

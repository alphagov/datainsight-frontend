module Settings

  def self.graphs_images_dir
    "/var/tmp/graphs"
  end

  def self.uri_root
    "/performance"
  end

  def self.platform
    ENV['FACTER_govuk_platform'] || Rails.env
  end

  def self.api_urls
    @api_urls ||= load_api_urls
  end

  def self.feature_toggles
    @feature_toggles ||= init_feature_toggles
  end

  private

  def self.init_feature_toggles
    feature_toggles = {}
    if Rails.env.development? or Rails.env.test?
      # Add feature toggles here
      # feature_toggles[:feature_name] = true
      feature_toggles[:use_tabular_numbers] = true
    end
    feature_toggles[:show_weekly_visitors_in_narrative] = true
    feature_toggles
  end

  def self.load_api_urls
    api_urls_file = File.read(Rails.root.join("config", "environments", "api_urls.yml"))
    config = YAML.load(api_urls_file)
    config[platform]
  end
end
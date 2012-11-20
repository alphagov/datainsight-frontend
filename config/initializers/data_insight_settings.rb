module DataInsightSettings

  GRAPHS_IMAGES_DIR = "/var/tmp/graphs"
  URI_ROOT = "/performance"

  def self.platform
    ENV['FACTER_govuk_platform'] || Rails.env
  end

  # Allows accessing config variables from harmony.yml like so:
  #   Harmony[:domain] => harmonyapp.com
  def self.[](key)
    unless @api_urls
      raw_config = File.read(Rails.root.join("config", "environments", "api_urls.yml"))
      @api_urls = YAML.load(raw_config)[platform]
    end
    @api_urls[key]
  end

  def self.[]=(key, value)
    @api_urls[key.to_sym] = value
  end

  def self.feature_toggles
    unless @feature_toggles
      @feature_toggles = {}
      if Rails.env.development? or Rails.env.test?
        # Add feature toggles here
        # FEATURE[:feature_name] = true
        @feature_toggles[:use_tabular_numbers] = true
      end
      @feature_toggles[:show_weekly_visitors_in_narrative] = true
    end
    @feature_toggles
  end

end
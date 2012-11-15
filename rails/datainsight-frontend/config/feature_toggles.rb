FEATURE = {}
class FeatureToggles
  def self.configure(env = ENV["RACK_ENV"])
    if env.to_sym == :development or env.to_sym == :test
      # Add feature toggles here
      # FEATURE[:feature_name] = true
      FEATURE[:use_tabular_numbers] = true
    end
    FEATURE[:show_weekly_visitors_in_narrative] = true
  end
end

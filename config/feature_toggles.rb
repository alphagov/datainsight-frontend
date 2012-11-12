FEATURE = {}
class FeatureToggles
  def self.configure(env = ENV["RACK_ENV"])
    if env.to_sym == :development or env.to_sym == :test
      FEATURE[:show_weekly_visitors_in_narrative] = true
    end
  end
end

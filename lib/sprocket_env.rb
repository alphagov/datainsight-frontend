require "singleton"
class SprocketEnvHolder
  include Singleton

  def environment
    @sprocket_env ||= create_environment
  end

  private
  def create_environment
    env = Sprockets::Environment.new
    env.append_path 'assets/images'
    env.append_path 'assets/javascripts'
    env.append_path 'assets/stylesheets'

    env
  end
end
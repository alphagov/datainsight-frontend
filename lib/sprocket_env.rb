require "singleton"
class SprocketEnvHolder
  include Singleton

  def environment
    @sprocket_env ||= create_environment
  end

  private
  def create_environment
    env = Sprockets::Environment.new
    env.append_path 'public/images'
    env.append_path 'public/javascripts'
    env.append_path 'public/stylesheets'

    env
  end
end
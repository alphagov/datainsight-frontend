class Policy
  attr_reader :title

  def initialize(properties = {})
    @title = properties[:title]
  end
end
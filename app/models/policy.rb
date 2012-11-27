class Policy
  attr_reader :title, :department, :update_date

  def initialize(properties = {})
    @title = properties[:title]
    @department = properties[:department]
    @update_date = Date.iso8601(properties[:updated_at])
  end
end
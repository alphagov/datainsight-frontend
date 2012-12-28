class Policy
  attr_reader :title, :department, :update_date, :url

  def initialize(properties = {})
    @title = properties[:title]
    @department = properties[:department] #properties[:organisations].first["abbreviation"]
    begin
      @update_date = Date.parse(properties[:updated_at])
    rescue Exception => e
      @update_date = "missing"
      logger.info e
    end
    @url = properties[:web_url]
  end
end
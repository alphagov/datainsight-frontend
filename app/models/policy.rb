class Policy
  attr_reader :title, :department, :update_date, :url

  def initialize(properties = {})
    @title = properties[:title]
    @department = get_department(properties[:organisations])
    @update_date = get_update_date(properties[:updated_at])
    @url = properties[:web_url]
  end

  private

  def get_department(organisations)
    begin
      organisations.first["abbreviation"] || ""
    rescue StandardError => e
      logger.error e
      ""
    end
  end

  def get_update_date(updated_at)
    begin
      Date.parse(updated_at)
    rescue StandardError => e
      logger.error e
      nil
    end
  end
end
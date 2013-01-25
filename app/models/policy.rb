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
      Department.new(organisations.first) if valid_organisations_list?(organisations)
    rescue StandardError => e
      logger.error e
      nil
    end
  end

  def valid_organisations_list?(organisations)
    org = organisations.first
    org["name"].present? && org["abbreviation"].present?
  end

  def get_update_date(updated_at)
    begin
      Date.parse(updated_at)
    rescue StandardError => e
      logger.error e
      nil
    end
  end

  class Department
    attr_reader :name, :abbreviation

    def initialize(properties)
      @name = properties["name"]
      @abbreviation = properties["abbreviation"]
    end
  end
end
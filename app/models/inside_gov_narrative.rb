class InsideGovNarrative < Narrative
  def initialize(weekly_visitors_data)
    super(weekly_visitors_data, "Inside Government")
  end

  def extract_values(data)
    data["details"]["data"].select {|datum|
      datum.has_key?("value")
    }.last(2).map {|datum|
      datum["value"]
    }
  end
end
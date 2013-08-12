class InsideGovNarrative < Narrative
  def site_name
    "Departments and policy content"
  end

  def extract_values(data)
    data["details"]["data"].select {|datum|
      datum.has_key?("value")
    }.last(2).map {|datum|
      datum["value"]
    }
  end
end
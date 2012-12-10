class GovukNarrative < Narrative
  def site_name
    "GOV.UK"
  end

  def extract_values(data)
    data["details"]["data"].select {|datum|
      datum.has_key?("value") && datum["value"].has_key?("govuk")
    }.last(2).map {|datum|
      datum["value"]["govuk"]
    }
  end
end
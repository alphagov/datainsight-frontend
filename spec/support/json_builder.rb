class JsonBuilder

  def self.most_entered_policies(overrides)
    policy_entries_entity = {
        "response_info" => {
            "status" => "ok"
        },
        "details" => {
            "source" => ["Google Analytics", "Celebrus", "Omniture"],
            "start_at" => "2012-05-20",
            "end_at" => "2012-06-03",
            "data" => []
        },
        "updated_at" => "2012-11-26T16:00:07+00:00"
    }

    policy_defaults = {
        "policy" => {
            "title" => "Default policy title",
            "department" => "ZZZ",
            "updated_at" => "2000-01-01T12:00:00+00:00",
            "web_url" => "https://www.gov.uk/default_policy_url"
        },
        "entries" => 0
    }

    overrides.each do |policy_data|
      policy_entries_entity["details"]["data"] << policy_defaults.deep_merge(policy_data)
    end

    policy_entries_entity
  end

end
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

  def self.inside_gov_weekly_visitors(opts)

    if opts[:values]
      start_date = opts[:start_date] || Date.new(2012, 1, 1)
      data = opts[:values].each_with_index.map do |value, index|
        start_at = start_date + (index * 7)
        end_at = start_at + 6
        {"start_at" => start_at.strftime, "end_at" => end_at.strftime, "value" => value}
      end
    end

    if opts[:start_date] && opts[:end_date]
      week_start_dates = (Date.parse(opts[:start_date])..Date.parse(opts[:end_date])).step(7)
      data = week_start_dates.map do |start_at|
        end_at = start_at + 6
        {"start_at" => start_at.strftime, "end_at" => end_at.strftime, "value" => 1}
      end
    end

    {
        "details" => {
            "data" => data
        }
    }
  end

end
class JsonBuilder

  def self.most_entered_policies(overrides)
    policy_defaults = {
        "policy" => {
            "title" => "Default policy title",
            "department" => "ZZZ",
            "updated_at" => "2000-01-01T12:00:00+00:00",
            "web_url" => "https://www.gov.uk/default_policy_url"
        },
        "entries" => 0
    }

    data = overrides.map do |policy_data|
      policy_defaults.deep_merge(policy_data)
    end

    wrap_in_envelope data, "details" => {"source" => ["Google Analytics", "Celebrus", "Omniture"], "start_at" => "2012-05-20", "end_at" => "2012-06-03"}
  end

  def self.inside_gov_weekly_visitors(opts)

    if opts[:values]
      start_date = opts[:start_date] || Date.new(2012, 1, 1)
      data = opts[:values].each_with_index.map do |value, index|
        start_at = start_date + (index * 7)
        inside_gov_weekly_visitors_datum(start_at, value)
      end
    end

    if opts[:start_date] && opts[:end_date]
      week_start_dates = (Date.parse(opts[:start_date])..Date.parse(opts[:end_date])).step(7)
      data = week_start_dates.map do |start_at|
        inside_gov_weekly_visitors_datum(start_at, 1)
      end
    end

    {
        "details" => {
            "data" => data
        }
    }

    wrap_in_envelope(data)
  end

  private

  def self.inside_gov_weekly_visitors_datum(start_date, value)
    end_date = start_date + 6
    {"start_at" => start_date.strftime, "end_at" => end_date.strftime, "value" => value}
  end

  def self.wrap_in_envelope(data, overrides = {})
    envelope = {
        "response_info" => {
            "status" => "ok"
        },
        "details" => {
        },
        "updated_at" => "2012-01-01T00:00:00+00:00"
    }

    envelope.deep_merge! overrides

    envelope["details"]["data"] = data

    envelope
  end

end
require "songkick/transport"
require "plek"

Songkick::Transport.logger = Rails.logger
Transport = Songkick::Transport::HttParty

class ClientAPI
  def initialize(config)
    @api_urls = config
  end

  def narrative
    get("todays_activity_base_url", "/narrative")
  end

  def weekly_visits
    get("weekly_reach_base_url", "/weekly-visits")
  end

  def weekly_visitors
    get("weekly_reach_base_url", "/weekly-visitors")
  end

  def hourly_traffic
    get("todays_activity_base_url", "/todays-activity")
  end

  def format_success
    get("format_success_base_url", "/format-success")
  end

  def most_entered_policies
    get("inside_government_base_url", "/entries/weekly/policies")
  end

  def inside_gov_format_success
    get("inside_government_base_url", "/format-success/weekly")
  end

  def inside_gov_weekly_visitors
    get("inside_government_base_url", "/visitors/weekly?limit=25")
  end

  private
  def get(base, path)
    transport(Plek.new.find(@api_urls[base])).get(path).data
  end

  def transport(host, args={})
    Transport.new(host, :user_agent => "Data Insight Web", :timeout => args[:timeout] || 5)
  end
end

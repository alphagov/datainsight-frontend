require "songkick/transport"

Songkick::Transport.logger = Rails.logger
Transport = Songkick::Transport::HttParty

class ClientAPI
  def initialize(config)
    @api_urls = config
  end

  def narrative
    transport(@api_urls['todays_activity_base_url']).get("/narrative").data
  end

  def weekly_visits
    transport(@api_urls['weekly_reach_base_url']).get("/weekly-visits").data
  end

  def weekly_visitors
    transport(@api_urls['weekly_reach_base_url']).get("/weekly-visitors").data
  end

  def hourly_traffic
    transport(@api_urls['todays_activity_base_url']).get("/todays-activity").data
  end

  def format_success
    transport(@api_urls['format_success_base_url']).get("/format-success").data
  end

  def most_entered_policies
    transport(@api_urls['inside_government_base_url']).get("/entries/weekly/policies").data
  end

  def inside_gov_format_success
    transport(@api_urls['inside_government_base_url']).get("/format-success/weekly").data
  end

  def inside_gov_weekly_visitors
    transport(@api_urls['inside_government_base_url']).get("/visitors/weekly?limit=12").data
  end

  private
  def transport(host, args={})
    Transport.new(host, :user_agent => "Data Insight Web", :timeout => args[:timeout] || 5)
  end
end

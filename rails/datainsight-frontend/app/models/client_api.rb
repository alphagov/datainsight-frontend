require "songkick/transport"

Transport = Songkick::Transport::HttParty

class ClientAPI
  def initialize(config)
    @api_urls = config
  end

  def rewrite_urls(url, &block)
    response = block.yield.data
    response["id"] = "#{url}.json"
    response["web_url"] = url
    response
  rescue Songkick::Transport::UpstreamError => e
    logger.error(e)
    :error
  end

  def narrative(url)
    rewrite_urls(url) { transport(@api_urls['todays_activity_base_url']).get("/narrative") }
  end

  def weekly_visits(url)
    rewrite_urls(url) { transport(@api_urls['weekly_reach_base_url']).get("/weekly-visits") }
  end

  def weekly_visitors(url)
    rewrite_urls(url) { transport(@api_urls['weekly_reach_base_url']).get("/weekly-visitors") }
  end

  def hourly_traffic(url)
    rewrite_urls(url) { transport(@api_urls['todays_activity_base_url']).get("/todays-activity") }
  end

  def format_success(url)
    rewrite_urls(url) { transport(@api_urls['format_success_base_url']).get("/format-success") }
  end

  private
  def transport(host, args={})
    Transport.new(host, :user_agent => "Data Insight Web", :timeout => args[:timeout] || 5)
  end
end

require "songkick/transport"

Transport = Songkick::Transport::HttParty

class ClientAPI
  def initialize(config)
    @api_urls = config
  end

  def execute(url, &block)
    result = get_entity(block)
    return :error unless result
    add_urls!(url, result)
  end

  def add_urls!(url, entity)
    entity["id"] = "#{url}.json"
    entity["web_url"] = url
    entity
  end

  def get_entity(block)
    begin
      data = block.yield.data
    rescue Songkick::Transport::UpstreamError => e
      logger.error e.message
      logger.error e.backtrace.join("\n")
    end
    data
  end

  def get_json(url, base_url, path)
    execute(url) { transport(base_url).get(path) }
  end

  def narrative(url)
    get_json(url, @api_urls['todays_activity_base_url'], "/narrative")
  end

  def weekly_visits(url)
    get_json(url, @api_urls['weekly_reach_base_url'], "/weekly-visits")
  end

  def weekly_visitors(url)
    get_json(url, @api_urls['weekly_reach_base_url'], "/weekly-visitors")
  end

  def hourly_traffic(url)
    get_json(url, @api_urls['todays_activity_base_url'], "/todays-activity")
  end

  def format_success(url)
    get_json(url, @api_urls['format_success_base_url'], "/format-success")
  end

  private
  def transport(host, args={})
    Transport.new(host, :user_agent => "Data Insight Web", :timeout => args[:timeout] || 5)
  end
end

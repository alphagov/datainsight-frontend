class ClientStub

  def initialize(config = nil)
    @fixtures = JSON.parse(File.read(File.expand_path(File.join(Rails.root, 'spec', 'fixtures', 'client_stub.json'))))
  end

  def narrative
    fixture :narrative
  end

  def weekly_visits
    fixture :weekly_visits
  end

  def weekly_visitors
    fixture :weekly_visitors
  end

  def hourly_traffic
    fixture :hourly_traffic
  end

  def format_success
    fixture :format_success
  end

  def most_visited_policies
    fixture "most-visited-policies".to_sym
  end

  def inside_gov_format_success
    fixture "inside-government-format-success".to_sym
  end

  def inside_gov_weekly_visitors
    fixture :"inside-government-visitors-weekly"
  end

  private
  def fixture(name)
    fixture_file = File.join(File.dirname(__FILE__), "../../spec/fixtures/#{name}.json")

    JSON.parse(load_fixture(fixture_file))
  rescue JSON::ParserError => e
    raise Songkick::Transport::UpstreamError.new e.message
  end

  def load_fixture(fixture_file)
    if File.exist?(fixture_file)
      File.read(fixture_file)
    else
      ERB.new(File.read(fixture_file + ".erb")).result(binding)
    end
  end
end

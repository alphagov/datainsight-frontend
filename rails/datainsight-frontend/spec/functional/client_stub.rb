class ClientStub
  def narrative(url)
    fixture :narrative
  end

  def weekly_visits(url)
    fixture :weekly_visits
  end

  def weekly_visitors(url)
    fixture :weekly_visitors
  end

  def hourly_traffic(url)
    fixture :hourly_traffic
  end

  def format_success(url)
    fixture :format_success
  end

  private
  def fixture(name)
    fixture_file = File.join(File.dirname(__FILE__), "../fixtures/#{name}.json")

    JSON.parse(load_fixture(fixture_file))
  end

  def load_fixture(fixture_file)
    if File.exist?(fixture_file)
      File.read(fixture_file)
    else
      ERB.new(File.read(fixture_file + ".erb")).result(binding)
    end
  end
end

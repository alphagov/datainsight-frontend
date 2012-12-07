class Narrative
  attr_reader :content

  def initialize(weekly_visitors_data, site_name="GOV.UK")
    @site_name = site_name
    @content = create_content(weekly_visitors_data)
  end

  protected
  def describe_change(percentage)
    if percentage == 0
      "about the same as"
    elsif percentage > 0
      "<green>an increase of #{percentage}%</green> from"
    else
      "<red>a decrease of #{percentage.abs}%</red> from"
    end
  end

  def format_number(visitors_last_week)
    NumberFormat::human_readable_number(visitors_last_week)
  end

  def build_content(visitors_last_week, visitors_the_week_before)
    percentage = ((visitors_last_week / visitors_the_week_before - 1) * 100).round
    change = describe_change(percentage)
    "#@site_name had #{format_number(visitors_last_week)} visitors last week, #{change} the week before"
  end

  def create_content(weekly_visitors_data)
    return "" if weekly_visitors_data.nil? or weekly_visitors_data.empty?
    return "" unless weekly_visitors_data['details'] and weekly_visitors_data['details']['data']

    values = extract_values(weekly_visitors_data).reject { |datum| datum.nil? }.map(&:to_f)

    return "" if values.length < 2

    build_content(values[-1], values[-2])
  end

  def extract_values(data)
    data["details"]["data"].select {|datum|
      datum.has_key?("value") && datum["value"].has_key?("govuk")
    }.last(2).map {|datum|
      datum["value"]["govuk"]
    }
  end
end

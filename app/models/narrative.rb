require_relative "number_format"

class Narrative
  attr_reader :content

  def initialize(weekly_visitors_data)
    @content = create_content(weekly_visitors_data)
  end

  private

  def create_content(weekly_visitors_data)
    return "" if weekly_visitors_data.nil? or weekly_visitors_data.empty?
    return "" unless weekly_visitors_data['details'] and weekly_visitors_data['details']['data']

    govuk_data = weekly_visitors_data['details']['data'].select { |data| data.has_key?('value') && data['value'].has_key?('govuk') }
    return "" if govuk_data.count < 2

    visitors_the_week_before, visitors_last_week = govuk_data.last(2).map { |data| data['value']['govuk'].to_f }

    return build_content(visitors_last_week, visitors_the_week_before)
  end

  def build_content(visitors_last_week, visitors_the_week_before)
    percentage = ((visitors_last_week / visitors_the_week_before - 1) * 100).round
    change = describe_change(percentage)
    "GOV.UK had #{format_number(visitors_last_week)} visitors last week, #{change} the week before"
  end

  def format_number(visitors_last_week)
    NumberFormat::human_readable_number(visitors_last_week)
  end

  def describe_change(percentage)
    if percentage == 0
      "about the same as"
    elsif percentage > 0
      "<green>an increase of #{percentage}%</green> from"
    else
      "<red>a decrease of #{percentage.abs}%</red> from"
    end
  end
end
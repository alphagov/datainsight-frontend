class NumberFormat

  # similar function exists in helpers.js: GOVUK.Insights.formatNumericLabel
  def self.human_readable_number(number)
    threshold_for_rendering_as_millions = 999_500

    if number >= 10_000_000
      (number.to_f / 1_000_000).round.to_s + " million"
    elsif number >= threshold_for_rendering_as_millions
      (number.to_f / 1_000_000).round(1).to_s.sub(".0", "") + " million"
    elsif number >= 10_000
      (number.to_f / 1_000).round.to_s + " thousand"
    elsif number > 100
      (number.to_f / 1_000).round(1).to_s.sub(".0", "") + " thousand"
    else
      number.to_s
    end
  end
end
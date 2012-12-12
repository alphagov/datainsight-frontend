class NumberFormat

  # similar function exists in helpers.js: GOVUK.Insights.formatNumericLabel
  SUFFIXES = {
      million: " million",
      thousand: " thousand"
  }

  def self.human_readable_number(number, suffixes = SUFFIXES)
    threshold_for_rendering_as_millions = 999_500

    if number >= 10_000_000
      (number.to_f / 1_000_000).round.to_s + suffixes[:million]
    elsif number >= threshold_for_rendering_as_millions
      (number.to_f / 1_000_000).round(1).to_s.sub(".0", "") + suffixes[:million]
    elsif number >= 10_000
      (number.to_f / 1_000).round.to_s + suffixes[:thousand]
    elsif number >= 1000
      (number.to_f / 1_000).round(1).to_s.sub(".0", "") + suffixes[:thousand]
    else
      number.to_s
    end
  end

  def self.short_human_readable_number(number)
    self.human_readable_number(number, million: "m", thousand: "k")
  end
end
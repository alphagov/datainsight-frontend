require "bigdecimal"
class NumberFormat

  # a similar function exists in helpers.js: GOVUK.Insights.formatNumericLabel
  SUFFIXES = {
      million: " million",
      thousand: "k"
  }

  def self.human_readable_number(number, suffixes = SUFFIXES)
    return "0" if number == 0

    thresholds = [
      {name: :million,  value: 1_000_000},
      {name: :thousand, value: 1_000}
    ]
    rounded_number = BigDecimal.new(number.to_f, 3).to_f

    thresholds.each do |threshold|
      if rounded_number >= (threshold[:value] / 2)
        if rounded_number < threshold[:value]
          significant_figures = 2
        else
          significant_figures = 3
          number = rounded_number
        end
        number = BigDecimal.new(number.to_f, significant_figures).to_f / threshold[:value]

        if number < 10
          number = sprintf("%.2f", number)
        elsif number < 100
          number = sprintf("%.1f", number)
        else
          number = sprintf("%.0f", number)
        end
        return number + suffixes[threshold[:name]]
      end
    end
    return number.to_s
  end

  def self.short_human_readable_number(number)
    self.human_readable_number(number, million: "m", thousand: "k")
  end
end
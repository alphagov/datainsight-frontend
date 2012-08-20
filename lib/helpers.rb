require "date"

class Time
  def day_ordinal_suffix
    if day == 11 or day == 12
      return "th"
    else
      case day%10
        when 1 then return "st"
        when 2 then return "nd"
        when 3 then return "rd"
        else return "th"
      end
    end
  end
end

module Insight
  module Helpers
    def narrative(text)
      Nokogiri::XML("<narrative>#{text}</narrative>").xpath("./*").children.map { |e|
        case e.node_name
          when "red"
            "<span class='red'>#{e.text}</span>"
          when "green"
            "<span class='green'>#{e.text}</span>"
          else
            e.text
        end
      }.join
    end

    def display_todays_date
      #Current Date in format {Weekday day<th> month, 24-hour:min<am/pm>}
      date = Time.now
      date.strftime("%A %-d#{date.day_ordinal_suffix} %B, %H:%M%P")
    end

    def error_div
      '<div style="color: red">Sorry, there has been an error.</div>'
    end
  end
end
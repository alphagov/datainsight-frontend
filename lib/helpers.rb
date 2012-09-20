require "date"

class Time
  def day_ordinal_suffix
    if day == 11 or day == 12
      return "th"
    else
      case day%10
        when 1 then
          return "st"
        when 2 then
          return "nd"
        when 3 then
          return "rd"
        else
          return "th"
      end
    end
  end
end

module Insight
  module Helpers
    ROOT_PATH = "/performance"

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
      '<div class="error">Sorry, there has been an error.</div>'
    end

    def displayable(message)
      message != :error and not message.empty?
    end

    def nav_link_to text, path, options = {}
      if path == request.path_info
        options[:class] = options[:class] ? options[:class] + ' current' : 'current'
      end
      internal_link_to(text, path, options)
    end

    def internal_link_to text, path, options = {}
      link_to(text, "#{ROOT_PATH}#{path}", options)
    end
  end
end
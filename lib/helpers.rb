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

    def nav_link_to text, target, options = {}
      if request.path_info == target
        options[:class] = options[:class] ? options[:class] + ' current' : 'current'
      end
      internal_link_to(text, target, options)
    end

    def internal_link_to text, target, options={}
      link_to(text, "#{self.class.uri_root}#{target}", options)
    end
  end
end

module Padrino
  module Helpers
    module AssetTagHelpers
      def asset_path(kind, source)
        return source if source =~ /^http/
        # is_absolute = source =~ %r{^/}
        asset_folder = asset_folder_name(kind)
        source = source.to_s.gsub(/\s/, '%20')
        ignore_extension = (asset_folder.to_s == kind.to_s) # don't append an extension
        source << ".#{kind}" unless ignore_extension or source =~ /\.#{kind}/
        result_path = asset_host + asset_folder + "/" + source
        timestamp = asset_timestamp(result_path, false)
        "#{result_path}#{timestamp}"
      end
    end
  end
end

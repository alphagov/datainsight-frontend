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
  end
end
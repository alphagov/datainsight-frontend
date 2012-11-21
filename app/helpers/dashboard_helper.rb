require "date"

module DashboardHelper

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
    message != :error and not message.nil? and not message.empty?
  end

  def graph_image_tag name
    location = "#{Settings.graphs_images_dir}/#{name}.png"
    timestamp = File.exist?(location) ? "?#{File.mtime(location).to_i}" : ""
    uri = "#{Settings.uri_root}/dashboard/#{name}.png#{timestamp}"

    tag(:img, :src => uri)
  end

  def test?
    ENV["RAILS_ENV"] == 'test'
  end
end

module ApplicationHelper

  def nav_link_to(text, options)
    link_to text, options, class: (current_page?(options) ? 'current' : '')
  end

  def allow_line_break_after_slash(text)
    h(text).gsub("/", "/&#8203;").html_safe
  end

end

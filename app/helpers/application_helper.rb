
module ApplicationHelper

  def nav_link_to(text, options)
    link_to text, options, class: (current_page?(options) ? 'current' : '')
  end

end

class DashboardController < ApplicationController

  def index

  end

  def narrative
    @narrative = "<red>GOV.UK had 3.5 million visitors</red> last week, about the same as the week before"
  end

end

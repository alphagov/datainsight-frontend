class AnnotationsBuilder
  def initialize
    @annotations = []
  end

  def add_annotation(options = {})
    @annotations << {"date" => "2013-01-01", "comment" => "any text", "link" => "any link"}.merge(options)
    self
  end

  def build
    { "data" => @annotations, "updated_at" => "2013-01-09T12:00:00+00:00" }
  end
end

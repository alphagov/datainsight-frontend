class PolicyEntries
  attr_reader :policy, :entries

  def self.build(json)
    json["details"]["data"].map { |d| PolicyEntries.new( Policy.new(d["policy"].symbolize_keys), d["entries"].to_i ) }
  rescue
    []
  end

  def initialize(policy, entries)
    @policy = policy
    @entries = entries
  end
end
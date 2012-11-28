class PolicyVisits
  attr_reader :policy, :visits

  def self.build(json)
    json["details"]["data"].map { |d| PolicyVisits.new( Policy.new(d["policy"].symbolize_keys), d["visits"].to_i ) }
  rescue
    []
  end

  def initialize(policy, visits)
    @policy = policy
    @visits = visits
  end
end
require "songkick/transport"

Transport = Songkick::Transport::HttParty

module Insight
  module API
    def api()
      if USE_STUB_DATA
        ClientStub.new
      else
        ClientAPI.new
      end
    end

    class ClientAPI
      def user_trust
        {
            "govuk" => {
                "values" => [25, 60, 5, 5, 5],
                "trustLevel" => 10
            },
            "directgov" => {
                "values" => [5, 5, 5, 65, 25],
                "trustLevel" => 90
            },
            "businesslink" => {
                "values" => [33, 23, 27, 12, 5],
                "trustLevel" => 17
            }
        }
      end

      def narrative
        transport("http://localhost:8081").get("/narrative").data
      end

      def weekly_visits
        transport("http://localhost:8082").get("/weekly_visits").data
      end

      private
      def transport(host, args={})
        Transport.new(host, :user_agent => "Data Insight Web", :timeout => args[:timeout] || 5)
      end
    end

    class ClientStub
      def method_missing(method, *args, &block)
        fixture(method)
      end

      private
      def fixture(name)
        JSON.parse(
            File.open(File.join(File.dirname(__FILE__), "../spec/fixtures/#{name}.json")).read
        )
      end
    end
  end
end
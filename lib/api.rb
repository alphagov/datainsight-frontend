require "songkick/transport"

Transport = Songkick::Transport::Curb

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
      def narrative
        transport("http://localhost:8081").get("/leader").data
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
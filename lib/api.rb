require "songkick/transport"

Transport = Songkick::Transport::HttParty

module Insight
  module API

    module StubApiMethod
      def api
        @api ||= ClientStub.new
      end
    end

    module ApiMethod
      def api
        @api ||= ClientAPI.new
      end
    end

    class ClientAPI
      def user_trust
        {
            "govuk" => {
                "votes" => [25, 60, 5, 5, 5],
                "trustLevel" => 10
            },
            "directgov" => {
                "votes" => [5, 5, 5, 65, 25],
                "trustLevel" => 90
            },
            "businesslink" => {
                "votes" => [33, 23, 27, 12, 5],
                "trustLevel" => 17
            }
        }
      end

      def get_json(&block)
        begin
          block.yield.data
        rescue Songkick::Transport::UpstreamError
          :error
        end
      end

      def narrative
        result = get_json { transport("http://localhost:8081").get("/narrative") }
        result == :error ? result : result["content"]
      end

      def weekly_visits
        get_json { transport("http://localhost:8082").get("/weekly-visits") }
      end

      def weekly_visitors
        get_json { transport("http://localhost:8082").get("/weekly-visitors") }
      end

      def todays_activity
        get_json { transport("http://localhost:8083").get("/todays-activity") }
      end

      private
      def transport(host, args={})
        Transport.new(host, :user_agent => "Data Insight Web", :timeout => args[:timeout] || 5)
      end
    end

    class ClientStub

      def user_trust
        fixture :user_trust
      end

      def narrative
        fixture :narrative
      end

      def weekly_visits
        fixture :weekly_visits
      end

      def weekly_visitors
        fixture :weekly_visitors
      end

      def todays_activity
        fixture :todays_activity
      end

      private
      def fixture(name)
        fixture_file = File.join(File.dirname(__FILE__), "../spec/fixtures/#{name}.json")

        json_string = if File.exist?(fixture_file)
                        File.read(fixture_file)
                      else
                        last_sunday = Date.today - Date.today.wday
                        start_date = last_sunday << 6

                        dates = (start_date..last_sunday).to_a.reverse
                        ERB.new(File.read(fixture_file + ".erb")).result(binding)
                      end
        json = JSON.parse(json_string)
        if (name == :narrative)
          json["content"]
        else
          json
        end
      end
    end
  end
end

require "spec_helper"

describe ClientAPI do

  it "should return the response from upstream server with additional properties" do
    FakeWeb.register_uri(:get, "http://upstream-server/resource/path", body: '{"property": "value"}')

    client_api = ClientAPI.new({})

    json = client_api.get_json("http://frontend/url", "http://upstream-server", "/resource/path")

    json[:property] = "value"
    json[:id] = "http://frontend/url.json"
    json[:web_url] = "http://frontend/url"
  end

  it "should return an error token when the upstream server returns an error response" do
    FakeWeb.register_uri(:get, "http://upstream-server/resource/path", status: 404)

    client_api = ClientAPI.new({})

    resource = client_api.get_json("http://frontend/url", "http://upstream-server", "/resource/path")

    resource.should be :error
  end
end
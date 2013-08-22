# This is the hostname when on our network
DataInsightFrontend::Application.config.backdrop_url = ENV["BACKDROP_URL"] || 'http://publicapi.dev.gov.uk'
# This is the hostname that should be requested from a browser
DataInsightFrontend::Application.config.backdrop_url_external = ENV["BACKDROP_URL"] || 'http://publicapi.dev.gov.uk'

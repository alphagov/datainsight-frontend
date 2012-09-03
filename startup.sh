#!/usr/bin/env bash

set -e

PORT=3027

echo -e "Installing dependencies"
bundle install --path vendor --local

bundle exec whenever --set "port=$PORT" --update-crontab datainsight-frontend
echo -e "Starting application server"
bundle exec unicorn --port $PORT

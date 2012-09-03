#!/usr/bin/env bash

set -e

ANSI_YELLOW="\033[33m"
ANSI_RED="\033[31m"
ANSI_RESET="\033[0m"

echo -e "${ANSI_YELLOW}Installing dependencies${ANSI_RESET}"
bundle install --path vendor --local

bundle exec whenever --set "port=$PORT" --update-crontab datainsight-frontend
echo -e "${ANSI_YELLOW}Starting application server${ANSI_RESET}"
bundle exec unicorn --port $PORT

#!/usr/bin/env bash

ANSI_RED="\033[31m"
ANSI_RESET="\033[0m"

git diff-index --quiet HEAD
case $? in
  0)
    bundle package
    zip -x vendor/ruby/\* -x \*.zip -x tmp\* -x .git\* -r datainsight-web-`git log --pretty=format:'%h' -n 1` *
  ;;
  1)
    echo -e "${ANSI_RED}You have uncommitted changes${ANSI_RESET}"
  ;;
esac

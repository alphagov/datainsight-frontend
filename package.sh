#!/usr/bin/env bash

ANSI_RED="\033[31m"
ANSI_RESET="\033[0m"

git diff-index --quiet HEAD
case $? in
  0)
    bundle package
    hash=$(git log --pretty=format:'%h' -n 1)
    zip -x vendor/ruby/\* -x \*.zip -x tmp\* -x .git\* -r datainsight-web-$hash *
    echo $hash
  ;;
  1)
    echo -e "${ANSI_RED}You have uncommitted changes${ANSI_RESET}"
  ;;
esac

#!/bin/bash
set -e

bundle install --path "${HOME}/bundles/${JOB_NAME}"
# TODO: does this need to check return values?
bundle exec rake ci:setup:rspec spec --trace
bundle exec rake ci:setup:rspec jasmine:phantom:ci --trace

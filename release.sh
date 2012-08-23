#!/usr/bin/env bash

set -e

PROJECT_NAME=datainsight-web

export VERSION="$1"
if [ -z "$VERSION" ]; then
  echo "USAGE: release.sh <version-hash>"
  exit 1
fi

if [ $VERSION = '-p' ]; then
  VERSION=$(./package.sh | tail -n 1 | tr -d '\n')
fi

#HOST="deploy@datainsight"
HOST="deploy@datainsight.alphagov.co.uk"

# remove older deployments
clean_old_files() {
	DIR=$1
	OLD=$(ssh $HOST "ls -t '$DIR'" | tail -n +2)
	for file in $OLD; do echo "remove $DIR/$file"; ssh $HOST rm -rf $DIR/$file; done
}
clean_old_files /srv/$PROJECT_NAME/release
clean_old_files /srv/$PROJECT_NAME/packages

scp $PROJECT_NAME-$VERSION.zip $HOST:/srv/$PROJECT_NAME/packages
# deploy
ssh $HOST "mkdir /srv/$PROJECT_NAME/release/$VERSION; unzip -o /srv/$PROJECT_NAME/packages/$PROJECT_NAME-$VERSION.zip -d /srv/$PROJECT_NAME/release/$VERSION;"
# link
ssh $HOST "rm /srv/$PROJECT_NAME/current; ln -s /srv/$PROJECT_NAME/release/$VERSION/ /srv/$PROJECT_NAME/current;"
# restart
ssh $HOST "sudo service $PROJECT_NAME restart"

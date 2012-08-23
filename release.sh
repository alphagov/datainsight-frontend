#!/usr/bin/env bash

set -e

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
clean_old_files /srv/datainsight-web/release
clean_old_files /srv/datainsight-web/packages

scp datainsight-web-$VERSION.zip $HOST:/srv/datainsight-web/packages
# deploy
ssh $HOST "mkdir /srv/datainsight-web/release/$VERSION; unzip -o /srv/datainsight-web/packages/datainsight-web-$VERSION.zip -d /srv/datainsight-web/release/$VERSION;"
# link
ssh $HOST "rm /srv/datainsight-web/current; ln -s /srv/datainsight-web/release/$VERSION/ /srv/datainsight-web/current;"
# restart
ssh $HOST "sudo service datainsight-web restart"

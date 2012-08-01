#!/usr/bin/env bash

set -e

export VERSION="$1"
if [ -z "$VERSION" ]; then
  echo "USAGE: release.sh <version-hash>"
  exit 1
fi

#HOST="deploy@datainsight"
HOST="deploy@datainsight.alphagov.co.uk"

scp datainsight-web-$VERSION.zip $HOST:/srv/datainsight-web/packages
# deploy
ssh $HOST "mkdir /srv/datainsight-web/release/$VERSION; unzip -o /srv/datainsight-web/packages/datainsight-web-$VERSION.zip -d /srv/datainsight-web/release/$VERSION;"
# link
ssh $HOST "rm /srv/datainsight-web/current; ln -s /srv/datainsight-web/release/$VERSION/ /srv/datainsight-web/current;"
# restart
ssh $HOST "sudo service datainsight-web restart"

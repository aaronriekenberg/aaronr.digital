#!/bin/sh

DEST=/var/www/htdocs/aaronr.digital
SOURCE=/home/aaron/aaronr.digital

cd $DEST
rm -fr * .git*

cd $SOURCE
cp -r * $DEST
cp -r .git* $DEST

cd $DEST
./scripts/brotli-static.sh

#!/bin/sh

DEST=/var/www/htdocs/aaronr.digital
SOURCE=/home/aaron/aaronr.digital

cd $DEST
rm -fr *

cd $SOURCE
cp -r * $DEST

cd $DEST
./brotli-static.sh

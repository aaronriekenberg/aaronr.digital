#!/bin/sh -x

find . -name \*.gz | xargs rm -f

find . -name \*.html -o -name \*.js -o -name \*.map -o -name \*.css -o -name \*.ico | xargs gzip -k

#!/bin/sh -x

find . -name \*.gz | xargs rm -f

find . -name \*.html -o -name \*.js -o -name \*.map -o -name \*.css | xargs gzip -k

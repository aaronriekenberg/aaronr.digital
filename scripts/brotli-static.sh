#!/bin/sh -x

find . -name \*.br | xargs rm -f

#find . -name \*.html -o -name \*.js -o -name \*.map -o -name \*.css -o -name \*.ico -o -name \*.txt | xargs brotli -k

find . -name \*.html -o -name \*.js -o -name \*.map -o -name \*.css -o -name \*.ico -o -name \*.txt | awk '{printf "brotli -k %s\n", $1}' | rust-parallel

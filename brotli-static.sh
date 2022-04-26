#!/bin/sh -x

find . -name \*.br | xargs rm -f

find . -name \*.html -o -name \*.js -o -name \*.map -o -name \*.css -o -name \*.ico | xargs brotli -k

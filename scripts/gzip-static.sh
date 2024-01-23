#!/bin/bash -x

set -e

find . -name \*.gz -print0 | rust-parallel -0 rm -f

find . \( -name \*.html -o -name \*.js -o -name \*.map -o -name \*.css -o -name \*.txt -o name \*.ico \) -print0 | rust-parallel -0 gzip -k

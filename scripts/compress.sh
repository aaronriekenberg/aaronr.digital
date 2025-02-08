#!/bin/sh -x

find . -name \*.zst -print0 | xargs -0 rm -f

find . -name \*.br -print0 | xargs -0 rm -f

find . -name \*.gz -print0 | xargs -0 rm -f

find . \( -name \*.html -o -name \*.js -o -name \*.map -o -name \*.css -o -name \*.ico -o -name \*.txt \) -print0 | rust-parallel -0 zstd -k

find . \( -name \*.html -o -name \*.js -o -name \*.map -o -name \*.css -o -name \*.ico -o -name \*.txt \) -print0 | rust-parallel -0 brotli -k

find . \( -name \*.html -o -name \*.js -o -name \*.map -o -name \*.css -o -name \*.ico -o -name \*.txt \) -print0 | rust-parallel -0 gzip -k

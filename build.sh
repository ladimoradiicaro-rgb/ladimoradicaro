#!/bin/sh
# Cloudflare Pages build: publish only the public site, not repo internals
# (.claude/, plans/, scripts, source notes). Build command: sh build.sh  ·  Output: dist
set -e
rm -rf dist
mkdir -p dist
cp *.html *.css *.js robots.txt sitemap.xml llms.txt _headers dist/
cp -R assets vendor dist/
# never publish the build script itself
rm -f dist/build.sh
echo "Built dist/ with $(find dist -type f | wc -l | tr -d ' ') files"

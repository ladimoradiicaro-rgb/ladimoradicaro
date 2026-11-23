#!/bin/sh
# Pubblica il sito su Cloudflare Pages (progetto "ladimoradicaro").
set -e
cd "$(dirname "$0")"
sh build.sh
wrangler pages deploy dist --project-name ladimoradicaro --branch main --commit-dirty=true

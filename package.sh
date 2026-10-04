#!/bin/sh
# Builds the Chrome Web Store upload zip: dist/classic-watch-layout-<version>.zip
# Everything is included except development-only files listed below.
set -e
cd "$(dirname "$0")"

version=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' manifest.json)
out="dist/classic-watch-layout-$version.zip"

mkdir -p dist
rm -f "$out"
zip -rq "$out" . \
  -x '.git/*' '.gitignore' '.DS_Store' '*/.DS_Store' \
  -x 'dist/*' 'tools/*' 'store/*' 'package.sh' 'diagnose.js'

# Fail if anything the manifest references is missing from the zip.
listing=$(unzip -Z1 "$out")
for f in $(grep -oE '"[^"]+\.(js|css|html|png)"' manifest.json | tr -d '"' | sort -u); do
  echo "$listing" | grep -qx "$f" || { echo "missing from zip: $f" >&2; exit 1; }
done

echo "Built $out"
echo "$listing" | sed 's/^/  /'

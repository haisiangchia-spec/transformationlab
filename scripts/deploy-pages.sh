#!/usr/bin/env bash
# Publish only generated Vite output; preserve source branch and Pages history.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
npm run build
pages_remote=$(git remote get-url origin)
pages_temp=$(mktemp -d)
trap 'rm -rf "$pages_temp"' EXIT

git init -q -b gh-pages "$pages_temp/site"
git -C "$pages_temp/site" remote add origin "$pages_remote"
if git ls-remote --exit-code "$pages_remote" refs/heads/gh-pages > "$pages_temp/ref"; then
  git -C "$pages_temp/site" fetch -q --depth=1 origin gh-pages
  git -C "$pages_temp/site" checkout -q -B gh-pages FETCH_HEAD
else
  pages_status=$?
  if [ "$pages_status" -ne 2 ]; then
    echo 'Cannot read the remote Pages branch; publication stopped.' >&2
    exit "$pages_status"
  fi
fi
# This branch contains generated site files only. Never remove source-checkout files.
git -C "$pages_temp/site" rm -q -r --ignore-unmatch .
cp -a dist/. "$pages_temp/site/"
touch "$pages_temp/site/.nojekyll"
git -C "$pages_temp/site" add --all
if git -C "$pages_temp/site" diff --cached --quiet; then
  echo 'Pages build is already current.'
else
  pages_source=$(git rev-parse --short HEAD)
  git -C "$pages_temp/site" commit -m "Deploy School Transformation Lab from $pages_source"
  git -C "$pages_temp/site" push origin HEAD:gh-pages
fi

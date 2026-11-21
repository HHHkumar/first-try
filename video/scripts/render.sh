#!/bin/bash
# Full-resolution render of the given chapters, from a frozen copy of the bundle
# so further edits do not disturb a render in progress.
#   scripts/render.sh 1 2
mkdir -p out/final out/frozen
for n in "$@"; do
  snap=out/frozen/ch$n-$(date +%s)
  cp -r out/bundle "$snap"
  start=$(date +%s)
  npx remotion render "$snap" Chapter$n out/final/ch$n.mp4 --concurrency=4 --crf=16 2>&1 | grep -i -E "^Error|error:" 
  echo "ch$n done in $(( $(date +%s) - start )) s" >> out/final/log.txt
done

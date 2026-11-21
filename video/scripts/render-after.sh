#!/bin/bash
# Wait for a chapter to finish, then render the following ones from a given bundle.
#   scripts/render-after.sh 2 out/bundle-v1 3 4 5
wait_for=$1; bundle=$2; shift 2
until grep -q "ch$wait_for done" out/final/log.txt 2>/dev/null; do sleep 15; done
for n in "$@"; do
  start=$(date +%s)
  npx remotion render "$bundle" Chapter$n out/final/ch$n.mp4 --concurrency=4 --crf=16 2>&1 | grep -i -E "^Error|error:"
  echo "ch$n done in $(( $(date +%s) - start )) s" >> out/final/log.txt
done

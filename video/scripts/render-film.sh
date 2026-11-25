#!/bin/bash
# Full-resolution render of a film's chapters from a frozen copy of the bundle.
#   scripts/render-film.sh Charge charge 1 2 3     -> out/final/charge/ch1.mp4 ...
prefix=$1; dir=out/final/$2; shift 2
mkdir -p "$dir" out/frozen
snap=out/frozen/$prefix-$(date +%s)
cp -r out/bundle "$snap"
for n in "$@"; do
  start=$(date +%s)
  npx remotion render "$snap" "$prefix$n" "$dir/ch$n.mp4" --concurrency=4 --crf=16 2>&1 | grep -i -E "^Error|error:"
  echo "ch$n done in $(( $(date +%s) - start )) s" >> "$dir/log.txt"
done

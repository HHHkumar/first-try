#!/bin/bash
# Contact sheet of a chapter at given narration times.
#   scripts/sheet.sh Chapter2 20 3 7 11 ...   (composition, lead frames, seconds...)
comp=$1; lead=$2; shift 2
dir=out/sheets/$comp-$(date +%s); mkdir -p "$dir"
i=0; inputs=()
for t in "$@"; do
  f=$(python3 -c "print(int($lead+$t*30))")
  n=$(printf "%02d" $i)
  npx remotion still out/bundle "$comp" "$dir/$n.png" --frame=$f --scale=0.5 2>&1 | grep -i -E "^Error|not found"
  i=$((i+1))
done
ffmpeg -v error -y -framerate 1 -i "$dir/%02d.png" -vf "tile=3x$(( (i+2)/3 ))" -frames:v 1 "$dir/sheet.png"
echo "$dir/sheet.png"

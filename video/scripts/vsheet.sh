#!/bin/bash
# Contact sheet of a vertical Short at given narration seconds (lead 10 frames).
#   scripts/vsheet.sh S1 3 10 25 ...
comp=$1; shift
dir=out/sheets/$comp-$(date +%s); mkdir -p "$dir"
i=0
for t in "$@"; do
  f=$(python3 -c "print(int(10+$t*30))")
  npx remotion still out/bundle "$comp" "$dir/$(printf %02d $i).png" --frame=$f --scale=0.3 2>&1 | grep -i -E "^Error|not found"
  i=$((i+1))
done
ffmpeg -v error -y -framerate 1 -i "$dir/%02d.png" -vf "tile=${i}x1" -frames:v 1 "$dir/sheet.png"
echo "$dir/sheet.png"

#!/bin/bash
# Normalise each rendered Short to -14 LUFS and give it its upload name.
#   scripts/finish-shorts.sh 1 2 3 ...
names=(x snail-in-your-wire invisible-push two-plates compass-needle why-switches-spark light power-station socket runs-late)
out=out/final/shorts/upload; mkdir -p $out
for n in "$@"; do
  ffmpeg -v error -y -i out/final/shorts/ch$n.mp4 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p \
    -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$out/short-$n-${names[$n]}.mp4"
  echo "short $n: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out/short-$n-${names[$n]}.mp4" | cut -c1-5) s, $(du -h "$out/short-$n-${names[$n]}.mp4" | cut -f1)"
done

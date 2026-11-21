#!/bin/bash
# Wait for a chapter of a film to finish rendering, then render more of them.
#   scripts/render-film-after.sh 4 Charge charge 5 6 7 8 9
wait_for=$1; shift
until grep -q "ch$wait_for done" "out/final/$2/log.txt" 2>/dev/null; do sleep 15; done
exec scripts/render-film.sh "$@"

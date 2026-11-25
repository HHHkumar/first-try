# Inside the Wire

A ten-minute animated explainer on resistance and resistivity for beginner
electrical engineering students. Remotion drives the timeline, Three.js draws the
copper lattice and electron gas, and the narration is ElevenLabs speech with
word-level timings.

## Layout

- `../script/narration.md`: the narration script (source of the voice).
- `public/voice/`: narration audio and word timings, one pair per chapter.
- `src/world/`: the 3D wire: electron simulation (`sim.ts`), sprite renderer
  (`Sprites.tsx`) and scene (`WireWorld.tsx`).
- `src/ui/`: shared 2D pieces (chapter shell, wire tube, type, read-outs, the room).
- `src/chapters/`: one composition per chapter, plus the thumbnail.
- `scripts/`: voice generation, contact sheets, rendering and the final join.

## Commands

```bash
npm ci
npx remotion studio src/index.ts                 # preview and scrub
npx remotion bundle src/index.ts --out-dir=out/bundle
scripts/render.sh 1 2 3 4 5 6 7 8                # full-resolution chapters into out/final
node scripts/assemble.mjs                        # join, add the ambient bed, write subtitles
npx remotion still out/bundle Thumbnail out/final/thumbnail.png --scale=0.66667
```

`scripts/sheet.sh Chapter3 20 5 12 30` renders a contact sheet of a chapter at
the given narration times (the second argument is the chapter's lead-in in
frames: 36 for chapter 1, 20 for the rest).

## Voice

`node scripts/voice.mjs 3` regenerates chapter 3 from the script. It needs an
ElevenLabs key, either injected by the environment's network proxy or in
`ELEVENLABS_API_KEY`. Visual cues are written as narration times in each
chapter file (`T(12.4)`), so a re-voiced chapter needs its cues re-checked
against the new `public/voice/chN.json`.

## Rendering without a GPU

`remotion.config.ts` selects the software ANGLE backend. Everything in the 3D
scenes is drawn as shaded camera-facing quads rather than real geometry with a
bloom pass, which keeps a full render to a few hours on four CPU cores.

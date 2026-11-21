# Handoff: electrical-engineering explainer videos

For the Claude Code session taking this project over on the owner's PC. Everything you need is in this repository (`HHHkumar/first-try`, branch `ccr-8ea8d772-fjd5i1`, draft PR #1). Rendered videos are **not** in the repository; only source, narration audio, subtitles and thumbnails are.

## 1. What this project is

Animated explainer videos for absolute beginners in electrical engineering. The brief, in the owner's words: immersive graphics that convey what textbooks usually fail to convey.

- Built with Remotion 4 + React 19 + Three.js (`video/`), one composition per chapter.
- Narrated in the owner's ElevenLabs professional voice clone.
- Each film has: history of how the idea was discovered, defined and standardised; a timeline strip along the bottom; background music and sound effects; and a closing line "please like, share, and subscribe to this channel" with an end card showing `youtube.com/@electricalmcqs`.
- All pictures are generated in code. ElevenLabs is used for audio only.

## 2. Where things stand

**Delivered (Series 1, the basics):** Inside the Wire (resistance); 1 The Invisible Push (charge and field); 2 The Space Between (capacitance); 3 The Second Field (magnetism); 4 The Current That Won't Stop (inductance); 5 Two Fields, One Light (the owner chose to keep the *first* version; a 3D alternative exists as the current source in `films/fields/`); 6 The Field That Moves the World (induction).

**Series 2, Alternating Current (six videos, "Aurora" look):**

| # | Title | Film key | Comp prefix | State |
|---|---|---|---|---|
| 1 | Back and Forth: The Shape of Alternating Current | `ac1` | `A` | Delivered (11:34) |
| 2 | Out of Step: Resistors, Coils and Capacitors on AC | `ac2` | `B` | Script approved, narration generated, all nine chapters built and checked on still frames, thumbnail done. Rendered in the cloud and delivered to the owner. Subtitles and thumbnail are in `video/release/ac2/`; the video file itself is not in the repository. |
| 3 | The Turning Arrow: Phasors and Impedance | `ac3` (not yet registered) | suggest `P` | Script drafted at `script/ac-3-turning-arrow.md`, about 11½ min. **Not yet approved by the owner.** |
| 4 | Resonance | – | – | Not started |
| 5 | Power in AC, power factor | – | – | Not started |
| 6 | Three phase | – | – | Not started |

Offered to the owner but not requested: adding the subscribe ending to "The Invisible Push"; a circuit-laws bridge series; a machines-and-grid series.

## 3. How the owner likes to work

- **Process per video:** draft script → owner approves → generate voice → build → render → deliver film, thumbnail and subtitles with chapter times → present the next script. No per-chapter approval.
- **Scripts:** elaborate, with simple everyday examples and worked figures; target 12–14 minutes (recent ones ran about 11–11½ and were accepted). Plain spoken sentences, one idea each. Narration pace is about 150–158 words a minute, so estimate length from the spoken word count (exclude `**On screen**` lines and headings).
- **Visuals:** mostly 3D with showpiece "hero scenes". The owner found the old dark-blue look monotonous and chose style "A, Aurora" for the AC series: colourful, but still intricate 3D.
- **Colour code in the AC series:** voltage pink, current cyan, power gold, magnetic field mint, electric field violet, coil copper. Keep it consistent.
- **Delivery note:** always say honestly what was and was not verified. You cannot watch motion or hear audio; checking is by still frames.

## 4. Hard rules

1. **Never ask for, print or commit the ElevenLabs API key.** See section 6 for how it is supplied.
2. ElevenLabs generations cost credits. Do not regenerate narration that already exists in `video/public/voice/<film>/`. Never retry a successful generation.
3. Treat the owner's name, email and personal details as private; never send them to outside services.
4. No AI-model identifiers in commits, PR text or code comments.
5. Push only to branch `ccr-8ea8d772-fjd5i1` unless the owner says otherwise. Commit after each milestone.
6. Never run `rm` on a path built from a shell variable.
7. Scenes and images are made in code, not with ElevenLabs or stock assets.

## 5. Repository map

```
script/                     narration scripts (markdown), one per film
video/
  src/Root.tsx              registers every chapter composition and thumbnail still
  src/anim.ts               ramp, span, lerp, lerp3
  src/ui/Shell.tsx          T(seconds), LEAD=20, TAIL, chapterFrames(voiceSeconds)
  src/ui/type.tsx, hud.tsx  Meter, Big, Center, Kicker, Sub, Sym, Frac, Panel
  src/world/Stage3D.tsx     the 3D stage: instanced sprites, `orbs` and `glows` callbacks
  src/films/ac/kit.tsx      Aurora kit: AShell, AStage, ribbon, level, poles, loop, colours
  src/films/ac1/            A1–A9, AThumb
  src/films/ac2/            B1–B9, BThumb, kit.tsx (pair, power, cursor, resistor, coil,
                            capacitor, station, keys, arrow, bracket, flow, wire, Timeline)
  src/films/<older films>/  charge, capacitance, magnetism, inductance, fields, induction
  public/voice/<film>/      chN.mp3 + chN.json (word timings) per chapter
  public/audio/             bgm.mp3 and the four effects: whoosh, spark, impact, shimmer
  scripts/voice.mjs         narration generator (FILMS table maps film key → script file)
  scripts/assemble.mjs      joins chapters, mixes music and effects, writes .srt (FILMS table)
  scripts/sound/<film>.json effect cues: { chapter, t, sfx, gain }
  scripts/sheet.sh          contact sheet of stills at given narration seconds
  scripts/render-film.sh    full render of listed chapters
  release/<film>/           thumbnail.png and .srt (committed)
  out/                      bundles, sheets, final renders (git-ignored)
```

## 6. Setup on the PC

- Node 22 and ffmpeg 6 or newer on the PATH. The helper scripts are bash: on Windows use Git Bash or WSL.
- `cd video && npm install`
- Remotion downloads its own headless browser on first render. In the cloud there was no GPU; on a PC with one, try `--gl=angle` on render commands for a large speed-up, and raise `--concurrency` in `scripts/render-film.sh` to match the core count.
- **Narration:** `scripts/voice.mjs` reads `process.env.ELEVENLABS_API_KEY`. In the cloud a network proxy injected the key, so the variable was unset. On the PC the owner must set that environment variable themselves, outside the chat. Drop the `--use-env-proxy` flag unless the PC uses a proxy. The voice ID is already in the script.

## 7. Workflow commands (run from `video/`)

```bash
# 1. Register a new film in BOTH FILMS tables (scripts/voice.mjs and scripts/assemble.mjs), then:
node scripts/voice.mjs <film> <chapter>          # one chapter at a time; creates chN.mp3 + chN.json

# 2. Print sentence start times from public/voice/<film>/chN.json and build scenes against them.

# 3. Check
npx tsc --noEmit
npx remotion bundle src/index.ts --out-dir=out/bundle
scripts/sheet.sh <Comp> 20 <t1> <t2> ...         # prints the path of a contact sheet; LOOK at it

# 4. Render, assemble, share copy
scripts/render-film.sh <Prefix> <film> 1 2 3 ... # logs to out/final/<film>/log.txt
node scripts/assemble.mjs <film>                 # prints chapter start times and total length
ffmpeg -i out/final/<film>/<name>.mp4 -c:v libx264 -preset veryfast -crf 24 -c:a copy out/final/<film>/<name>-share.mp4
cp out/final/<film>/<name>.srt release/<film>/

# Thumbnail (1280x720)
npx remotion still out/bundle <Thumb> release/<film>/thumbnail.png --scale=0.66667
```

To re-render video 2 locally if ever needed: `scripts/render-film.sh B ac2 1 2 3 4 5 6 7 8 9`, then `node scripts/assemble.mjs ac2` (output name `out-of-step`), then the share copy and the srt copy.

## 8. Conventions inside a chapter file

- Every time cue is in narration seconds: `T(s)` converts to frames (20 lead frames + s × 30).
  `at(frame, t)` fades something in at t; `span(frame, T(a), T(b), fade)` shows it between a and b; `shot(frame, from, to)` cross-fades whole scenes; `keys(frame, [[t, value], …])` eases a value through keyframes.
- Chapter length: `chapterFrames(voice.duration)`. Last chapter: `T(voice.duration + 5) + TAIL`, with `<EndCard frame={frame} from={start of the subscribe sentence} />`.
- A scene describes itself by calling `add(x, y, z, size, rgb, alpha)` thousands of times; there are no meshes. `AStage` draws the `scene` twice (once mirrored in the floor). Floor is at y = −3.2. With the usual camera (`pos z ≈ 25`, `fov 34`) the visible half-width at z = 0 is about 13 units.
- 2D overlays go in the children of `AShell`: `Cap` (caption, bottom left), `Panel` + `Meter` (read-outs, top right), `Center` (formula or title cards; dim the world to about 0.3 behind them), `Timeline`.
- Do not wrap overlays that sit over a 3D world in `Scene`; its solid backdrop hides the world. Use `AbsoluteFill` or `Panel`.
- Graph convention in video 2: time runs to the right, so the wave that lags has its crest further right. Keep that in later videos.
- Each film has its own `TIMELINE` entries and passes `already` (lit before the chapter) and `events` (`[index, seconds]` lit during it).

## 9. Lessons that cost time

- Always view contact sheets before a full render. Typical faults: overlapping labels and captions, objects off-frame, field lines too faint, components too small.
- 2D labels placed over 3D objects must be positioned by eye from a sheet; projected positions are only guessed.
- After drafting by search-and-replace, remove leftover dummy expressions and unused imports before `tsc`.
- Check historical dates before putting them on screen; where a date is uncertain, word the script so it needs none.
- Measure the script's spoken word count and correct the stated length; do not guess.
- In the cloud, one background job could not exceed two hours, so films were rendered in two batches. That limit may not apply on the PC.

## 10. Next actions

1. Get the owner's decision on `script/ac-3-turning-arrow.md`. On approval: register `ac3`, generate voice, build in the Aurora look with a new chapter prefix, check, render, deliver.
2. Then draft video 4 (resonance) and continue through video 6, one script approval at a time.

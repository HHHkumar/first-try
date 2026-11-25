# Handoff: Electrical MCQs explainer videos, Shorts and Lab

For the Claude Code session taking this project over on the owner's PC. Read this whole file before doing anything.

Everything is in this repository (`HHHkumar/first-try`, branch `ccr-8ea8d772-fjd5i1`, draft PR #1): scripts, narration audio, scene code, subtitles, thumbnails, Shorts covers, upload kits and the website Lab. **Rendered video files are not in the repository.** The owner downloaded every finished video from the cloud session. To get any video file again, re-render it from source (section 8).

Last updated: 21 November 2026.

## 1. What this project is

Animated explainer videos for absolute beginners in electrical engineering, for the YouTube channel `youtube.com/@electricalmcqs` and the website `electricalmcqs.in` (an MCQ practice site for Karnataka power-sector AE/JE exams). The owner's brief: immersive graphics that convey what textbooks usually fail to convey.

- Built with Remotion 4 + React 19 + Three.js (`video/`). One composition per chapter; one composition per Short.
- Narrated in the owner's ElevenLabs professional voice clone (voice ID is in `video/scripts/voice.mjs`).
- Long films have: the history of each idea, a timeline strip, music and sound effects, and a closing "please like, share, and subscribe to this channel" with an end card.
- All pictures are generated in code. ElevenLabs is used for audio only.
- The videos are getting good traction, according to the owner.

## 2. Where things stand

### Long-form films (16:9, all delivered)

| # | Title | Film key | Comp prefix | Length |
|---|---|---|---|---|
| 1 | Inside the Wire (resistance) | `resistance` | `Chapter` | 10:18 |
| 2 | The Invisible Push (charge and field) | `charge` | `Charge` | 13:57 (no spoken subscribe ending) |
| 3 | The Space Between (capacitance) | `capacitance` | `Capac` | 9:07 |
| 4 | The Second Field (magnetism) | `magnetism` | `Mag` | 10:23 |
| 5 | The Current That Won't Stop (inductance) | `inductance` | `Ind` | 8:33 |
| 6 | Two Fields, One Light (EM waves) | `fields` | `F` | 13:52. **The owner kept the first version.** The current source in `films/fields/` is a 3D alternative; the first version is in git history before the commit "Rebuild video 5's flat diagrams as 3D scenes". |
| 7 | The Field That Moves the World (induction) | `induction` | `I` | 13:46 |
| 8 | Back and Forth (AC series 1) | `ac1` | `A` | 11:33 |
| 9 | Out of Step (AC series 2) | `ac2` | `B` | 11:12 |

Check composition IDs in `video/src/Root.tsx` before rendering.

### AC series, still to make (Aurora look)

| # | Title | State |
|---|---|---|
| 3 | The Turning Arrow: Phasors and Impedance | Script drafted at `script/ac-3-turning-arrow.md` (about 11½ min). **Not yet approved by the owner.** Suggested film key `ac3`, prefix `P`. |
| 4 | Resonance | Not started |
| 5 | Power in AC, power factor | Not started |
| 6 | Three phase | Not started |

### Shorts (9:16, all delivered)

Nine vertical Shorts, one per long film, 70–77 s each, 1080×1920. Compositions `S1`–`S9` in `video/src/films/shorts/`. Narration in `video/public/voice/shorts/`, script in `script/shorts.md`. Covers and the upload kit are in `video/release/shorts/`: `cover-1.png` … `cover-9.png` and `upload-kit.md` (titles, descriptions, tags, pinned comments, Instagram/Facebook captions, posting plan).

The owner asked whether the full-length films could also be made 9:16. The answer given: a native vertical re-layout of every chapter is not worth it, because YouTube treats vertical videos only up to 3 minutes as Shorts. A cheap "stacked" vertical version (16:9 film centred, title above, captions below, made with ffmpeg from the existing renders) was offered but **not requested yet**.

### YouTube metadata for the long films

`video/release/youtube-metadata.md`: title, description with chapter times, tags, credits footer and upload settings for all nine long films.

### Website Lab (live)

An interactive page, **https://electricalmcqs.in/lab/**, with one experiment per long film, each with sliders, live read-outs and a 3-question quiz. Source: `web/lab/body.html` (edit this) and `web/lab/index.html` (the full page that is deployed; rebuild it from `body.html`, see `web/lab/README.md`). Experiment anchors: `#wire #charge #capacitor #magnet #inductor #light #generator #ac #rlc`.

Also published as a private claude.ai artifact preview: https://claude.ai/artifact/1JLyjPN5hpCZpJxb7yQCgS (an older version, without the site header).

### Offered, not requested

- Subscribe ending for "The Invisible Push".
- Stacked 9:16 versions of the long films.
- A circuit-laws bridge series; a machines-and-grid series.
- Lab experiments for future AC videos 3–6 (add one per new video).

## 3. How the owner likes to work

- **Process per long video:** draft script → owner approves → generate voice → build → render → deliver the film, thumbnail and subtitles with chapter times → present the next script. No per-chapter approval.
- **Scripts:** elaborate, with simple everyday examples and worked figures. Target 12–14 minutes; recent ones ran 11–11½ and were accepted. Plain spoken sentences, one idea each. The narration runs at about 150–158 words a minute (Shorts read faster, about 165), so estimate length from the spoken word count, excluding `**On screen**` lines and headings.
- **Visuals:** mostly 3D with showpiece "hero scenes". The AC series and all Shorts use the colourful "Aurora" look.
- **Colour code:** voltage pink, current cyan, power gold, magnetic field mint, electric field violet, coil copper.
- **For each new video, also make:** its Short (add to `script/shorts.md`, compositions `S10`, …), an entry in the YouTube metadata file, an entry in the Shorts upload kit, and a Lab experiment. The owner wants the whole package each time.
- **Delivery:** say honestly what was and was not checked. You cannot watch motion or hear audio; checking is by still frames and loudness measurement.

## 4. Hard rules

1. **Never ask for, print or commit an API key or token** (ElevenLabs, Netlify, anything else). Keys are set by the owner as environment variables, outside the chat.
2. ElevenLabs generations cost credits. Do not regenerate narration that already exists in `video/public/voice/`. Never retry a successful generation.
3. Treat the owner's name, email and personal details as private; never send them to outside services.
4. No AI-model identifiers in commits, PR text or code comments.
5. Push only to branch `ccr-8ea8d772-fjd5i1` unless the owner says otherwise. Commit after each milestone.
6. Never run `rm` on a path built from a shell variable.
7. Scenes and images are made in code, not with ElevenLabs or stock assets.
8. **The live website is production.** Before any deploy, make a draft deploy, show the owner the changes and get an explicit yes (section 9).

## 5. Repository map

```
HANDOFF.md                  this file
script/                     narration scripts: one per long film, shorts.md for all Shorts
web/lab/                    the website Lab: body.html (source), index.html (deployed), README.md
video/
  src/Root.tsx              registers every composition (chapters, Shorts, thumbnails)
  src/anim.ts               ramp, span, lerp, lerp3
  src/ui/Shell.tsx          T(seconds), LEAD=20, TAIL, chapterFrames(voiceSeconds)
  src/world/Stage3D.tsx     the 3D stage: instanced sprites, `orbs` and `glows` callbacks
  src/world/field.ts        charges, traced field lines, arrows
  src/world/magnet.ts       magnets, needles, wires, coils
  src/films/ac/kit.tsx      Aurora kit: AShell, AStage, ribbon, level, poles, gapField, loop, colours
  src/films/ac1/, ac2/      AC films (ac2/kit.tsx: resistor, coil, capacitor, station, pair, power)
  src/films/shorts/         Shorts: kit.tsx (ShortShell, Pop, Tag, keys, upright, moved, SHORTS) and S1–S9
  src/films/<older films>/  charge, capacitance, magnetism, inductance, fields, induction
  public/voice/<film>/      chN.mp3 + chN.json (word timings)
  public/audio/             bgm.mp3, whoosh, spark, impact, shimmer
  scripts/voice.mjs         narration generator (FILMS table: film key → script file)
  scripts/assemble.mjs      joins long-film chapters, mixes music and effects, writes .srt
  scripts/sound/<film>.json sound-effect cues for long films
  scripts/sheet.sh          contact sheet for 16:9 chapters (lead 20 frames)
  scripts/vsheet.sh         contact sheet for 9:16 Shorts (lead 10 frames)
  scripts/render-film.sh    full render of listed compositions: render-film.sh <Prefix> <dir> n…
  scripts/finish-shorts.sh  normalises Shorts to -14 LUFS and gives them their upload names
  release/<film>/           thumbnails and .srt per long film
  release/shorts/           Shorts covers and upload-kit.md
  release/youtube-metadata.md  long-film titles, descriptions, tags, credits
  out/                      bundles, sheets, renders (git-ignored)
```

## 6. Setup on the PC

- Node 22 and ffmpeg 6 or newer on the PATH. The helper scripts are bash: on Windows use Git Bash or WSL.
- `cd video && npm install`
- Remotion downloads its own headless browser on first render. The cloud had no GPU and 4 cores. On a PC with a GPU, try `--gl=angle` on render commands, and raise `--concurrency` in `scripts/render-film.sh` to match the cores.
- **Narration:** `scripts/voice.mjs` reads `process.env.ELEVENLABS_API_KEY`. The owner sets it on the PC. Drop the `--use-env-proxy` flag unless the PC uses a proxy.
- **Netlify** (only when deploying the website): the owner creates a personal access token in Netlify (User settings → Applications → Personal access tokens) and sets it as `NETLIFY_AUTH_TOKEN` in the environment. The token used by the cloud session was stored only in that cloud environment; ask the owner to revoke it if not done already.

## 7. Long films: workflow (run from `video/`)

```bash
# Register a new film in BOTH FILMS tables (scripts/voice.mjs and scripts/assemble.mjs), then:
node scripts/voice.mjs <film> <chapter>          # one chapter at a time; creates chN.mp3 + chN.json
# Print sentence start times from public/voice/<film>/chN.json and build scenes against them.
npx tsc --noEmit
npx remotion bundle src/index.ts --out-dir=out/bundle
scripts/sheet.sh <Comp> 20 <t1> <t2> ...         # prints a contact sheet path; LOOK at it
scripts/render-film.sh <Prefix> <film> 1 2 3 ... # logs to out/final/<film>/log.txt
node scripts/assemble.mjs <film>                 # prints chapter start times and total length
ffmpeg -i out/final/<film>/<name>.mp4 -c:v libx264 -preset veryfast -crf 24 -c:a copy out/final/<film>/<name>-share.mp4
cp out/final/<film>/<name>.srt release/<film>/
npx remotion still out/bundle <Thumb> release/<film>/thumbnail.png --scale=0.66667   # 1280x720
```

Conventions inside a chapter file:
- Time cues are narration seconds: `T(s)` = 20 lead frames + s × 30. `at`, `span`, `shot`, `keys` as in the AC files.
- Chapter length `chapterFrames(voice.duration)`; last chapter `T(voice.duration + 5) + TAIL` with `<EndCard from={start of the subscribe sentence} />`.
- Scenes call `add(x, y, z, size, rgb, alpha)`; there are no meshes. `AStage` mirrors the scene in a floor at y = −3.2. With the usual camera (z ≈ 25, fov 34), the visible half-width is about 13 units.
- Overlays over a 3D world go in `AbsoluteFill`/`Panel`, never `Scene` (its solid backdrop hides the world).
- Graphs: time runs to the right; the lagging wave crests further right.

## 8. Shorts: workflow (run from `video/`)

```bash
# Add a section "## N. Title" to script/shorts.md (about 180-200 spoken words: hook first, one idea,
# end with "The full video is <title>, on our channel. Follow for more.")
node scripts/voice.mjs shorts N
# Copy an existing S file as a template; register S<N> in Root.tsx at width 1080, height 1920,
# and add the film to SHORTS in src/films/shorts/kit.tsx.
npx tsc --noEmit && npx remotion bundle src/index.ts --out-dir=out/bundle
scripts/vsheet.sh S<N> 2 10 20 30 ...           # LOOK at it
scripts/render-film.sh S shorts N               # about 6 minutes per Short in the cloud
# add the upload name to the names list in scripts/finish-shorts.sh, then:
scripts/finish-shorts.sh N                      # -> out/final/shorts/upload/short-N-<name>.mp4
# cover: hides captions and keeps the hook headline big
npx remotion still out/bundle S<N> release/shorts/cover-N.png --frame=<rich frame> --props='{"cover":true}'
```

Conventions in a Short:
- Voice starts 10 frames in: `st(s)`, `ta`, `tspan`, `keys` in `shorts/kit.tsx` use that lead. `ShortShell` supplies the headline, word-by-word captions, progress bar, closing card, music and effects; `endAt` is the start of the "The full video is…" sentence.
- Safe zones for 1080×1920: headline at the top (to about y = 340), pop-ups around y = 420–700, captions at y = 1180–1440. YouTube's own buttons sit on the right edge and the bottom 20 %.
- Portrait camera: fov 40 gives a half-width of only about 4 units at z = 20, so build scenes tall. `upright(add)` turns a scene built along x into a vertical one; `moved(add, dx, dy)` shifts it.
- The upload kit and covers must be updated for each new Short.

## 9. Website: how electricalmcqs.in is built and deployed

- **Netlify** project "ornate-shortbread-f5b7f6" (site ID `5f028ded-9014-474a-9996-1e198dfcdc95`), custom domain electricalmcqs.in.
- **There is no Git repository and no build step behind the site.** It is published by drag-and-drop (manual deploys). About 1,057 files: a compiled React practice app at `/` (`/app-assets/index-BJILItd5.js`), and plain static pages under `/topics/`, `/subjects/`, `/q/`, `/guides/`, `/watch/` and `/classic/` that share `/assets/pages.css`.
- **The current live deploy** (published 20 November 2026) added `/lab/`, and a "Lab" link in the top menu and footer of 1,047 static pages. It also added a "Lab" chip and footer link to the compiled app bundle, a "See it, then try it" card on `/watch/`, and `/lab/` to `sitemap.xml`.
- **Danger:** a deploy replaces the whole site. If anyone drags an older folder from the PC, the Lab and the links disappear. The owner was asked to download this deploy (Netlify → Deploys → latest → Download) and use that folder as the base from now on. Confirm they did before relying on any local copy.
- **How the cloud session deployed safely,** for the next change:
  1. List the files of the published deploy via the Netlify API (`GET /api/v1/deploys/{id}/files`, paginated, 100 per page). Each entry has the file's SHA-1.
  2. Download only the files you need to change from the live site.
  3. Netlify injects an analytics `<script id="netlify-rum-container">` at the end of served HTML. Strip it, and check the SHA-1 matches the API's before editing, so you edit exact copies.
  4. Create a **draft** deploy (`POST /api/v1/sites/{site}/deploys` with the full `{path: sha1}` map and `"draft": true`), upload only the files it reports as required, show the owner the preview URL, and wait for a yes.
  5. Publish by creating the same digest deploy again without `draft`. Do not use "restore" or "publish" on older deploys.
- To update the Lab alone: edit `web/lab/body.html`, rebuild `web/lab/index.html` as described in `web/lab/README.md`, and deploy that one file with the digest method.

## 10. Lessons that cost time

- Always view contact sheets before a full render. Typical faults: labels overlapping captions or the headline, objects off-frame, field lines too faint, components too small, empty seconds between scenes.
- Labels over 3D objects must be placed by eye from a sheet.
- Remove leftover dummy expressions and unused imports before `tsc`.
- Check historical dates before putting them on screen; where unsure, word the script so it needs none.
- Measure spoken word counts and state lengths from them.
- Shorts audio comes out quiet (about −31 dB mean); `finish-shorts.sh` normalises it to about −14 LUFS. Do not skip that step.
- The chat can only attach files up to 400 MB, and the Google Drive connector only up to 10 MB, so large masters need re-encoding to send.

## 11. Next actions

1. Ask the owner for a decision on `script/ac-3-turning-arrow.md`. On approval, make the whole package: the long film (register `ac3`, voice, build in Aurora, check, render, deliver), its Short (`S10`), metadata and upload-kit entries, and a Lab experiment (deployed with the owner's approval).
2. Then draft AC videos 4 (resonance), 5 (power and power factor) and 6 (three phase), one script approval at a time.
3. If the owner asks, make stacked 9:16 versions of the long films for Instagram or Facebook.

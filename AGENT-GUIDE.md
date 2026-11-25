# Agent guide: the Electrical MCQs video project

A complete guide for an AI coding agent joining this project with no prior context. It explains what the project is, how the toolchain works, how a video goes from script to finished file, and how to make new videos that look, sound and are put together exactly like the existing ones.

Read sections 1–4 before touching anything. Sections 5–9 are the working manual. Section 13 lists the rules that must never be broken.

The shorter `HANDOFF.md` in the repository root is a status note for the owner's other sessions. This file is the full manual; where they disagree, the newer date wins.

Last updated: 21 November 2026.

---

## 1. The project in one page

**Who it is for.** The YouTube channel **Electrical MCQs** (`youtube.com/@electricalmcqs`) and its website **electricalmcqs.in**, an exam-practice site for electrical engineers in Karnataka, India (KPTCL, KPCL, ESCOM AE and JE recruitment exams). The audience is absolute beginners and exam candidates. Many watch on phones.

**What we make.**

1. **Long-form explainer films** (16:9, 1920×1080, 8–14 minutes). Each explains one idea of electricity from the ground up, with 3D animation, narration, on-screen captions, a history timeline, music and sound effects.
2. **Shorts** (9:16, 1080×1920, 70–77 seconds). One per long film: a hook, one idea, and a pointer to the full video.
3. **Upload kits:** titles, descriptions, chapter times, tags, pinned comments, social captions and thumbnails or covers.
4. **The Lab** (`electricalmcqs.in/lab/`): an interactive web page with one hands-on experiment and quiz per film.

**The owner's brief, in their words:** immersive graphics that convey what textbooks usually fail to convey. The guiding question for every scene is "what does the student need to *see* to understand this?"

**How it is made.** Everything visual is generated in code with **Remotion** (React video framework) and **Three.js** (3D in the browser). Narration is the owner's own cloned voice from **ElevenLabs**; music and sound effects were also made with ElevenLabs once and are reused. **ffmpeg** joins, mixes, normalises and encodes. No stock footage, no AI-generated images.

**What exists today** (all delivered to the owner):

| # | Long film | Film key | Composition IDs | Length | Short |
|---|---|---|---|---|---|
| 1 | Inside the Wire (resistance) | `resistance` | `Chapter1`–`Chapter8` | 10:18 | `S1` |
| 2 | The Invisible Push (charge and field) | `charge` | `Charge1`–`Charge9` | 13:57 | `S2` |
| 3 | The Space Between (capacitance) | `capacitance` | `Capac1`–`Capac9` | 9:07 | `S3` |
| 4 | The Second Field (magnetism) | `magnetism` | `Mag1`–`Mag10` | 10:23 | `S4` |
| 5 | The Current That Won’t Stop (inductance) | `inductance` | `Ind1`–`Ind9` | 8:33 | `S5` |
| 6 | Two Fields, One Light (EM waves) | `fields` | `F1`–`F9` | 13:52 | `S6` |
| 7 | The Field That Moves the World (induction) | `induction` | `I1`–`I10` | 13:46 | `S7` |
| 8 | Back and Forth (AC 1: the shape of AC) | `ac1` | `A1`–`A9` | 11:33 | `S8` |
| 9 | Out of Step (AC 2: R, L, C on AC) | `ac2` | `B1`–`B9` | 11:12 | `S9` |

Film 6 note: the owner kept the *first* version of "Two Fields, One Light". The source now in `src/films/fields/` is a later 3D alternative. The first version is in git history, before the commit titled "Rebuild video 5's flat diagrams as 3D scenes".

**What comes next:** AC series videos 3–6. Video 3, "The Turning Arrow: Phasors and Impedance", has a draft script at `script/ac-3-turning-arrow.md` that **the owner has not yet approved**. Then 4 Resonance, 5 Power in AC and power factor, 6 Three phase. See section 12.

---

## 2. Repository and environment

**Repository:** `github.com/HHHkumar/first-try`, working branch `ccr-8ea8d772-fjd5i1` (draft pull request #1). Rendered videos are **not** committed; everything else is.

```
AGENT-GUIDE.md              this file
HANDOFF.md                  short status note
script/                     narration scripts (Markdown), one per long film; shorts.md for all Shorts
web/lab/                    the website Lab: body.html (source), index.html (deployed page), README.md
video/                      the Remotion project (run all video commands from here)
  package.json              remotion 4.0.543, @remotion/three, @react-three/fiber 9, three 0.187, react 19
  remotion.config.ts        renderer settings (software WebGL, JPEG frames, overwrite)
  src/index.ts              registers Root
  src/Root.tsx              every composition: chapters (1920x1080), Shorts (1080x1920), thumbnail stills
  src/theme.ts              FPS = 30, W = 1920, H = 1080, the original palette C
  src/anim.ts               ramp, span, lerp, lerp3, makeCues
  src/fonts.ts              the Sora font (and others) loaded from public/fonts
  src/ui/Shell.tsx          chapter frame for the older films; T(), LEAD, TAIL, chapterFrames()
  src/ui/type.tsx, hud.tsx  text components: Big, Center, Kicker, Sub, Sym, Frac, Meter, Panel
  src/world/Stage3D.tsx     THE 3D ENGINE (section 4)
  src/world/Sprites.tsx     the instanced sprite renderer and its shaders
  src/world/WireWorld.tsx   camera (CameraPose) and the resistance film's wire world
  src/world/field.ts        point charges, field-line tracing, arrows
  src/world/magnet.ts       bar magnets, compass needles, wires, coils, coil field lines
  src/films/charge/kit.tsx  shared helpers: at(), shot(), Cap (caption), Timeline, drawPlates
  src/films/capacitance/kit.tsx  EndCard (the like/share/subscribe card)
  src/chapters/             the first film, Inside the Wire (Chapter1–Chapter8, Thumbnail); its renders go to out/final/ directly
  src/films/<film>/         one folder per film: kit.tsx plus one file per chapter
  src/films/ac/kit.tsx      the "Aurora" look: AShell, AStage, ribbon, level, poles, gapField, loop, colours
  src/films/ac2/kit.tsx     resistor, coil, capacitor, station, pair, power, cursor, keys
  src/films/shorts/kit.tsx  ShortShell, Pop, Tag, st, ta, tspan, keys, upright, moved, SHORTS
  public/voice/<film>/      chN.mp3 narration + chN.json word timings, per chapter
  public/voice/shorts/      chN.mp3 / chN.json for Short N
  public/audio/             bgm.mp3 (music bed), whoosh.mp3, spark.mp3, impact.mp3, shimmer.mp3
  public/fonts/             font files
  scripts/voice.mjs         makes narration from a script (ElevenLabs API)
  scripts/assemble.mjs      joins a long film's chapters, mixes music and effects, writes subtitles
  scripts/sound/<film>.json extra sound-effect cues for a long film
  scripts/render-film.sh    renders listed compositions to out/final/<dir>/chN.mp4
  scripts/finish-shorts.sh  loudness-normalises Shorts and gives them their upload names
  scripts/sheet.sh          contact sheet of stills from a 16:9 chapter
  scripts/vsheet.sh         contact sheet of stills from a 9:16 Short
  release/<film>/           committed deliverables: thumbnail.png, <name>.srt
  release/shorts/           cover-1.png … cover-9.png, upload-kit.md
  release/youtube-metadata.md  titles, descriptions, tags, credits for the long films
  out/                      git-ignored: bundles, contact sheets, renders
```

**Machine requirements**
- Node.js 22, npm, ffmpeg and ffprobe 6 or newer, bash (on Windows use WSL or Git Bash), git.
- `cd video && npm install` (or `npm ci`). Remotion downloads its own headless Chromium on first use.
- Disk: about 2 GB per long film for intermediate renders.
- `remotion.config.ts` sets `setChromiumOpenGlRenderer('swangle')`, i.e. software WebGL, because the original machine had no GPU. On a machine with a GPU, pass `--gl=angle` (or change the config) for a large speed-up, and raise `--concurrency` in `scripts/render-film.sh` to the number of CPU cores.
- Rendering speed on the original 4-core, no-GPU cloud machine: a 1080p chapter of about 75 s took 10–20 minutes; a Short took about 6 minutes; a whole long film took 1½–2½ hours.

**Keys** (never in chat, never in files, never in commits):
- `ELEVENLABS_API_KEY`: read by `scripts/voice.mjs`. The owner sets it as an environment variable on the machine. If it is missing, stop and ask the owner to set it; do not ask them to paste it.
- `NETLIFY_AUTH_TOKEN`: only for website deploys (section 10). Same rule.

---

## 3. Remotion in five minutes (what you need to know)

Remotion renders a video by rendering a React component once per frame in headless Chrome and screenshotting it.

- A **composition** is registered in `src/Root.tsx`: `<Composition id="A3" component={A3} durationInFrames={A3_FRAMES} fps={30} width={1920} height={1080} />`.
- Inside a component, `useCurrentFrame()` returns the frame number. **Everything must be a pure function of the frame.** No timers, no `Math.random()` without a seed, no state that accumulates between frames. Frames are rendered out of order and in parallel. Use `mulberry32(seed)` from `src/world/rng.ts` for seeded randomness.
- `<Audio src={staticFile('voice/ac1/ch3.mp3')} />` inside `<Sequence from={20}>` plays the narration starting at frame 20. Files under `video/public/` are addressed with `staticFile()`.
- Commands (run in `video/`):
  - `npx tsc --noEmit`: type-check. Must pass before every render.
  - `npx remotion bundle src/index.ts --out-dir=out/bundle`: build the project once; renders and stills then use the bundle.
  - `npx remotion still out/bundle <ID> out.png --frame=<n> [--scale=0.5]`: one frame as an image.
  - `npx remotion render out/bundle <ID> out.mp4 --concurrency=4 --crf=16`: a whole composition.
  - `npx remotion studio`: interactive preview in a browser, if you have a display.

---

## 4. The 3D engine (read this carefully)

Every 3D scene in the project uses one engine: `Stage3D` (`src/world/Stage3D.tsx`) or its Aurora wrapper `AStage` (`src/films/ac/kit.tsx`).

**There are no meshes or models.** A scene is a function that calls `add(x, y, z, size, rgb, alpha)` many thousands of times. Each call places one camera-facing sprite in 3D space. Two kinds exist:

- **orbs**: lit, solid-looking spheres (atoms, magnet blocks, plates). Sorted back to front. At most 9,000 per frame.
- **glows**: additive points of light (electrons, field lines, wires, waves, sparks). At most 90,000 per frame.

Lines, rings, waves and surfaces are drawn by placing many glows close together, for example every 0.03–0.1 units along a path. Brightness comes from `alpha` and from overlapping additive glows. Colours are `[r, g, b]` in 0–1; use `rgb('#ff4fa3')` to convert hex.

The camera is a `CameraPose`: `{ pos: [x, y, z], target: [x, y, z], fov, focus, dof }`. `fov` is the vertical field of view in degrees. `focus` is the distance from the camera that is sharp, and `dof` is how fast things blur away from it (0.02–0.045 is typical).

**Sizing rules of thumb:**
- 16:9 frame, camera at z ≈ 25, fov 34: the visible half-width at z = 0 is about 13 units, the half-height about 7.6.
- 9:16 frame, camera at z ≈ 20, fov 40: the visible half-width is only about 4 units and the half-height about 7.3. Build portrait scenes **tall**.

**`AStage`** (Aurora look) takes `{ pose, orbs?, scene, opacity?, mirror?, ground? }`. It draws a grid "floor of light" at y = −3.2 and draws `scene` twice: once faintly mirrored in the floor, then for real. Pass `ground={false}` to drop the floor (all Shorts do).

**Reusable scene functions** (import them; do not rewrite them):

| Function | File | What it draws |
|---|---|---|
| `ribbon(add, x0, x1, y(x), color(x), opts)` | ac/kit | a glowing wave along x, with optional fill threads to its axis |
| `level(add, y, x0, x1, color, gain)` | ac/kit | dashed horizontal level line (peak, RMS) |
| `poles`, `gapField`, `loop` | ac/kit | magnet pole blocks, field between them, a turning generator loop |
| `phaseColor(u)` | ac/kit | colour that cycles along a wave |
| `station(add, cx, 'R'/'L'/'C', now, frame, opts)` | ac2/kit | a component with its voltage and current graph (and power) |
| `resistor`, `coil`, `capacitor`, `pair`, `power`, `cursor`, `arrow`, `flow`, `wire` | ac2/kit | building blocks for circuits and graphs |
| `traceLines(charges, opts)`, `drawLines`, `drawCharge`, `drawArrow`, `drawFieldArrows` | world/field | electric field lines and charges |
| `drawBarMagnet`, `drawNeedle`, `drawWire`, `drawRings`, `makeCoil`, `traceCoil`, `drawCoil` | world/magnet | magnets, compasses, wires and coils |
| `useCoil`, `drawTurns`, `drawCoilField`, `drawCore` | inductance/kit | a coil with current beads, its field lines, an iron core |
| `ring`, `drawWave` | fields/kit | a pulsing ring of field; a travelling EM wave |
| `ringLoop`, `rotMagnet`, `xField`, `plate`, `orbit` | induction/kit | loops, a rotating magnet, a uniform field, metal sheets, an orbiting camera |
| `drawGenerator` | induction/I1 | a rotating-magnet generator with its coils |
| `drawTransformer` | induction/I7 | a transformer with flux in the core |
| `drawPlates` | charge/kit | capacitor plates with surface charge and field |
| `upright(add)`, `moved(add, dx, dy)` | shorts/kit | turn a scene built along x to stand vertically; shift a scene |

Performance: anything expensive that does not change each frame, such as traced field lines, belongs in `useMemo`. If a scene needs lines for several configurations, trace them all once in `useMemo` and pick per frame (see `S2.tsx`).

---

## 5. The house style

### Look

- **Series 1 films** (1–7) use the original dark navy look (`C` palette in `theme.ts`, `Shell` frame).
- **The AC series and all Shorts** use the **Aurora** look, which the owner chose to make the visuals more colourful: deep indigo background `#0b0722`, teal and magenta haze, a grid floor of light, and colourful glowing waves. **Use Aurora for everything new.**
- **Colour code** (keep it identical everywhere): voltage **pink** `#ff4fa3`; current **cyan** `#35c9ff`; power and highlights **gold** `#ffd646`; magnetic field **mint** `#7dffb0`; electric field **violet** `#b78bff`; coils **copper** `#ffb27a`; extra accent teal `#5ff5e0`.
- **Fonts:** Sora (titles, captions, numbers). Import `sora` from `src/fonts.ts`.
- Mostly 3D, with a showpiece "hero scene" in most chapters. Flat 2D diagrams are used sparingly, for formulas and title cards. The owner explicitly asked for more 3D.

### Layout of a 16:9 chapter (AC style)

- 3D world filling the frame.
- **Caption** (`Cap`): bottom-left, a small uppercase "kicker" line over a larger sentence. It summarises the narration; it is not a transcript.
- **Read-outs** (`Panel` + `Meter`): top-right, numbers with units, for example "Peak 325 V".
- **Formula or title cards** (`Center` + `Big`/`Sym`/`Frac`): centred, with the world dimmed to about 30 % behind them.
- **Timeline strip** (`Timeline`): along the bottom, the history dates for the film, lighting up as they are mentioned.
- The last chapter ends with `EndCard`: "Like · Share · Subscribe" and `youtube.com/@electricalmcqs`.

### Layout of a 9:16 Short (`ShortShell` does all of this)

- Thin pink-to-cyan **progress bar** at the very top.
- **Headline:** big for the first 3.5 s (the hook), then held smaller at the top for the rest, under the label "ELECTRICAL MCQS · IN 90 SECONDS".
- **Pop-ups** (`Pop`): big figures or phrases, around y = 420–700 px.
- **Word-by-word captions:** three words at a time, current word in gold, centred at y = 1180–1440 px.
- **Closing card** (last 4.6 s): "The full video · <title> · on the channel", "Try it yourself · electricalmcqs.in/lab", and a "Follow @electricalmcqs" button.
- **Safe zones:** keep important text away from the right edge (YouTube's buttons) and the bottom 20 % (channel name and description).

### Narration and scripts

Scripts live in `script/*.md`. Format (the voice generator parses it):

```markdown
## 3. Reading the wave

**On screen:** what the picture shows. Not spoken. Put scene instructions here.

First spoken paragraph. Short plain sentences.

Second spoken paragraph.

---
```

- Every `## N. Title` heading is one chapter (or one Short). Paragraphs that do not start with `**On screen` and are not `---` are spoken.
- Write numbers as words when they are spoken ("two hundred and thirty volts"). Show digits on screen.
- **Long films:** 8–10 chapters; 12–14 minutes is the owner's target (recent films ran 11–11½ and were accepted). Use everyday analogies (a handsaw, a heavy trolley, a filling tank), worked figures, and the history of who discovered, defined and standardised each idea. End the last chapter with a recap, a teaser for the next video, and the exact line: "If this helped you see it, and not just calculate it, please like, share, and subscribe to this channel."
- **Shorts:** about 180–200 spoken words. The first sentence is a surprising hook. One idea. End with: "The full video is <title>, on our channel. Follow for more."
- **Pace:** the voice reads about 150–158 words a minute in long films and about 165 in Shorts. Estimate length from the spoken word count and state it honestly.
- **Accuracy:** check every date and figure. If a date is uncertain, write around it.

---

## 6. Making a long film, step by step

Example: AC video 3, film key `ac3`, composition prefix `P`, script `script/ac-3-turning-arrow.md`.

**Step 1. Script approval.** Never generate narration before the owner approves the script. Send them the script with its measured length.

**Step 2. Register the film** in both tables:
- `video/scripts/voice.mjs` → `FILMS`: `ac3: { script: 'ac-3-turning-arrow.md', out: ['ac3'] },`
- `video/scripts/assemble.mjs` → `FILMS`: `ac3: { dir: ['ac3'], voice: ['ac3'], chapters: 9, lead: () => 20, name: 'the-turning-arrow' },`

**Step 3. Narration** (costs ElevenLabs credits; run each chapter once):
```bash
cd video
node scripts/voice.mjs ac3            # lists chapters and character counts (free)
node scripts/voice.mjs ac3 1          # generates chapter 1 → public/voice/ac3/ch1.mp3 + ch1.json
```
If a call fails with a network error, retry that chapter. If it succeeded, never regenerate it. The `.json` holds `{ duration, words: [{ text, start, end }] }`.

**Step 4. Read the timings.** Print each sentence's start time; every visual cue is pinned to these:
```bash
node -e 'const j=require("./public/voice/ac3/ch1.json");let s=[],t=null;for(const w of j.words){if(t===null)t=w.start;s.push(w.text);if(/[.?!]$/.test(w.text)){console.log(t.toFixed(1),s.join(" "));s=[];t=null}}'
```

**Step 5. Build the chapters.** Create `src/films/ac3/` with a `kit.tsx` (`VOICE`, the film's `TIMELINE` entries, any shared scene functions) and one file per chapter. Template, based on the AC films:

```tsx
import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac3/ch2.json';
import { span } from '../../anim';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { rgb } from '../../world/Stage3D';
import { AShell, AStage, at, Cap, PINK, ribbon, shot, SUN, sway } from '../ac/kit';
import { Timeline, VOICE } from './kit';

// Chapter 2 - <title>: <one line on what the chapter shows>.
export const P2_FRAMES = chapterFrames(voice.duration);

export const P2 = () => {
  const frame = useCurrentFrame();
  const angle = frame * 0.045;              // anything that moves is a function of frame
  const hero = shot(frame, -1, 40.2);       // scene 1, cross-fading out at 40.2 s of narration
  return (
    <AShell
      voice={VOICE(2)}
      frames={P2_FRAMES}
      world={
        <AStage
          opacity={hero}
          pose={{ pos: [sway(frame), 2.4, 25], target: [0, -0.5, 0], fov: 34, focus: 25, dof: 0.022 }}
          scene={(add) => {
            ribbon(add, -10, 10, (x) => 2 * Math.sin(angle - x * 0.8), () => rgb(PINK));
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(12.0), T(40.0))} style={{ right: 110, top: 60 }}>
        <Meter label="Peak" value="325" unit="V" color={SUN} size={72} />
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(7.4))} kicker="Short uppercase line" title="The sentence that sums up this moment" />
      <Timeline frame={frame} already={[0]} events={[[1, 14.0]]} />
    </AShell>
  );
};
```

Timing helpers (from `ui/Shell.tsx` and `charge/kit.tsx`): `T(s)` converts narration seconds to frames (20 lead frames + s × 30); `at(frame, s)` fades from 0 to 1 at s; `span(frame, T(a), T(b))` is 1 between a and b, with fades; `shot(frame, from, to)` cross-fades whole scenes; `keys(frame, [[s, v], …])` (ac2 or shorts kit) eases a value through keyframes. Chapter length is `chapterFrames(voice.duration)`. The **last** chapter uses `T(voice.duration + 5) + TAIL` and shows `<EndCard frame={frame} from={<start of the subscribe sentence>} />`.

**Step 6. Register** each chapter in `src/Root.tsx` (import it and add it to an array like `ac2`, which is mapped to `<Composition … width={W} height={H} />`). Add a thumbnail component (copy `ac2/BThumb.tsx`) and register it as a 1-frame still.

**Step 7. Check before rendering. Never skip this.**
```bash
npx tsc --noEmit
npx remotion bundle src/index.ts --out-dir=out/bundle
scripts/sheet.sh P2 20 3 12 25 40 55        # stills at those narration seconds → prints a PNG path
```
Open the contact sheet and look for overlapping text (captions vs read-outs vs formulas), objects cut off at the frame edge, empty or near-black stretches, field lines too faint to see, objects too small, and labels pointing at the wrong thing. Fix, re-bundle, re-check. Expect two or three rounds.

**Step 8. Sound cues** (optional): `scripts/sound/ac3.json`, for example `[{ "chapter": 3, "t": 30.6, "sfx": "shimmer", "gain": 0.25 }]`. `t` is narration seconds within that chapter; `sfx` is one of `whoosh`, `spark`, `impact`, `shimmer`. A whoosh at every chapter change is added automatically.

**Step 9. Render, assemble, deliver.**
```bash
scripts/render-film.sh P ac3 1 2 3 4 5 6 7 8 9   # → out/final/ac3/ch1.mp4 …; timings in out/final/ac3/log.txt
node scripts/assemble.mjs ac3                     # → the-turning-arrow.mp4, -voice-only.mp4, .srt; prints chapter times
cd out/final/ac3
ffmpeg -i the-turning-arrow.mp4 -c:v libx264 -preset veryfast -crf 24 -c:a copy the-turning-arrow-share.mp4
cp the-turning-arrow.srt ../../../release/ac3/
cd ../../..
npx remotion still out/bundle PThumb release/ac3/thumbnail.png --scale=0.66667   # 1280x720
```
`render-film.sh` copies the bundle to `out/frozen/` first, so you can keep editing while it renders. After assembly, take a few frames from the joined file to confirm it (`ffmpeg -ss <t> -i file.mp4 -frames:v 1 check.png`).

What `assemble.mjs` does: it joins the chapters losslessly and builds subtitles (one cue per sentence or clause). It lays the music bed (`bgm.mp3`, looped with 6 s crossfades, volume 0.13, ducked under the voice with a sidechain compressor) and adds the sound cues. It raises the whole mix by 7 dB with a limiter and writes AAC 192 kbps at 48 kHz.

**Step 10. Package and report.** Add the film's entry to `video/release/youtube-metadata.md`: title, description with the chapter times printed by `assemble.mjs`, tags, and the common credits footer. Then make its Short (section 7) and its Lab experiment (section 9). Report to the owner with the chapter table, total length, and an honest note on what you checked (stills only) and which parts are most worth their eye.

---

## 7. Making a Short, step by step

Example: the Short for AC video 3 becomes `S10`.

1. Add `## 10. <hook title>` to `script/shorts.md`, about 180–200 spoken words (section 5).
2. `node scripts/voice.mjs shorts 10`, then print its sentence timings (as in step 4 above, with `public/voice/shorts/ch10.json`).
3. Add `{ n: 10, id: 'phasor', film: 'The Turning Arrow', lab: 'phasor' }` to `SHORTS` in `src/films/shorts/kit.tsx`.
4. Copy the closest existing Short (`S1.tsx`–`S9.tsx`) to `S10.tsx`. Its skeleton:

```tsx
import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/shorts/ch10.json';
import { AStage, PINK, SUN, sway } from '../ac/kit';
import { keys, Pop, shortFrames, ShortShell, st, ta, tspan, upright } from './kit';

export const S10_FRAMES = shortFrames(voice.duration);

export const S10 = () => {
  const frame = useCurrentFrame();
  return (
    <ShortShell
      n={10}
      voice={voice}
      endAt={68.2}                                   // start of "The full video is …"
      headline={<>The <span style={{ color: SUN }}>turning arrow</span></>}
      world={
        <AStage
          ground={false}
          pose={{ pos: [sway(frame, 1.5), 1, 20], target: [0, 0.5, 0], fov: 40, focus: 20, dof: 0.02 }}
          scene={(add) => { /* build tall; upright(add) turns an x-built scene vertical */ }}
        />
      }
    >
      <Pop frame={frame} from={12.2} to={20.1} size={84}>a big key figure</Pop>
    </ShortShell>
  );
};
```

   In Shorts the voice starts 10 frames in, so use `st(s)`, `ta(frame, s)`, `tspan(frame, a, b)` and `keys` from `shorts/kit.tsx`, not `T()` and `at()`.
5. Register in `Root.tsx` with `width={1080} height={1920}`.
6. `npx tsc --noEmit`, bundle, then `scripts/vsheet.sh S10 2 10 20 30 40 50 60` and look. Check especially that pop-ups clear the headline, the scene is not hidden under the headline or captions, there are no empty seconds between scenes, and nothing is too thin to read on a phone.
7. `scripts/render-film.sh S shorts 10` → `out/final/shorts/ch10.mp4`.
8. Add the upload name to the `names` list in `scripts/finish-shorts.sh`, then run `scripts/finish-shorts.sh 10`. This normalises loudness to about −14 LUFS (the raw render is very quiet, about −31 dB mean) and writes `out/final/shorts/upload/short-10-<name>.mp4` at H.264 CRF 19 with fast start. **Never skip this step.**
9. Cover image: `npx remotion still out/bundle S10 release/shorts/cover-10.png --frame=<a rich frame> --props='{"cover":true}'`. Cover mode hides captions and pop-ups, keeps the hook headline big, and adds the film's title as a badge.
10. Add a section to `release/shorts/upload-kit.md` in the same format as the others: title with `#shorts`, description, tags, pinned comment, Instagram/Facebook caption.

---

## 8. Quality bar and how to verify

You cannot watch video or hear audio directly, so verification is by:

1. **Contact sheets** of stills before every render (`sheet.sh`, `vsheet.sh`). Look at them yourself; do not assume.
2. **Frames from the final file** after rendering (`ffmpeg -ss <t> -i <file> -frames:v 1 x.png`).
3. **Loudness:** `ffmpeg -i <file> -af ebur128 -f null -` (integrated loudness `I:`). Long films come out of `assemble.mjs` at a good level; Shorts must go through `finish-shorts.sh`.
4. **Duration and chapter times** from `assemble.mjs` output or `ffprobe`.

When reporting, say plainly what you checked and what you could not (motion, timing feel, audio balance). Name the specific scenes most worth the owner's attention. The owner values honest reports.

---

## 9. The Lab (interactive web page)

- Live at **https://electricalmcqs.in/lab/**. Source `web/lab/body.html`; deployed file `web/lab/index.html`.
- One self-contained HTML file: plain JavaScript and canvas 2D, no build step, Google Fonts only. It is styled to match the site header and the Aurora colours.
- Each experiment is an object in the `LABS` array: `id`, `n`, `series`, `video`, `topic`, `blurb`, `hint`, `state`, `controls` (types `range`, `log`, `select`, `toggle`, `button`), `readouts(state)`, `draw(ctx, w, h, dt, state, time)`, an optional `pointer(...)`, and `quiz` (three questions with `o` options, `a` answer index and `why` explanation).
- Each experiment has its own address: `/lab/#wire`, `#charge`, `#capacitor`, `#magnet`, `#inductor`, `#light`, `#generator`, `#ac`, `#rlc`. The YouTube descriptions link to these.
- **To add an experiment:** append an object to `LABS` in `body.html`, change "/ 27" in the score label to the new total (3 × the number of experiments), rebuild `index.html` as described in `web/lab/README.md`, and test it in a headless browser at desktop width (1400 px) and phone width (400 px). Check for script errors and horizontal scrolling.

---

## 10. The website and deploying safely

- Hosted on **Netlify**, project "ornate-shortbread-f5b7f6", site ID `5f028ded-9014-474a-9996-1e198dfcdc95`, domain electricalmcqs.in.
- **There is no Git repository or build behind the site.** It is deployed by drag-and-drop. About 1,057 files: a compiled React practice app at `/` (`/app-assets/index-BJILItd5.js`), and static HTML under `/topics/`, `/subjects/`, `/q/`, `/guides/`, `/watch/` and `/classic/` sharing `/assets/pages.css`.
- The current production deploy (20 November 2026) added `/lab/`; a "Lab" link in the top menu and footer of 1,047 static pages; a "Lab" chip and footer link in the app bundle; a "See it, then try it" card on `/watch/`; and `/lab/` in `sitemap.xml`.
- **A deploy replaces the entire site.** Never deploy a partial folder.

**Safe procedure** (the method used last time; needs `NETLIFY_AUTH_TOKEN`):
1. `GET https://api.netlify.com/api/v1/sites/<site>/` → `published_deploy.id`.
2. `GET /api/v1/deploys/<id>/files?per_page=100&page=N` until a page has fewer than 100 entries. Each entry is `{ id: "/path", sha }` (SHA-1).
3. Download only the files you will change from `https://electricalmcqs.in/<path>`. Netlify appends an analytics `<script async id="netlify-rum-container" …></script>` to served HTML. Strip it and confirm the SHA-1 now equals the API's, so you edit exact originals.
4. Edit. Then `POST /api/v1/sites/<site>/deploys` with `{ "files": { "/path": "<sha1>", … all files … }, "draft": true }`. The response lists `required` hashes; upload each of those files with `PUT /api/v1/deploys/<new id>/files/<path>` (`Content-Type: application/octet-stream`).
5. Give the owner the draft URL (`https://<deploy id>--ornate-shortbread-f5b7f6.netlify.app`) and a list of exactly what changed. **Wait for an explicit yes.**
6. Publish by POSTing the same file map without `"draft"`; the files are already uploaded, so it finishes in seconds. Verify the live pages afterwards. Do not "restore" or "publish" older deploys.

Remind the owner to download the latest deploy from the Netlify dashboard and use that folder if they ever drag-and-drop again; an older folder would wipe the Lab.

---

## 11. Owner preferences and working agreement

- **Per long video:** script → owner approves → voice → build → check → render → deliver (film, thumbnail, subtitles, chapter times) → present the next script. Do not ask for approval chapter by chapter.
- **The full package for every new film:** long film, Short, metadata and upload-kit entries, and a Lab experiment.
- More 3D, colourful (Aurora), intricate hero scenes; everyday examples; history included.
- Thumbnails 1280×720 for long films (copy an existing `*Thumb.tsx`): big two-colour title on the left, a hero visual on the right, the series label above.
- Communication: short, plain status notes, and honest about limits. Send deliverables as soon as they exist.
- The owner downloads finished videos themselves; large files may need re-encoding to fit upload limits.

---

## 12. What to do next

1. Ask the owner for a decision on `script/ac-3-turning-arrow.md` (phasors and impedance; chapters on the 60 V + 80 V = 100 V puzzle, the turning arrow, phasor diagrams with Steinmetz and Kennelly in 1893, adding arrows tip to tail, impedance (Heaviside, 1886), adding a capacitor, a worked electromagnet on AC versus DC). Apply any changes they ask for.
2. On approval, make the full package (sections 6, 7, 9).
3. Then draft AC 4 (Resonance), AC 5 (Power in AC and power factor) and AC 6 (Three phase), one approval at a time. Keep the colour code and the Aurora look, and continue the AC series timeline. Each script should open with a concrete puzzle, use everyday analogies, give worked figures, include the history, and end with a recap, a teaser for the next video and the subscribe line.
4. If asked: stacked 9:16 versions of the long films (film centred, title above, captions below, made with ffmpeg from the renders), or a spoken subscribe ending for "The Invisible Push".

---

## 13. Rules that must never be broken

1. **Never ask for, print, log or commit an API key or token.** The owner sets keys as environment variables.
2. **Never generate narration without an approved script,** and never regenerate narration that already exists; every generation costs the owner's ElevenLabs credits.
3. **Never deploy to electricalmcqs.in without a draft preview and the owner's explicit yes.**
4. Keep the owner's personal details (name, email, accounts) private; never send them to outside services.
5. Do not put AI-model names or identifiers in commits, pull requests, code or documents in the repository.
6. Commit after each milestone with a clear message, and push only to branch `ccr-8ea8d772-fjd5i1` unless the owner says otherwise.
7. Never run destructive commands such as `rm -rf` on a path built from a variable, and never delete the owner's files.
8. All pictures are made in code. No stock footage and no AI-generated images.
9. Check facts and dates. If unsure, write around the uncertainty rather than guessing.

---

## 14. Troubleshooting

| Problem | Cause and fix |
|---|---|
| `tsc` errors after editing | Usually leftover placeholder code or unused imports; remove them. |
| A 3D scene is black | The overlay was wrapped in `Scene` (solid backdrop), or `opacity` is 0 at that frame; use `AbsoluteFill` or `Panel`, and check the `shot()` ranges. |
| Field lines invisible | Raise the gain (`drawLines` gain 1–1.6) or glow size; move the camera closer. |
| Text overlaps | Re-time `span()` ranges so captions, read-outs and cards do not share a moment, or move one. |
| Render very slow | No GPU: expected. With a GPU use `--gl=angle`; raise `--concurrency`. |
| `Narration cue not found` | `makeCues` (older films) looks up words; the narration changed. Update the cue. |
| ElevenLabs 401 or 403 | The key is missing or wrong; ask the owner to set `ELEVENLABS_API_KEY`. Do not ask for the key itself. |
| Short is quiet | Run `scripts/finish-shorts.sh N`. |
| Subtitles drift | `assemble.mjs` uses each chapter's lead (20 frames; 36 for chapter 1 of the resistance film). A new film must use `lead: () => 20` unless its chapters differ. |
| Out of disk | Delete `out/frozen/*` and old `out/sheets/*` (not `public/` or `release/`). |

---

## 15. Glossary

- **Composition:** one renderable video or still, registered in `Root.tsx`.
- **Film key:** the short name of a film in `voice.mjs` and `assemble.mjs` (for example `ac2`).
- **Chapter:** one composition of a long film, matching one `##` section of its script.
- **Lead:** frames of picture before the narration starts (20 for chapters, 10 for Shorts).
- **Contact sheet:** a grid of still frames, used to check a scene before rendering.
- **Aurora:** the colourful look of the AC series and the Shorts.
- **Hero scene:** a showpiece 3D shot that makes the chapter's main idea visible.
- **Upload kit:** the titles, descriptions, tags, comments, captions and covers for publishing.
- **Lab:** the interactive companion page at electricalmcqs.in/lab.

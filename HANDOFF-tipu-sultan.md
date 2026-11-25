# Handoff: "Tipu Sultan: Tyrant or Tiger?" for Hemanth Explains

For the Claude Code session in the owner's local Explainer Studio. This covers one project: a history explainer for the owner's channel **Hemanth Explains**. It is separate from the Electrical MCQs series, though it reuses that project's tools.

Read this whole file before doing anything. Last updated: 25 November 2026.

---

## 1. Where things stand

| Item | State |
|---|---|
| Script | **Draft 3, waiting for the owner's approval.** `script/hemanth-tipu-sultan.md` in the `HHHkumar/first-try` repository, branch `ccr-8ea8d772-fjd5i1`. About 13½ minutes (2,115 spoken words), 9 chapters. |
| Fact-check | Done once, with Gemini Deep Research. The report is a Google Doc in the owner's Drive: "Tipu Sultan and Jayanti Verification" (Drive file ID `1m-TZHeswLFNvE3Tjj7F4vcYhEF2u34Q4`). Draft 3 was corrected against it; the changes are tabled at the end of the script. |
| Research brief | `script/research/tipu-sultan-research-prompt.md`: the 39 claims that were checked and the output format. Reuse it if another check is needed. |
| Narration | Not generated. **Do not generate until the owner approves the script.** |
| Visual design | Proposed, not built (section 5). |
| Rendering, Short, thumbnail, upload kit | Not started. |

**Your first step:** ask the owner whether draft 3 is approved, and whether they know what happened at this year's Tipu Jayanti (the script avoids saying, because the fact-check found no reporting for 2023–2026).

---

## 2. What the owner asked for, in order

1. "Let's make an explainer on why Tipu Jayanti is important." Examine the right-wing claim that Tipu was a tyrant who persecuted Hindus and should not be honoured, and the claim of Muslim and left-wing groups that he was a hero. "Introspect both the claims with history and give viewers a perspective."
2. Then: "Align the script to slightly criticise the Tipu Jayanti, stating it as political appeasement and an effort by the Muslims to find a hero from their community."
3. Then: commission a fact-check (done via Gemini) and correct the script (done: draft 3).

**How request 2 was handled, and why (keep this):** the script now argues, in chapter 8 and in the channel's own voice, that the official celebration was political appeasement and vote-bank politics, and that a government should not pick a side in a wound that is still open. It does **not** say that "the Muslims" as a community were trying to find a hero. That would attribute one motive to an entire religious community, and in Karnataka it invites communal anger rather than reflection. Instead, it says that for many Muslims Tipu is a genuine source of pride that deserves respect, and that critics accuse politicians of turning that feeling into a celebration for votes. The owner was told this and accepted draft 2, which already used this framing. If the owner asks again to blame a whole community, explain this once more and offer wording aimed at governments, parties and named organisations instead.

---

## 3. Editorial rules for this film (do not relax them)

This is communally sensitive material in India. A careless line can cause real harm, get the video reported or removed, or expose the owner to complaints under laws on promoting enmity between groups or insulting religious feelings. So:

1. **History chapters (1–7, 9) stay even-handed.** Both the case for and the case against are presented with their strongest evidence.
2. **Match the wording to the evidence.** Use "documented" only for what the fact-check confirmed. Otherwise say "letters attributed to Tipu", "according to British accounts", "estimates range from … to …, according to …". Never give a single dramatic number for a disputed figure.
3. **The opinion is labelled as opinion** ("here is where I will give you my own view"), argued from evidence, and aimed at governments and politicians, never at a religious community.
4. **Name both deaths of 10 November 2015** whenever the violence is mentioned: D. S. Kuttappa and Sahul Hameed. Two men lost their lives.
5. **No inflammatory visuals:** no blood, no burning temples, churches or mosques, no caricatures or stereotyped clothing for any community, no images of real present-day politicians, and no AI-generated "portraits" of Tipu presented as real. People appear as simple line-drawn silhouettes, labelled.
6. **Quotations on screen must be exact,** with the source and date on screen. Politicians' quotes come from the 30 July 2019 newspaper reports (Times of India and The Logical Indian).
7. **Thumbnail and title must not be bait** that inflames one side (for example "Tipu the butcher" or "Tipu the hero"). The working title, "Tyrant or Tiger?", asks a question, which is fine.

---

## 4. Facts still to check before recording

These are listed at the end of the script. Resolve them, or ask the owner, before generating narration:

1. **The 1790 Malabar letter** (to Budruz Zuman Khan, "over four lakh Hindus converted"): check it against William Kirkpatrick, *Select Letters of Tippoo Sultan* (1811; scanned copies exist on Google Books and archive.org). If the wording isn't in Kirkpatrick or another scholarly edition, remove the number from chapter 5 and keep only "letters attributed to Tipu boast of converting large numbers".
2. **Karnataka's official jayantis,** with the year each was introduced, for the calendar graphic in chapter 8. Source: the Kannada and Culture Department, or a newspaper explainer.
3. **Whether Tipu Jayanti was marked this year** (November 2026), and by whom. Add one sourced line to chapter 1 only if there is reliable reporting.
4. **The embassy to France (1787–88)** and **Purnaiah's service as Diwan under the Wodeyars after 1799:** standard in the histories, but not confirmed by the fact-check. Check Mohibbul Hasan or Kate Brittlebank.
5. Keep the source notes at the end of the script up to date with anything you change.

If you have web access, search established newspapers and scholarly sources. Do not use blogs, Reddit, Wikipedia or partisan sites as the final citation; the Gemini report leaned on these in places, and draft 3 kept only what it tied to newspapers, museums or named historians.

---

## 5. Visual design (proposed; confirm with the owner)

The Electrical MCQs videos use the "Aurora" look (indigo, pink and cyan). **Hemanth Explains is a different channel and should look different.** The proposal:

- **Palette:** a warm near-black background (about `#14100b`), parchment `#e9dcc0`, gold ink `#d6a645`, a muted red for Company territory `#b4473a`, a deep green for Mysore `#3f7a5a`, and soft blue for rivers and coast `#5f8fb0`.
- **Type:** a serif display face for titles and quotations (for example Cormorant Garamond or Playfair Display) and a clean sans for labels (for example Inter). Both are on Google Fonts and can be bundled into `public/fonts`.
- **Look:** animated maps that draw themselves in gold ink, documents and letters on aged paper, a slow push-in on each, and a timeline strip along the bottom (as in the other films) running 1750 → 1799 and 2015 → 2019.
- **3D hero scenes**, using the same sprite engine as the other films (section 6), in warm tones:
  1. Chapter 3: a Mysorean rocket (iron tube on a bamboo pole) launching in slow motion, with its arc drawn across the sky.
  2. Chapter 3: the island fort of Srirangapatna between the arms of the Kaveri, with the 1799 breach marked.
  3. Chapter 6: a plan of Srirangapatna with the Ranganathaswamy temple and the palace site side by side.
  4. Chapter 8: the balance, with evidence cards dropping into either pan.
- **Maps:** draw them in code from public-domain outline data, such as Natural Earth country and state outlines, simplified, kept under `public/data/`. The regions (Mysore 1767, 1782, 1792; Company territory; Kodagu, Malabar and the Canara coast) are hand-drawn polygons on top. Label every map with its year.
- **Channel end card:** "Like · Share · Subscribe" and "Hemanth Explains" in the new style. **Ask the owner for the channel's exact handle and URL** before drawing it; do not use the Electrical MCQs handle.

---

## 6. How to build it with the existing tools

The production pipeline is fully described in **`AGENT-GUIDE.md`** in the same repository. Read sections 3–8 there. The short version, adapted for this film:

**Setup** (in `video/`): Node 22, ffmpeg 6+, `npm install`. The owner sets `ELEVENLABS_API_KEY` as an environment variable; never ask for it in chat. On a machine with a GPU, use `--gl=angle` when rendering.

**Steps:**

1. **Register the film** as key `tipu`, composition prefix `Tipu` (IDs `Tipu1`–`Tipu9`), output name `tipu-sultan-tyrant-or-tiger`:
   - `scripts/voice.mjs` → `FILMS`: `tipu: { script: 'hemanth-tipu-sultan.md', out: ['tipu'] },`
   - `scripts/assemble.mjs` → `FILMS`: `tipu: { dir: ['tipu'], voice: ['tipu'], chapters: 9, lead: () => 20, name: 'tipu-sultan-tyrant-or-tiger' },`
   
   The script's "Fact-check notes" section starts with `## Fact-check notes`, which has no chapter number, so `voice.mjs` skips it automatically. Check with `node scripts/voice.mjs tipu` (it lists chapters for free) that exactly 9 chapters appear.
2. **Narration,** only after approval: `node scripts/voice.mjs tipu 1`, then 2 … 9. Use the owner's voice clone (the voice ID is already in `voice.mjs`), unless they choose a different voice for this channel; ask once. Each chapter costs ElevenLabs credits, so never regenerate one that succeeded.
   - **Pronunciation:** check how the voice reads Srirangapatna, Devanahalli, Kodagu, Kodava, Madikeri, Sringeri, Mauludi, Purnaiah, Wodeyar, Pollilur, Siddaramaiah and Yediyurappa. If a name comes out wrong, respell it phonetically in the spoken text only (for example "Shree-ranga-patna"), and keep the correct spelling on screen.
3. **A new kit** for the look: `src/films/tipu/kit.tsx`, with the palette, a `TShell` modelled on `AShell` from `src/films/ac/kit.tsx` (warm haze instead of Aurora), a `TStage` modelled on `AStage` without the grid floor, a caption component in the serif face, a `Quote` component (aged-paper card, attribution line), a map renderer, and a `Timeline` with this film's dates.
4. **Chapters** `src/films/tipu/Tipu1.tsx` … `Tipu9.tsx`, each timed to its narration (print the sentence start times from `public/voice/tipu/chN.json`, as described in `AGENT-GUIDE.md`). Register them in `src/Root.tsx` at 1920×1080.
5. **Check** with `npx tsc --noEmit`, bundle, then `scripts/sheet.sh Tipu<N> 20 <seconds…>`, and look at every sheet. Besides the usual faults (overlaps, cut-off objects, faint lines), check this film specifically for: correct spelling of every name and place; correct years on every map; numbers on screen matching the narration exactly; and quotations matching the sources word for word.
6. **Sound cues** in `scripts/sound/tipu.json`. Keep effects restrained for this subject: a soft whoosh at chapter changes (automatic), and a low impact at the fall of Srirangapatna (chapter 3) at most. No dramatic stingers over the persecution or violence.
7. **Render and assemble:** `scripts/render-film.sh Tipu tipu 1 2 … 9`, then `node scripts/assemble.mjs tipu`, then the share copy and the `.srt`, as in `AGENT-GUIDE.md` section 6. `assemble.mjs` uses `public/audio/bgm.mp3`, the Electrical MCQs music bed. Ask the owner whether this channel should get its own music (it would need generating in ElevenLabs, which costs credits).
8. **Thumbnail** (1280×720): a component `TipuThumb`. Suggested design: the title "Tyrant or Tiger?" in the serif face, a gold-ink map of Mysore with a tiger-stripe motif, and the small line "What the history actually says". No faces, no religious symbols, nothing graphic.

---

## 7. The full package to deliver

The owner expects each video as a package:

1. **The long film:** finished file, share copy, subtitles, thumbnail, and a chapter list with timings.
2. **A Short** (9:16, about 60–75 s): build it with the Shorts pipeline in `AGENT-GUIDE.md` section 7, but restyled in this film's look (the Shorts kit uses Aurora, and its closing card says Electrical MCQs, so make a variant for Hemanth Explains). A suggested hook: "Tipu Sultan fought the British to his last breath. He also deported tens of thousands of his own subjects. Both are true." End by pointing to the full video. Keep the same editorial rules.
3. **An upload kit** (`release/tipu/upload-kit.md`): title, description with chapter times and a short sources list (for a contested history topic, a visible source list builds trust), tags, a pinned comment that invites respectful discussion, and Instagram/Facebook captions. Suggested title: "Tipu Sultan: Tyrant or Tiger? What the history actually says (and why Tipu Jayanti divides Karnataka)". Recommend that the owner keep comments open but use YouTube's "hold potentially inappropriate comments for review" setting on this video.
4. **No Lab experiment** for this one (the Lab is for the electricity series).

---

## 8. Rules that must never be broken

1. Never ask for, print or commit API keys or tokens (ElevenLabs, Netlify or any other).
2. Never generate narration before the script is approved, and never regenerate narration that already exists.
3. Never present a disputed figure or an unverified quotation as established fact.
4. Never write or show content that blames, stereotypes or caricatures a religious or caste community.
5. Keep the owner's personal details private.
6. No AI-model names in commits, code or documents.
7. Commit after each milestone. In the `first-try` repository, push only to branch `ccr-8ea8d772-fjd5i1`, unless the owner says otherwise. If the Explainer Studio is a different repository, copy the script, research brief and this handoff into it, and follow the owner's instructions for that repository.
8. Report honestly. Say that checks were done on still frames, and name the scenes most worth the owner's own review.

---

## 9. Files to bring into the local Explainer Studio

From `HHHkumar/first-try` (branch `ccr-8ea8d772-fjd5i1`):

- `script/hemanth-tipu-sultan.md`: the script, draft 3, with fact-check notes.
- `script/research/tipu-sultan-research-prompt.md`: the research brief.
- `HANDOFF-tipu-sultan.md`: this file.
- `AGENT-GUIDE.md`: the full production manual for the toolchain.
- If the Explainer Studio does not already contain the Remotion project: the whole `video/` folder (the engine, kits, scripts and audio).

And from the owner's Google Drive: the Gemini fact-check report, "Tipu Sultan and Jayanti Verification".

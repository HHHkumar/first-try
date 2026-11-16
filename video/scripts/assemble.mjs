// Joins the rendered chapters into the finished film.
//   node scripts/assemble.mjs              (the resistance film)
//   node scripts/assemble.mjs charge       (The Invisible Push)
// Reads the film's ch1.mp4 ... chN.mp4 and writes, beside them:
//   inside-the-wire.mp4             picture + narration + music and sound effects
//   inside-the-wire-voice-only.mp4  picture + narration, nothing else
//   inside-the-wire.srt             subtitles from the narration timings
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILMS = {
  resistance: { dir: [], voice: [], chapters: 8, lead: (n) => (n === 1 ? 36 : 20), name: 'inside-the-wire' },
  charge: { dir: ['charge'], voice: ['charge'], chapters: 9, lead: () => 20, name: 'the-invisible-push' },
  capacitance: { dir: ['capacitance'], voice: ['capacitance'], chapters: 9, lead: () => 20, name: 'the-space-between' },
  magnetism: { dir: ['magnetism'], voice: ['magnetism'], chapters: 10, lead: () => 20, name: 'the-second-field' },
  inductance: { dir: ['inductance'], voice: ['inductance'], chapters: 9, lead: () => 20, name: 'the-current-that-wont-stop' },
  fields: { dir: ['fields'], voice: ['fields'], chapters: 9, lead: () => 20, name: 'two-fields-one-light' },
};
const film = FILMS[process.argv[2] ?? 'resistance'];
if (!film) throw new Error(`Unknown film "${process.argv[2]}"`);
const out = join(root, 'out', 'final', ...film.dir);
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 }).toString();
const seconds = (file) => Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).trim());

const FPS = 30;
const chapters = Array.from({ length: film.chapters }, (_, i) => i + 1).map((n) => ({
  n,
  file: join(out, `ch${n}.mp4`),
  voice: JSON.parse(readFileSync(join(root, 'public', 'voice', ...film.voice, `ch${n}.json`), 'utf8')),
  lead: film.lead(n) / FPS, // picture before the voice starts (see the chapter files)
}));

let t = 0;
for (const c of chapters) {
  c.start = t;
  c.length = seconds(c.file);
  t += c.length;
}
const total = t;

// --- subtitles ---------------------------------------------------------------
const stamp = (s) => {
  const ms = Math.round(s * 1000);
  const p = (v, n = 2) => String(v).padStart(n, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};
const cues = [];
for (const c of chapters) {
  let line = [];
  const flush = () => {
    if (!line.length) return;
    cues.push({ start: c.start + c.lead + line[0].start, end: c.start + c.lead + line[line.length - 1].end + 0.15, text: line.map((w) => w.text).join(' ') });
    line = [];
  };
  for (const w of c.voice.words) {
    line.push(w);
    const text = line.map((x) => x.text).join(' ');
    const sentenceEnd = /[.?!]$/.test(w.text);
    const clauseEnd = /[,:;]$/.test(w.text);
    if (sentenceEnd || (clauseEnd && text.length > 30) || text.length > 52) flush();
  }
  flush();
}
for (let i = 0; i < cues.length - 1; i++) cues[i].end = Math.min(cues[i].end, cues[i + 1].start - 0.02);
writeFileSync(join(out, `${film.name}.srt`), cues.map((c, i) => `${i + 1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join('\n'));

// --- picture + narration -----------------------------------------------------
const list = join(out, 'concat.txt');
writeFileSync(list, chapters.map((c) => `file '${c.file}'`).join('\n') + '\n');
const voiceOnly = join(out, `${film.name}-voice-only.mp4`);
const joined = join(out, 'joined.mp4');
run('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', joined]);
run('ffmpeg', ['-v', 'error', '-y', '-i', joined, '-c:v', 'copy', '-af', 'volume=7dB,alimiter=limit=0.9', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', voiceOnly]);

// --- music and sound effects ---------------------------------------------------
// public/audio holds a background track and a few effects generated with
// ElevenLabs. The track is repeated with long crossfades to cover the film and
// ducks under the voice. A whoosh marks each chapter change; a film can add its
// own cues in scripts/sound/<film>.json as { chapter, t, sfx, gain } with t in
// narration seconds.
const audio = (name) => join(root, 'public', 'audio', `${name}.mp3`);
const bgmLength = seconds(audio('bgm'));
const XFADE = 6;
const copies = Math.max(1, Math.ceil((total - XFADE) / (bgmLength - XFADE)));
const cues2 = chapters.slice(1).map((c) => ({ at: Math.max(0, c.start - 0.7), sfx: 'whoosh', gain: 0.24 }));
const cueFile = join(root, 'scripts', 'sound', `${process.argv[2] ?? 'resistance'}.json`);
if (existsSync(cueFile)) {
  for (const q of JSON.parse(readFileSync(cueFile, 'utf8'))) {
    const c = chapters[q.chapter - 1];
    cues2.push({ at: c.start + c.lead + q.t, sfx: q.sfx, gain: q.gain ?? 0.3 });
  }
}
const inputs = ['-i', joined];
for (let i = 0; i < copies; i++) inputs.push('-i', audio('bgm'));
for (const q of cues2) inputs.push('-i', audio(q.sfx));
const filters = [];
let bed = '[1:a]';
for (let i = 1; i < copies; i++) {
  filters.push(`${bed}[${i + 1}:a]acrossfade=d=${XFADE}:c1=tri:c2=tri[x${i}]`);
  bed = `[x${i}]`;
}
filters.push(`${bed}atrim=0:${total.toFixed(2)},volume=0.13,afade=t=in:d=2,afade=t=out:st=${(total - 5).toFixed(2)}:d=5,aformat=channel_layouts=stereo[bgm]`);
cues2.forEach((q, i) => filters.push(`[${copies + 1 + i}:a]volume=${(q.gain * 0.5).toFixed(3)},aformat=channel_layouts=stereo,adelay=${Math.round(q.at * 1000)}:all=1[e${i}]`));
filters.push(`[0:a]aformat=channel_layouts=stereo,asplit=2[v1][v2]`);
filters.push(`[bgm][v1]sidechaincompress=threshold=0.02:ratio=4:attack=120:release=900[ducked]`);
filters.push(`[v2][ducked]${cues2.map((_, i) => `[e${i}]`).join('')}amix=inputs=${2 + cues2.length}:normalize=0:duration=first,volume=7dB,alimiter=limit=0.9[mix]`);
const final = join(out, `${film.name}.mp4`);
run('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', filters.join(';'), '-map', '0:v', '-map', '[mix]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', final]);

console.log(`chapters: ${chapters.map((c) => `${c.n}@${c.start.toFixed(1)}s`).join(' ')}`);
console.log(`total ${total.toFixed(1)} s (${(total / 60).toFixed(2)} min), ${cues.length} subtitle cues`);

// Joins the rendered chapters into the finished film.
//   node scripts/assemble.mjs
// Reads out/final/ch1.mp4 ... ch8.mp4 and writes, into out/final:
//   inside-the-wire.mp4             picture + narration + ambient bed
//   inside-the-wire-voice-only.mp4  picture + narration, nothing else
//   inside-the-wire.srt             subtitles from the narration timings
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'out', 'final');
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 }).toString();
const seconds = (file) => Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).trim());

const FPS = 30;
const chapters = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
  n,
  file: join(out, `ch${n}.mp4`),
  voice: JSON.parse(readFileSync(join(root, 'public', 'voice', `ch${n}.json`), 'utf8')),
  lead: (n === 1 ? 36 : 20) / FPS, // picture before the voice starts (see the chapter files)
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
writeFileSync(join(out, 'inside-the-wire.srt'), cues.map((c, i) => `${i + 1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join('\n'));

// --- picture + narration -----------------------------------------------------
const list = join(out, 'concat.txt');
writeFileSync(list, chapters.map((c) => `file '${c.file}'`).join('\n') + '\n');
const voiceOnly = join(out, 'inside-the-wire-voice-only.mp4');
const joined = join(out, 'joined.mp4');
run('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', joined]);
run('ffmpeg', ['-v', 'error', '-y', '-i', joined, '-c:v', 'copy', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', voiceOnly]);

// --- ambient bed -------------------------------------------------------------
// A slow, low drone on D with breathing overtones, a little air, and a soft
// swell where each chapter begins. It ducks under the voice.
const tone = (f, a, rate, phase) => `${a}*sin(2*PI*${f}*t)*(0.55+0.45*sin(2*PI*${rate}*t+${phase}))`;
const left = [tone(73.42, 0.3, 0.06, 0), tone(110.0, 0.22, 0.045, 1.1), tone(146.83, 0.15, 0.08, 2.3), tone(220.0, 0.08, 0.1, 0.4), tone(293.66, 0.04, 0.12, 3.0)].join('+');
const right = [tone(73.6, 0.3, 0.055, 0.7), tone(109.8, 0.22, 0.05, 2.0), tone(147.1, 0.15, 0.075, 0.2), tone(220.6, 0.08, 0.09, 1.9), tone(293.2, 0.04, 0.13, 1.0)].join('+');
const swellAt = chapters.slice(1).map((c) => Math.max(0, c.start - 0.5));
const filters = [
  `aevalsrc='${left}|${right}':s=44100:d=${total.toFixed(2)},lowpass=f=1500,aecho=0.8:0.7:140|310:0.3|0.22,volume=0.035[drone]`,
  `anoisesrc=color=pink:r=44100:d=${total.toFixed(2)},highpass=f=300,lowpass=f=2400,volume=0.004,aformat=channel_layouts=stereo[air]`,
  `anoisesrc=color=pink:r=44100:d=2.4,bandpass=f=700:w=500,afade=t=in:d=0.9,afade=t=out:st=0.9:d=1.5,volume=0.07,aformat=channel_layouts=stereo,asplit=${swellAt.length}${swellAt.map((_, i) => `[s${i}]`).join('')}`,
  ...swellAt.map((s, i) => `[s${i}]adelay=${Math.round(s * 1000)}:all=1[d${i}]`),
  `[drone][air]${swellAt.map((_, i) => `[d${i}]`).join('')}amix=inputs=${2 + swellAt.length}:normalize=0:duration=first,afade=t=in:d=2.5,afade=t=out:st=${(total - 4).toFixed(2)}:d=4[bed]`,
  `[0:a]aformat=channel_layouts=stereo,asplit=2[v1][v2]`,
  `[bed][v1]sidechaincompress=threshold=0.02:ratio=5:attack=120:release=900[ducked]`,
  `[v2][ducked]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-16:TP=-1.5:LRA=11[mix]`,
];
const final = join(out, 'inside-the-wire.mp4');
run('ffmpeg', ['-v', 'error', '-y', '-i', joined, '-filter_complex', filters.join(';'), '-map', '0:v', '-map', '[mix]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', final]);

console.log(`chapters: ${chapters.map((c) => `${c.n}@${c.start.toFixed(1)}s`).join(' ')}`);
console.log(`total ${total.toFixed(1)} s (${(total / 60).toFixed(2)} min), ${cues.length} subtitle cues`);

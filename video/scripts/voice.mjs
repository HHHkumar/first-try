// Generates narration audio and word timings from a film's script.
//   node scripts/voice.mjs resistance 1      -> chapter 1 of the resistance film
//   node scripts/voice.mjs charge 2 3 4      -> several chapters of the charge film
//   node scripts/voice.mjs charge            -> list that film's chapters
// The API key is supplied by the environment's network proxy; set
// ELEVENLABS_API_KEY only when running somewhere without that proxy.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const VOICE_ID = 'Ut4tnRZt9dfqFBruMIJe';
const MODEL_ID = 'eleven_v4';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILMS = {
  resistance: { script: 'narration.md', out: [] },
  charge: { script: 'charge-and-field.md', out: ['charge'] },
  capacitance: { script: 'capacitance.md', out: ['capacitance'] },
  magnetism: { script: 'magnetism.md', out: ['magnetism'] },
  inductance: { script: 'inductance.md', out: ['inductance'] },
  fields: { script: 'fields-together.md', out: ['fields'] },
};
const film = FILMS[process.argv[2]];
if (!film) throw new Error(`Unknown film "${process.argv[2]}". Known: ${Object.keys(FILMS).join(', ')}`);
const outDir = join(root, 'public', 'voice', ...film.out);

export const readChapters = () => {
  const md = readFileSync(join(root, '..', 'script', film.script), 'utf8');
  const chapters = [];
  for (const block of md.split(/^## /m).slice(1)) {
    const [heading, ...rest] = block.split('\n');
    const m = heading.match(/^(\d+)\.\s+(.*)$/);
    if (!m) continue;
    const paragraphs = rest
      .join('\n')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p && !p.startsWith('**On screen') && p !== '---');
    chapters.push({ number: Number(m[1]), title: m[2].trim(), paragraphs });
  }
  return chapters;
};

// Character timings -> word timings, with the paragraph each word belongs to.
const toWords = (text, alignment) => {
  const words = [];
  let current = null;
  let paragraph = 0;
  for (let i = 0; i < alignment.characters.length; i++) {
    const ch = alignment.characters[i];
    if (/\s/.test(ch)) {
      if (current) words.push(current);
      current = null;
      if (ch === '\n' && text[i + 1] === '\n') paragraph++;
      continue;
    }
    if (!current) current = { text: '', start: alignment.character_start_times_seconds[i], end: 0, paragraph };
    current.text += ch;
    current.end = alignment.character_end_times_seconds[i];
  }
  if (current) words.push(current);
  return words;
};

const generate = async (chapter) => {
  const text = chapter.paragraphs.join('\n\n');
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'xi-api-key': process.env.ELEVENLABS_API_KEY ?? 'proxy-injected' },
    body: JSON.stringify({ text, model_id: MODEL_ID }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 400)}`);
  const data = await res.json();
  mkdirSync(outDir, { recursive: true });
  const mp3 = join(outDir, `ch${chapter.number}.mp3`);
  writeFileSync(mp3, Buffer.from(data.audio_base64, 'base64'));
  const duration = Number(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]).toString().trim(),
  );
  const words = toWords(text, data.alignment);
  writeFileSync(
    join(outDir, `ch${chapter.number}.json`),
    JSON.stringify({ chapter: chapter.number, title: chapter.title, characters: text.length, duration, words }, null, 1),
  );
  console.log(`ch${chapter.number} "${chapter.title}": ${text.length} chars, ${words.length} words, ${duration.toFixed(1)} s`);
};

const wanted = process.argv.slice(3).map(Number);
if (wanted.length) {
  for (const chapter of readChapters().filter((c) => wanted.includes(c.number))) await generate(chapter);
} else {
  for (const c of readChapters()) console.log(c.number, c.title, c.paragraphs.join(' ').length, 'chars');
}

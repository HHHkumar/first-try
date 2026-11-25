import type { ReactNode } from 'react';
import { AbsoluteFill, Audio, Easing, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { ramp } from '../../anim';
import { sora } from '../../fonts';
import type { Add } from '../../world/Stage3D';
import { BG, CYAN, PINK, SUN, TEAL } from '../ac/kit';

// The vertical Shorts: 1080 x 1920, one idea in about 75 seconds.
// Every time cue is in narration seconds; the voice starts SL frames in.
export const SW = 1080;
export const SH = 1920;
export const SL = 10;
export const END_PAD = 4.6;
export const st = (s: number) => Math.round(SL + s * 30);
export const ta = (frame: number, t: number, d = 0.5) => ramp(frame, st(t), st(t + d));
export const tspan = (frame: number, a: number, b: number, fade = 8) => Math.min(ramp(frame, st(a), st(a) + fade), 1 - ramp(frame, st(b) - fade, st(b)));
export const shortFrames = (duration: number) => st(duration + END_PAD);
/** a value eased between keyframes [seconds, value] */
export const keys = (frame: number, k: [number, number][]) => {
  let v = k[0][1];
  for (let j = 1; j < k.length; j++) if (frame >= st(k[j - 1][0])) v = k[j - 1][1] + (k[j][1] - k[j - 1][1]) * ramp(frame, st(k[j - 1][0]), st(k[j][0]), Easing.inOut(Easing.quad));
  return v;
};

// Scene transforms: draw a scene built along x so it stands upright, or move it.
export const upright = (add: Add): Add => (x, y, z, s, c, a) => add(-y, x, z, s, c, a);
export const moved = (add: Add, dx: number, dy: number, dz = 0): Add => (x, y, z, s, c, a) => add(x + dx, y + dy, z + dz, s, c, a);

type Word = { text: string; start: number; end: number };
const chunk = (words: Word[]) => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    if (cur.length >= 3 || /[,.?!:;]$/.test(w.text)) {
      out.push(cur);
      cur = [];
    }
  }
  if (cur.length) out.push(cur);
  return out;
};

const Captions = ({ words, frame, until }: { words: Word[]; frame: number; until: number }) => {
  const t = (frame - SL) / 30;
  if (t > until) return null;
  const groups = chunk(words);
  const gi = groups.findIndex((g, i) => t >= g[0].start - 0.05 && (i === groups.length - 1 || t < groups[i + 1][0].start - 0.05));
  if (gi < 0) return null;
  const g = groups[gi];
  const pop = interpolate(t - g[0].start, [-0.05, 0.12], [0.86, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ top: 1180, height: 260, alignItems: 'center', justifyContent: 'center', padding: '0 90px' }}>
      <div style={{ fontFamily: sora, fontWeight: 700, fontSize: 84, lineHeight: 1.08, letterSpacing: -1.5, textAlign: 'center', transform: `scale(${pop})`, textShadow: '0 4px 0 rgba(0,0,0,0.55), 0 0 40px rgba(11,7,34,0.95)' }}>
        {g.map((w, i) => (
          <span key={i} style={{ color: t >= w.start - 0.03 && t < w.end + 0.08 ? SUN : '#ffffff' }}>
            {w.text.replace(/[,;:]$/, '')}
            {i < g.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** A big figure or phrase that pops in above the captions. */
export const Pop = ({ frame, from, to, children, color = SUN, top = 420, size = 96 }: { frame: number; from: number; to: number; children: ReactNode; color?: string; top?: number; size?: number }) => {
  const o = tspan(frame, from, to, 6);
  if (o <= 0.01) return null;
  const s = interpolate(frame - st(from), [0, 7], [0.7, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill style={{ top, height: size * 2.6, alignItems: 'center', justifyContent: 'center', opacity: o, padding: '0 70px' }}>
      <div style={{ fontFamily: sora, fontWeight: 700, fontSize: size, lineHeight: 1.05, letterSpacing: -2, color, textAlign: 'center', transform: `scale(${s})`, textShadow: `0 0 50px ${color}88, 0 4px 0 rgba(0,0,0,0.5)` }}>{children}</div>
    </AbsoluteFill>
  );
};

/** A small label placed by hand over part of the scene. */
export const Tag = ({ x, y, opacity, children, color = '#ffffff', size = 44, align = 'center' }: { x: number; y: number; opacity: number; children: ReactNode; color?: string; size?: number; align?: 'left' | 'center' | 'right' }) =>
  opacity <= 0.01 ? null : (
    <div style={{ position: 'absolute', left: align === 'center' ? x - 400 : align === 'right' ? x - 800 : x, top: y, width: 800, textAlign: align, opacity, fontFamily: sora, fontWeight: 600, fontSize: size, color, textShadow: '0 0 24px rgba(11,7,34,0.95), 0 2px 0 rgba(0,0,0,0.6)' }}>
      {children}
    </div>
  );

export type ShortInfo = { n: number; id: string; film: string; headline: ReactNode; lab: string };
export const SHORTS: Omit<ShortInfo, 'headline'>[] = [
  { n: 1, id: 'wire', film: 'Inside the Wire', lab: 'wire' },
  { n: 2, id: 'charge', film: 'The Invisible Push', lab: 'charge' },
  { n: 3, id: 'capacitor', film: 'The Space Between', lab: 'capacitor' },
  { n: 4, id: 'magnet', film: 'The Second Field', lab: 'magnet' },
  { n: 5, id: 'inductor', film: 'The Current That Won’t Stop', lab: 'inductor' },
  { n: 6, id: 'light', film: 'Two Fields, One Light', lab: 'light' },
  { n: 7, id: 'generator', film: 'The Field That Moves the World', lab: 'generator' },
  { n: 8, id: 'ac', film: 'Back and Forth', lab: 'ac' },
  { n: 9, id: 'rlc', film: 'Out of Step', lab: 'rlc' },
];

const HAZE =
  'radial-gradient(ellipse 80% 40% at 15% 18%, rgba(0,220,200,0.24), rgba(0,220,200,0) 70%), radial-gradient(ellipse 80% 45% at 90% 35%, rgba(214,60,255,0.22), rgba(214,60,255,0) 70%), radial-gradient(ellipse 100% 30% at 50% 100%, rgba(60,90,255,0.28), rgba(60,90,255,0) 75%)';

/** The frame every Short shares. `endAt` is when the closing line begins. */
export const ShortShell = ({ n, voice, headline, endAt, world, children }: { n: number; voice: { duration: number; words: Word[] }; headline: ReactNode; endAt: number; world: ReactNode; children?: ReactNode }) => {
  const frame = useCurrentFrame();
  const info = SHORTS[n - 1];
  const total = shortFrames(voice.duration);
  const end = ramp(frame, st(endAt) - 4, st(endAt) + 10);
  const cover = Boolean((getInputProps() as { cover?: boolean }).cover);
  const hookBig = cover ? 1 : 1 - ramp(frame, st(3.2), st(3.9), Easing.inOut(Easing.cubic));
  const fadeOut = ramp(frame, total - 10, total - 1);
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: sora, color: '#fff' }}>
      <AbsoluteFill style={{ opacity: 1 - 0.78 * end }}>{world}</AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: 'screen', background: HAZE }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(11,7,34,0.85) 0%, rgba(11,7,34,0) 22%, rgba(11,7,34,0) 58%, rgba(11,7,34,0.55) 80%, rgba(11,7,34,0.85) 100%)' }} />
      {/* progress bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, height: 10, width: `${(frame / total) * 100}%`, background: `linear-gradient(90deg, ${PINK}, ${CYAN})` }} />
      {/* headline: big for the hook, then held smaller at the top */}
      <div style={{ position: 'absolute', left: 70, right: 70, top: interpolate(hookBig, [0, 1], [150, 300]), textAlign: 'center', opacity: 1 - end }}>
        <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: 7, color: TEAL, textTransform: 'uppercase', marginBottom: 14 }}>Electrical MCQs · in 90 seconds</div>
        <div style={{ fontSize: interpolate(hookBig, [0, 1], [62, 104]), fontWeight: 700, lineHeight: 1.04, letterSpacing: -2, textShadow: '0 0 40px rgba(11,7,34,0.9), 0 4px 0 rgba(0,0,0,0.45)' }}>{headline}</div>
      </div>
      {cover ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center' }}>
          <span style={{ fontSize: 44, fontWeight: 700, color: BG, background: SUN, borderRadius: 999, padding: '16px 40px' }}>{info.film}</span>
        </div>
      ) : (
        <>
          <AbsoluteFill style={{ opacity: 1 - end }}>{children}</AbsoluteFill>
          <Captions words={voice.words} frame={frame} until={endAt - 0.05} />
        </>
      )}
      {/* the closing card */}
      {end > 0.01 ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '0 90px', opacity: end, textAlign: 'center' }}>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: 7, color: TEAL, textTransform: 'uppercase' }}>The full video</div>
          <div style={{ fontSize: 100, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2.5, marginTop: 24, textShadow: `0 0 70px ${PINK}66` }}>{info.film}</div>
          <div style={{ fontSize: 42, fontWeight: 300, marginTop: 22, opacity: 0.85 }}>on the channel</div>
          <div style={{ marginTop: 90, fontSize: 34, fontWeight: 600, letterSpacing: 5, color: '#a9a2d2', textTransform: 'uppercase' }}>Try it yourself</div>
          <div style={{ fontSize: 52, fontWeight: 600, color: SUN, marginTop: 14 }}>electricalmcqs.in/lab</div>
          <div style={{ marginTop: 90, fontSize: 46, fontWeight: 700, color: BG, background: CYAN, borderRadius: 999, padding: '22px 54px', boxShadow: `0 0 60px ${CYAN}88` }}>Follow @electricalmcqs</div>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ backgroundColor: BG, opacity: Math.max(1 - ramp(frame, 0, 6), fadeOut) }} />
      <Sequence from={SL}>
        <Audio src={staticFile(`voice/shorts/ch${n}.mp3`)} />
      </Sequence>
      <Audio src={staticFile('audio/bgm.mp3')} loop volume={(f) => (f < st(endAt) ? 0.075 : 0.2) * (1 - ramp(f, total - 30, total))} />
      <Audio src={staticFile('audio/whoosh.mp3')} volume={0.3} />
      <Sequence from={st(endAt)}>
        <Audio src={staticFile('audio/shimmer.mp3')} volume={0.32} />
      </Sequence>
    </AbsoluteFill>
  );
};

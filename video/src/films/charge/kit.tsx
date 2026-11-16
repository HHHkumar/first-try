import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { ramp } from '../../anim';
import { sora } from '../../fonts';
import { C } from '../../theme';
import { T } from '../../ui/Shell';
import { drawArrow, drawCharge, POS, type Charge } from '../../world/field';
import { rgb, type Add } from '../../world/Stage3D';

// Pieces shared by every chapter of "The Invisible Push".
export const VOICE = (n: number) => `charge/ch${n}`;
export const at = (frame: number, t: number, d = 0.6) => ramp(frame, T(t), T(t + d));
export const INK = '#d7e6ff';

// The people behind the ideas, in historical order. Each chapter lights the
// ones it has reached; the strip stays on screen for the whole film.
export const TIMELINE = [
  { year: '600 BC', name: 'Thales' },
  { year: '1600', name: 'Gilbert' },
  { year: '1733', name: 'du Fay' },
  { year: '1747', name: 'Franklin' },
  { year: '1752', name: 'Lightning rod' },
  { year: '1785', name: 'Coulomb' },
  { year: '1800', name: 'Volta' },
  { year: '1830s', name: 'Faraday' },
  { year: '1836', name: 'Faraday’s cage' },
  { year: '1860s', name: 'Maxwell' },
  { year: '1897', name: 'Thomson' },
  { year: '1910', name: 'Millikan' },
] as const;

type TimelineProps = {
  frame: number;
  already: number[]; // lit before this chapter began
  events?: [number, number][]; // [index, narration seconds] lit during this chapter
  opacity?: number;
  entries?: readonly { year: string; name: string }[];
};

export const Timeline = ({ frame, already, events = [], opacity = 1, entries = TIMELINE }: TimelineProps) => {
  const level: number[] = entries.map((_, i) => (already.includes(i) ? 1 : 0));
  let current = -1;
  for (const [i, t] of events) {
    level[i] = Math.max(level[i], at(frame, t, 0.8));
    if (frame >= T(t) && frame < T(t + 7)) current = i;
  }
  return (
    <div style={{ position: 'absolute', left: 110, right: 110, bottom: 34, height: 70, opacity, fontFamily: sora }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 9, height: 2, background: 'rgba(147,163,192,0.28)' }} />
      {entries.map((e, i) => {
        const lit = level[i];
        const now = i === current;
        const color = now ? C.electron : C.text;
        return (
          <div key={e.year + e.name} style={{ position: 'absolute', left: `${(i / (entries.length - 1)) * 100}%`, top: 0, width: 0 }}>
            <div
              style={{
                position: 'absolute',
                left: -7,
                top: 3,
                width: 14,
                height: 14,
                borderRadius: 7,
                background: lit > 0.05 ? color : C.bg0,
                border: `2px solid ${lit > 0.05 ? color : 'rgba(147,163,192,0.4)'}`,
                opacity: 0.35 + 0.65 * lit,
                boxShadow: now ? `0 0 18px 4px ${C.electron}` : undefined,
              }}
            />
            <div style={{ position: 'absolute', left: -80, width: 160, top: 26, textAlign: 'center', opacity: 0.2 + 0.8 * lit, color }}>
              <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: 1 }}>{e.year}</div>
              <div style={{ fontSize: 17, fontWeight: 400, color: now ? C.electron : C.dim, whiteSpace: 'nowrap' }}>{e.name}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Caption, lifted clear of the timeline strip.
export const Cap = ({ opacity, kicker, title }: { opacity: number; kicker: string; title: string }) => (
  <AbsoluteFill style={{ justifyContent: 'flex-end', padding: '0 0 150px 110px', opacity }}>
    <div style={{ fontFamily: sora, fontSize: 22, fontWeight: 600, letterSpacing: 5, textTransform: 'uppercase', color: C.electron, marginBottom: 12, transform: `translateY(${(1 - opacity) * 10}px)` }}>
      {kicker}
    </div>
    <div style={{ fontFamily: sora, fontSize: 46, fontWeight: 300, color: C.text, letterSpacing: -0.5, textShadow: '0 2px 30px rgba(3,6,13,0.95)', transform: `translateY(${(1 - opacity) * 16}px)` }}>
      {title}
    </div>
  </AbsoluteFill>
);

// Glowing line drawing: the film's way of showing people and apparatus.
export const Ink = ({ children, opacity = 1, color = INK, width = 3.5, style }: { children: ReactNode; opacity?: number; color?: string; width?: number; style?: CSSProperties }) =>
  opacity <= 0 ? null : (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity, filter: `drop-shadow(0 0 7px ${color}aa)`, ...style }}>
      <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );

// 1 while a shot is on screen, dipping to 0 for a few frames at each end.
export const shot = (frame: number, from: number, to: number, fade = 10) => Math.min(ramp(frame, T(from), T(from) + fade), 1 - ramp(frame, T(to) - fade, T(to)));

// Two pairs of charges showing the rule: like kinds push apart, unlike pull together.

export const drawPairs = (orb: Add | null, glow: Add | null, cam: readonly number[], frame: number, like: number, unlike: number, y1 = 1.9, y2 = -1.9) => {
  const breathe = 0.5 - 0.5 * Math.cos(frame * 0.05);
  const pairs: { cs: Charge[]; dir: number; g: number }[] = [
    { cs: [{ x: -1.5 - 0.9 * breathe, y: y1, z: 0, q: 1 }, { x: 1.5 + 0.9 * breathe, y: y1, z: 0, q: 1 }], dir: 1, g: like },
    { cs: [{ x: -2.4 + 0.9 * breathe, y: y2, z: 0, q: 1 }, { x: 2.4 - 0.9 * breathe, y: y2, z: 0, q: -1 }], dir: -1, g: unlike },
  ];
  for (const p of pairs) {
    if (p.g <= 0.01) continue;
    for (const c of p.cs) drawCharge(orb ?? (() => {}), glow ?? (() => {}), c, cam, 0.42, p.g);
    if (glow) {
      // force arrows: outward for a like pair, inward for an unlike pair
      const [a, b] = p.cs;
      drawArrow(glow, a.x - 0.6 * p.dir, a.y, 0, -p.dir, 0, 0, 1.3, POS, p.g, 0.1);
      drawArrow(glow, b.x + 0.6 * p.dir, b.y, 0, p.dir, 0, 0, 1.3, POS, p.g, 0.1);
    }
  }
};

// Two charged plates facing each other, with the uniform field between them.
// Positive plate on the left, negative on the right; the field points +x.
export type PlateOptions = {
  half?: number; // half the gap
  appear?: number;
  charge?: number; // how much surface charge has gathered
  lines?: number; // how much of each field line is drawn
  lineGain?: number;
  hide?: { from: number; to: number; amount: number }; // a stretch with no field (inside a conductor)
  size?: number; // scales the plates' height and depth (area grows with size squared)
};

export const drawPlates = (orb: Add | null, glow: Add | null, frame: number, o: PlateOptions = {}) => {
  const { half = 3.4, appear = 1, charge = 1, lines = 1, lineGain = 1, hide, size = 1 } = o;
  const ny = Math.round(3 * size);
  const nz = Math.round(2 * size);
  if (appear <= 0.01) return;
  if (orb) {
    const hot = rgb('#ffb35c');
    const cool = rgb('#8a96b4');
    for (let layer = 0; layer < 2; layer++)
      for (let y = -ny; y <= ny; y++)
        for (let z = -nz * 1.5; z <= nz * 1.5 + 0.01; z += 1.5) {
          orb(-half - layer * 0.8, y, z, 0.54, hot, appear);
          orb(half + layer * 0.8, y, z, 0.54, cool, appear);
        }
  }
  if (!glow) return;
  const neg = rgb('#4fc8ff');
  const pos = rgb('#ff7d4d');
  const white = rgb('#eafcff');
  const fieldColour = rgb('#b7a2ff');
  // charge sitting on the inner faces
  const count = Math.round(70 * charge * size * size);
  for (let i = 0; i < count; i++) {
    const y = (((i * 0.618034) % 1) * 2 - 1) * (ny + 0.2);
    const z = (((i * 0.754878 + 0.13) % 1) * 2 - 1) * (nz * 1.5 + 0.2);
    const tw = 0.7 + 0.3 * Math.sin(frame * 0.09 + i);
    glow(half - 0.5, y, z, 0.5, neg, 0.6 * appear * tw);
    glow(half - 0.5, y, z, 0.14, white, appear);
    glow(-half + 0.5, y + 0.2, z - 0.2, 0.42, pos, 0.7 * appear * tw);
  }
  // the field, straight across the gap
  if (lines <= 0.01) return;
  const span = half * 2 - 1.3;
  const n = Math.round(span / 0.1);
  let k = 0;
  for (let y = -(ny - 0.6); y <= ny - 0.59; y += 1.2)
    for (let z = -(nz * 1.5 - 1); z <= nz * 1.5 - 0.99; z += 2) {
      k++;
      for (let i = 0; i <= n * lines; i++) {
        const x = -half + 0.65 + i * 0.1;
        let a = 1;
        if (hide && x > hide.from && x < hide.to) a = 1 - hide.amount;
        if (a <= 0.01) continue;
        const phase = (((i - frame * 0.9 + k * 13) % 44) + 44) % 44;
        const pulse = Math.exp(-((phase - 22) ** 2) / 20);
        glow(x, y, z, 0.07 + 0.11 * pulse, fieldColour, (0.5 + 0.7 * pulse) * lineGain * a * appear);
      }
    }
};

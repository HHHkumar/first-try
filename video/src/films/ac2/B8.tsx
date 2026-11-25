import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac2/ch8.json';
import { lerp, span } from '../../anim';
import { C } from '../../theme';
import { sora } from '../../fonts';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { rgb, type Add } from '../../world/Stage3D';
import { AShell, AStage, at, Cap, CYAN, PINK, ribbon, shot, SUN, sway, TEAL, VIOLET, WHITE } from '../ac/kit';
import { capacitor, coil, COPPER, flow, resistor, station, Timeline, VOICE, wire } from './kit';

// Chapter 8 - Putting them to work: the loudspeaker crossover, the choke, and CIVIL.
export const B8_FRAMES = chapterFrames(voice.duration);

// a loudspeaker cone facing the camera
const cone = (add: Add, cx: number, cy: number, R: number, push: number, color: string, gain: number) => {
  for (let k = 1; k <= 6; k++) {
    const r = (R * k) / 6;
    const n = Math.round(22 + 60 * (r / 1.6));
    for (let i = 0; i < n; i++) add(cx + Math.cos((i / n) * 6.283) * r, cy + Math.sin((i / n) * 6.283) * r, 1 - (1 - k / 6) * 0.7 + push * (1 - k / 7), k === 6 ? 0.16 : 0.11, rgb(k === 6 ? WHITE : color), (k === 6 ? 0.8 : 0.4 + 0.5 * Math.abs(push) * 3) * gain);
  }
  add(cx, cy, 0.4 + push, 0.5 * R, rgb(color), 0.7 * gain);
};
const box = (add: Add, x0: number, x1: number, y0: number, y1: number, gain: number) => {
  for (const z of [1, -2]) {
    wire(add, x0, y0, x1, y0, gain, z);
    wire(add, x0, y1, x1, y1, gain, z);
    wire(add, x0, y0, x0, y1, gain, z);
    wire(add, x1, y0, x1, y1, gain, z);
  }
  for (const x of [x0, x1]) for (const y of [y0, y1]) for (let z = -2; z <= 1; z += 0.08) add(x, y, z, 0.11, rgb(WHITE), 0.55 * gain);
};
const LETTERS: [string, string][] = [
  ['C', VIOLET],
  ['I', CYAN],
  ['V', PINK],
  ['I', CYAN],
  ['L', COPPER],
];

export const B8 = () => {
  const frame = useCurrentFrame();
  const mode = frame < T(32.2) ? 0 : frame < T(48.0) ? 1 : 2;
  const u = (x: number) => x * 0.75 - frame * 0.07;
  const low = (x: number) => Math.sin(u(x));
  const high = (x: number) => Math.sin(5.5 * u(x));
  const cab = at(frame, 7.8);
  const lo = at(frame, 15.1);
  const hi = at(frame, 23.4);
  const useCoil = at(frame, 40.4);
  const now = frame * 0.05;
  const g1 = span(frame, T(54.3), T(62.5), 8);
  const g2 = span(frame, T(62.7), T(71.4), 8);

  return (
    <AShell
      voice={VOICE(8)}
      frames={B8_FRAMES}
      world={
        <AStage
          opacity={Math.max(shot(frame, -1, 32.3), shot(frame, 32.1, 48.1), shot(frame, 47.9, 200)) * (mode === 2 ? 0.75 : 1)}
          pose={mode === 0 ? { pos: [-1 + sway(frame), 2.2, 25], target: [-1.4, 0, 0], fov: 34, focus: 25, dof: 0.022 } : mode === 1 ? { pos: [sway(frame), 2.2, 21], target: [0, 0.3, 0], fov: 34, focus: 21, dof: 0.028 } : { pos: [sway(frame), 2.2, 26], target: [0, -0.1, 0], fov: 34, focus: 26, dof: 0.022 }}
          scene={(add) => {
            if (mode === 0) {
              // the signal: slow and fast waves tangled together
              ribbon(add, -14, -6.4, (x) => 0.2 + 0.8 * low(x) + 0.4 * high(x), () => rgb(WHITE), { axis: 0.2, fill: false });
              wire(add, -6.2, -1.6, -6.2, 2.0, Math.max(lo, hi));
              // low notes: through the coil, to the large cone
              wire(add, -6.2, -1.6, -5.2, -1.6, lo);
              coil(add, -3.6, -2.2, 0.9 * low(-3.6), frame, lo, { len: 2.2, r: 0.6, turns: 6, field: 0.7 });
              ribbon(add, -1.6, 4.6, (x) => -1.6 + 0.8 * low(x) + 0.04 * high(x), () => rgb(SUN), { axis: -1.6, fill: false, gain: lo });
              // high notes: through the capacitor, to the small cone
              capacitor(add, -3.6, 2.0, 0.9 * high(-3.6), frame, hi, { h: 0.7, gap: 0.4, lead: 2.2 });
              ribbon(add, -1.6, 4.6, (x) => 2.0 + 0.5 * high(x) + 0.05 * low(x), () => rgb(TEAL), { axis: 2.0, fill: false, gain: hi });
              box(add, 5, 9.6, -3.0, 3.4, cab);
              cone(add, 7.3, -1.0, 1.6, 0.16 * low(5) * lo, SUN, cab);
              cone(add, 7.3, 2.2, 0.7, 0.1 * high(5) * hi, TEAL, cab);
              return;
            }
            if (mode === 1) {
              // a fluorescent tube, and what limits its current
              for (let x = -6; x <= 6; x += 0.12) add(x, 2.4, 0, 0.55, [0.85, 0.93, 1], 0.5 + 0.08 * Math.sin(frame * 1.9));
              add(0, 2.4, 0, 16, [0.7, 0.85, 1], 0.12);
              for (const x of [-6.3, 6.3]) add(x, 2.4, 0, 0.5, rgb(WHITE), 0.9);
              wire(add, -6.3, 2.4, -6.3, -1.0, 1);
              wire(add, 6.3, 2.4, 6.3, -1.0, 1);
              wire(add, -6.3, -1.0, -2.9, -1.0, 1);
              wire(add, 2.9, -1.0, 6.3, -1.0, 1);
              flow(add, -6.3, -3, -1.0, -Math.cos(now) * 0.5, CYAN, 0.8, 0.3);
              flow(add, 3, 6.3, -1.0, -Math.cos(now) * 0.5, CYAN, 0.8, 0.3);
              resistor(add, 0, -1.0, 0.6 + 0.4 * Math.sin(now) ** 2, 1 - useCoil, 1.1);
              coil(add, 0, -2.0, -Math.cos(now), frame, useCoil, { len: 3.4, r: 1.0 });
              return;
            }
            station(add, -10.8, 'C', now, frame);
            station(add, 10.8, 'L', now, frame);
          }}
        />
      }
    >
      <Panel opacity={shot(frame, 10.3, 32.1)} style={{ left: 0, top: 0, width: 1920, height: 1080 }}>
        <div style={{ position: 'absolute', left: 1130, top: 285, fontSize: 30, fontWeight: 300, color: TEAL, opacity: at(frame, 12.6) }}>high notes</div>
        <div style={{ position: 'absolute', left: 1130, top: 735, fontSize: 30, fontWeight: 300, color: SUN }}>low notes</div>
      </Panel>
      <Panel opacity={shot(frame, 36.8, 47.9)} style={{ left: 0, right: 0, top: 190, textAlign: 'center', fontSize: 40, fontWeight: 300 }}>
        {frame < T(40.4) ? <span style={{ color: '#ff9a4a' }}>a resistor: wastes energy as heat</span> : <span style={{ color: COPPER }}>a choke: limits by reactance, wastes almost nothing</span>}
      </Panel>
      <Panel opacity={shot(frame, 52.3, 200)} style={{ left: 0, right: 0, top: 250, textAlign: 'center', fontFamily: sora }}>
        <div style={{ fontSize: 240, fontWeight: 600, letterSpacing: 26, lineHeight: 1 }}>
          {LETTERS.map(([ch, col], k) => {
            const on = (k <= 2 ? g1 : 0) + (k >= 2 ? g2 : 0);
            const off = (k > 2 ? g1 : 0) + (k < 2 ? g2 : 0);
            return (
              <span key={k} style={{ color: on > 0.5 ? col : C.text, opacity: lerp(0.9, 0.2, off), textShadow: on > 0.5 ? `0 0 60px ${col}` : 'none' }}>
                {ch}
              </span>
            );
          })}
        </div>
        <div style={{ fontSize: 46, fontWeight: 300, marginTop: 40, height: 60 }}>
          <span style={{ opacity: g1 }}>
            in a <span style={{ color: VIOLET }}>capacitor</span>, <span style={{ color: CYAN }}>current</span> comes before <span style={{ color: PINK }}>voltage</span>
          </span>
        </div>
        <div style={{ fontSize: 46, fontWeight: 300, marginTop: -60, height: 60 }}>
          <span style={{ opacity: g2 }}>
            in an <span style={{ color: COPPER }}>inductor</span>, <span style={{ color: PINK }}>voltage</span> comes before <span style={{ color: CYAN }}>current</span>
          </span>
        </div>
        <div style={{ fontSize: 46, fontWeight: 300, marginTop: 0, display: 'flex', justifyContent: 'center', gap: 120 }}>
          <span style={{ opacity: at(frame, 71.6), color: VIOLET }}>Capacitor: current leads</span>
          <span style={{ opacity: at(frame, 73.9), color: COPPER }}>Inductor: current lags</span>
        </div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(7.6))} kicker="Coils and capacitors treat frequencies differently" title="So we can use them to sort one frequency from another" />
      <Cap opacity={span(frame, T(7.8), T(14.9))} kicker="Look inside a loudspeaker cabinet" title="A large cone for the low notes, a small one for the high notes" />
      <Cap opacity={span(frame, T(15.1), T(23.2))} kicker="A coil is wired in line with the large cone" title="Low frequencies pass easily; high ones are held back" />
      <Cap opacity={span(frame, T(23.4), T(32.0))} kicker="A capacitor in line with the small cone does the opposite" title="Each note is sent to the cone that can play it" />
      <Cap opacity={span(frame, T(32.4), T(47.9))} kicker="A coil is also the gentlest way to limit an alternating current" title="That is the job of the choke in an old fluorescent lamp" />
      <Cap opacity={span(frame, T(48.2), T(200))} kicker="A way to remember which way round the timing goes" title="Think of the word CIVIL" />
      <Timeline frame={frame} already={[0, 1, 2, 3]} />
    </AShell>
  );
};

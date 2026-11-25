import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/fields/ch2.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { caveat } from '../../fonts';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Kicker, Meter } from '../../ui/type';
import { drawLines, traceLines } from '../../world/field';
import { barPoles, BFIELD, CURRENT, drawBarMagnet, NORTH } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { ringLoop, shiftLines } from '../induction/kit';
import { at, B, Cap, E, EFIELD, ring, shot, Timeline, VOICE } from './kit';

// Chapter 2 - Faraday: a changing magnetic field makes an electric field.
export const F2_FRAMES = chapterFrames(voice.duration);
const io = Easing.inOut(Easing.quad);
// a meter needle that kicks at time t0 (seconds of narration) and settles back
const kick = (frame: number, t0: number, sign: number) => {
  const s = (frame - T(t0)) / 30;
  return s < 0 ? 0 : sign * Math.exp(-s * 1.3) * Math.cos(s * 5);
};
const pushAt = (f: number) => ramp(f, T(52.6), T(54.8), io) - ramp(f, T(59.3), T(61.6), io);

export const F2 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const lines = useMemo(() => traceLines(barPoles(0, 0, 1.4), { perCharge: 14, bound: 7 }), []);
  const note = span(frame, T(-1), T(17.5), 12);
  const sRing = shot(frame, 17.5, 48.9);
  const sMagnet = shot(frame, 48.7, 68.3);
  const sSpace = shot(frame, 68.1, 109.5);
  const sCooker = shot(frame, 109.3, 160);
  const which = frame < T(48.8) ? 0 : frame < T(68.2) ? 1 : frame < T(109.4) ? 2 : 3;
  const on = frame >= T(41.4) && frame < T(46.4);
  const needle1 = kick(frame, 41.6, 1) + kick(frame, 46.6, -1);
  const push = pushAt(frame);
  const rate = (pushAt(frame + 1) - pushAt(frame - 1)) * 30;
  const mx = lerp(-6.4, -2.6, push);
  const grow = 0.5 + 0.5 * Math.sin(frame * 0.05);
  const wire = 1 - ramp(frame, T(104.0), T(106.0));
  const heat = ramp(frame, T(121.0), T(131.0));
  const side = (s: number): CameraPose => ({ pos: [s + Math.sin(frame * 0.003) * 1.5, 3.2, 14.5], target: [0, 0, 0], fov: 34, focus: 15.5, dof: 0.04 });

  return (
    <Shell
      voice={VOICE(2)}
      frames={F2_FRAMES}
      world={
        frame > T(17.4) ? (
          <AbsoluteFill style={{ opacity: Math.max(sRing, sMagnet, sSpace, sCooker) }}>
            <Stage3D
              width={width}
              height={height}
              pose={which === 0 ? { pos: [Math.sin(frame * 0.003) * 1.5, 2.2, 14], target: [0, 0, 0], fov: 34, focus: 14, dof: 0.04 } : which === 3 ? { pos: [4 + Math.sin(frame * 0.003) * 1.5, 5, 13], target: [0, 0.2, 0], fov: 34, focus: 14.5, dof: 0.04 } : side(6)}
              deep={which === 0 ? [0.1, 0.11, 0.14] : undefined}
              orbs={(add) => {
                if (which === 0) for (let i = 0; i < 40; i++) for (const z of [-0.22, 0.22]) add(Math.cos((i / 40) * 6.283) * 2.4, Math.sin((i / 40) * 6.283) * 2.4, z, 0.6, rgb('#8f9bb6'), 1);
                if (which === 1) drawBarMagnet(add, mx, 0, 1.4);
              }}
              glows={(add) => {
                if (which === 0) {
                  // two separate coils wound on the iron ring
                  for (let k = -3; k <= 3; k++) {
                    const d = k * 0.17;
                    ring(add, -2.4 * Math.cos(d), 2.4 * Math.sin(d), 0, 'y', 0.75, 0, '#e8935a', 0.75);
                    ring(add, -2.4 * Math.cos(d), 2.4 * Math.sin(d), 0, 'y', 0.75, frame * 1.4, CURRENT, on ? 1 : 0);
                    ring(add, 2.4 * Math.cos(d), 2.4 * Math.sin(d), 0, 'y', 0.75, 0, '#c8d4ea', 0.75);
                    ring(add, 2.4 * Math.cos(d), 2.4 * Math.sin(d), 0, 'y', 0.75, frame * 1.4, '#ffb36b', Math.min(1, Math.abs(needle1) * 1.6), needle1 > 0 ? 1 : -1);
                  }
                  // the flux in the iron while the current flows
                  if (on) ring(add, 0, 0, 0.7, 'z', 2.4, frame, BFIELD, 0.9);
                }
                if (which === 1) {
                  drawLines(add, shiftLines(lines, mx), frame, 0.9, BFIELD, { bold: true });
                  for (const x of [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9]) ringLoop(add, 1.4 + x, 0, 0, 1.7, 0, frame, rate * 2);
                }
                if (which === 2) {
                  // a magnetic field through the middle, growing and shrinking
                  const c = rgb(BFIELD);
                  for (const [y, z] of [[0, 0], [0.6, 0], [-0.6, 0], [0, 0.6], [0, -0.6], [0.45, 0.45], [-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45]])
                    for (let i = 0; i <= 90; i++) {
                      const x = -5 + i * 0.11;
                      const phase = (((i - frame * 0.7 + y * 20 + z * 9) % 30) + 30) % 30;
                      const pulse = Math.exp(-(phase * phase) / 12);
                      add(x, y, z, 0.09 + 0.1 * pulse, c, (0.45 + 0.55 * pulse) * (0.45 + 0.55 * grow));
                    }
                  // the wire loop, then only the electric field that was pushing its charges
                  const g = rgb('#c8d4ea');
                  for (let i = 0; i < 120; i++) add(0, Math.cos((i / 120) * 6.283) * 2.2, Math.sin((i / 120) * 6.283) * 2.2, 0.17, g, 0.8 * wire);
                  const dir = Math.cos(frame * 0.05) > 0 ? 1 : -1;
                  const strength = Math.abs(Math.cos(frame * 0.05));
                  ring(add, 0, 0, 0, 'x', 2.2, frame, EFIELD, at(frame, 80.9) * (0.6 + 0.6 * strength), dir);
                  for (const [x, r] of [[0, 3.2], [-2.4, 2.4], [2.4, 2.4], [0, 1.3]]) ring(add, x, 0, 0, 'x', r, frame, EFIELD, at(frame, 96.4) * (0.5 + 0.5 * strength), dir);
                }
                if (which === 3) {
                  // the glass of an induction cooker, the coil beneath it, and a pan on top
                  const glass = rgb('#9fd4ff');
                  for (let x = -5; x <= 5.01; x += 0.4) for (let z = -3; z <= 3.01; z += 0.4) add(x, 0, z, 0.1, glass, 0.3);
                  for (const r of [0.6, 1.1, 1.6, 2.1]) {
                    ring(add, 0, -0.6, 0, 'y', r, 0, '#e8935a', 0.7);
                    ring(add, 0, -0.6, 0, 'y', r, frame * 2, CURRENT, 0.9, Math.sin(frame * 0.3) > 0 ? 1 : -1);
                  }
                  for (let y = 0.25; y <= 1.7; y += 0.24) ring(add, 0, y, 0, 'y', 2.4, 0, '#c8d4ea', 0.6);
                  // the changing field through the pan, and the currents it drives in the base
                  const beat = 0.5 + 0.5 * Math.sin(frame * 0.3);
                  for (const s of [-1, 1]) {
                    ring(add, s * 1.3, 0, 0, 'z', 1.3, frame, BFIELD, 0.4 + 0.5 * beat);
                    ring(add, 0, 0, s * 1.3, 'x', 1.3, frame, BFIELD, 0.4 + 0.5 * beat);
                  }
                  for (const r of [0.5, 1.0, 1.5, 2.0]) ring(add, 0, 0.22, 0, 'y', r, frame * 1.5, NORTH, at(frame, 121.0) * (0.5 + 0.5 * heat));
                  add(0, 0.25, 0, 5, rgb(NORTH), 0.3 * heat);
                }
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Scene opacity={note}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 220, textAlign: 'center' }}>
          <Kicker>Michael Faraday · once electricity had made magnetism, the reverse must be possible</Kicker>
          <div style={{ fontFamily: caveat, fontSize: 150, color: '#f4ead2', marginTop: 70, opacity: at(frame, 12.6), transform: 'rotate(-2deg)' }}>Convert magnetism into electricity</div>
          <div style={{ fontSize: 40, fontWeight: 300, color: C.dim, marginTop: 50, opacity: at(frame, 15.4) }}>a note to himself: it took him ten years</div>
        </Panel>
      </Scene>

      <Panel opacity={span(frame, T(23.2), T(48.7))} style={{ right: 110, top: 70, display: 'flex', gap: 56 }}>
        <Meter label="First coil · battery" value={on ? 'on' : 'off'} color={CURRENT} size={76} />
        <Meter label="Second coil · meter" value={Math.abs(needle1) < 0.04 ? '0' : `${needle1 > 0 ? '+' : '−'}${Math.abs(needle1 * 9).toFixed(1)}`} color="#ffb36b" size={76} />
      </Panel>
      <Cap opacity={span(frame, T(17.8), T(28.9))} kicker="August 1831" title="Two separate coils on an iron ring, with no connection between them" />
      <Cap opacity={span(frame, T(29.1), T(38.2))} kicker="A steady current in the first coil" title="The meter shows nothing. Everyone had looked for a steady effect" />
      <Cap opacity={span(frame, T(38.4), T(48.7))} kicker="At the instant of switching on, the needle kicks" title="And on switching off, it kicks the other way" />

      <Panel opacity={span(frame, T(50.0), T(68.1))} style={{ right: 110, top: 70 }}>
        <Meter label="Current in the coil" value={Math.abs(rate) < 0.03 ? '0' : `${rate > 0 ? '+' : '−'}${Math.abs(rate * 3).toFixed(1)}`} color={CURRENT} size={90} align="right" />
      </Panel>
      <Cap opacity={span(frame, T(49.0), T(55.4))} kicker="A bar magnet and a coil of wire" title="Push the magnet in, and a current flows" />
      <Cap opacity={span(frame, T(55.6), T(59.2))} kicker="Hold it still, however strong it is" title="and nothing happens" />
      <Cap opacity={span(frame, T(59.4), T(62.4))} kicker="Pull it out" title="and the current flows the other way" />
      <Cap opacity={span(frame, T(62.6), T(68.1), 8)} kicker="A steady magnetic field does nothing" title="Only a changing one drives a current" />

      <Cap opacity={span(frame, T(68.4), T(80.8))} kicker="The charges in the wire were at rest, and something pushed them" title="Only an electric field can push a charge at rest" />
      <Cap opacity={span(frame, T(81.0), T(88.4))} kicker="So" title={<span>A changing <B>magnetic field</B> creates an <E>electric field</E></span> as unknown as string} />
      <Cap opacity={span(frame, T(88.6), T(101.7))} kicker="An electric field of a new kind: no charges to start or end on" title="Its lines close on themselves, in loops" />
      <Cap opacity={span(frame, T(101.9), T(109.3))} kicker="The wire only reveals it" title="Take the wire away: the loops are still there, in empty space" />
      <Panel opacity={span(frame, T(70.0), T(109.3))} style={{ right: 110, top: 70 }}>
        <Meter label="Magnetic field through the loop" value={Math.cos(frame * 0.05) > 0 ? 'growing' : 'shrinking'} color={BFIELD} size={70} align="right" />
      </Panel>

      <Cap opacity={span(frame, T(109.6), T(123.5))} kicker="In your kitchen: the induction cooker" title="A changing magnetic field makes loops of electric field in the pan" />
      <Cap opacity={span(frame, T(123.7), T(160))} kicker="Those drive currents in the metal" title="The pan heats itself, and the glass stays cool" />
      <Panel opacity={span(frame, T(116.8), T(160))} style={{ right: 110, top: 70, display: 'flex', gap: 56 }}>
        <Meter label="Pan" value={heat > 0.5 ? 'hot' : 'warming'} color={NORTH} size={76} />
        <Meter label="Glass" value="cool" color="#9fd4ff" size={76} />
      </Panel>
      <Timeline frame={frame} already={[]} events={[[0, 18.2]]} />
    </Shell>
  );
};

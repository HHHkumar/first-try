import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac2/ch3.json';
import { span } from '../../anim';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { rgb, type Add } from '../../world/Stage3D';
import { AShell, AStage, at, Cap, CYAN, FLOOR, PINK, shot, SUN, sway, VIOLET, WHITE } from '../ac/kit';
import { X0, X1, CX } from './B2';
import { arrow, bracket, coil, cursor, dot, keys, pair, Timeline, VOICE, type Graph } from './kit';

// Chapter 3 - The coil: the voltage follows how fast the current changes, so the current lags.
export const B3_FRAMES = chapterFrames(voice.duration);
const PI = Math.PI;
const K = (2 * PI * 3) / (X1 - X0);
const AX = 0.5;
const AMP = 2.3;

// a heavy trolley on rails
const trolley = (add: Add, px: number, roll: number) => {
  const body = rgb(VIOLET);
  for (let x = -1.6; x <= 1.61; x += 0.4) for (let y = 0; y < 3; y++) for (let z = -0.8; z <= 0.81; z += 0.4) add(px + x, FLOOR + 1.1 + y * 0.42, z, 0.4, body, 0.75);
  for (const wx of [-1.1, 1.1])
    for (const wz of [-0.9, 0.9]) {
      for (let i = 0; i < 26; i++) add(px + wx + Math.cos((i / 26) * 6.283) * 0.42, FLOOR + 0.45 + Math.sin((i / 26) * 6.283) * 0.42, wz, 0.12, rgb(WHITE), 0.85);
      for (let s = -1; s <= 1; s += 0.25) add(px + wx + Math.cos(roll) * 0.4 * s, FLOOR + 0.45 - Math.sin(roll) * 0.4 * s, wz, 0.09, rgb(WHITE), 0.6);
    }
};

export const B3 = () => {
  const frame = useCurrentFrame();
  const tro = frame >= T(55.1);
  // the coil's graph: current i = -cos(th), voltage v = sin(th)
  const th = keys(frame, [[0, 0], [12, 0], [21.6, PI], [33.6, PI], [40.6, 2.5 * PI], [43.8, 2.5 * PI], [54.8, 6 * PI]]);
  const xc = X0 + th / K;
  const g: Graph = { x0: X0, x1: X1, th: (x) => (x - X0) * K, axis: AX, amp: AMP };
  const cur = -Math.cos(th);
  const slope = AMP * K * Math.sin(th);
  const tang = span(frame, T(16.5), T(43.6), 10);
  const whole = at(frame, 43.8, 1.5);
  const gap = span(frame, T(45.6), T(55.0), 10);
  // the trolley: push F = sin, speed = -cos, place = -sin
  const t2 = keys(frame, [[55, PI / 2], [60.4, PI / 2], [66.6, PI], [68.7, PI]]) + Math.max(0, frame - T(68.7)) * 0.045;
  const px = -Math.sin(t2) * 3.2;
  const K2 = (2 * PI * 2) / 16;
  const g2: Graph = { x0: -8, x1: 8, th: (x) => PI / 2 + (x + 8) * K2, axis: 2.7, amp: 0.95 };
  const xc2 = -8 + (((t2 - PI / 2) / K2) % 16);

  return (
    <AShell
      voice={VOICE(3)}
      frames={B3_FRAMES}
      world={
        <AStage
          opacity={Math.max(shot(frame, -1, 55.2), shot(frame, 55.0, 200))}
          pose={tro ? { pos: [sway(frame), 2.0, 22], target: [0, -0.4, 0], fov: 34, focus: 22, dof: 0.025 } : { pos: [sway(frame), 2.3, 25], target: [-0.4, -0.5, 0], fov: 34, focus: 25, dof: 0.022 }}
          scene={(add) => {
            if (tro) {
              for (const z of [-0.9, 0.9]) for (let x = -10; x <= 10; x += 0.08) add(x, FLOOR + 0.03, z, 0.1, rgb(WHITE), 0.5);
              trolley(add, px, px / 0.42);
              const F = Math.sin(t2);
              arrow(add, px - Math.sign(F) * (2.0 + Math.abs(F) * 2.6), FLOOR + 1.5, 1.0, F * 2.6, PINK);
              arrow(add, px, FLOOR + 3.0, 0, -Math.cos(t2) * 2.6, CYAN);
              pair(add, g2, PI / 2, { iAmp: 1 });
              cursor(add, xc2, 1.6, 3.8);
              dot(add, xc2, g2.axis + g2.amp * Math.sin(t2), PINK);
              dot(add, xc2, g2.axis - g2.amp * Math.cos(t2), CYAN);
              return;
            }
            pair(add, g, PI / 2, { iAmp: 1, i: at(frame, 9.3), v: at(frame, 30.2), vTo: xc + (X1 - xc) * whole });
            cursor(add, xc, -2.2, 3.2, at(frame, 12));
            dot(add, xc, AX + AMP * cur, CYAN, at(frame, 12));
            dot(add, xc, AX + AMP * Math.sin(th), PINK, at(frame, 30.2));
            // how fast the current is changing: its slope, drawn as a tangent
            if (tang > 0.01) {
              const n = 1.7 / Math.hypot(1, slope);
              for (let s = -1; s <= 1; s += 0.03) add(xc + s * n, AX + AMP * cur + s * n * slope, 0, 0.16, rgb(SUN), tang);
            }
            bracket(add, X0 + (2.5 * PI) / K, X0 + (3 * PI) / K, AX + AMP + 0.55, SUN, gap);
            coil(add, CX, 0.4, cur, frame, at(frame, 0.3), { len: 4, r: 1.15 });
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(12.0), T(55.0))} style={{ right: 110, top: 60, display: 'flex', gap: 56 }}>
        <div style={{ opacity: tang }}>
          <Meter label="Current is changing" value={Math.abs(Math.sin(th)) < 0.12 ? 'not at all' : Math.abs(Math.sin(th)) > 0.93 ? 'fastest' : 'slowly'} color={SUN} size={64} />
        </div>
        <div style={{ opacity: gap }}>
          <Meter label="Current lags the voltage by" value="90°" color={SUN} size={64} />
        </div>
      </Panel>
      <Panel opacity={span(frame, T(56.4), T(200))} style={{ right: 110, top: 60, display: 'flex', gap: 56, fontSize: 40, fontWeight: 300 }}>
        <span style={{ color: PINK }}>the push</span>
        <span style={{ color: CYAN }}>the trolley’s speed</span>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(9.1))} kicker="Now the coil. Remember what a coil cares about" title="A coil does not oppose a current" />
      <Cap opacity={span(frame, T(9.3), T(16.3))} kicker="It opposes a change in current" title="Its voltage depends on how fast the current is changing" />
      <Cap opacity={span(frame, T(16.5), T(21.2))} kicker="So ask" title="When is an alternating current changing fastest?" />
      <Cap opacity={span(frame, T(21.4), T(30.0))} kicker="Not at its crest: it has stopped rising and not yet begun to fall" title="For an instant it is not changing at all" />
      <Cap opacity={span(frame, T(30.2), T(34.1))} kicker="So at that instant" title="the voltage across the coil is zero" />
      <Cap opacity={span(frame, T(34.3), T(43.6))} kicker="The current changes fastest as it sweeps through zero" title="That is when the voltage is greatest" />
      <Cap opacity={span(frame, T(43.8), T(50.6))} kicker="Side by side" title="The voltage peaks; a quarter of a cycle later, the current peaks" />
      <Cap opacity={span(frame, T(50.8), T(54.9))} kicker="In a coil" title="the current lags the voltage by ninety degrees" />
      <Cap opacity={span(frame, T(55.3), T(63.9))} kicker="You can feel why: push a heavy trolley back and forth on rails" title="You push hardest at the very start, when it is standing still" />
      <Cap opacity={span(frame, T(64.1), T(71.5))} kicker="Its greatest speed comes later, as your push dies away" title="The trolley’s speed lags your push" />
      <Cap opacity={span(frame, T(71.7), T(200))} kicker="Its mass does to motion" title="what inductance does to current" />
      <Timeline frame={frame} already={[1]} events={[[2, 4.2]]} />
    </AShell>
  );
};

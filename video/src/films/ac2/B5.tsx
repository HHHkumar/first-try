import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac2/ch5.json';
import { span } from '../../anim';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { rgb } from '../../world/Stage3D';
import { AShell, AStage, at, Cap, CYAN, FLOOR, PINK, shot, SUN, sway, TEAL, WHITE } from '../ac/kit';
import { X0, X1, CX } from './B2';
import { bracket, capacitor, cursor, dot, keys, pair, Timeline, VOICE, type Graph } from './kit';

// Chapter 5 - The capacitor: the current follows how fast the voltage changes, so the current leads.
export const B5_FRAMES = chapterFrames(voice.duration);
const PI = Math.PI;
const K = (2 * PI * 3) / (X1 - X0);
const AX = 0.5;
const AMP = 2.3;

export const B5 = () => {
  const frame = useCurrentFrame();
  const mode = frame < T(65.0) ? 0 : frame < T(79.8) ? 1 : 2;
  // the capacitor's graph: voltage v = sin(th), current i = cos(th)
  const th = keys(frame, [[0, 0], [4.5, 0], [18.6, 2 * PI], [33.8, 2 * PI], [40.6, 2.5 * PI], [46.1, 2.5 * PI], [49.6, 2.5 * PI + 0.8], [55.4, 2.5 * PI + 0.8], [64.8, 6 * PI]]);
  const xc = X0 + th / K;
  const g: Graph = { x0: X0, x1: X1, th: (x) => (x - X0) * K, axis: AX, amp: AMP };
  const slope = AMP * K * Math.cos(th);
  const tang = span(frame, T(11.6), T(55.2), 10);
  const whole = at(frame, 55.4, 1.5);
  const traced = at(frame, 25.3);
  const gap = span(frame, T(57.5), T(64.9), 10);
  // the tank, filled from the bottom
  const fill = Math.max(0, frame - T(67.4)) / 30;
  const lev = 1 - Math.exp(-fill / 2.6);
  const rate = frame < T(67.4) ? 0 : Math.exp(-fill / 2.6);
  const now = frame * 0.05;

  return (
    <AShell
      voice={VOICE(5)}
      frames={B5_FRAMES}
      world={
        <AStage
          opacity={Math.max(shot(frame, -1, 65.1), shot(frame, 64.9, 79.9), shot(frame, 79.7, 200))}
          pose={mode === 0 ? { pos: [sway(frame), 2.3, 25], target: [-0.4, -0.5, 0], fov: 34, focus: 25, dof: 0.022 } : mode === 1 ? { pos: [2 + sway(frame), 2.6, 20], target: [-1.5, -0.6, 0], fov: 34, focus: 20, dof: 0.03 } : { pos: [3 + sway(frame, 2.5), 2.4, 15], target: [0, 0, 0], fov: 34, focus: 15.5, dof: 0.035 }}
          scene={(add) => {
            if (mode === 1) {
              // a tank, and the pipe that fills it from below
              const top = FLOOR + 5.2;
              for (let y = FLOOR + 0.2; y <= top; y += 0.36) for (let i = 0; i < 52; i++) add(2 + Math.cos((i / 52) * 6.283) * 2.2, y, Math.sin((i / 52) * 6.283) * 2.2, 0.1, rgb(WHITE), 0.45);
              for (let y = FLOOR + 0.3; y <= FLOOR + 0.3 + 4.7 * lev; y += 0.24)
                for (let i = 0; i < 46; i++) {
                  const a = i * 2.39996 + y * 3;
                  const r = 2.05 * Math.sqrt((i + 0.5) / 46);
                  add(2 + Math.cos(a) * r, y + 0.04 * Math.sin(frame * 0.2 + i), Math.sin(a) * r, 0.2, rgb(TEAL), 0.5);
                }
              for (const dy of [-0.3, 0.3]) for (let x = -10; x <= -0.2; x += 0.08) add(x, FLOOR + 0.75 + dy, 0, 0.1, rgb(WHITE), 0.5);
              for (let k = 0; k < 26; k++) {
                const x = -10 + ((k * 0.39 + travelled(fill)) % 9.8);
                add(x, FLOOR + 0.75 + 0.14 * Math.sin(k * 2.1), 0, 0.2 + 0.12 * rate, rgb(CYAN), 0.25 + 0.75 * rate);
              }
              return;
            }
            if (mode === 2) {
              capacitor(add, 0, 0, Math.sin(now), frame, 1, { gap: 1.5, h: 2.1, lead: 5 });
              return;
            }
            pair(add, g, -PI / 2, { iAmp: 1, v: at(frame, 4.5), i: traced, iTo: xc + (X1 - xc) * whole });
            cursor(add, xc, -2.2, 3.2, at(frame, 4.5));
            dot(add, xc, AX + AMP * Math.sin(th), PINK, at(frame, 4.5));
            dot(add, xc, AX + AMP * Math.cos(th), CYAN, traced);
            if (tang > 0.01) {
              const n = 1.7 / Math.hypot(1, slope);
              for (let s = -1; s <= 1; s += 0.03) add(xc + s * n, AX + AMP * Math.sin(th) + s * n * slope, 0, 0.16, rgb(SUN), tang);
            }
            bracket(add, X0 + (4 * PI) / K, X0 + (4.5 * PI) / K, AX + AMP + 0.55, SUN, gap);
            capacitor(add, CX, 0.3, Math.sin(th), frame, at(frame, 0.3), { h: 1.7 });
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(11.6), T(64.9))} style={{ right: 110, top: 60, display: 'flex', gap: 56 }}>
        <div style={{ opacity: tang }}>
          <Meter label="Voltage is changing" value={Math.abs(Math.cos(th)) < 0.12 ? 'not at all' : Math.abs(Math.cos(th)) > 0.93 ? 'fastest' : 'slowly'} color={SUN} size={64} />
        </div>
        <div style={{ opacity: gap }}>
          <Meter label="Current leads the voltage by" value="90°" color={SUN} size={64} />
        </div>
      </Panel>
      <Panel opacity={span(frame, T(65.3), T(79.7))} style={{ right: 110, top: 60, display: 'flex', gap: 56 }}>
        <Meter label="Flow" value={`${Math.round(rate * 100)}`} unit="%" color={CYAN} size={80} />
        <Meter label="Level" value={`${Math.round(lev * 100)}`} unit="%" color={PINK} size={80} />
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(4.3))} kicker="Now the capacitor" title="Here everything is the other way round" />
      <Cap opacity={span(frame, T(4.5), T(11.4))} kicker="A capacitor’s voltage depends on the charge on its plates" title="Current is charge arriving or leaving" />
      <Cap opacity={span(frame, T(11.6), T(18.5))} kicker="So the current is large when the voltage is changing fast" title="and zero when the voltage is not changing" />
      <Cap opacity={span(frame, T(18.7), T(25.1))} kicker="Follow one cycle" title="The capacitor is empty; the supply voltage is just beginning to rise" />
      <Cap opacity={span(frame, T(25.3), T(33.6))} kicker="The voltage is climbing as steeply as it ever does" title="Charge pours onto the plates: the current is at its greatest" />
      <Cap opacity={span(frame, T(33.8), T(40.8))} kicker="Near its crest, the voltage levels off" title="The plates are nearly full, and the flow dwindles" />
      <Cap opacity={span(frame, T(41.0), T(45.9))} kicker="At the crest itself, the voltage stops changing" title="and the current is zero" />
      <Cap opacity={span(frame, T(46.1), T(55.2))} kicker="The voltage starts to fall, and the charge flows back out" title="The current has already reversed, while the voltage is still positive" />
      <Cap opacity={span(frame, T(55.4), T(64.9))} kicker="The current peaks first; the voltage, a quarter of a cycle later" title="In a capacitor, the current leads the voltage by ninety degrees" />
      <Cap opacity={span(frame, T(65.3), T(70.8))} kicker="Think of filling a tank from the bottom" title="The water rushes in fastest when the tank is empty" />
      <Cap opacity={span(frame, T(71.0), T(79.7))} kicker="As the level rises, the flow slows; when the tank is full, it stops" title="The flow comes first. The level follows" />
      <Cap opacity={span(frame, T(80.1), T(90.4))} kicker="No charge ever crosses the gap between the plates" title="Charge flows onto one plate and off the other, back and forth" />
      <Cap opacity={span(frame, T(90.6), T(200))} kicker="As far as the rest of the circuit can tell" title="a current is passing through" />
      <Timeline frame={frame} already={[1, 2, 3]} events={[[0, 4.5]]} />
    </AShell>
  );
};

// how far the water in the pipe has travelled after `fill` seconds of a dwindling flow
function travelled(fill: number) {
  return 9 * 2.6 * (1 - Math.exp(-fill / 2.6)) * 0.6;
}

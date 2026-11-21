import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac2/ch7.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker, Meter, Sub } from '../../ui/type';
import { AShell, AStage, at, Cap, CYAN, PINK, SUN, sway, TEAL } from '../ac/kit';
import { X0, X1, CX } from './B2';
import { capacitor, coil, cursor, dot, flow, keys, pair, power, resistor, Timeline, VOICE, wire, type Graph } from './kit';

// Chapter 7 - Where the energy goes: reactance borrows energy and hands it back.
export const B7_FRAMES = chapterFrames(voice.duration);
const PI = Math.PI;
const W = X1 - X0;
const K = (2 * PI * 3) / W;

export const B7 = () => {
  const frame = useCurrentFrame();
  const m1 = ramp(frame, T(15.4), T(18.0));
  const m2 = ramp(frame, T(46.0), T(49.0));
  const shift = (PI / 2) * (m1 - 2 * m2);
  const th = keys(frame, [[0, 0], [15.2, 2 * PI], [15.6, 2 * PI], [18.6, 2.5 * PI], [26.6, 3 * PI], [31.0, 3 * PI], [37.0, 3.5 * PI], [46.0, 6 * PI], [58.0, 9 * PI], [77.5, 13 * PI]]);
  const xc = X0 + ((th / K) % W);
  const g: Graph = { x0: X0, x1: X1, th: (x) => (x - X0) * K, axis: 1.7, amp: 1.6 };
  const gp: Graph = { ...g, axis: -2.0, amp: 0.7 };
  const v = Math.sin(th);
  const i = Math.sin(th - shift);
  // energy delivered so far: the integral of the power
  const energy = 0.5 * (th * Math.cos(shift) - 0.5 * Math.sin(2 * th - shift));
  const word = span(frame, T(71.3), T(200), 12);

  return (
    <AShell
      voice={VOICE(7)}
      frames={B7_FRAMES}
      world={
        <AStage
          opacity={lerp(1, 0.3, word)}
          pose={{ pos: [sway(frame), 2.3, 25], target: [-0.4, -0.6, 0], fov: 34, focus: 25, dof: 0.022 }}
          scene={(add) => {
            pair(add, g, shift);
            power(add, gp, shift, at(frame, 6.4));
            cursor(add, xc, -2.9, 3.5);
            dot(add, xc, g.axis + g.amp * v, PINK);
            dot(add, xc, g.axis + g.amp * 0.72 * i, CYAN);
            dot(add, xc, gp.axis + gp.amp * 2 * v * i, SUN, at(frame, 6.4));
            resistor(add, CX - 0.3, 0.6, v * v, 1 - m1, 1.3);
            coil(add, CX, 0.5, i, frame, m1 * (1 - m2), { len: 4, r: 1.15 });
            capacitor(add, CX, 0.6, v, frame, m2, { h: 1.7 });
            // energy on its way in, or on its way back out
            wire(add, X1 + 0.3, -2.0, CX + 1, -2.0, 0.8);
            flow(add, X1 + 0.3, CX + 1, -2.0, energy * 1.6, SUN, at(frame, 6.4));
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(6.4), T(71.0))} style={{ right: 110, top: 60, display: 'flex', gap: 56 }}>
        <Meter label="Power" value={frame < T(15.4) ? 'always positive' : 2 * v * i > 0.05 ? 'taking' : 2 * v * i < -0.05 ? 'giving back' : '·'} color={SUN} size={64} />
        <div style={{ opacity: at(frame, 40.6) }}>
          <Meter label="Average power" value="0" unit="W" color={SUN} size={64} />
        </div>
        <div style={{ opacity: at(frame, 60.7) }}>
          <Meter label="Current, all the while" value="7.4" unit="A" color={CYAN} size={64} />
        </div>
      </Panel>
      <Center opacity={word}>
        <Kicker style={{ marginBottom: 22, color: TEAL }}>Current that carries energy nobody uses</Kicker>
        <Big size={150} style={{ textShadow: `0 0 80px ${SUN}55` }}>
          <span style={{ color: SUN }}>Reactive</span> power
        </Big>
        <Sub style={{ color: C.text }}>its cost is the subject of a later video</Sub>
      </Center>
      <Cap opacity={span(frame, T(0.2), T(6.2))} kicker="Now we can answer the puzzle" title="Why does a coil with thirty-one ohms of reactance stay cool?" />
      <Cap opacity={span(frame, T(6.4), T(15.2))} kicker="Look at the power again: voltage times current" title="In the resistor they were in step: always positive" />
      <Cap opacity={span(frame, T(15.4), T(24.0))} kicker="In the coil, they are a quarter of a cycle apart" title="For a quarter cycle both are positive: the coil takes energy" />
      <Cap opacity={span(frame, T(24.2), T(27.2))} kicker="That energy goes" title="into building its magnetic field" />
      <Cap opacity={span(frame, T(27.4), T(37.2))} kicker="Next quarter: one positive, the other negative. The power is negative" title="The field collapses, and the coil hands the energy back" />
      <Cap opacity={span(frame, T(37.4), T(45.8))} kicker="Take, give back. Take, give back" title="Over a whole cycle the average power is zero. No heat" />
      <Cap opacity={span(frame, T(46.0), T(53.6))} kicker="A capacitor does the same, with its electric field" title="It borrows energy as it charges, and returns it as it discharges" />
      <Cap opacity={span(frame, T(53.8), T(58.0))} kicker="So reactance does not consume energy" title="It only borrows it" />
      <Cap opacity={span(frame, T(58.2), T(66.7))} kicker="But notice what that means for the wires" title="A real current flows back and forth, carrying energy nobody uses" />
      <Cap opacity={span(frame, T(66.9), T(71.0))} kicker="The generator must supply that current" title="and the cables must carry it" />
      <Timeline frame={frame} already={[0, 1, 2, 3]} />
    </AShell>
  );
};

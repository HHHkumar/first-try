import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/capacitance/ch2.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker, Meter } from '../../ui/type';
import { NEG, POS } from '../../world/field';
import { rgb, Stage3D } from '../../world/Stage3D';
import { at, Cap, drawPlates, PLATES, Timeline, VOICE } from './kit';

// Chapter 2 - Storing charge. A battery moves charge from one plate to the other.
export const CAPAC2_FRAMES = chapterFrames(voice.duration);

// the wire from the positive plate, down and round, to the negative plate
const wire = (t: number): [number, number, number] => {
  const pts: [number, number, number][] = [
    [-4.2, 0, 0],
    [-7.5, 0, 0],
    [-7.5, -5.6, 0],
    [7.5, -5.6, 0],
    [7.5, 0, 0],
    [4.2, 0, 0],
  ];
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let d = t * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) return [lerp(pts[i][0], pts[i + 1][0], d / lens[i]), lerp(pts[i][1], pts[i + 1][1], d / lens[i]), 0];
    d -= lens[i];
  }
  return pts[pts.length - 1];
};

export const Capac2 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const connected = at(frame, 5.0) * (1 - at(frame, 37.0));
  // the charge builds quickly at first, then levels off as the plates push back
  const tt = Math.max(0, (frame - T(11.4)) / (T(34.4) - T(11.4)));
  const charge = frame < T(11.4) ? 0 : Math.min(1, (1 - Math.exp(-3.6 * tt)) / (1 - Math.exp(-3.6)));
  const flowing = frame >= T(11.4) && frame < T(34.6) ? 1 - charge : 0;
  const pose = { ...PLATES, pos: [PLATES.pos[0] + Math.sin(frame * 0.004), PLATES.pos[1] - 1, PLATES.pos[2] + 3] as [number, number, number], target: [0, -1.4, 0] as [number, number, number], focus: 23.4 };

  return (
    <Shell
      voice={VOICE(2)}
      frames={CAPAC2_FRAMES}
      world={
        <AbsoluteFill>
          <Stage3D
            width={width}
            height={height}
            pose={pose}
            fog={0.012}
            orbs={(add) => {
              drawPlates(add, null, frame, {});
              // the battery, in the wire below
              if (connected > 0) {
                add(-0.7, -5.6, 0, 0.9, rgb(POS), connected);
                add(0.7, -5.6, 0, 0.9, rgb(NEG), connected);
              }
            }}
            glows={(add) => {
              drawPlates(null, add, frame, { charge, lines: charge > 0 ? 1 : 0, lineGain: charge });
              const dim = rgb('#93a3c0');
              for (let i = 0; i <= 150; i++) {
                const p = wire(i / 150);
                add(p[0], p[1], p[2], 0.1, dim, 0.9 * connected);
              }
              // electrons leave one plate and are pushed round to the other
              const e = rgb(NEG);
              const white = rgb('#eafcff');
              for (let k = 0; k < 14; k++) {
                const t = (((frame - T(11.4)) * 0.006 * (0.4 + flowing) + k / 14) % 1 + 1) % 1;
                const p = wire(t);
                add(p[0], p[1], p[2], 0.6, e, 0.6 * Math.min(1, flowing * 3) * connected);
                add(p[0], p[1], p[2], 0.18, white, Math.min(1, flowing * 3) * connected);
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Panel opacity={span(frame, T(11.0), T(46.8))} style={{ right: 110, top: 80, display: 'flex', gap: 56 }}>
        <Meter label="Charge on each plate" value={`± ${(12 * charge).toFixed(1)}`} unit="µC" color={C.electron} size={76} />
        <Meter label="Plate voltage" value={(12 * charge).toFixed(1)} unit="V" color={C.rho} size={76} />
        <div style={{ opacity: connected }}>
          <Meter label="Battery" value="12.0" unit="V" size={76} />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(7.2))} kicker="Two metal plates, facing each other across a gap" title="Connect a battery between them" />
      <Cap opacity={span(frame, T(7.4), T(22.4))} kicker="The battery does not create charge" title="It pulls electrons off one plate and piles them onto the other" />
      <Cap opacity={span(frame, T(22.7), T(31.9))} kicker="As the charge builds" title="the plates’ own voltage pushes back against the battery" />
      <Cap opacity={span(frame, T(32.2), T(36.0))} kicker="When the two are equal" title="the flow stops" />
      <Cap opacity={span(frame, T(36.2), T(45.2))} kicker="Now disconnect the battery" title="Each plate holds the other’s charge in place across the gap" />
      <Center opacity={span(frame, T(45.3), T(47.6), 8)} style={{ justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 250, paddingLeft: 110 }}>
        <Kicker>Electricity</Kicker>
        <Big size={150}>stored</Big>
      </Center>
      <Timeline frame={frame} already={[0, 1, 2]} />
    </Shell>
  );
};

import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/charge/ch2.json';
import { lerp, ramp, span } from '../../anim';
import { stix } from '../../fonts';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker, Sub } from '../../ui/type';
import { fibSphere, NEG, POS } from '../../world/field';
import { mulberry32 } from '../../world/rng';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, drawPairs, Ink, shot, Timeline, VOICE } from './kit';

// Chapter 2 - Amber. Thales, Gilbert, du Fay, Franklin.
export const CHARGE2_FRAMES = chapterFrames(voice.duration);
const AMBER = '#ffb347';

export const Charge2 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const gem = useMemo(() => {
    const rand = mulberry32(2);
    const pts: [number, number, number][] = [];
    for (let x = -1.8; x <= 1.8; x += 0.4)
      for (let y = -1.1; y <= 1.1; y += 0.4)
        for (let z = -1.2; z <= 1.2; z += 0.4) {
          if ((x / 1.75) ** 2 + (y / 1.05) ** 2 + (z / 1.15) ** 2 < 1) pts.push([x + (rand() - 0.5) * 0.14, y + (rand() - 0.5) * 0.14, z + (rand() - 0.5) * 0.14]);
        }
    return pts;
  }, []);
  const chaff = useMemo(() => {
    const rand = mulberry32(6);
    const dirs = fibSphere(70);
    return dirs.map((d) => ({
      from: [(rand() * 2 - 1) * 6, -3.2 - rand() * 1.2, (rand() * 2 - 1) * 3] as [number, number, number],
      to: [d[0] * 1.95, -Math.abs(d[1]) * 1.2 - 0.1, d[2] * 1.35] as [number, number, number],
      delay: rand() * 70,
    }));
  }, []);
  const lumps = useMemo(() => [fibSphere(520), fibSphere(160)], []);

  const sAmber = shot(frame, -1, 23.0);
  const sGilbert = shot(frame, 22.8, 42.9);
  const sDuFay = shot(frame, 42.7, 56.9);
  const sFranklin = ramp(frame, T(56.7), T(57.3));
  const orbit = frame * 0.003;
  const pose: CameraPose =
    frame < T(22.9)
      ? { pos: [Math.sin(orbit) * 2.5 + 1, 1.6, lerp(11, 8.6, ramp(frame, 0, T(22)))], target: [lerp(0, 2.2, ramp(frame, T(11.4), T(13.4))), -0.5, 0], fov: 34, focus: 9, dof: 0.12 }
      : { pos: [Math.sin(orbit) * 1.2, 0.6, 13], target: [0, 0, 0], fov: 34, focus: 13, dof: 0.08 };
  const needle = lerp(-38, 24, ramp(frame, T(28.6), T(31.6), Easing.inOut(Easing.cubic))) + 3 * Math.sin(frame * 0.2) * (1 - ramp(frame, T(31), T(34)));

  return (
    <Shell
      voice={VOICE(2)}
      frames={CHARGE2_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(sAmber, sDuFay, sFranklin) }}>
          <Stage3D
            width={width}
            height={height}
            pose={pose}
            deep={frame < T(22.9) ? [0.45, 0.2, 0.03] : undefined}
            halo={frame < T(22.9) ? 0.5 : 0.2}
            orbs={(add) => {
              if (frame < T(22.9)) {
                const c = rgb(AMBER);
                for (const p of gem) add(p[0], p[1], p[2], 0.44, c, 0.95);
              } else if (frame < T(56.8)) {
                drawPairs(add, null, pose.pos, frame, at(frame, 49.6), at(frame, 53.2));
              }
            }}
            glows={(add) => {
              if (frame < T(22.9)) {
                const warm = rgb(AMBER);
                add(0, 0, 0, 9, warm, 0.28);
                const straw = rgb('#f7ecc0');
                for (const c of chaff) {
                  const t = ramp(frame, T(7.6) + c.delay, T(10.4) + c.delay, Easing.in(Easing.quad));
                  const bob = (1 - t) * 0.18 * Math.sin(frame * 0.08 + c.delay);
                  add(lerp(c.from[0], c.to[0], t), lerp(c.from[1], c.to[1], t) + bob, lerp(c.from[2], c.to[2], t), 0.16, straw, 0.9);
                }
              } else if (frame < T(56.8)) {
                drawPairs(null, add, pose.pos, frame, at(frame, 49.6), at(frame, 53.2));
              } else {
                // Franklin: one substance. Too much of it on the left, too little on the right.
                const fluid = rgb('#ffd98a');
                const more = lumps[0];
                const less = lumps[1];
                const seen = at(frame, 60.0, 1.0);
                for (let i = 0; i < more.length; i++) {
                  const r = 1.75 * Math.cbrt((i + 0.5) / more.length);
                  add(-3.4 + more[i][0] * r, 0.4 + more[i][1] * r, more[i][2] * r, 0.15, fluid, 0.8 * seen * (0.7 + 0.3 * Math.sin(frame * 0.1 + i)));
                }
                for (let i = 0; i < less.length; i++) {
                  const r = 1.75 * Math.cbrt((i + 0.5) / less.length);
                  add(3.4 + less[i][0] * r, 0.4 + less[i][1] * r, less[i][2] * r, 0.15, fluid, 0.8 * seen * (0.7 + 0.3 * Math.sin(frame * 0.1 + i)));
                }
                add(-3.4, 0.4, 0, 8, rgb(POS), 0.16 * at(frame, 66.4));
                add(3.4, 0.4, 0, 8, rgb(NEG), 0.16 * at(frame, 67.8));
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      {/* Thales */}
      <Cap opacity={span(frame, T(3.2), T(12.2))} kicker="About 600 BC · Thales" title="Rubbed amber pulls in feathers and bits of straw" />
      <Panel opacity={span(frame, T(12.6), T(22.8))} style={{ right: 110, top: 86, textAlign: 'right' }}>
        <div style={{ fontFamily: stix, fontSize: 150, color: AMBER, lineHeight: 1, textShadow: `0 0 50px ${AMBER}77` }}>ηλεκτρον</div>
        <div style={{ fontSize: 40, fontWeight: 300, color: C.dim, marginTop: 10 }}>elektron: the Greek word for amber</div>
        <div style={{ fontSize: 54, fontWeight: 300, marginTop: 34, display: 'flex', gap: 34, justifyContent: 'flex-end' }}>
          <span style={{ opacity: at(frame, 17.5) }}>electricity</span>
          <span style={{ opacity: at(frame, 18.7) }}>electron</span>
          <span style={{ opacity: at(frame, 19.6) }}>electronics</span>
        </div>
      </Panel>

      {/* Gilbert */}
      <Scene opacity={sGilbert}>
        <Ink>
          {/* versorium: a light needle on a pivot */}
          <path d="M 520 760 h 280 M 660 760 V 520" />
          <g transform={`rotate(${needle} 660 520)`}>
            <path d="M 430 520 H 890 M 890 520 l -34 -16 v 32 z" />
          </g>
          <circle cx={660} cy={520} r={9} fill="#d7e6ff" />
        </Ink>
        <Ink color={AMBER} width={5}>
          {/* a rubbed rod brought near */}
          <path d={`M ${lerp(1500, 1010, ramp(frame, T(27.6), T(30.2)))} 380 l 220 -150`} strokeWidth={22} strokeOpacity={0.9} />
        </Ink>
        <Panel opacity={at(frame, 33.4)} style={{ left: 1040, top: 520, width: 760 }}>
          <Kicker>It is not only amber</Kicker>
          <div style={{ fontSize: 60, fontWeight: 300, marginTop: 14, display: 'flex', gap: 34, flexWrap: 'wrap' }}>
            {[
              ['glass', 35.0],
              ['sulphur', 35.9],
              ['wax', 36.7],
              ['gems', 37.4],
            ].map(([w, t]) => (
              <span key={w} style={{ opacity: at(frame, t as number) }}>
                {w}
              </span>
            ))}
          </div>
        </Panel>
        <Cap opacity={span(frame, T(26.8), T(39.4))} kicker="1600 · William Gilbert" title="He tested hundreds of materials" />
        <Center opacity={span(frame, T(39.6), T(42.8), 10)} style={{ justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 70, paddingLeft: 110 }}>
          <Kicker>He gave the effect its name</Kicker>
          <Big size={190} style={{ color: AMBER, textShadow: `0 0 70px ${AMBER}66` }}>
            electric
          </Big>
        </Center>
      </Scene>

      {/* du Fay */}
      <Cap opacity={span(frame, T(43.2), T(56.6))} kicker="1733 · Charles du Fay" title="There are two kinds of electricity" />
      <Panel opacity={span(frame, T(50.0), T(56.6))} style={{ left: 0, right: 0, top: 100, textAlign: 'center' }}>
        <div style={{ fontSize: 44, fontWeight: 300 }}>the same kind: they push apart</div>
      </Panel>
      <Panel opacity={span(frame, T(53.6), T(56.6))} style={{ left: 0, right: 0, top: 520, textAlign: 'center' }}>
        <div style={{ fontSize: 44, fontWeight: 300, color: C.electron }}>different kinds: they pull together</div>
      </Panel>

      {/* Franklin */}
      <Cap opacity={span(frame, T(57.4), T(73.2))} kicker="1747 · Benjamin Franklin" title="One electrical substance: too much of it, or too little" />
      <Panel opacity={at(frame, 66.4)} style={{ left: 250, top: 150, width: 520, textAlign: 'center' }}>
        <Sub style={{ marginTop: 0 }}>too much</Sub>
        <Big size={84} style={{ color: POS, whiteSpace: 'nowrap' }}>
          positive +
        </Big>
      </Panel>
      <Panel opacity={at(frame, 67.8)} style={{ left: 1150, top: 150, width: 520, textAlign: 'center' }}>
        <Sub style={{ marginTop: 0 }}>too little</Sub>
        <Big size={84} style={{ color: NEG, whiteSpace: 'nowrap' }}>
          negative −
        </Big>
      </Panel>

      <Timeline frame={frame} already={[]} events={[[0, 3.8], [1, 27.2], [2, 43.0], [3, 57.2]]} opacity={ramp(frame, T(2.6), T(3.8))} />
    </Shell>
  );
};

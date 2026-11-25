import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/magnetism/ch2.json';
import { lerp, lerp3, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Kicker } from '../../ui/type';
import { fibSphere } from '../../world/field';
import { drawNeedle, NORTH, SOUTH } from '../../world/magnet';
import { mulberry32 } from '../../world/rng';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, Ink, shot, Timeline, VOICE } from './kit';

// Chapter 2 - The stone that points. Lodestone, the compass, Peregrinus, Gilbert.
export const MAG2_FRAMES = chapterFrames(voice.duration);

// field of a small magnet at the centre of a sphere, at a point on its surface
const dipoleAt = (p: readonly number[]): [number, number, number] => {
  const r = Math.hypot(p[0], p[1], p[2]);
  const n = [p[0] / r, p[1] / r, p[2] / r];
  const md = n[1]; // moment along +y
  return [3 * md * n[0], 3 * md * n[1] - 1, 3 * md * n[2]];
};

export const Mag2 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const stone = useMemo(() => {
    const rand = mulberry32(5);
    return fibSphere(150).map((d) => {
      const r = 1.5 * Math.cbrt(rand()) * (0.8 + 0.3 * rand());
      return [d[0] * r * 1.25, d[1] * r * 0.85, d[2] * r] as [number, number, number];
    });
  }, []);
  const nails = useMemo(() => {
    const rand = mulberry32(8);
    return fibSphere(36).map((d) => ({ from: [(rand() * 2 - 1) * 7, -3.4 - rand(), (rand() * 2 - 1) * 3] as [number, number, number], to: [d[0] * 2.0, -Math.abs(d[1]) * 1.4, d[2] * 1.6] as [number, number, number], delay: rand() * 60 }));
  }, []);
  const ball = useMemo(() => fibSphere(900), []);
  const needles = useMemo(() => fibSphere(130), []);

  const sStone = shot(frame, -1, 12.4);
  const china = span(frame, T(12.2), T(34.0), 14);
  const sSphere = shot(frame, 33.8, 57.4);
  const breakM = span(frame, T(57.0), T(66.4), 12);
  const sTerrella = shot(frame, 66.0, 200);
  const toEarth = ramp(frame, T(81.6), T(85.6), Easing.inOut(Easing.cubic));
  const orbit = frame * 0.004;
  const pose: CameraPose =
    frame < T(12.3)
      ? { pos: [Math.sin(orbit) * 2 + 1, 1.4, 10], target: [0, -0.6, 0], fov: 34, focus: 10, dof: 0.11 }
      : { pos: lerp3([Math.sin(orbit) * 4, 2.4, 11.5], [Math.sin(orbit) * 4, 3, 17], toEarth), target: [0, 0, 0], fov: 34, focus: lerp(11.6, 17, toEarth), dof: 0.05 };
  const settle = ramp(frame, T(14.6), T(18.6), Easing.out(Easing.elastic(1)));
  const spoon = lerp(-140, 0, settle);
  const trace = ramp(frame, T(42.0), T(49.6));
  const split = ramp(frame, T(59.4), T(61.0), Easing.out(Easing.cubic));

  return (
    <Shell
      voice={VOICE(2)}
      frames={MAG2_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(sStone, sSphere, sTerrella) }}>
          <Stage3D
            width={width}
            height={height}
            pose={pose}
            deep={[0.05, 0.06, 0.09]}
            orbs={(add) => {
              if (frame < T(12.3)) {
                const c = rgb('#5d6880');
                for (const p of stone) add(p[0], p[1], p[2], 0.6, c, 1);
              }
            }}
            glows={(add) => {
              if (frame < T(12.3)) {
                const iron = rgb('#c8d4ea');
                for (const n of nails) {
                  const t = ramp(frame, T(2.6) + n.delay, T(5.0) + n.delay, Easing.in(Easing.quad));
                  const x = lerp(n.from[0], n.to[0], t);
                  const y = lerp(n.from[1], n.to[1], t);
                  const z = lerp(n.from[2], n.to[2], t);
                  for (let k = 0; k < 6; k++) add(x + k * 0.07, y - k * 0.05, z, 0.11, iron, 0.85);
                }
              } else {
                // a round lodestone; later, the Earth
                const R = lerp(2.6, 3.4, toEarth);
                const rock = rgb('#8a96b4');
                const sea = rgb('#2f7fe0');
                const land = rgb('#5fd08f');
                for (const d of ball) {
                  const isLand = Math.sin(d[0] * 3.1 + 1) * Math.sin(d[1] * 4.3) * Math.cos(d[2] * 2.7 + 2) > 0.08;
                  const e = isLand ? land : sea;
                  add(d[0] * R, d[1] * R, d[2] * R, 0.14, [lerp(rock[0], e[0], toEarth), lerp(rock[1], e[1], toEarth), lerp(rock[2], e[2], toEarth)], 0.75);
                }
                // Peregrinus: the lines a needle follows all meet at two points
                if (frame < T(57.3)) {
                  const line = rgb('#ffe08a');
                  for (let m = 0; m < 10; m++) {
                    const lon = (m / 10) * Math.PI * 2;
                    for (let i = 0; i <= 60 * trace; i++) {
                      const lat = -Math.PI / 2 + (i / 60) * Math.PI;
                      add(Math.cos(lat) * Math.cos(lon) * 2.66, Math.sin(lat) * 2.66, Math.cos(lat) * Math.sin(lon) * 2.66, 0.08, line, 0.8);
                    }
                  }
                  const p = at(frame, 50.0);
                  add(0, 2.7, 0, 0.9, rgb(NORTH), p);
                  add(0, -2.7, 0, 0.9, rgb(SOUTH), p);
                } else {
                  // Gilbert: small needles all over the sphere, dipping as compasses do on Earth
                  const show = at(frame, 73.6, 1.5);
                  for (const d of needles) {
                    const p = [d[0] * (R + 0.25), d[1] * (R + 0.25), d[2] * (R + 0.25)];
                    const b = dipoleAt(p);
                    drawNeedle(add, p[0], p[1], p[2], b[0], b[1], b[2], 0.55, show);
                  }
                }
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Cap opacity={span(frame, T(0.2), T(7.2))} kicker="Ancient Greece · near Magnesia" title="A dark stone that pulled on iron" />
      <Panel opacity={span(frame, T(7.4), T(12.2))} style={{ right: 110, top: 86, textAlign: 'right' }}>
        <Kicker>Lodestone</Kicker>
        <div style={{ fontSize: 96, fontWeight: 300, letterSpacing: -2 }}>
          Magnesia <span style={{ color: C.dim }}>→</span> <span style={{ color: C.electron, opacity: at(frame, 10.4) }}>magnet</span>
        </div>
      </Panel>

      {/* China: the spoon that turns south, and the needle */}
      <Scene opacity={china}>
        <Ink>
          <rect x={360} y={330} width={520} height={520} rx={12} fill="rgba(215,230,255,0.03)" />
          <circle cx={620} cy={590} r={210} strokeOpacity={0.5} />
          {Array.from({ length: 24 }, (_, i) => (
            <path key={i} d={`M ${620 + Math.cos((i * Math.PI) / 12) * 210} ${590 + Math.sin((i * Math.PI) / 12) * 210} l ${Math.cos((i * Math.PI) / 12) * 22} ${Math.sin((i * Math.PI) / 12) * 22}`} strokeOpacity={0.5} strokeWidth={2} />
          ))}
        </Ink>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
          <g transform={`rotate(${spoon} 620 590)`}>
            <ellipse cx={620} cy={650} rx={62} ry={78} fill="#5d6880" stroke="#c8d4ea" strokeWidth={3} />
            <path d="M 620 580 V 420" stroke="#c8d4ea" strokeWidth={16} strokeLinecap="round" />
          </g>
          {/* the needle and its small error */}
          <g opacity={at(frame, 21.6)}>
            <circle cx={1360} cy={590} r={200} fill="rgba(79,200,255,0.06)" stroke="#d7e6ff" strokeWidth={3} />
            <line x1={1360} y1={380} x2={1360} y2={800} stroke={C.dim} strokeWidth={2} strokeDasharray="8 8" />
            <g transform={`rotate(${-6 * at(frame, 26.8, 1.2)} 1360 590)`}>
              <polygon points="1352,590 1360,430 1368,590" fill={NORTH} />
              <polygon points="1352,590 1360,750 1368,590" fill={SOUTH} />
            </g>
            <text x={1380} y={370} fill={C.dim} fontSize={26} fontFamily="Sora">
              true north
            </text>
          </g>
        </svg>
        <Cap opacity={span(frame, T(12.9), T(18.8))} kicker="China" title="A sliver of lodestone turns until it lies north and south" />
        <Cap opacity={span(frame, T(19.0), T(29.6))} kicker="1088 · Shen Kuo" title="A magnetised needle, which does not point exactly true" />
        <Cap opacity={span(frame, T(30.0), T(33.8), 8)} kicker="Within a century" title="sailors were crossing open sea by it" />
      </Scene>

      <Cap opacity={span(frame, T(34.4), T(49.8))} kicker="1269 · Peter Peregrinus" title="He traced the lines a needle follows on a round lodestone" />
      <Panel opacity={span(frame, T(50.0), T(57.2))} style={{ right: 70, top: 86, width: 430, textAlign: 'right' }}>
        <Kicker>They all met at two points</Kicker>
        <Big size={130} style={{ textAlign: 'right' }}>
          poles
        </Big>
        <div style={{ fontSize: 40, fontWeight: 300, color: C.dim, opacity: at(frame, 53.0) }}>like poles push apart, unlike poles pull together</div>
      </Panel>

      {/* break a magnet: two complete magnets */}
      <Scene opacity={breakM}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
          {[-1, 1].map((side) => (
            <g key={side} transform={`translate(${side * 150 * split},0)`}>
              <rect x={side < 0 ? 560 : 960} y={470} width={200} height={140} fill={NORTH} opacity={side < 0 ? 0.9 : lerp(0, 0.9, split)} />
              <rect x={side < 0 ? 760 : 1160} y={470} width={200} height={140} fill={SOUTH} opacity={side > 0 ? 0.9 : lerp(0, 0.9, split)} />
              {/* before the break it is one magnet: north on the left half, south on the right */}
              <rect x={side < 0 ? 760 : 960} y={470} width={200} height={140} fill={side < 0 ? NORTH : SOUTH} opacity={0.9 * (1 - split)} />
              <rect x={side < 0 ? 560 : 960} y={470} width={400} height={140} fill="none" stroke="#d7e6ff" strokeWidth={3} />
            </g>
          ))}
        </svg>
        <Cap opacity={1} kicker="Something strange" title="Break a magnet in half and you get two complete magnets" />
      </Scene>

      <Cap opacity={span(frame, T(66.8), T(78.2))} kicker="1600 · William Gilbert" title="A lodestone carved into a small sphere, with a needle on its surface" />
      <Cap opacity={span(frame, T(78.6), T(87.0))} kicker="It behaved exactly as a compass does on the Earth" title="The Earth itself is a great magnet" />

      <Timeline frame={frame} already={[4]} events={[[0, 3.1], [1, 19.0], [2, 36.6], [3, 67.2]]} />
    </Shell>
  );
};

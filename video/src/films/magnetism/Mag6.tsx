import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/magnetism/ch6.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Kicker, Meter, Sym } from '../../ui/type';
import { drawLines } from '../../world/field';
import { BFIELD, CURRENT, drawCoil, makeCoil, NORTH, SOUTH, traceCoil } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, Ink, shot, Timeline, VOICE } from './kit';

// Chapter 6 - Coils and electromagnets.
export const MAG6_FRAMES = chapterFrames(voice.duration);
const R = 1.5;
const seedsFor = (radii: number[]): [number, number, number][] =>
  radii.flatMap((r) => (r === 0 ? [[0, 0, 0] as [number, number, number]] : [0, 1, 2, 3, 4, 5].map((k) => [0, Math.cos((k * Math.PI) / 3) * r, Math.sin((k * Math.PI) / 3) * r] as [number, number, number])));

export const Mag6 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const loopXs = [0];
  const coilXs = useMemo(() => Array.from({ length: 11 }, (_, i) => -3 + i * 0.6), []);
  const loopLines = useMemo(() => traceCoil(makeCoil([0], R), seedsFor([0, 0.5, 1.0]), 11), []);
  const coilLines = useMemo(() => traceCoil(makeCoil(coilXs, R), seedsFor([0, 0.45, 0.9, 1.2]), 12), [coilXs]);

  const sLoop = shot(frame, -1, 12.6);
  const sCoil = shot(frame, 12.3, 41.4);
  const henry = span(frame, T(41.0), T(50.8), 12);
  const uses = ramp(frame, T(50.4), T(51.0));
  const isCoil = frame >= T(12.4);
  const core = ramp(frame, T(31.6), T(33.6), Easing.out(Easing.cubic));
  const orbit = frame * 0.003;
  const pose: CameraPose = { pos: [5 + Math.sin(orbit) * 2, 3.4, isCoil ? 14 : 11], target: [0, 0, 0], fov: 34, focus: isCoil ? 15 : 12, dof: 0.045 };
  const lift = ramp(frame, T(46.6), T(49.0), Easing.inOut(Easing.cubic));

  return (
    <Shell
      voice={VOICE(6)}
      frames={MAG6_FRAMES}
      world={
        uses < 1 ? (
          <AbsoluteFill style={{ opacity: Math.max(sLoop, sCoil) }}>
            <Stage3D
              width={width}
              height={height}
              pose={pose}
              deep={[0.1, 0.11, 0.14]}
              orbs={(add) => {
                // an iron bar slid into the coil
                if (isCoil && core > 0) {
                  const iron = rgb('#9aa6c0');
                  for (let x = -3.4; x <= 3.41; x += 0.62) for (const [y, z] of [[0.36, 0.36], [-0.36, 0.36], [0.36, -0.36], [-0.36, -0.36]]) add(x - (1 - core) * 9, y, z, 0.66, iron, 1);
                }
              }}
              glows={(add) => {
                drawCoil(add, isCoil ? coilXs : loopXs, R, frame);
                const boost = 1 + 1.2 * core;
                drawLines(add, isCoil ? coilLines : loopLines, frame, (isCoil ? at(frame, 16.6, 1.5) : at(frame, 2.0, 1.5)) * boost, BFIELD, { bold: true });
                // the two faces: one a north pole, the other a south
                const face = isCoil ? at(frame, 23.6) : at(frame, 5.0);
                const end = isCoil ? 3.5 : 0.6;
                add(end, 0, 0, 1.6, rgb(NORTH), 0.5 * face);
                add(-end, 0, 0, 1.6, rgb(SOUTH), 0.5 * face);
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Cap opacity={span(frame, T(0.2), T(9.4))} kicker="Bend the wire into a loop" title="The rings of field add up through the middle" />
      <Cap opacity={span(frame, T(9.7), T(12.3), 8)} kicker="One face north, the other south" title="A loop of current is a magnet" />
      <Cap opacity={span(frame, T(12.6), T(22.6))} kicker="Many loops side by side: a solenoid" title="Inside, the field runs straight and nearly uniform" />
      <Cap opacity={span(frame, T(23.0), T(31.2))} kicker="Outside" title="it is exactly the field of a bar magnet" />
      <Panel opacity={span(frame, T(26.6), T(41.0))} style={{ right: 110, top: 70 }}>
        <div style={{ fontSize: 120, display: 'flex', alignItems: 'baseline', gap: 26 }}>
          <Sym color={BFIELD}>B</Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Sym>
            μ<sub style={{ fontSize: '0.45em', fontStyle: 'normal' }}>0</sub>
          </Sym>
          <Sym color={C.shape}>n</Sym>
          <Sym color={CURRENT}>I</Sym>
        </div>
        <div style={{ fontSize: 30, fontWeight: 300, color: C.dim, marginTop: 6 }}>turns per metre × current</div>
      </Panel>
      <Cap opacity={span(frame, T(31.5), T(40.9))} kicker="1825 · William Sturgeon" title="An iron bar inside: his small coil lifted twenty times its own weight" />

      {/* Henry's electromagnet */}
      <Scene opacity={henry}>
        <Ink style={{ transform: 'translateY(-110px)' }}>
          <path d="M 500 150 H 1420 M 560 150 V 900 M 1360 150 V 900 M 440 900 H 1480" strokeOpacity={0.5} />
          {/* the horseshoe */}
          <path d="M 800 150 V 300 M 1120 150 V 300" strokeWidth={5} />
          <path d="M 800 520 V 380 Q 800 270 960 270 Q 1120 270 1120 380 V 520" strokeWidth={46} stroke="#9aa6c0" strokeOpacity={0.9} />
        </Ink>
        <Ink color={CURRENT} width={5} style={{ transform: 'translateY(-110px)' }}>
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M 770 ${372 + i * 16} h 60 M 1090 ${372 + i * 16} h 60`} />
          ))}
        </Ink>
        <Ink style={{ transform: 'translateY(-110px)' }}>
          {/* the keeper, the platform and its load, lifted clear of the ground */}
          <g transform={`translate(0, ${-90 * lift})`}>
            <rect x={760} y={612} width={400} height={30} fill="#9aa6c0" fillOpacity={0.8} />
            <path d="M 820 642 V 760 M 1100 642 V 760 M 700 760 H 1220" />
            {Array.from({ length: 5 }, (_, i) => (
              <rect key={i} x={720 + i * 100} y={770} width={86} height={86} rx={6} fill="rgba(215,230,255,0.08)" />
            ))}
          </g>
        </Ink>
        <Panel opacity={at(frame, 47.4)} style={{ left: 1420, top: 370, width: 420 }}>
          <Meter label="Held up" value="over a ton" color={C.electron} size={74} />
        </Panel>
        <Cap opacity={1} kicker="1831 · Joseph Henry" title="Many layers of insulated wire on an iron horseshoe" />
      </Scene>

      <Scene opacity={uses}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 250, textAlign: 'center' }}>
          <Kicker>A magnet you can switch on and off</Kicker>
          <div style={{ fontSize: 110, fontWeight: 300, letterSpacing: -3, marginTop: 30, display: 'flex', justifyContent: 'center', gap: 70, flexWrap: 'wrap' }}>
            {[
              ['relay', 53.6],
              ['contactor', 54.9],
              ['motor', 56.3],
              ['transformer', 57.4],
            ].map(([w, t]) => (
              <span key={w} style={{ opacity: at(frame, t as number), color: w === 'transformer' ? C.electron : C.text }}>
                {w}
              </span>
            ))}
          </div>
        </Panel>
      </Scene>
      <Timeline frame={frame} already={[0, 1, 2, 3, 4, 5]} events={[[6, 34.1], [7, 43.6]]} />
    </Shell>
  );
};

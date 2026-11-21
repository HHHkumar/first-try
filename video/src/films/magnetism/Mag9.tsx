import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/magnetism/ch9.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker, Meter, Sub } from '../../ui/type';
import { drawArrow } from '../../world/field';
import { BFIELD, CURRENT, drawWire, NORTH, SOUTH } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';
import { at, Cap, GOLD, Ink, shot, Timeline, VOICE } from './kit';

// Chapter 9 - Measuring it: Gauss, the tesla, and the ampere.
export const MAG9_FRAMES = chapterFrames(voice.duration);

// a logarithmic scale of field strength from 10 microtesla to 10 tesla
const X0 = 260;
const X1 = 1660;
const xOf = (tesla: number) => X0 + ((Math.log10(tesla) + 5) / 6) * (X1 - X0);
const MARKS: [number, string, string, number, string][] = [
  [50e-6, 'The Earth', '50 millionths of a tesla', 29.9, BFIELD],
  [5e-3, 'A fridge magnet', 'a few thousandths', 33.3, C.electron],
  [2.1, 'A hospital scanner', '1.5 to 3 tesla', 35.9, GOLD],
];

export const Mag9 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const gauss = span(frame, T(-1), T(17.3), 12);
  const tesla = span(frame, T(17.4), T(39.3), 12);
  const sWires = shot(frame, 39.2, 70);
  const swing = Math.sin(frame * 0.07) * 16 * Math.exp(-Math.max(0, frame - T(3.4)) / 420);
  const counted = ramp(frame, T(55.0), T(56.0));

  return (
    <Shell
      voice={VOICE(9)}
      frames={MAG9_FRAMES}
      world={
        sWires > 0 ? (
          <AbsoluteFill style={{ opacity: sWires * (1 - 0.65 * counted) }}>
            <Stage3D
              width={width}
              height={height}
              pose={{ pos: [0, 2.2, 15], target: [0, 0.3, 0], fov: 34, focus: 15, dof: 0.04 }}
              glows={(add) => {
                drawWire(add, 1.5, 0, -9, 9, frame, 1);
                drawWire(add, -1.5, 0, -9, 9, frame, 1);
                const f = at(frame, 51.6);
                for (const x of [-4.5, 4.5]) {
                  drawArrow(add, x, 2.7, 0, 0, -1, 0, 0.9, CURRENT, f, 0.11);
                  drawArrow(add, x, -2.7, 0, 0, 1, 0, 0.9, CURRENT, f, 0.11);
                }
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      {/* Gauss and the swinging needle */}
      <Scene opacity={gauss}>
        <Ink>
          <path d="M 1180 170 H 1560 M 1370 170 V 250" strokeOpacity={0.6} />
          <path d="M 1370 250 V 560" strokeWidth={2} />
          <path d="M 1150 640 Q 1370 700 1590 640" strokeOpacity={0.35} />
        </Ink>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute', filter: 'drop-shadow(0 0 10px rgba(215,230,255,0.5))' }}>
          <g transform={`translate(1370,560) rotate(${swing})`}>
            <path d="M 0 -15 L 190 0 L 0 15 Z" fill={NORTH} />
            <path d="M 0 -15 L -190 0 L 0 15 Z" fill={SOUTH} />
            <circle r={7} fill="#d7e6ff" />
          </g>
        </svg>
        <Panel opacity={at(frame, 0.2)} style={{ left: 140, top: 190, width: 900 }}>
          <Kicker>To build with magnetism, we have to measure it</Kicker>
          <div style={{ fontSize: 70, fontWeight: 300, letterSpacing: -2, marginTop: 16, lineHeight: 1.15, opacity: at(frame, 3.6) }}>1832 · Carl Friedrich Gauss</div>
          <div style={{ fontSize: 42, fontWeight: 300, color: C.dim, marginTop: 18, lineHeight: 1.35, opacity: at(frame, 7.4) }}>
            measures the Earth’s field in absolute terms, using only
          </div>
          <div style={{ fontSize: 76, fontWeight: 300, marginTop: 20, display: 'flex', gap: 46 }}>
            {[
              ['length', 11.6],
              ['mass', 12.6],
              ['time', 13.4],
            ].map(([w, t]) => (
              <span key={w} style={{ opacity: at(frame, t as number), color: C.electron }}>
                {w}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 42, fontWeight: 300, marginTop: 34, opacity: at(frame, 14.8) }}>
            The old unit of field: <span style={{ color: BFIELD }}>the gauss</span>
          </div>
        </Panel>
      </Scene>

      {/* the tesla, and a scale of field strengths */}
      <Scene opacity={tesla}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 110, textAlign: 'center' }}>
          <Kicker>The modern unit · after Nikola Tesla · adopted 1960</Kicker>
          <div style={{ fontSize: 150, fontWeight: 300, letterSpacing: -4, marginTop: 4 }}>
            <span style={{ color: BFIELD }}>1 tesla</span>
            <span style={{ opacity: at(frame, 24.9) }}>
              <span style={{ color: C.dim }}> = </span>10,000 gauss
            </span>
          </div>
        </Panel>
        <AbsoluteFill style={{ opacity: at(frame, 28.6) }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id="bscale" x1="0" x2="1">
                <stop offset="0" stopColor={BFIELD} stopOpacity={0.25} />
                <stop offset="1" stopColor={GOLD} stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <rect x={X0} y={676} width={X1 - X0} height={8} rx={4} fill="url(#bscale)" />
            {[-5, -4, -3, -2, -1, 0, 1].map((p) => (
              <g key={p}>
                <path d={`M ${xOf(10 ** p)} 664 V 696`} stroke="#d7e6ff" strokeOpacity={0.5} strokeWidth={2} />
                <text x={xOf(10 ** p)} y={736} fill={C.dim} fontFamily="Sora" fontSize={24} textAnchor="middle">
                  {['10 µT', '100 µT', '1 mT', '10 mT', '0.1 T', '1 T', '10 T'][p + 5]}
                </text>
              </g>
            ))}
            {MARKS.map(([b, name, value, t, color]) => (
              <g key={name} opacity={at(frame, t)}>
                <circle cx={xOf(b)} cy={680} r={15} fill={color} style={{ filter: `drop-shadow(0 0 14px ${color})` }} />
                <path d={`M ${xOf(b)} 660 V 600`} stroke={color} strokeWidth={2.5} />
                <text x={xOf(b)} y={540} fill={C.text} fontFamily="Sora" fontSize={40} fontWeight={300} textAnchor="middle">
                  {name}
                </text>
                <text x={xOf(b)} y={584} fill={color} fontFamily="Sora" fontSize={28} textAnchor="middle">
                  {value}
                </text>
              </g>
            ))}
          </svg>
        </AbsoluteFill>
        <Cap opacity={span(frame, T(27.4), T(39.2))} kicker="One tesla is a strong field" title="Each step along this scale is ten times stronger" />
      </Scene>

      {/* the ampere */}
      <Cap opacity={span(frame, T(39.6), T(42.8))} kicker="And magnetism gave us" title="the unit of current itself" />
      <Cap opacity={span(frame, T(43.0), T(54.8))} kicker="1948 · the ampere, defined by Ampère’s own experiment" title="Two long parallel wires, one metre apart" />
      <Panel opacity={span(frame, T(51.4), T(54.8), 8)} style={{ right: 110, top: 70 }}>
        <Meter label="Force on each metre of wire, at 1 A" value="2 × 10⁻⁷" unit="N" color={CURRENT} size={96} align="right" />
      </Panel>
      <Panel opacity={span(frame, T(47.9), T(54.8), 8)} style={{ left: 110, top: 540 }}>
        <div style={{ fontSize: 44, fontWeight: 300, color: C.dim }}>1 m apart</div>
      </Panel>
      <Center opacity={counted}>
        <Kicker style={{ marginBottom: 24 }}>2019 · redefined by counting electrons</Kicker>
        <Big size={96}>
          1 ampere = <span style={{ color: C.electron }}>6.24 × 10¹⁸</span> electrons
        </Big>
        <Sub style={{ opacity: at(frame, 58.6) }}>passing a point every second</Sub>
      </Center>
      <Timeline frame={frame} already={[0, 1, 2, 3, 4, 5, 6, 7, 9, 10]} events={[[8, 3.4], [11, 22.4]]} />
    </Shell>
  );
};

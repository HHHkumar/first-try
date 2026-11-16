import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/fields/ch2.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { caveat } from '../../fonts';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Kicker, Meter } from '../../ui/type';
import { BFIELD, CURRENT, NORTH, SOUTH } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import { at, B, Cap, E, EFIELD, Ink, ring, shot, Timeline, VOICE } from './kit';

// Chapter 2 - Faraday: a changing magnetic field makes an electric field.
export const F2_FRAMES = chapterFrames(voice.duration);
// a needle that kicks at time t0 (seconds of narration) and settles back
const kick = (frame: number, t0: number, sign: number) => {
  const s = (frame - T(t0)) / 30;
  return s < 0 ? 0 : sign * 42 * Math.exp(-s * 1.3) * Math.cos(s * 5);
};
const MeterDial = ({ x, y, angle }: { x: number; y: number; angle: number }) => (
  <>
    <circle cx={x} cy={y} r={92} />
    <path d={`M ${x - 60} ${y - 40} A 72 72 0 0 1 ${x + 60} ${y - 40}`} strokeOpacity={0.4} />
    <path d={`M ${x} ${y + 30} L ${x} ${y - 66}`} transform={`rotate(${angle} ${x} ${y + 30})`} stroke={CURRENT} strokeWidth={5} />
  </>
);

export const F2 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const note = span(frame, T(-1), T(17.5), 12);
  const ringScene = span(frame, T(17.6), T(48.8), 12);
  const magnet = span(frame, T(48.9), T(68.2), 12);
  const space = shot(frame, 68.2, 109.4);
  const cooker = span(frame, T(109.5), T(140), 12);
  const on = frame >= T(41.4) && frame < T(46.4);
  const needle1 = kick(frame, 41.6, 1) + kick(frame, 46.6, -1);
  // the magnet: pushed in, held, pulled out
  const inn = ramp(frame, T(52.6), T(54.8)) - ramp(frame, T(59.3), T(61.6));
  const moving = frame > T(52.6) && frame < T(54.8) ? 1 : frame > T(59.3) && frame < T(61.6) ? -1 : 0;
  const needle2 = moving * 34 + kick(frame, 54.8, 0.3) + kick(frame, 61.6, -0.3);
  const mx = lerp(360, 760, inn);
  const grow = 0.5 + 0.5 * Math.sin(frame * 0.05);
  const wire = 1 - ramp(frame, T(104.0), T(106.0));
  const heat = ramp(frame, T(123.6), T(131.0));

  return (
    <Shell
      voice={VOICE(2)}
      frames={F2_FRAMES}
      world={
        space > 0 ? (
          <AbsoluteFill style={{ opacity: space }}>
            <Stage3D
              width={width}
              height={height}
              pose={{ pos: [6 + Math.sin(frame * 0.003) * 1.5, 3.6, 13], target: [0, 0, 0], fov: 34, focus: 15, dof: 0.045 }}
              glows={(add) => {
                // a magnetic field through the middle, growing and shrinking
                const c = rgb(BFIELD);
                for (const [y, z] of [[0, 0], [0.6, 0], [-0.6, 0], [0, 0.6], [0, -0.6], [0.45, 0.45], [-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45]])
                  for (let i = 0; i <= 90; i++) {
                    const x = -5 + i * 0.11;
                    const phase = (((i - frame * 0.7 + y * 20 + z * 9) % 30) + 30) % 30;
                    const pulse = Math.exp(-(phase * phase) / 12);
                    add(x, y, z, 0.06 + 0.1 * pulse, c, (0.2 + 0.7 * pulse) * (0.25 + 0.75 * grow));
                  }
                // the wire loop, then only the electric field that was pushing its charges
                const g = rgb('#c8d4ea');
                for (let i = 0; i < 120; i++) add(0, Math.cos((i / 120) * 6.283) * 2.2, Math.sin((i / 120) * 6.283) * 2.2, 0.17, g, 0.8 * wire);
                const dir = Math.cos(frame * 0.05) > 0 ? 1 : -1;
                const strength = Math.abs(Math.cos(frame * 0.05));
                const loops = at(frame, 80.9);
                ring(add, 0, 0, 0, 'x', 2.2, frame, EFIELD, loops * (0.3 + strength), dir);
                for (const [x, r] of [[0, 3.2], [-2.4, 2.4], [2.4, 2.4], [0, 1.3]]) ring(add, x, 0, 0, 'x', r, frame, EFIELD, at(frame, 96.4) * (0.2 + 0.8 * strength), dir);
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

      <Scene opacity={ringScene}>
        <Ink>
          <circle cx={960} cy={470} r={200} strokeWidth={46} stroke="#9aa6c0" strokeOpacity={0.85} />
        </Ink>
        <Ink color={on ? CURRENT : '#d7e6ff'}>
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M 730 ${400 + i * 20} h 62`} strokeWidth={5} />
          ))}
          <path d="M 730 400 H 420 V 440 M 420 520 V 560 H 730" />
          <path d="M 380 440 H 460 M 400 470 H 440 M 380 500 H 460 M 400 520 H 440" strokeWidth={5} />
          <path d={`M 520 400 L ${on ? 600 : 590} ${on ? 400 : 356}`} strokeWidth={7} />
        </Ink>
        <Ink>
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M 1128 ${400 + i * 20} h 62`} strokeWidth={5} />
          ))}
          <path d="M 1190 400 H 1480 V 390 M 1480 560 H 1190" />
          <MeterDial x={1480} y={470} angle={needle1} />
        </Ink>
        <Panel opacity={1} style={{ left: 330, top: 600, width: 300, textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 300, color: C.dim }}>battery and switch</div>
        </Panel>
        <Panel opacity={1} style={{ left: 1330, top: 600, width: 300, textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 300, color: C.dim }}>meter</div>
        </Panel>
        <Cap opacity={span(frame, T(17.8), T(28.9))} kicker="August 1831" title="Two separate coils on an iron ring, with no connection between them" />
        <Cap opacity={span(frame, T(29.1), T(38.2))} kicker="A steady current in the first coil" title="The meter shows nothing. Everyone had looked for a steady effect" />
        <Cap opacity={span(frame, T(38.4), T(48.8))} kicker="At the instant of switching on, the needle kicks" title="And on switching off, it kicks the other way" />
      </Scene>

      <Scene opacity={magnet}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
          <rect x={mx} y={420} width={170} height={100} fill={SOUTH} />
          <rect x={mx + 170} y={420} width={170} height={100} fill={NORTH} />
        </svg>
        <Ink>
          {Array.from({ length: 10 }, (_, i) => (
            <ellipse key={i} cx={1000 + i * 30} cy={470} rx={22} ry={120} />
          ))}
          <path d="M 1000 592 V 730 H 1620 V 562 M 1270 350 V 300 H 1620 V 378" />
          <MeterDial x={1620} y={470} angle={needle2} />
        </Ink>
        <Cap opacity={span(frame, T(49.0), T(55.4))} kicker="A bar magnet and a coil of wire" title="Push the magnet in, and a current flows" />
        <Cap opacity={span(frame, T(55.6), T(59.2))} kicker="Hold it still, however strong it is" title="and nothing happens" />
        <Cap opacity={span(frame, T(59.4), T(62.4))} kicker="Pull it out" title="and the current flows the other way" />
        <Cap opacity={span(frame, T(62.6), T(68.2), 8)} kicker="A steady magnetic field does nothing" title="Only a changing one drives a current" />
      </Scene>

      <Cap opacity={span(frame, T(68.4), T(80.8))} kicker="The charges in the wire were at rest, and something pushed them" title="Only an electric field can push a charge at rest" />
      <Cap opacity={span(frame, T(81.0), T(88.4))} kicker="So" title={<span>A changing <B>magnetic field</B> creates an <E>electric field</E></span> as unknown as string} />
      <Cap opacity={span(frame, T(88.6), T(101.7))} kicker="An electric field of a new kind: no charges to start or end on" title="Its lines close on themselves, in loops" />
      <Cap opacity={span(frame, T(101.9), T(109.4))} kicker="The wire only reveals it" title="Take the wire away: the loops are still there, in empty space" />
      <Panel opacity={span(frame, T(70.0), T(109.4))} style={{ right: 110, top: 70 }}>
        <Meter label="Magnetic field through the loop" value={Math.cos(frame * 0.05) > 0 ? 'growing' : 'shrinking'} color={BFIELD} size={70} align="right" />
      </Panel>

      <Scene opacity={cooker}>
        <Ink>
          <path d="M 420 620 H 1500" strokeWidth={8} strokeOpacity={0.7} />
          <path d="M 640 600 H 1280 M 640 600 V 420 M 1280 600 V 420 M 1280 450 H 1420" />
        </Ink>
        <Ink color={CURRENT} width={5}>
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={720 + i * 60} cy={680} r={18} />
          ))}
        </Ink>
        <Ink color={BFIELD} opacity={0.5 + 0.5 * Math.sin(frame * 0.5)}>
          {[120, 200, 280].map((r) => (
            <ellipse key={r} cx={960} cy={650} rx={r} ry={r * 0.55} strokeDasharray="5 12" />
          ))}
        </Ink>
        <Ink color={NORTH} width={5} opacity={at(frame, 121.0)}>
          {[80, 170, 260].map((r) => (
            <ellipse key={r} cx={960} cy={588} rx={r} ry={9} strokeDasharray="16 14" strokeDashoffset={-frame * 3} />
          ))}
        </Ink>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute', opacity: heat * 0.8 }}>
          <rect x={640} y={572} width={640} height={30} fill={NORTH} style={{ filter: 'blur(14px)' }} />
        </svg>
        <Panel opacity={1} style={{ left: 1340, top: 640 }}>
          <div style={{ fontSize: 30, fontWeight: 300, color: C.dim }}>glass, staying cool</div>
          <div style={{ fontSize: 30, fontWeight: 300, color: CURRENT, marginTop: 30 }}>coil under the glass</div>
        </Panel>
        <Cap opacity={span(frame, T(109.6), T(123.5))} kicker="In your kitchen: the induction cooker" title="A changing magnetic field makes loops of electric field in the pan" />
        <Cap opacity={span(frame, T(123.7), T(140))} kicker="Those drive currents in the metal" title="The pan heats itself, and the glass stays cool" />
      </Scene>
      <Timeline frame={frame} already={[]} events={[[0, 18.2]]} />
    </Shell>
  );
};

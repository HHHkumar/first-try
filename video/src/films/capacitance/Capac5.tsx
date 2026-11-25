import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/capacitance/ch5.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Kicker, Meter } from '../../ui/type';
import { drawArrow, NEG, POS } from '../../world/field';
import { mulberry32 } from '../../world/rng';
import { rgb, Stage3D } from '../../world/Stage3D';
import { at, Cap, drawPlates, Ink, PLATES, shot, Timeline, VOICE } from './kit';

// Chapter 5 - The dielectric. Faraday's discovery, and what the molecules do.
export const CAPAC5_FRAMES = chapterFrames(voice.duration);
const MATERIALS = [
  { name: 'Air', k: '× 1', t: 0 },
  { name: 'Paper', k: '× 3', t: 50.4 },
  { name: 'Glass', k: '× 5 to 10', t: 53.6 },
  { name: 'Some ceramics', k: '× thousands', t: 55.8 },
];

export const Capac5 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const molecules = useMemo(() => {
    const rand = mulberry32(21);
    const list: { x: number; y: number; z: number; a: number; b: number }[] = [];
    for (let x = -1.8; x <= 1.81; x += 1.2) for (let y = -2.4; y <= 2.41; y += 1.2) for (let z = -1.5; z <= 1.51; z += 1.5) list.push({ x, y, z, a: rand() * Math.PI * 2, b: rand() * Math.PI });
    return list;
  }, []);

  const lab = span(frame, T(-1), T(16.2), 14);
  const sWorld = shot(frame, 15.8, 58.6);
  const roll = ramp(frame, T(58.2), T(59.0));
  const align = ramp(frame, T(22.2), T(27.4), Easing.inOut(Easing.cubic));
  const oppose = at(frame, 31.4, 1.0);
  const weaken = ramp(frame, T(35.4), T(40.4));
  const fillIdx = frame < T(8.4) ? 0 : frame < T(10.2) ? 1 : frame < T(12.0) ? 2 : 3;
  const fills = ['air', 'sulphur', 'shellac', 'glass'];
  const lifts = [1, 2.2, 3.0, 5.0];
  const unroll = ramp(frame, T(68.6), T(73.0), Easing.out(Easing.cubic));

  return (
    <Shell
      voice={VOICE(5)}
      frames={CAPAC5_FRAMES}
      world={
        frame > T(15.4) && roll < 1 ? (
          <AbsoluteFill style={{ opacity: sWorld }}>
            <Stage3D
              width={width}
              height={height}
              pose={{ ...PLATES, pos: [PLATES.pos[0] + Math.sin(frame * 0.004), PLATES.pos[1], PLATES.pos[2]] }}
              fog={0.012}
              orbs={(add) => {
                drawPlates(add, null, frame, {});
                // each molecule: a positive end and a negative end, pulled a little apart
                const p = rgb(POS);
                const n = rgb(NEG);
                for (const m of molecules) {
                  const d = 0.12 + 0.2 * align;
                  // random directions at first; in the field they turn to lie along it
                  const ux = lerp(Math.cos(m.a) * Math.sin(m.b), 1, align);
                  const uy = lerp(Math.sin(m.a) * Math.sin(m.b), 0, align);
                  const uz = lerp(Math.cos(m.b), 0, align);
                  const k = Math.hypot(ux, uy, uz) || 1;
                  add(m.x + (ux / k) * d, m.y + (uy / k) * d, m.z + (uz / k) * d, 0.34, n, 1);
                  add(m.x - (ux / k) * d, m.y - (uy / k) * d, m.z - (uz / k) * d, 0.34, p, 1);
                }
              }}
              glows={(add) => {
                drawPlates(null, add, frame, { lineGain: lerp(0.95, 0.35, weaken) });
                // the molecules' own field points the other way
                if (oppose > 0) for (const m of molecules) if (Math.abs(m.z) < 0.1) drawArrow(add, m.x + 0.5, m.y + 0.42, m.z, -1, 0, 0, 0.9, '#ffb36b', oppose * 0.9, 0.09);
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      {/* Faraday's concentric spheres */}
      <Scene opacity={lab}>
        <Ink>
          <circle cx={620} cy={500} r={250} />
          <circle cx={620} cy={500} r={140} fill="rgba(215,230,255,0.05)" />
          <path d="M 620 250 V 120 M 580 120 H 660 M 620 750 V 860 M 520 860 H 720" />
        </Ink>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
          <path d="M 620 250 A 250 250 0 1 1 619.9 250 Z M 620 360 A 140 140 0 1 0 620.1 360 Z" fill={['#93a3c0', '#ffe08a', '#ffb36b', '#9fe8d8'][fillIdx]} fillOpacity={fillIdx === 0 ? 0.06 : 0.3} fillRule="evenodd" />
        </svg>
        <Panel opacity={at(frame, 7.0)} style={{ left: 1000, top: 250, width: 800 }}>
          <Kicker>The gap is filled with</Kicker>
          <div style={{ fontSize: 110, fontWeight: 300, letterSpacing: -3, color: ['#93a3c0', '#ffe08a', '#ffb36b', '#9fe8d8'][fillIdx] }}>{fills[fillIdx]}</div>
          <div style={{ marginTop: 40 }}>
            <Meter label="Capacitance" value={`× ${lifts[fillIdx].toFixed(1)}`} color={C.electron} size={110} />
          </div>
        </Panel>
        <Cap opacity={span(frame, T(3.0), T(15.8))} kicker="1837 · Michael Faraday" title="He filled the gap with different insulating materials" />
      </Scene>

      <Cap opacity={span(frame, T(16.2), T(22.0))} kicker="An insulator has no free electrons" title="But its molecules can stretch, or turn" />
      <Cap opacity={span(frame, T(22.3), T(34.8))} kicker="In a field" title="Each molecule becomes a tiny pair of charges, with a field of its own" />
      <Cap opacity={span(frame, T(35.5), T(46.8))} kicker="That weakens the field in the gap" title="A lower voltage for the same charge: a larger capacitance" />
      <Panel opacity={span(frame, T(35.6), T(58.2))} style={{ right: 110, top: 80, display: 'flex', gap: 56 }}>
        <Meter label="Charge" value="12.0" unit="µC" size={72} />
        <Meter label="Voltage" value={lerp(12, 4, weaken).toFixed(1)} unit="V" color={C.rho} size={72} />
        <Meter label="Capacitance" value={`× ${(12 / lerp(12, 4, weaken)).toFixed(1)}`} color={C.electron} size={72} />
      </Panel>
      <Panel opacity={span(frame, T(47.4), T(58.2))} style={{ left: 110, top: 80 }}>
        <Kicker>We call such a material a dielectric</Kicker>
        <div style={{ marginTop: 16, fontSize: 44, fontWeight: 300, lineHeight: 1.5 }}>
          {MATERIALS.slice(1).map((m) => (
            <div key={m.name} style={{ opacity: at(frame, m.t) }}>
              {m.name} <span style={{ color: C.electron }}>{m.k}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* a real capacitor: foil and film, rolled up */}
      <Scene opacity={roll}>
        <Ink>
          <ellipse cx={520} cy={340} rx={150} ry={46} />
          <path d="M 370 340 V 760 A 150 46 0 0 0 670 760 V 340" fill="rgba(215,230,255,0.04)" />
          <path d="M 470 300 V 200 M 570 300 V 200" strokeWidth={5} />
        </Ink>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={670} y={420 + i * 34} width={1080 * unroll} height={i % 2 ? 14 : 24} rx={3} fill={i % 2 ? '#9fe8d8' : C.ion} fillOpacity={i % 2 ? 0.5 : 0.75} />
          ))}
        </svg>
        <Panel opacity={at(frame, 69.6)} style={{ left: 1080, top: 300, width: 700 }}>
          <div style={{ fontSize: 40, fontWeight: 300, color: C.rho }}>thin metal foil</div>
        </Panel>
        <Panel opacity={at(frame, 71.6)} style={{ left: 1080, top: 580, width: 700 }}>
          <div style={{ fontSize: 40, fontWeight: 300, color: '#9fe8d8' }}>film a few thousandths of a millimetre thick</div>
        </Panel>
        <Panel opacity={1} style={{ left: 110, top: 80 }}>
          <Kicker>A dielectric also stands a far stronger field than air</Kicker>
          <div style={{ fontSize: 60, fontWeight: 300, letterSpacing: -1, marginTop: 10 }}>so the plates can sit much closer</div>
        </Panel>
        <Cap opacity={span(frame, T(68.6), T(78.6))} kicker="A modern capacitor" title="Metres of foil and film, rolled to the size of a fingertip" />
      </Scene>

      <Timeline frame={frame} already={[0, 1, 2, 7]} events={[[5, 4.4]]} />
    </Shell>
  );
};

import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/magnetism/ch7.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker, Meter } from '../../ui/type';
import { BFIELD, CURRENT, NORTH, SOUTH } from '../../world/magnet';
import { mulberry32 } from '../../world/rng';
import { at, Cap, Timeline, VOICE } from './kit';

// Chapter 7 - Why iron? Atomic current loops, domains, and the Curie temperature.
export const MAG7_FRAMES = chapterFrames(voice.duration);
const COLS = 20;
const ROWS = 9;

export const Mag7 = () => {
  const frame = useCurrentFrame();
  const atoms = useMemo(() => {
    const rand = mulberry32(17);
    const seeds = Array.from({ length: 7 }, () => ({ x: rand() * COLS, y: rand() * ROWS, a: rand() * Math.PI * 2 }));
    return Array.from({ length: COLS * ROWS }, (_, i) => {
      const cx = i % COLS;
      const cy = Math.floor(i / COLS);
      let best = seeds[0];
      let bd = Infinity;
      for (const s of seeds) {
        const d = (s.x - cx) ** 2 + ((s.y - cy) * 1.6) ** 2;
        if (d < bd) {
          bd = d;
          best = s;
        }
      }
      return { cx, cy, random: rand() * Math.PI * 2, domain: best.a, jitter: rand() };
    });
  }, []);

  const question = span(frame, T(-1), T(7.4), 12);
  const grid = ramp(frame, T(7.2), T(7.9));
  const intoDomains = ramp(frame, T(30.4), T(33.0)); // iron: neighbours line up, in patches
  const applied = ramp(frame, T(46.2), T(49.6), Easing.inOut(Easing.cubic));
  const cut = span(frame, T(55.2), T(69.2), 12);
  const heat = ramp(frame, T(71.0), T(79.6));
  const lost = ramp(frame, T(78.6), T(80.6));
  const align = applied * (1 - lost);
  const tempC = lerp(20, 800, heat);
  const netM = frame < T(46) ? 0 : align;

  return (
    <Shell voice={VOICE(7)} frames={MAG7_FRAMES}>
      <Scene opacity={1}>
        <Center opacity={question}>
          <Kicker style={{ marginBottom: 26 }}>Why iron, and not copper or wood?</Kicker>
          <Big size={104}>Where is the current in a lump of lodestone?</Big>
        </Center>

        <AbsoluteFill style={{ opacity: grid * (1 - cut) }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            {atoms.map((a, i) => {
              const x = 250 + a.cx * 74;
              const y = 260 + a.cy * 66;
              // each atom is a tiny loop of current, with a small magnet's arrow through it
              const shake = (heat * 2.4 + 0.12) * Math.sin(frame * (0.2 + a.jitter * 0.3) + a.random * 5);
              const base = lerp(a.random, a.domain, intoDomains);
              let d = 0 - base;
              while (d > Math.PI) d -= Math.PI * 2;
              while (d < -Math.PI) d += Math.PI * 2;
              const ang = base + d * align + shake + lost * (a.random - base) * 1;
              const loop = at(frame, 12.4);
              const col = align > 0.6 ? BFIELD : '#d7e6ff';
              return (
                <g key={i} transform={`translate(${x},${y})`}>
                  <circle r={20} fill="none" stroke={CURRENT} strokeOpacity={0.35 * loop} strokeWidth={2} />
                  <circle cx={Math.cos(frame * 0.3 + i) * 20} cy={Math.sin(frame * 0.3 + i) * 20} r={3.4} fill={CURRENT} opacity={loop * 0.9} />
                  <g transform={`rotate(${(ang * 180) / Math.PI})`}>
                    <path d="M -17 0 H 15 M 7 -7 L 17 0 L 7 7" fill="none" stroke={col} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </g>
              );
            })}
          </svg>
          <Panel opacity={span(frame, T(46.0), T(69.0))} style={{ right: 110, top: 70 }}>
            <Meter label="Field inside the iron" value={`× ${Math.round(1 + 999 * netM).toLocaleString('en-US')}`} color={BFIELD} size={84} />
          </Panel>
          <Panel opacity={span(frame, T(70.2), T(83.0))} style={{ right: 110, top: 70, display: 'flex', gap: 56 }}>
            <Meter label="Temperature" value={tempC.toFixed(0)} unit="°C" color={heat > 0.5 ? NORTH : C.text} size={84} />
            <Meter label="Magnetism" value={`${Math.round(100 * (1 - lost))} %`} color={BFIELD} size={84} />
          </Panel>
          <Cap opacity={span(frame, T(7.6), T(16.6))} kicker="Ampère’s guess, long before anyone could check" title="Inside a magnet: countless tiny loops of current" />
          <Cap opacity={span(frame, T(17.0), T(24.9))} kicker="He was right" title="Electrons circle their atoms, and spin: each one a minute magnet" />
          <Cap opacity={span(frame, T(25.3), T(32.9))} kicker="In most materials these cancel out" title="But in iron, nickel and cobalt, neighbours line up" />
          <Cap opacity={span(frame, T(33.1), T(45.8))} kicker="1907 · Pierre Weiss" title="They line up in patches, called domains, pointing every way" />
          <Cap opacity={span(frame, T(46.1), T(55.0))} kicker="Apply a field" title="The domains swing into line, and the iron multiplies it" />
          <Cap opacity={span(frame, T(69.4), T(76.2))} kicker="1895 · Pierre Curie" title="Heat destroys the order" />
          <Cap opacity={span(frame, T(76.5), T(83.0), 8)} kicker="Above 770 °C, for iron" title="a magnet stops being a magnet" />
        </AbsoluteFill>

        {/* cutting a magnet only cuts between the loops */}
        <AbsoluteFill style={{ opacity: cut }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            {[-1, 1].map((side) => {
              const dx = side * 70 * ramp(frame, T(62.2), T(64.0), Easing.out(Easing.cubic));
              return (
                <g key={side} transform={`translate(${dx},0)`}>
                  <rect x={side < 0 ? 460 : 960} y={420} width={500} height={220} fill="rgba(215,230,255,0.04)" stroke="#d7e6ff" strokeWidth={3} />
                  {Array.from({ length: 6 }, (_, i) => {
                    const x = (side < 0 ? 502 : 1002) + i * 83;
                    return (
                      <g key={i}>
                        <ellipse cx={x} cy={530} rx={24} ry={88} fill="none" stroke={CURRENT} strokeWidth={3} />
                        <circle cx={x + 24 * Math.cos(frame * 0.2 + i)} cy={530 + 88 * Math.sin(frame * 0.2 + i)} r={5} fill={CURRENT} />
                      </g>
                    );
                  })}
                  <text x={side < 0 ? 440 : 940} y={545} fill={SOUTH} fontSize={50} fontFamily="Sora" fontWeight={600} textAnchor="end" opacity={side < 0 ? 1 : at(frame, 64.0)}>
                    S
                  </text>
                  <text x={side < 0 ? 980 : 1480} y={545} fill={NORTH} fontSize={50} fontFamily="Sora" fontWeight={600} opacity={side > 0 ? 1 : at(frame, 64.0)}>
                    N
                  </text>
                </g>
              );
            })}
          </svg>
          <Cap opacity={1} kicker="Our earlier puzzle, explained" title="Cut a magnet, and you only cut between loops of current" />
        </AbsoluteFill>
      </Scene>
      <Timeline frame={frame} already={[0, 1, 2, 3, 4, 5, 6, 7]} events={[[10, 33.1], [9, 71.6]]} />
    </Shell>
  );
};

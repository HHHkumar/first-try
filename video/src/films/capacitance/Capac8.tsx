import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/capacitance/ch8.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Kicker } from '../../ui/type';
import { NEG, POS } from '../../world/field';
import { at, Cap, GOLD, Ink, Timeline, VOICE } from './kit';

// Chapter 8 - Everywhere. Batteries of jars, smoothing, power factor, touch
// screens, and the capacitance nobody asked for.
export const CAPAC8_FRAMES = chapterFrames(voice.duration);

export const Capac8 = () => {
  const frame = useCurrentFrame();
  const jars = span(frame, T(-1), T(15.6), 12);
  const smooth = span(frame, T(15.4), T(21.4), 10);
  const bank = span(frame, T(21.2), T(25.8), 10);
  const touch = span(frame, T(25.6), T(32.4), 10);
  const cable = ramp(frame, T(32.2), T(32.9));
  const smoothed = ramp(frame, T(18.2), T(20.4));
  const finger = ramp(frame, T(28.6), T(31.0), Easing.out(Easing.cubic));
  const fx = 1180;
  const fy = 480;
  const stretch = ramp(frame, T(39.8), T(44.6), Easing.inOut(Easing.cubic));

  return (
    <Shell voice={VOICE(8)} frames={CAPAC8_FRAMES}>
      <Scene opacity={1}>
        {/* Franklin's battery of Leyden jars */}
        <AbsoluteFill style={{ opacity: jars }}>
          <Ink>
            {Array.from({ length: 6 }, (_, i) => {
              const x = 330 + i * 220;
              return (
                <g key={i}>
                  <path d={`M ${x} 500 Q ${x} 470 ${x + 30} 462 V 440 H ${x + 110} V 462 Q ${x + 140} 470 ${x + 140} 500 V 760 Q ${x + 140} 784 ${x + 116} 784 H ${x + 24} Q ${x} 784 ${x} 760 Z`} fill="rgba(215,230,255,0.04)" />
                  <path d={`M ${x + 2} 620 H ${x + 138} V 760 Q ${x + 138} 782 ${x + 116} 782 H ${x + 24} Q ${x + 2} 782 ${x + 2} 760 Z`} fill={`${NEG}22`} stroke="none" />
                  <path d={`M ${x + 70} 700 V 350`} strokeWidth={5} />
                </g>
              );
            })}
            <path d="M 400 350 H 1500" stroke={GOLD} strokeWidth={5} />
            <path d="M 330 800 H 1570" stroke={GOLD} strokeWidth={5} strokeOpacity={0.7} />
          </Ink>
          <Panel opacity={at(frame, 4.4)} style={{ left: 110, top: 80 }}>
            <Kicker>1749 · Benjamin Franklin</Kicker>
            <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1, marginTop: 8 }}>
              He called the set a <span style={{ color: GOLD }}>battery</span>
            </div>
          </Panel>
          <Panel opacity={at(frame, 9.0)} style={{ right: 110, top: 200, textAlign: 'right' }}>
            <Kicker>1782 · Alessandro Volta</Kicker>
            <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1, marginTop: 8 }}>
              called the device a <span style={{ color: C.electron }}>condenser</span>
            </div>
          </Panel>
        </AbsoluteFill>

        {/* smoothing */}
        <AbsoluteFill style={{ opacity: smooth }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }} fill="none">
            <line x1={300} y1={700} x2={1620} y2={700} stroke={C.dim} strokeWidth={2} />
            <path d={Array.from({ length: 265 }, (_, i) => `${i === 0 ? 'M' : 'L'} ${300 + i * 5} ${700 - 300 * Math.abs(Math.sin(i * 0.06))}`).join(' ')} stroke={GOLD} strokeWidth={4} opacity={1 - 0.7 * smoothed} />
            <path d={Array.from({ length: 265 }, (_, i) => `${i === 0 ? 'M' : 'L'} ${300 + i * 5} ${420 + 22 * (1 - (((i * 0.06) / Math.PI) % 1))}`).join(' ')} stroke={C.electron} strokeWidth={5} opacity={smoothed} />
          </svg>
          <Panel opacity={1} style={{ left: 110, top: 80 }}>
            <Kicker>In every power supply</Kicker>
            <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1, marginTop: 8 }}>A capacitor smooths the bumps into a steady voltage</div>
          </Panel>
        </AbsoluteFill>

        {/* power-factor bank */}
        <AbsoluteFill style={{ opacity: bank }}>
          <Ink>
            {Array.from({ length: 3 }, (_, r) =>
              Array.from({ length: 8 }, (_, i) => (
                <g key={`${r}-${i}`}>
                  <rect x={380 + i * 150} y={330 + r * 170} width={96} height={120} rx={8} fill="rgba(215,230,255,0.05)" />
                  <path d={`M ${404 + i * 150} ${330 + r * 170} v -22 M ${452 + i * 150} ${330 + r * 170} v -22`} strokeWidth={5} />
                </g>
              )),
            )}
            <path d="M 340 470 H 1580 M 340 640 H 1580 M 340 810 H 1580" strokeOpacity={0.5} />
          </Ink>
          <Panel opacity={1} style={{ left: 110, top: 80 }}>
            <Kicker>In substations</Kicker>
            <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1, marginTop: 8 }}>Great banks of them correct the power factor</div>
          </Panel>
        </AbsoluteFill>

        {/* touch screen */}
        <AbsoluteFill style={{ opacity: touch }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <rect x={520} y={250} width={880} height={560} rx={36} fill="rgba(215,230,255,0.03)" stroke="#d7e6ff" strokeWidth={3} />
            {Array.from({ length: 13 }, (_, i) =>
              Array.from({ length: 8 }, (_, j) => {
                const x = 590 + i * 62;
                const y = 300 + j * 62;
                const near = Math.max(0, 1 - Math.hypot(x - fx, y - fy) / 170) * finger;
                return <circle key={`${i}-${j}`} cx={x} cy={y} r={7 + 9 * near} fill={near > 0.05 ? C.electron : '#5b6c91'} opacity={0.5 + 0.5 * near} />;
              }),
            )}
            <circle cx={fx} cy={fy} r={120 - 50 * finger} fill="none" stroke={GOLD} strokeWidth={4} opacity={finger} />
          </svg>
          <Panel opacity={1} style={{ left: 110, top: 80 }}>
            <Kicker>Under the glass of a touch screen</Kicker>
            <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1, marginTop: 8 }}>A grid of tiny capacitors, changed by your finger</div>
          </Panel>
        </AbsoluteFill>

        {/* the cable */}
        <AbsoluteFill style={{ opacity: cable }}>
          <Ink>
            {/* cross-section: core, insulation, sheath */}
            <circle cx={360} cy={520} r={170} />
            <circle cx={360} cy={520} r={150} strokeOpacity={0.3} />
            <circle cx={360} cy={520} r={56} fill={`${POS}55`} stroke={POS} />
          </Ink>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }} fill="none" strokeLinecap="round">
            <g opacity={at(frame, 39.6)}>
              <line x1={640} y1={430} x2={640 + 1160 * stretch} y2={430} stroke={NEG} strokeWidth={10} />
              <line x1={640} y1={520} x2={640 + 1160 * stretch} y2={520} stroke={POS} strokeWidth={22} />
              <line x1={640} y1={610} x2={640 + 1160 * stretch} y2={610} stroke={NEG} strokeWidth={10} />
              {Array.from({ length: 12 }, (_, i) => {
                const x = 700 + i * 92 + ((frame * 2.4) % 92);
                return x < 640 + 1160 * stretch - 20 ? <path key={i} d={`M ${x} 555 v 34 m -8 -10 l 8 12 l 8 -12 M ${x} 485 v -34 m -8 10 l 8 -12 l 8 12`} stroke={GOLD} strokeWidth={3} opacity={at(frame, 46.6)} /> : null;
              })}
            </g>
          </svg>
          <Panel opacity={at(frame, 40.0)} style={{ left: 640, top: 300, fontSize: 30, fontWeight: 300, color: NEG }}>
            sheath
          </Panel>
          <Panel opacity={at(frame, 40.0)} style={{ left: 640, top: 640, fontSize: 30, fontWeight: 300, color: POS }}>
            core, with insulation between: two plates, stretched out for kilometres
          </Panel>
          <Panel opacity={1} style={{ left: 110, top: 80 }}>
            <Kicker>Capacitance appears where nobody asked for it</Kicker>
            <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1, marginTop: 8 }}>Any two conductors with a gap between them</div>
          </Panel>
          <Panel opacity={at(frame, 46.6)} style={{ left: 640, top: 780 }}>
            <Big size={72} style={{ color: GOLD, textAlign: 'left' }}>
              charging current
            </Big>
          </Panel>
          <Cap opacity={span(frame, T(39.8), T(51.2))} kicker="A long underground cable" title="Simply energising it draws a current engineers must design for" />
        </AbsoluteFill>
      </Scene>
      <Timeline frame={frame} already={[0, 1, 2, 5, 6, 7]} events={[[3, 0.2], [4, 8.5]]} />
    </Shell>
  );
};

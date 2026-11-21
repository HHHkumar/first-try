import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/capacitance/ch7.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Kicker, Sub, Sym } from '../../ui/type';
import { NEG, POS } from '../../world/field';
import { at, Cap, GOLD, Ink, Timeline, VOICE } from './kit';

// Chapter 7 - Capacitors in circuits. The time constant; DC and AC; parallel and series.
export const CAPAC7_FRAMES = chapterFrames(voice.duration);

const curve = (fn: (u: number) => number, upTo: number) =>
  Array.from({ length: 121 }, (_, i) => i / 120)
    .filter((u) => u <= upTo)
    .map((u, i) => `${i === 0 ? 'M' : 'L'} ${u * 760} ${420 - fn(u) * 380}`)
    .join(' ');

// two plates of a capacitor symbol, with a few charges on them
const CapSymbol = ({ x, y, h = 150, gap = 36, charged = 1 }: { x: number; y: number; h?: number; gap?: number; charged?: number }) => (
  <g>
    <path d={`M ${x - gap / 2} ${y - h / 2} V ${y + h / 2}`} stroke={POS} strokeWidth={8} />
    <path d={`M ${x + gap / 2} ${y - h / 2} V ${y + h / 2}`} stroke={NEG} strokeWidth={8} />
    {[-0.3, 0, 0.3].map((k) => (
      <g key={k} opacity={charged}>
        <path d={`M ${x - gap / 2 - 30} ${y + k * h} h 16 m -8 -8 v 16`} stroke={POS} strokeWidth={3} />
        <path d={`M ${x + gap / 2 + 14} ${y + k * h} h 16`} stroke={NEG} strokeWidth={3} />
      </g>
    ))}
  </g>
);

export const Capac7 = () => {
  const frame = useCurrentFrame();
  const rc = span(frame, T(-1), T(31.9), 12);
  const acdc = span(frame, T(31.7), T(51.9), 12);
  const combos = ramp(frame, T(51.7), T(52.4));
  const draw = ramp(frame, T(5.6), T(14.4), Easing.linear);
  const TAU = 0.2; // one time constant, as a share of the graph's width
  const slosh = Math.sin(frame * 0.16);

  return (
    <Shell voice={VOICE(7)} frames={CAPAC7_FRAMES}>
      <Scene opacity={1}>
        {/* charging through a resistor */}
        <AbsoluteFill style={{ opacity: rc }}>
          <Ink>
            {/* battery, resistor, capacitor in a loop */}
            <path d="M 200 760 V 420 M 200 380 V 300 H 330 l 14 -26 l 28 52 l 28 -52 l 28 52 l 28 -52 l 14 26 H 640 V 440 M 640 520 V 760 H 200" />
            <path d="M 160 420 H 240 M 180 380 H 220" strokeWidth={6} />
          </Ink>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <g fill="none" strokeLinecap="round" transform="rotate(90 640 480)">
              <CapSymbol x={640} y={480} h={170} gap={80} charged={draw} />
            </g>
            <g transform="translate(960,330)">
              <line x1={0} y1={420} x2={780} y2={420} stroke={C.dim} strokeWidth={2} />
              <line x1={0} y1={420} x2={0} y2={20} stroke={C.dim} strokeWidth={2} />
              <line x1={0} y1={40} x2={780} y2={40} stroke={C.rho} strokeWidth={2} strokeDasharray="8 8" opacity={0.6} />
              <text x={776} y={28} fill={C.rho} fontSize={24} fontFamily="Sora" textAnchor="end">
                battery voltage
              </text>
              <path d={curve((u) => 1 - Math.exp(-u / TAU), draw)} fill="none" stroke={C.electron} strokeWidth={5} />
              <path d={curve((u) => Math.exp(-u / TAU), draw)} fill="none" stroke={GOLD} strokeWidth={4} strokeDasharray="10 8" />
              <text x={500} y={120} fill={C.electron} fontSize={28} fontFamily="Sora" opacity={at(frame, 8.4)}>
                voltage on the capacitor
              </text>
              <text x={300} y={360} fill={GOLD} fontSize={28} fontFamily="Sora" opacity={at(frame, 6.8)}>
                current
              </text>
              {/* one and five time constants */}
              <g opacity={at(frame, 23.8)}>
                <line x1={760 * TAU} y1={420} x2={760 * TAU} y2={420 - 0.632 * 380} stroke={C.text} strokeWidth={2} strokeDasharray="6 6" />
                <circle cx={760 * TAU} cy={420 - 0.632 * 380} r={9} fill={C.text} />
                <text x={760 * TAU + 16} y={420 - 0.632 * 380 + 34} fill={C.text} fontSize={26} fontFamily="Sora">
                  63 %, about two thirds
                </text>
                <text x={760 * TAU} y={456} fill={C.text} fontSize={26} fontFamily="Sora" textAnchor="middle">
                  1 τ
                </text>
              </g>
              <g opacity={at(frame, 28.2)}>
                <circle cx={760} cy={420 - 0.993 * 380} r={9} fill={C.text} />
                <text x={760} y={456} fill={C.text} fontSize={26} fontFamily="Sora" textAnchor="middle">
                  5 τ
                </text>
              </g>
            </g>
          </svg>
          <Panel opacity={at(frame, 15.6)} style={{ left: 110, top: 80 }}>
            <Kicker>The time constant</Kicker>
            <div style={{ fontSize: 120, marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 26 }}>
              <Sym>τ</Sym>
              <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
                =
              </Sym>
              <Sym color={GOLD} show={at(frame, 17.8, 0.3)}>
                R
              </Sym>
              <Sym color={C.electron} show={at(frame, 19.4, 0.3)}>
                C
              </Sym>
            </div>
          </Panel>
          <Cap opacity={span(frame, T(0.2), T(14.8))} kicker="A capacitor never charges in an instant" title="The current starts large and fades as it fills" />
          <Cap opacity={span(frame, T(15.4), T(31.7))} kicker="Resistance multiplied by capacitance" title="sets the pace: full, in practice, after five time constants" />
        </AbsoluteFill>

        {/* steady against changing voltage */}
        <AbsoluteFill style={{ opacity: acdc }}>
          <div style={{ position: 'absolute', left: 960, top: 200, width: 2, height: 560, background: 'rgba(147,163,192,0.25)' }} />
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }} fill="none" strokeLinecap="round">
            <path d="M 250 480 H 430 M 530 480 H 710" stroke="#d7e6ff" strokeWidth={4} />
            <CapSymbol x={480} y={480} h={200} gap={100} />
            <line x1={250} y1={300} x2={710} y2={300} stroke={C.rho} strokeWidth={4} />
            <g opacity={at(frame, 42.0)}>
              <path d="M 1210 480 H 1390 M 1490 480 H 1670" stroke="#d7e6ff" strokeWidth={4} />
              <CapSymbol x={1440} y={480} h={200} gap={100} charged={Math.abs(slosh)} />
              <path d={Array.from({ length: 93 }, (_, i) => `${i === 0 ? 'M' : 'L'} ${1210 + i * 5} ${300 - 46 * Math.sin(i * 0.2 + frame * 0.16)}`).join(' ')} stroke={C.rho} strokeWidth={4} />
              {/* charge flowing on and off the plates */}
              {[1250, 1310, 1550, 1610].map((x) => (
                <path key={x} d={`M ${x + 22 * slosh - 14} 468 l ${slosh > 0 ? 14 : -14} 12 l ${slosh > 0 ? -14 : 14} 12`} stroke={GOLD} strokeWidth={4} transform={`translate(${slosh > 0 ? 0 : 14},0)`} />
              ))}
            </g>
          </svg>
          <Panel opacity={1} style={{ left: 110, top: 80, width: 800 }}>
            <Kicker color={C.rho}>A steady voltage</Kicker>
            <div style={{ fontSize: 50, fontWeight: 300, marginTop: 8, opacity: at(frame, 34.2) }}>Once charged, the current stops</div>
          </Panel>
          <Panel opacity={at(frame, 42.0)} style={{ left: 1040, top: 80, width: 800 }}>
            <Kicker color={C.rho}>A changing voltage</Kicker>
            <div style={{ fontSize: 50, fontWeight: 300, marginTop: 8 }}>Charge keeps flowing on and off</div>
          </Panel>
          <Panel opacity={at(frame, 47.4)} style={{ left: 0, right: 0, top: 720, textAlign: 'center' }}>
            <div style={{ fontSize: 66, fontWeight: 300, letterSpacing: -1 }}>
              Blocks direct current, <span style={{ color: C.electron, opacity: at(frame, 49.6) }}>passes alternating current</span>
            </div>
          </Panel>
        </AbsoluteFill>

        {/* side by side, and end to end */}
        <AbsoluteFill style={{ opacity: combos }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }} fill="none" strokeLinecap="round">
            <path d="M 240 480 H 400 M 400 380 V 580 M 400 380 H 470 M 400 580 H 470 M 570 380 H 640 M 570 580 H 640 M 640 380 V 580 M 640 480 H 800" stroke="#d7e6ff" strokeWidth={4} />
            <CapSymbol x={520} y={380} h={120} gap={100} />
            <CapSymbol x={520} y={580} h={120} gap={100} />
            <g opacity={at(frame, 58.2)}>
              <path d="M 1110 480 H 1230 M 1330 480 H 1470 M 1570 480 H 1690" stroke="#d7e6ff" strokeWidth={4} />
              <CapSymbol x={1280} y={480} h={150} gap={100} />
              <CapSymbol x={1520} y={480} h={150} gap={100} />
            </g>
          </svg>
          <Panel opacity={1} style={{ left: 110, top: 80, width: 820 }}>
            <Kicker>Side by side</Kicker>
            <div style={{ fontSize: 50, fontWeight: 300, marginTop: 8, opacity: at(frame, 54.8) }}>The areas add, so the capacitances add</div>
          </Panel>
          <Panel opacity={at(frame, 55.8)} style={{ left: 240, top: 720, width: 560, textAlign: 'center' }}>
            <div style={{ fontSize: 76 }}>
              <Sym>C</Sym> <Sym color={C.dim} style={{ fontStyle: 'normal' }}>=</Sym> <Sym color={C.electron}>C₁ + C₂</Sym>
            </div>
          </Panel>
          <Panel opacity={at(frame, 58.2)} style={{ left: 1040, top: 80, width: 800 }}>
            <Kicker>End to end</Kicker>
            <div style={{ fontSize: 50, fontWeight: 300, marginTop: 8 }}>The gaps add, so the total is smaller</div>
          </Panel>
          <Panel opacity={at(frame, 61.6)} style={{ left: 1110, top: 720, width: 580, textAlign: 'center' }}>
            <Sub style={{ marginTop: 0 }}>smaller than either one alone</Sub>
          </Panel>
        </AbsoluteFill>
      </Scene>
      <Timeline frame={frame} already={[0, 1, 2, 5, 6, 7]} />
    </Shell>
  );
};

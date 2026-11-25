import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import voice from '../../public/voice/ch4.json';
import { lerp, ramp, span } from '../anim';
import { Caption } from '../scenes/overlays';
import { C } from '../theme';
import { Panel } from '../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../ui/Shell';
import { Dimension, Tube } from '../ui/Tube';
import { Center, Frac, Kicker, Meter, Sub, Sym } from '../ui/type';

// Chapter 4 - Shape matters. Stretch the wire, thicken it, and watch the
// resistance follow length over area.
export const CH4_FRAMES = chapterFrames(voice.duration);

// 1 m of 1 mm^2 copper: R = 1.68e-8 * 1 / 1e-6 = 16.8 milliohms.
const R0 = 16.8;
const L0 = 600;
const RAD0 = 60;
const X0 = 180;
const Y0 = 520;

const Headline = ({ kicker, a, b, opacity, bAt }: { kicker: string; a: string; b: string; opacity: number; bAt: number }) => (
  <Panel opacity={opacity} style={{ left: 110, top: 80 }}>
    <Kicker>{kicker}</Kicker>
    <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1, marginTop: 10 }}>
      {a} <span style={{ color: C.electron, opacity: bAt }}>{b}</span>
    </div>
  </Panel>
);

export const Chapter4 = () => {
  const frame = useCurrentFrame();

  // --- the wire being reshaped ---------------------------------------------
  const stretch = ramp(frame, T(4.2), T(5.7)) * (1 - ramp(frame, T(19.2), T(20.3)));
  const thick = ramp(frame, T(21.0), T(23.4)) * (1 - ramp(frame, T(39.9), T(40.9)));
  const wide = ramp(frame, T(41.3), T(42.6));
  const length = L0 * (1 + stretch);
  const radius = RAD0 * (1 + (Math.SQRT2 - 1) * thick + wide);
  const area = (radius / RAD0) ** 2;
  const R = (R0 * (length / L0)) / area;
  const lab = span(frame, 0, T(47.3), 12);
  const formula = span(frame, T(47.0), T(52.0), 12);
  const cords = span(frame, T(52.0), T(59.6), 12);
  const gauge = ramp(frame, T(59.5), T(60.2));
  const lengthLabel = stretch > 0.5 ? '2 L' : 'L';
  const areaLabel = wide > 0.5 ? '4 A' : thick > 0.5 ? '2 A' : 'A';

  // --- strain gauge on a bridge ---------------------------------------------
  const truck = ramp(frame, T(61.6), T(70.6), Easing.inOut(Easing.quad));
  const load = Math.sin(Math.PI * Math.min(1, Math.max(0, (truck - 0.08) / 0.84))) ** 1.2;
  const sag = 34 * load;
  const beamY = (u: number) => 400 + sag * Math.sin(Math.PI * u);
  const beam = Array.from({ length: 41 }, (_, i) => `${i === 0 ? 'M' : 'L'} ${220 + i * 22} ${beamY(i / 40)}`).join(' ');
  const truckU = lerp(-0.12, 1.12, truck);
  const truckX = 220 + truckU * 880;
  const truckY = truckU > 0 && truckU < 1 ? beamY(truckU) : 400;
  const strain = load;
  const serp = (() => {
    const w = 190 * (1 + 0.16 * strain);
    const hgt = 150 * (1 - 0.05 * strain);
    const passes = 8;
    let d = '';
    for (let i = 0; i < passes; i++) {
      const y = -hgt / 2 + (i * hgt) / (passes - 1);
      const x1 = i % 2 === 0 ? -w / 2 : w / 2;
      const x2 = -x1;
      d += `${i === 0 ? 'M' : 'L'} ${x1} ${y} L ${x2} ${y} `;
    }
    return d;
  })();

  return (
    <Shell voice="ch4" frames={CH4_FRAMES}>
      <Scene opacity={1}>
        {/* the wire on the bench */}
        <AbsoluteFill style={{ opacity: lab }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <Tube x={X0} y={Y0} length={length} radius={radius} frame={frame} flow={1.6} density={5} lanes={4} laneOpacity={span(frame, T(28.9), T(34.4), 16)} />
            <Dimension x1={X0} x2={X0 + length} y={Y0 + radius + 44} label={lengthLabel} opacity={ramp(frame, T(3.4), T(4.0))} />
            <g opacity={ramp(frame, T(20.6), T(21.2))}>
              <line x1={X0 + length + radius * 0.36 + 14} y1={Y0} x2={X0 + length + 120} y2={Y0 - radius - 30} stroke={C.shape} strokeWidth={2} />
              <text x={X0 + length + 130} y={Y0 - radius - 36} fill={C.shape} fontSize={40} fontFamily="'STIX Two', serif" fontStyle="italic">
                {areaLabel}
              </text>
            </g>
            {/* end-on: diameter against area */}
            <g opacity={span(frame, T(38.0), T(47.0), 14)}>
              <circle cx={520} cy={900} r={50} fill={C.ion} fillOpacity={0.3} stroke={C.ion} strokeWidth={3} />
              <line x1={470} y1={900} x2={570} y2={900} stroke={C.text} strokeWidth={2} strokeDasharray="6 6" />
              <text x={520} y={890} fill={C.text} fontSize={30} textAnchor="middle" fontFamily="'STIX Two', serif" fontStyle="italic">
                d
              </text>
              <g opacity={ramp(frame, T(41.2), T(42.0))}>
                <circle cx={800} cy={900} r={100} fill={C.ion} fillOpacity={0.3} stroke={C.ion} strokeWidth={3} />
                <line x1={700} y1={900} x2={900} y2={900} stroke={C.text} strokeWidth={2} strokeDasharray="6 6" />
                <text x={800} y={890} fill={C.text} fontSize={30} textAnchor="middle" fontFamily="'STIX Two', serif" fontStyle="italic">
                  2 d
                </text>
              </g>
              <text x={940} y={915} fill={C.shape} fontSize={44} fontFamily="Sora" fontWeight={300} opacity={ramp(frame, T(43.3), T(44.0))}>
                four times the area
              </text>
            </g>
          </svg>

          <Panel opacity={1} style={{ right: 70, top: 380, width: 360 }}>
            <Meter label="Resistance" value={R.toFixed(1)} unit="mΩ" color={C.electron} size={96} />
            <div style={{ height: 34 }} />
            <div style={{ opacity: span(frame, T(12.4), T(36.8), 14) }}>
              <Meter label="Push needed for 1 A" value={R.toFixed(1)} unit="mV" color={C.rho} size={64} />
            </div>
          </Panel>

          <Caption opacity={span(frame, T(0.1), T(3.3))} kicker="One metre of copper wire, 1 mm² across" title="Now let’s change its shape" />
          <Headline kicker="Length" a="Double the length," b="double the resistance" opacity={span(frame, T(15.6), T(19.0))} bAt={ramp(frame, T(16.9), T(17.5))} />
          <Caption opacity={span(frame, T(6.0), T(12.3))} kicker="Twice as long" title="Twice as much lattice to get through" />
          <Caption opacity={span(frame, T(24.2), T(34.4))} kicker="Twice the cross-section" title="Twice as many electrons, side by side" />
          <Headline kicker="Area" a="Double the area," b="half the resistance" opacity={span(frame, T(34.6), T(37.3))} bAt={ramp(frame, T(36.0), T(36.6))} />
          <Headline kicker="Area, not diameter" a="Double the diameter," b="a quarter of the resistance" opacity={span(frame, T(40.9), T(47.0))} bAt={ramp(frame, T(45.0), T(45.7))} />
        </AbsoluteFill>

        {/* the rule */}
        <Center opacity={formula}>
          <div style={{ fontSize: 220, display: 'flex', alignItems: 'center', gap: 56 }}>
            <Sym>R</Sym>
            <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
              ∝
            </Sym>
            <Frac
              color={C.shape}
              width={190}
              top={<Sym color={C.shape} show={ramp(frame, T(48.6), T(49.4))}>L</Sym>}
              bottom={<Sym color={C.shape} show={ramp(frame, T(50.7), T(51.5))}>A</Sym>}
            />
          </div>
          <Sub style={{ marginTop: 50 }}>
            <span style={{ opacity: ramp(frame, T(48.0), T(48.6)) }}>grows with length</span>
            <span style={{ opacity: ramp(frame, T(50.0), T(50.6)) }}> · shrinks with area</span>
          </Sub>
        </Center>

        {/* extension cords */}
        <AbsoluteFill style={{ opacity: cords }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <Tube x={520} y={420} length={900} radius={20} frame={frame} flow={6} density={7} heat={0.9 * ramp(frame, T(54.6), T(57.0))} seed={4} />
            <Tube x={520} y={720} length={900} radius={62} frame={frame} flow={1.9} density={2.3} seed={5} opacity={ramp(frame, T(57.4), T(58.2))} />
          </svg>
          <Panel opacity={ramp(frame, T(54.2), T(54.8))} style={{ left: 110, top: 372, width: 380, textAlign: 'right' }}>
            <div style={{ fontSize: 46, fontWeight: 300 }}>Thin cord</div>
          </Panel>
          <Panel opacity={ramp(frame, T(55.6), T(56.2))} style={{ left: 1470, top: 372 }}>
            <div style={{ fontSize: 46, fontWeight: 300, color: C.rho }}>warms up</div>
          </Panel>
          <Panel opacity={ramp(frame, T(57.8), T(58.4))} style={{ left: 110, top: 672, width: 380, textAlign: 'right' }}>
            <div style={{ fontSize: 46, fontWeight: 300 }}>Thick cord</div>
          </Panel>
          <Panel opacity={ramp(frame, T(58.6), T(59.0))} style={{ left: 1470, top: 672 }}>
            <div style={{ fontSize: 46, fontWeight: 300, color: C.electron }}>stays cool</div>
          </Panel>
          <Headline kicker="Engineers use this every day" a="The same heavy load," b="two extension cords" opacity={1} bAt={1} />
        </AbsoluteFill>

        {/* strain gauge */}
        <AbsoluteFill style={{ opacity: gauge }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            {/* piers and deck */}
            <rect x={196} y={400} width={48} height={330} fill="#18233c" stroke="#33466e" strokeWidth={2} />
            <rect x={1076} y={400} width={48} height={330} fill="#18233c" stroke="#33466e" strokeWidth={2} />
            <line x1={60} y1={730} x2={1260} y2={730} stroke="#1c2a47" strokeWidth={3} />
            <line x1={0} y1={400} x2={220} y2={400} stroke="#5b6c91" strokeWidth={26} />
            <line x1={1100} y1={400} x2={1300} y2={400} stroke="#5b6c91" strokeWidth={26} />
            <path d={beam} fill="none" stroke="#5b6c91" strokeWidth={26} strokeLinecap="round" />
            <path d={beam} fill="none" stroke="#93a3c0" strokeWidth={3} transform="translate(0,-12)" />
            {/* truck */}
            <g transform={`translate(${truckX}, ${truckY - 16})`}>
              <rect x={-92} y={-66} width={128} height={56} rx={6} fill="#26324d" stroke={C.dim} strokeWidth={2} />
              <rect x={40} y={-50} width={50} height={40} rx={6} fill="#33466e" stroke={C.dim} strokeWidth={2} />
              <circle cx={-58} cy={-4} r={13} fill={C.bg0} stroke={C.dim} strokeWidth={3} />
              <circle cx={-10} cy={-4} r={13} fill={C.bg0} stroke={C.dim} strokeWidth={3} />
              <circle cx={62} cy={-4} r={13} fill={C.bg0} stroke={C.dim} strokeWidth={3} />
            </g>
            {/* gauge under the deck, and its close-up */}
            <rect x={640} y={beamY(0.5) + 15} width={40} height={10} rx={3} fill={C.rho} />
            <line x1={660} y1={beamY(0.5) + 26} x2={1420} y2={610} stroke={C.rho} strokeWidth={2} strokeDasharray="8 8" opacity={0.7} />
            <circle cx={1540} cy={640} r={190} fill="#0a1428" stroke={C.rho} strokeWidth={3} />
            <g transform="translate(1540,640)">
              <rect x={-140} y={-110} width={280} height={220} rx={14} fill={C.rho} fillOpacity={0.08} stroke={C.rho} strokeOpacity={0.4} strokeWidth={2} />
              <path d={serp} fill="none" stroke={C.rho} strokeWidth={8 * (1 - 0.3 * strain)} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
          <Panel opacity={ramp(frame, T(64.0), T(64.8))} style={{ left: 1350, top: 860, width: 380, textAlign: 'center' }}>
            <Meter label="Gauge resistance" value={(120 + 0.24 * strain).toFixed(2)} unit="Ω" color={C.electron} size={84} align="center" />
          </Panel>
          <Headline kicker="Strain gauge" a="A very fine wire," b="bonded to the structure" opacity={1} bAt={ramp(frame, T(64.3), T(65.0))} />
          <Caption opacity={span(frame, T(66.0), T(72.0))} kicker="Stretch it" title="Longer and thinner, so its resistance rises" />
        </AbsoluteFill>
      </Scene>
    </Shell>
  );
};

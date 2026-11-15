import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../public/voice/ch5.json';
import { ramp, span } from '../anim';
import { stix } from '../fonts';
import { Caption } from '../scenes/overlays';
import { C } from '../theme';
import { Panel } from '../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../ui/Shell';
import { Tube } from '../ui/Tube';
import { Big, Center, Frac, Kicker, Meter, Sub, Sym } from '../ui/type';
import { simulate } from '../world/sim';
import { WireWorld } from '../world/WireWorld';

// Chapter 5 - Material matters. Same shape, different material; resistivity;
// the completed formula; the one-metre cube; the enormous range of rho.
export const CH5_FRAMES = chapterFrames(voice.duration);
const LATTICE = { nx: 41, ny: 9, nz: 9 };
const OUTRO = T(91.2);
const NICHROME = '#c9b8ff';

const LADDER = [
  { name: 'Silver', rho: 1.59e-8, text: '1.59 × 10⁻⁸', color: '#dfe7f2', at: 73.8, note: '' },
  { name: 'Copper', rho: 1.68e-8, text: '1.68 × 10⁻⁸', color: C.ion, at: 76.0, note: '' },
  { name: 'Gold', rho: 2.44e-8, text: '2.44 × 10⁻⁸', color: '#ffd166', at: 77.8, note: '' },
  { name: 'Aluminium', rho: 2.65e-8, text: '2.65 × 10⁻⁸', color: '#b8c4d4', at: 78.6, note: '' },
  { name: 'Nichrome', rho: 1.1e-6, text: '1.1 × 10⁻⁶', color: NICHROME, at: 79.8, note: '65 × copper' },
  { name: 'Pure silicon', rho: 2.3e3, text: '2.3 × 10³', color: '#6f9bd8', at: 83.1, note: '100 billion × copper' },
  { name: 'Glass', rho: 1.7e10, text: '10¹⁰ and up', color: '#9fe8d8', at: 87.4, note: 'a billion billion × copper, and beyond' },
];
// The axis has to keep zooming out to fit each newcomer.
const AXIS = [
  { at: 72.4, max: 3.2e-8 },
  { at: 79.8, max: 3.2e-8 },
  { at: 81.4, max: 1.3e-6 },
  { at: 83.1, max: 1.3e-6 },
  { at: 85.0, max: 2.7e3 },
  { at: 87.4, max: 2.7e3 },
  { at: 89.4, max: 2.0e10 },
];
const axisMax = (frame: number) => {
  for (let i = AXIS.length - 1; i >= 0; i--) {
    if (frame >= T(AXIS[i].at)) {
      const next = AXIS[i + 1];
      if (!next) return AXIS[i].max;
      const t = ramp(frame, T(AXIS[i].at), T(next.at), Easing.inOut(Easing.cubic));
      return Math.exp(Math.log(AXIS[i].max) + (Math.log(next.max) - Math.log(AXIS[i].max)) * t);
    }
  }
  return AXIS[0].max;
};

export const Chapter5 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const sim = useMemo(
    () => simulate({ seed: 12, count: 240, frames: CH5_FRAMES - OUTRO + 2, substeps: 4, half: [20.5, 4.5, 4.5], thermalSpeed: 0.3, accel: () => 0.006, tau: () => 11 }),
    [],
  );

  const wires = span(frame, 0, T(18.2), 12);
  const rho = span(frame, T(18.2), T(28.0), 12);
  const formula = span(frame, T(28.0), T(41.2), 12);
  const cube = span(frame, T(41.2), T(55.2), 12);
  const split = span(frame, T(55.2), T(71.9), 12);
  const ladder = span(frame, T(71.9), T(91.4), 12);
  const outro = ramp(frame, OUTRO, OUTRO + 16);
  const max = axisMax(frame);
  const show = (t: number, d = 0.6) => ramp(frame, T(t), T(t + d));

  // isometric cube
  const iso = (x: number, y: number, z: number): [number, number] => [330 + x * 330 + z * 150, 800 - y * 330 - z * 115];
  const P = (x: number, y: number, z: number) => iso(x, y, z).join(',');

  return (
    <Shell
      voice="ch5"
      frames={CH5_FRAMES}
      world={
        frame >= OUTRO ? (
          <AbsoluteFill style={{ opacity: 0.55 }}>
            <WireWorld
              frame={frame - OUTRO}
              width={width}
              height={height}
              lattice={LATTICE}
              sim={sim}
              pose={{ pos: [1.5 + (frame - OUTRO) * 0.004, 6.4, 12.5], target: [0, -0.6, 0], fov: 34, focus: 13.2, dof: 0.2 }}
              look={{ temperature: 0, electronGain: 1, ionGain: 1.1, fog: 0.045, slab: 1.5, flashes: 0.5 }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Scene opacity={1 - outro}>
        {/* same shape, different material */}
        <AbsoluteFill style={{ opacity: wires }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <Tube x={520} y={400} length={820} radius={62} frame={frame} flow={1.8} density={4.5} grain={0.25} seed={6} />
            <Tube x={520} y={720} length={820} radius={62} frame={frame} flow={1.8} density={4.5} grain={1.7} seed={7} color={NICHROME} opacity={show(3.6)} />
          </svg>
          <Panel opacity={show(7.2)} style={{ left: 110, top: 352, width: 370, textAlign: 'right' }}>
            <div style={{ fontSize: 56, fontWeight: 300, color: C.rho }}>Copper</div>
          </Panel>
          <Panel opacity={show(8.7)} style={{ left: 110, top: 660, width: 370, textAlign: 'right' }}>
            <div style={{ fontSize: 56, fontWeight: 300, color: NICHROME }}>Nichrome</div>
            <div style={{ fontSize: 28, fontWeight: 300, color: C.dim, opacity: show(9.7) }}>the alloy in a heater coil</div>
          </Panel>
          <Panel opacity={show(12.0)} style={{ left: 1420, top: 340 }}>
            <Meter label="Resistance" value="16.8" unit="mΩ" color={C.text} size={84} />
          </Panel>
          <Panel opacity={show(12.6)} style={{ left: 1420, top: 660 }}>
            <Meter label="Resistance" value="1,100" unit="mΩ" color={C.electron} size={84} />
            <div style={{ fontSize: 34, fontWeight: 300, color: NICHROME, opacity: show(13.4) }}>about 65 times as much</div>
          </Panel>
          <Panel opacity={show(15.8)} style={{ left: 110, top: 80 }}>
            <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1 }}>
              Same shape. <span style={{ color: C.electron, opacity: show(17.0) }}>Different material.</span>
            </div>
          </Panel>
          <Caption opacity={span(frame, T(0.1), T(3.2))} kicker="But" title="Length and area are not the whole story" />
        </AbsoluteFill>

        {/* rho */}
        <Center opacity={rho}>
          <Kicker>A number for the material alone, with the shape taken out</Kicker>
          <Sym color={C.rho} size={420} show={show(24.6)} style={{ lineHeight: 1.05 }}>
            ρ
          </Sym>
          <Big size={90} style={{ opacity: show(24.8) }}>
            Resistivity
          </Big>
          <Sub style={{ opacity: show(26.4) }}>the Greek letter rho</Sub>
        </Center>

        {/* the formula, complete */}
        <Center opacity={formula}>
          <Kicker style={{ marginBottom: 50, opacity: show(28.4) }}>The formula, complete</Kicker>
          <div style={{ fontSize: 230, display: 'flex', alignItems: 'center', gap: 50 }}>
            <Sym show={show(30.8, 0.4)}>R</Sym>
            <Sym color={C.dim} show={show(31.2, 0.4)} style={{ fontStyle: 'normal' }}>
              =
            </Sym>
            <Sym color={C.rho} show={show(31.7, 0.4)}>
              ρ
            </Sym>
            <Frac
              color={C.shape}
              width={190}
              show={show(32.6, 0.4)}
              top={<Sym color={C.shape}>L</Sym>}
              bottom={<Sym color={C.shape} show={show(33.4, 0.4)}>A</Sym>}
            />
          </div>
          <div style={{ display: 'flex', gap: 110, marginTop: 60, height: 40 }}>
            <Kicker color={C.rho} style={{ opacity: show(35.8), fontSize: 30 }}>
              <span style={{ fontFamily: stix, fontStyle: 'italic', textTransform: 'none', fontSize: 44, letterSpacing: 0 }}>ρ</span> &nbsp;what the material contributes
            </Kicker>
            <Kicker color={C.shape} style={{ opacity: show(38.4), fontSize: 30 }}>
              <span style={{ fontFamily: stix, fontStyle: 'italic', textTransform: 'none', fontSize: 44, letterSpacing: 0 }}>L / A</span> &nbsp;what the shape contributes
            </Kicker>
          </div>
        </Center>

        {/* a one-metre cube */}
        <AbsoluteFill style={{ opacity: cube }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <g opacity={show(43.8)} strokeLinejoin="round">
              <polygon points={`${P(0, 0, 1)} ${P(1, 0, 1)} ${P(1, 1, 1)} ${P(0, 1, 1)}`} fill={C.ion} fillOpacity={0.08} stroke={C.ion} strokeOpacity={0.45} strokeWidth={2} />
              <polygon points={`${P(0, 0, 0)} ${P(1, 0, 0)} ${P(1, 0, 1)} ${P(0, 0, 1)}`} fill={C.ion} fillOpacity={0.08} stroke={C.ion} strokeOpacity={0.45} strokeWidth={2} />
              <polygon points={`${P(0, 0, 0)} ${P(0, 0, 1)} ${P(0, 1, 1)} ${P(0, 1, 0)}`} fill={C.rho} fillOpacity={0.12 + 0.5 * show(48.8)} stroke={C.rho} strokeWidth={3} />
              <polygon points={`${P(0, 1, 0)} ${P(1, 1, 0)} ${P(1, 1, 1)} ${P(0, 1, 1)}`} fill={C.ion} fillOpacity={0.2} stroke={C.ion} strokeWidth={3} />
              <polygon points={`${P(0, 0, 0)} ${P(1, 0, 0)} ${P(1, 1, 0)} ${P(0, 1, 0)}`} fill={C.ion} fillOpacity={0.14} stroke={C.ion} strokeWidth={3} />
              <polygon points={`${P(1, 0, 0)} ${P(1, 0, 1)} ${P(1, 1, 1)} ${P(1, 1, 0)}`} fill={C.rho} fillOpacity={0.12 + 0.5 * show(49.8)} stroke={C.rho} strokeWidth={3} />
            </g>
            {/* edge lengths */}
            <g opacity={show(45.8)} fill={C.shape} fontSize={36} fontFamily="Sora" fontWeight={300}>
              <text x={iso(0.5, 0, 0)[0]} y={iso(0.5, 0, 0)[1] + 50} textAnchor="middle">1 m</text>
              <text x={iso(1, 0, 0.5)[0] + 24} y={iso(1, 0, 0.5)[1] + 34}>1 m</text>
              <text x={iso(0, 0.5, 0)[0] - 26} y={iso(0, 0.5, 0)[1] + 10} textAnchor="end">1 m</text>
            </g>
            {/* meter leads from face to face */}
            <g opacity={show(48.6)} fill="none" stroke={C.electron} strokeWidth={3}>
              <path d={`M ${iso(0, 0.6, 0.5)[0]} ${iso(0, 0.6, 0.5)[1]} C ${iso(0, 0.6, 0.5)[0] - 90} 260, 300 150, 470 150`} />
              <path d={`M ${iso(1, 0.6, 0.5)[0]} ${iso(1, 0.6, 0.5)[1]} C ${iso(1, 0.6, 0.5)[0] + 110} 380, 860 240, 730 170`} />
              <rect x={470} y={95} width={260} height={110} rx={16} fill="#0c1730" />
            </g>
          </svg>
          <Panel opacity={show(48.6)} style={{ left: 470, top: 95, width: 260, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: stix, fontStyle: 'italic', fontSize: 64 }}>
              R <span style={{ fontStyle: 'normal', color: C.dim }}>=</span> <span style={{ color: C.rho, opacity: show(50.6) }}>ρ</span>
            </span>
          </Panel>
          <Panel opacity={show(47.8)} style={{ left: 1100, top: 420, width: 720 }}>
            <Kicker>Face to opposite face</Kicker>
            <div style={{ fontSize: 50, fontWeight: 300, marginTop: 12, lineHeight: 1.25 }}>The resistance of this cube is the material’s resistivity</div>
            <div style={{ marginTop: 50, opacity: show(52.2) }}>
              <Kicker color={C.rho}>Its unit</Kicker>
              <div style={{ fontFamily: stix, fontSize: 60, marginTop: 14 }}>
                <span style={{ fontStyle: 'italic', color: C.rho }}>ρ</span> = <span style={{ fontStyle: 'italic' }}>R</span> · <span style={{ fontStyle: 'italic' }}>A</span> / <span style={{ fontStyle: 'italic' }}>L</span>
                <span style={{ color: C.dim }}> → </span>Ω · m² / m = <span style={{ color: C.rho, opacity: show(54.0) }}>Ω · m</span>
              </div>
              <div style={{ fontSize: 36, fontWeight: 300, color: C.dim, marginTop: 10, opacity: show(54.0) }}>the ohm metre</div>
            </div>
          </Panel>
          <Caption opacity={span(frame, T(41.8), T(47.6))} kicker="What is rho, physically?" title="Picture a cube, one metre on each side" />
        </AbsoluteFill>

        {/* object against substance */}
        <AbsoluteFill style={{ opacity: split }}>
          <div style={{ position: 'absolute', left: 960, top: 190, width: 2, height: 560, background: 'rgba(147,163,192,0.25)' }} />
          <Panel opacity={show(57.6)} style={{ left: 110, top: 170, width: 780 }}>
            <Kicker>Belongs to an object</Kicker>
            <div style={{ fontSize: 96, fontWeight: 300, letterSpacing: -2, marginTop: 8 }}>
              Resistance <span style={{ fontFamily: stix, fontStyle: 'italic' }}>R</span>
            </div>
          </Panel>
          <Panel opacity={show(62.1)} style={{ left: 1030, top: 170, width: 800 }}>
            <Kicker color={C.rho}>Belongs to a substance</Kicker>
            <div style={{ fontSize: 96, fontWeight: 300, letterSpacing: -2, marginTop: 8 }}>
              Resistivity <span style={{ fontFamily: stix, fontStyle: 'italic', color: C.rho }}>ρ</span>
            </div>
          </Panel>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <g opacity={show(60.1)}>
              <Tube x={150} y={520} length={420} radius={30} frame={frame} flow={1.5} density={5} seed={8} />
              <text x={360} y={620} fill={C.dim} fontSize={34} fontFamily="Sora" fontWeight={300} textAnchor="middle">
                this wire
              </text>
            </g>
            <g opacity={show(61.0)}>
              <path d={Array.from({ length: 121 }, (_, i) => `${i === 0 ? 'M' : 'L'} ${640 + i * 1.7 + 26 * Math.sin(i * 0.42)} ${520 + 46 * Math.cos(i * 0.42)}`).join(' ')} fill="none" stroke={NICHROME} strokeWidth={5} strokeLinecap="round" />
              <text x={745} y={620} fill={C.dim} fontSize={34} fontFamily="Sora" fontWeight={300} textAnchor="middle">
                this coil
              </text>
            </g>
            {/* copper in any shape: the same rho */}
            <g opacity={show(64.9)}>
              <rect x={1060} y={460} width={150} height={110} rx={8} fill={C.ion} fillOpacity={0.3} stroke={C.ion} strokeWidth={3} />
            </g>
            <g opacity={show(65.7)}>
              <circle cx={1370} cy={515} r={62} fill={C.ion} fillOpacity={0.3} stroke={C.ion} strokeWidth={3} />
            </g>
            <g opacity={show(66.3)}>
              <path d="M 1520 560 C 1580 380, 1650 640, 1720 470 S 1800 500, 1830 480" fill="none" stroke={C.ion} strokeWidth={9} strokeLinecap="round" />
            </g>
            <text x={1440} y={640} fill={C.rho} fontSize={34} fontFamily="Sora" fontWeight={300} textAnchor="middle" opacity={show(66.3)}>
              copper, in any shape: 1.68 × 10⁻⁸ Ω · m
            </text>
          </svg>
          <Center opacity={show(67.8)} style={{ justifyContent: 'flex-end', paddingBottom: 110 }}>
            <Kicker color={C.dim}>You will also meet its inverse</Kicker>
            <div style={{ fontSize: 96, marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 28 }}>
              <span style={{ fontSize: 60, fontWeight: 300, opacity: show(69.6) }}>Conductivity</span>
              <Sym color={C.electron} show={show(70.8)}>
                σ
              </Sym>
              <Sym color={C.dim} show={show(70.8)} style={{ fontStyle: 'normal' }}>
                =
              </Sym>
              <Sym show={show(70.8)}>
                1 / <span style={{ color: C.rho }}>ρ</span>
              </Sym>
            </div>
          </Center>
        </AbsoluteFill>

        {/* the range */}
        <AbsoluteFill style={{ opacity: ladder }}>
          <Panel opacity={1} style={{ left: 110, top: 70 }}>
            <Kicker>Resistivity, in ohm metres</Kicker>
            <div style={{ fontSize: 56, fontWeight: 300, letterSpacing: -1, marginTop: 8 }}>Now look at the range</div>
          </Panel>
          <Panel opacity={span(frame, T(80.0), T(91.0), 14)} style={{ right: 110, top: 96 }}>
            <Kicker color={C.dim}>the scale keeps zooming out</Kicker>
          </Panel>
          <div style={{ position: 'absolute', left: 110, right: 110, top: 250 }}>
            {LADDER.map((m) => {
              const seen = show(m.at, 0.5);
              const w = Math.max(0.0015, Math.min(1, m.rho / max));
              return (
                <div key={m.name} style={{ display: 'flex', alignItems: 'center', height: 96, opacity: seen, fontFamily: 'Sora', color: C.text }}>
                  <div style={{ width: 290, fontSize: 40, fontWeight: 300 }}>{m.name}</div>
                  <div style={{ position: 'relative', flex: 1, height: 30 }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w * 48}%`, minWidth: 3, borderRadius: 4, background: m.color, boxShadow: `0 0 22px ${m.color}66` }} />
                    <div style={{ position: 'absolute', left: `calc(${w * 48}% + 22px)`, top: -8, whiteSpace: 'nowrap', fontSize: 32, fontWeight: 300, color: C.dim, fontVariantNumeric: 'tabular-nums' }}>
                      {m.text}
                      {m.note ? <span style={{ color: m.color, marginLeft: 26, opacity: ramp(frame, T(m.at + 0.9), T(m.at + 1.5)) }}>{m.note}</span> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Scene>

      {/* why such a range */}
      <Center opacity={outro}>
        <Kicker style={{ marginBottom: 34 }}>It comes down to two things</Kicker>
        <Big size={86} style={{ opacity: show(97.6) }}>How many electrons are free to move</Big>
        <Big size={86} style={{ opacity: show(100.0), color: C.electron, marginTop: 18 }}>
          and how easily they get through
        </Big>
      </Center>
    </Shell>
  );
};

import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../public/voice/ch6.json';
import { lerp, ramp, span } from '../anim';
import { Caption } from '../scenes/overlays';
import { C } from '../theme';
import { Panel } from '../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../ui/Shell';
import { Kicker, Meter } from '../ui/type';
import { simulate } from '../world/sim';
import { WireWorld, type CameraPose } from '../world/WireWorld';

// Chapter 6 - Temperature. Hot metal scatters more; the filament's inrush; the
// PT100; semiconductors do the opposite; superconductors.
export const CH6_FRAMES = chapterFrames(voice.duration);
const LATTICE = { nx: 41, ny: 9, nz: 9 };
const SILICON = { from: T(55.6), to: T(67.9) };
const SUPER = { from: T(67.3), to: CH6_FRAMES };
const heatAt = (f: number) => ramp(f, T(6.6), T(10.4));

const pose = (frame: number): CameraPose => ({ pos: [1.5 + frame * 0.004, 6.4, 12.5], target: [frame * 0.004, -0.6, 0], fov: 34, focus: 13.2, dof: 0.2 });

export const Chapter6 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const copper = useMemo(
    () =>
      simulate({ seed: 41, count: 240, frames: T(24), substeps: 4, half: [20.5, 4.5, 4.5], thermalSpeed: 0.3, accel: () => 0.006, tau: (f) => lerp(11, 4.2, heatAt(f)) }),
    [],
  );
  const silicon = useMemo(
    () => simulate({ seed: 43, count: 240, frames: SILICON.to - SILICON.from + 2, substeps: 4, half: [20.5, 4.5, 4.5], thermalSpeed: 0.3, accel: () => 0.006, tau: () => 8 }),
    [],
  );
  // Nothing scatters: the whole crowd streams one way and never slows.
  const superSim = useMemo(
    () =>
      simulate({ seed: 47, count: 240, frames: SUPER.to - SUPER.from + 2, substeps: 4, half: [20.5, 4.5, 4.5], thermalSpeed: 0.03, accel: (f) => 0.0016 * (1 - ramp(f, 60, 150)), tau: () => 1e9 }),
    [],
  );

  const heat = heatAt(frame);
  const tempC = 20 + 80 * heat;
  const bench = span(frame, T(23.0), T(55.9), 14);
  const bulb = span(frame, T(23.0), T(38.9), 14);
  const pt = span(frame, T(38.9), T(55.9), 14);
  const siIn = span(frame, SILICON.from, SILICON.to, 16);
  const suIn = ramp(frame, SUPER.from, SUPER.from + 18);
  const show = (t: number, d = 0.6) => ramp(frame, T(t), T(t + d));

  // filament
  const glow = ramp(frame, T(26.4), T(28.4));
  const filament = `rgb(${Math.round(lerp(120, 255, glow))},${Math.round(lerp(72, 238, glow))},${Math.round(lerp(40, 190, glow))})`;
  const coil = Array.from({ length: 81 }, (_, i) => `${i === 0 ? 'M' : 'L'} ${470 + i * 2.3} ${470 + 24 * Math.sin(i * 0.78)}`).join(' ');
  const draw = ramp(frame, T(34.6), T(37.8), Easing.linear);
  const inrush = Array.from({ length: 101 }, (_, i) => {
    const u = i / 100;
    const current = u < 0.08 ? 0 : 0.075 + 0.925 * Math.exp(-(u - 0.08) / 0.09);
    return `${i === 0 ? 'M' : 'L'} ${u * 620} ${300 - current * 270}`;
  })
    .slice(0, Math.max(2, Math.round(draw * 101)))
    .join(' ');

  // PT100: R = 100 * (1 + 0.00385 T)
  const probeT = 100 * ramp(frame, T(48.8), T(50.8));
  const probeR = 100 * (1 + 0.00385 * probeT);
  const gx = (t: number) => ((t + 50) / 250) * 640;
  const gy = (r: number) => 380 - ((r - 60) / 140) * 380;

  // silicon: heating frees carriers
  const siHeat = ramp(frame, T(59.4), T(63.0));
  const carriers = lerp(0.05, 0.8, siHeat);
  const zero = ramp(frame, T(70.2), T(72.4), Easing.inOut(Easing.quad));

  return (
    <Shell
      voice="ch6"
      frames={CH6_FRAMES}
      world={
        <>
          {frame < T(24) ? (
            <AbsoluteFill>
              <WireWorld
                frame={frame}
                width={width}
                height={height}
                lattice={LATTICE}
                sim={copper}
                pose={pose(frame)}
                look={{ temperature: heat * 0.9, electronGain: 1, ionGain: 1.1 + 0.25 * heat, fog: 0.045, slab: 1.5, flashes: 0.5 }}
              />
            </AbsoluteFill>
          ) : null}
          {siIn > 0 ? (
            <AbsoluteFill style={{ opacity: siIn }}>
              <WireWorld
                frame={frame - SILICON.from}
                width={width}
                height={height}
                lattice={LATTICE}
                sim={silicon}
                pose={pose(frame - SILICON.from)}
                look={{ temperature: 0, electronGain: 1.1, ionGain: 1.05, fog: 0.045, slab: 1.5, ionTint: '#5f8fd6', tremble: 1 + 2.2 * siHeat, electronFraction: carriers, flashes: 0.4 }}
              />
            </AbsoluteFill>
          ) : null}
          {suIn > 0 ? (
            <AbsoluteFill style={{ opacity: suIn }}>
              <WireWorld
                frame={frame - SUPER.from}
                width={width}
                height={height}
                lattice={LATTICE}
                sim={superSim}
                pose={pose(frame - SUPER.from)}
                look={{ temperature: 0, electronGain: 1.25, ionGain: 1.0, fog: 0.045, slab: 1.5, ionTint: '#8fc4ff', tremble: 0.9 * (1 - zero) }}
              />
            </AbsoluteFill>
          ) : null}
        </>
      }
    >
      {/* hot copper */}
      <Caption opacity={span(frame, T(0.1), T(5.9))} kicker="Resistivity is not fixed" title="It changes with temperature" />
      <Caption opacity={span(frame, T(6.6), T(15.5))} kicker="Heat a metal" title="More trembling, more scattering" />
      <Caption opacity={span(frame, T(15.8), T(22.8))} kicker="Copper" title="About 0.4 % more resistance for every degree Celsius" />
      <Panel opacity={span(frame, T(6.4), T(22.8))} style={{ right: 110, top: 86, width: 420 }}>
        <Meter label="Temperature" value={tempC.toFixed(0)} unit="°C" color={heat > 0.3 ? C.rho : C.text} size={96} />
        <div style={{ height: 26 }} />
        <div style={{ opacity: show(13.0) }}>
          <Meter label="Resistance of our copper wire" value={(16.8 * (1 + 0.0039 * (tempC - 20))).toFixed(1)} unit="mΩ" color={C.electron} size={72} />
        </div>
      </Panel>

      <Scene opacity={bench}>
        {/* the filament */}
        <AbsoluteFill style={{ opacity: bulb }}>
          <div
            style={{
              position: 'absolute',
              left: 560 - 520,
              top: 470 - 520,
              width: 1040,
              height: 1040,
              background: 'radial-gradient(circle closest-side, rgba(255,214,150,0.5), rgba(255,170,90,0.16) 40%, rgba(255,150,70,0))',
              opacity: glow,
              mixBlendMode: 'screen',
            }}
          />
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <path d="M 470 690 C 330 610, 300 300, 560 250 C 820 300, 790 610, 650 690 Z" fill="rgba(147,163,192,0.06)" stroke="#93a3c0" strokeOpacity={0.6} strokeWidth={3} />
            <rect x={482} y={690} width={156} height={92} rx={12} fill="#18233c" stroke="#33466e" strokeWidth={3} />
            <path d="M 520 690 L 480 478 M 600 690 L 652 478" fill="none" stroke="#5b6c91" strokeWidth={4} />
            <path d={coil} fill="none" stroke={filament} strokeWidth={6} strokeLinecap="round" style={{ filter: glow > 0.05 ? `drop-shadow(0 0 ${18 * glow}px #ffcf8a)` : undefined }} />
            {/* current at switch-on */}
            <g transform="translate(1050,470)" opacity={show(33.6)}>
              <line x1={0} y1={300} x2={640} y2={300} stroke={C.dim} strokeWidth={2} />
              <line x1={0} y1={300} x2={0} y2={0} stroke={C.dim} strokeWidth={2} />
              <text x={636} y={338} fill={C.dim} fontSize={24} fontFamily="Sora" textAnchor="end">
                time
              </text>
              <text x={52} y={338} fill={C.dim} fontSize={24} fontFamily="Sora" textAnchor="middle">
                switch on
              </text>
              <path d={inrush} fill="none" stroke={C.electron} strokeWidth={4} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${C.electron})` }} />
              <text x={84} y={30} fill={C.electron} fontSize={28} fontFamily="Sora" opacity={ramp(frame, T(35.9), T(36.5))}>
                the surge: over ten times the running current
              </text>
            </g>
          </svg>
          <Panel opacity={show(23.4)} style={{ left: 1050, top: 150 }}>
            <Kicker>A tungsten lamp filament</Kicker>
            <div style={{ display: 'flex', gap: 80, marginTop: 20 }}>
              <Meter label="Cold" value="65" unit="Ω" size={84} />
              <div style={{ opacity: show(29.6) }}>
                <Meter label="Glowing, above 2,000 °C" value="880" unit="Ω" color={C.rho} size={84} />
              </div>
            </div>
          </Panel>
          <Panel opacity={show(33.6)} style={{ left: 1050, top: 400 }}>
            <Kicker color={C.dim}>Current drawn by the bulb</Kicker>
          </Panel>
        </AbsoluteFill>

        {/* PT100 */}
        <AbsoluteFill style={{ opacity: pt }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <g transform="translate(200,330)">
              <line x1={0} y1={380} x2={640} y2={380} stroke={C.dim} strokeWidth={2} />
              <line x1={gx(0)} y1={380} x2={gx(0)} y2={0} stroke={C.dim} strokeWidth={2} strokeOpacity={0.5} />
              {[-50, 0, 50, 100, 150, 200].map((t) => (
                <text key={t} x={gx(t)} y={418} fill={C.dim} fontSize={24} fontFamily="Sora" textAnchor="middle">
                  {t}
                </text>
              ))}
              {[100, 150, 200].map((r) => (
                <text key={r} x={gx(-50) - 16} y={gy(r) + 8} fill={C.dim} fontSize={24} fontFamily="Sora" textAnchor="end">
                  {r}
                </text>
              ))}
              <text x={640} y={458} fill={C.dim} fontSize={24} fontFamily="Sora" textAnchor="end">
                temperature, °C
              </text>
              <text x={-70} y={-44} fill={C.dim} fontSize={24} fontFamily="Sora">
                resistance, Ω
              </text>
              <line x1={gx(-50)} y1={gy(100 * (1 - 0.00385 * 50))} x2={gx(200)} y2={gy(100 * (1 + 0.00385 * 200))} stroke={C.rho} strokeWidth={4} opacity={show(42.2)} />
              <g opacity={show(45.4)}>
                <line x1={gx(probeT)} y1={380} x2={gx(probeT)} y2={gy(probeR)} stroke={C.electron} strokeWidth={2} strokeDasharray="6 6" />
                <line x1={gx(-50)} y1={gy(probeR)} x2={gx(probeT)} y2={gy(probeR)} stroke={C.electron} strokeWidth={2} strokeDasharray="6 6" />
                <circle cx={gx(probeT)} cy={gy(probeR)} r={11} fill={C.electronCore} style={{ filter: `drop-shadow(0 0 10px ${C.electron})` }} />
              </g>
            </g>
            {/* a stator, with sensors buried in its windings */}
            <g transform="translate(1470,700) scale(0.92)" opacity={show(51.8)}>
              <circle r={250} fill="none" stroke="#5b6c91" strokeWidth={3} />
              <circle r={150} fill="none" stroke="#5b6c91" strokeWidth={3} />
              {Array.from({ length: 24 }, (_, i) => {
                const sensor = i % 8 === 2;
                return (
                  <g key={i} transform={`rotate(${i * 15})`}>
                    <rect x={-16} y={-232} width={32} height={66} rx={5} fill={C.ion} fillOpacity={0.32} stroke={C.ion} strokeWidth={2} />
                    {sensor ? <circle cx={0} cy={-199} r={9} fill={C.electronCore} style={{ filter: `drop-shadow(0 0 10px ${C.electron})` }} /> : null}
                  </g>
                );
              })}
              <text y={-6} fill={C.text} fontSize={34} fontFamily="Sora" fontWeight={300} textAnchor="middle">
                generator
              </text>
              <text y={36} fill={C.dim} fontSize={26} fontFamily="Sora" fontWeight={300} textAnchor="middle">
                stator windings
              </text>
            </g>
          </svg>
          <Panel opacity={1} style={{ left: 110, top: 80 }}>
            <Kicker>A thermometer made of resistance</Kicker>
            <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1, marginTop: 10 }}>
              The platinum <span style={{ color: C.rho, opacity: show(43.9) }}>PT100</span>
            </div>
          </Panel>
          <Panel opacity={show(45.4)} style={{ left: 930, top: 250, display: 'flex', gap: 60 }}>
            <Meter label="Measured" value={probeR.toFixed(1)} unit="Ω" color={C.electron} size={78} />
            <Meter label="So the temperature is" value={probeT.toFixed(0)} unit="°C" color={C.rho} size={78} />
          </Panel>
        </AbsoluteFill>
      </Scene>

      {/* silicon */}
      <Caption opacity={span(frame, T(56.2), T(59.2))} kicker="Semiconductors, such as silicon" title="do the opposite" />
      <Caption opacity={span(frame, T(59.5), T(67.2))} kicker="Heat silicon" title="More electrons shake free, so resistance falls" />
      <Panel opacity={span(frame, T(59.4), T(67.2))} style={{ right: 110, top: 86, width: 420 }}>
        <Meter label="Free electrons" value={`× ${(carriers / 0.05).toFixed(0)}`} color={C.electron} size={96} />
        <div style={{ height: 26 }} />
        <Meter label="Resistance" value={`÷ ${(carriers / 0.05).toFixed(0)}`} color={C.rho} size={72} />
      </Panel>

      {/* superconductor */}
      <Caption opacity={span(frame, T(67.9), T(73.2))} kicker="Cool certain materials far enough" title="and nothing scatters at all" />
      <Caption opacity={span(frame, T(73.4), T(77.6))} kicker="Superconductivity" title="A story for another day" />
      <Panel opacity={ramp(frame, T(69.8), T(70.4))} style={{ right: 110, top: 86, width: 420 }}>
        <Meter label="Resistance" value={zero >= 1 ? '0' : (0.8 * (1 - zero)).toFixed(3)} unit="Ω" color={C.electron} size={120} />
        <div style={{ fontSize: 36, fontWeight: 300, color: C.dim, opacity: show(72.3) }}>exactly zero</div>
      </Panel>
    </Shell>
  );
};

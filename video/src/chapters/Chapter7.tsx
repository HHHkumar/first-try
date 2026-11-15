import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../public/voice/ch7.json';
import { lerp, ramp, span } from '../anim';
import { Caption } from '../scenes/overlays';
import { C } from '../theme';
import { Panel } from '../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../ui/Shell';
import { Tube } from '../ui/Tube';
import { Big, Center, Kicker, Meter, Sub, Sym } from '../ui/type';
import { findCalmElectron, positionAt, simulate } from '../world/sim';
import { WireWorld, type CameraPose } from '../world/WireWorld';

// Chapter 7 - Heat and the real world. Where the energy goes, P = I^2 R,
// heaters and fuses, and why power travels at high voltage.
export const CH7_FRAMES = chapterFrames(voice.duration);
const LATTICE = { nx: 41, ny: 9, nz: 9 };
const WORLD_END = T(23.4);

const Bar = ({ label, value, fill, color, show = 1 }: { label: string; value: string; fill: number; color: string; show?: number }) => (
  <div style={{ opacity: show, marginTop: 26 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: 'Sora', color: C.text }}>
      <span style={{ fontSize: 26, color: C.dim, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 54, fontWeight: 300, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
    <div style={{ position: 'relative', height: 22, borderRadius: 11, background: 'rgba(147,163,192,0.16)', marginTop: 8 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(0.6, fill * 100)}%`, borderRadius: 11, background: color, boxShadow: `0 0 22px ${color}88` }} />
    </div>
  </div>
);

const Tower = ({ x, s }: { x: number; s: number }) => (
  <g transform={`translate(${x},760) scale(${s})`} fill="none" stroke="#5b6c91" strokeWidth={5} strokeLinejoin="round">
    <path d="M -60 0 L -16 -360 L 16 -360 L 60 0 M -52 -70 L 44 -140 M 52 -70 L -44 -140 M -42 -150 L 30 -230 M 42 -150 L -30 -230 M -30 -240 L 20 -310 M 30 -240 L -20 -310" />
    <path d="M -150 -300 L 150 -300 L 16 -340 L -16 -340 Z M -110 -220 L 110 -220" />
  </g>
);

export const Chapter7 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const sim = useMemo(
    () => simulate({ seed: 61, count: 200, frames: WORLD_END + 4, substeps: 4, half: [20.5, 4.5, 4.5], thermalSpeed: 0.16, accel: () => 0.008, tau: () => 22 }),
    [],
  );
  const hero = useMemo(() => findCalmElectron(sim, 0, T(12)), [sim]);
  const h = useMemo(() => {
    return (f: number): [number, number, number] => {
      const acc = [0, 0, 0];
      let n = 0;
      for (let k = -14; k <= 14; k += 2) {
        const p = positionAt(sim, hero, Math.min(T(12), Math.max(0, f + k)));
        acc[0] += p[0];
        acc[1] += p[1];
        acc[2] += p[2];
        n++;
      }
      return [acc[0] / n, acc[1] / n, acc[2] / n];
    };
  }, [sim, hero])(frame);

  const follow = 1 - ramp(frame, T(10.0), T(13.0));
  const warm = ramp(frame, T(11.4), T(22.0));
  const pose: CameraPose = {
    pos: [lerp(1.5, 0.6 + h[0], follow), lerp(6.4, 3.0 + h[1] * 0.6, follow), lerp(12.5, 6.6, follow)],
    target: [h[0] * follow, lerp(-0.6, h[1], follow), h[2] * follow],
    fov: 34,
    focus: lerp(13.2, 7.2, follow),
    dof: lerp(0.2, 0.26, follow),
  };

  const show = (t: number, d = 0.6) => ramp(frame, T(t), T(t + d));
  const bench = ramp(frame, T(22.6), T(23.4));
  const power = span(frame, T(22.6), T(30.0), 12);
  const heaters = span(frame, T(30.0), T(41.0), 12);
  const fuse = span(frame, T(41.0), T(49.3), 12);
  const line = span(frame, T(49.3), T(58.0), 12);
  const hv = span(frame, T(58.0), T(71.7), 12);
  const cable = ramp(frame, T(71.7), T(72.4));

  // fuse
  const amps = lerp(4, 32, ramp(frame, T(43.4), T(45.6), Easing.in(Easing.quad)));
  const blown = ramp(frame, T(45.6), T(46.0));
  const fuseHeat = Math.min(1, Math.max(0, (amps - 8) / 22)) * (1 - blown);
  // cable beyond its rating
  const overload = ramp(frame, T(75.2), T(78.0));
  const hot = (g: number) => `rgb(255,${Math.round(lerp(190, 120, g))},${Math.round(lerp(120, 50, g))})`;
  const heaterGlow = ramp(frame, T(36.4), T(39.6));

  return (
    <Shell
      voice="ch7"
      frames={CH7_FRAMES}
      world={
        frame < WORLD_END ? (
          <AbsoluteFill>
            <WireWorld
              frame={frame}
              width={width}
              height={height}
              lattice={LATTICE}
              sim={sim}
              pose={pose}
              look={{
                temperature: warm * 0.8,
                electronGain: lerp(1, 0.3, follow),
                ionGain: 1.1 + 0.3 * warm,
                fog: 0.045,
                slab: lerp(1.5, 1.3, follow),
                tremble: 1.4 + warm,
                flashes: 0.9 * (1 - follow),
                flashColor: '#ffb36b',
                hero: follow > 0.02 ? { index: hero, trail: 150, gain: follow } : undefined,
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Caption opacity={span(frame, T(0.1), T(7.3))} kicker="One question is left" title="Each scattering throws away the energy the field just gave" />
      <Center opacity={span(frame, T(7.6), T(9.5), 8)}>
        <Big size={120}>Where does that energy go?</Big>
      </Center>
      <Caption opacity={span(frame, T(9.7), T(18.6))} kicker="Into the lattice" title="The atoms tremble a little harder, and that is heat" />
      <Caption opacity={span(frame, T(19.0), T(22.6))} kicker="So" title="every conductor that carries a current warms up" />
      <Panel opacity={span(frame, T(12.0), T(22.6))} style={{ right: 110, top: 86 }}>
        <Meter label="Temperature of the wire" value={(20 + 45 * warm).toFixed(0)} unit="°C" color={C.rho} size={96} />
      </Panel>

      <Scene opacity={bench}>
        {/* P = I^2 R */}
        <Center opacity={power}>
          <Kicker color={C.rho} style={{ marginBottom: 30 }}>
            Power turned into heat
          </Kicker>
          <div style={{ fontSize: 250, display: 'flex', alignItems: 'baseline', gap: 50 }}>
            <Sym color={C.rho} show={show(27.4, 0.4)}>
              P
            </Sym>
            <Sym color={C.dim} show={show(27.8, 0.4)} style={{ fontStyle: 'normal' }}>
              =
            </Sym>
            <Sym color={C.electron} show={show(28.4, 0.3)}>
              I<sup style={{ fontSize: '0.5em', fontStyle: 'normal', opacity: show(28.6, 0.3) }}>2</sup>
            </Sym>
            <Sym show={show(29.2, 0.4)}>R</Sym>
          </div>
          <Sub style={{ marginTop: 40 }}>
            <span style={{ opacity: show(24.8) }}>the current, squared</span>
            <span style={{ opacity: show(26.0) }}> × the resistance</span>
          </Sub>
        </Center>

        {/* hot on purpose */}
        <AbsoluteFill style={{ opacity: heaters }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            {/* heater */}
            <g opacity={show(33.4)} transform="translate(360,520)">
              <rect x={-170} y={-150} width={340} height={300} rx={22} fill="#101a30" stroke="#33466e" strokeWidth={3} />
              {[-90, -30, 30, 90].map((y) => (
                <path
                  key={y}
                  d={Array.from({ length: 61 }, (_, i) => `${i === 0 ? 'M' : 'L'} ${-130 + i * 4.33} ${y + 16 * Math.sin(i * 0.9)}`).join(' ')}
                  fill="none"
                  stroke={hot(heaterGlow)}
                  strokeWidth={6}
                  strokeLinecap="round"
                  opacity={0.45 + 0.55 * heaterGlow}
                  style={{ filter: `drop-shadow(0 0 ${16 * heaterGlow}px #ff8a3a)` }}
                />
              ))}
            </g>
            {/* toaster */}
            <g opacity={show(34.2)} transform="translate(960,540)">
              <rect x={-190} y={-110} width={380} height={230} rx={34} fill="#101a30" stroke="#33466e" strokeWidth={3} />
              {[-80, 80].map((x) => (
                <rect key={x} x={x - 62} y={-128} width={124} height={34} rx={10} fill={hot(heaterGlow)} opacity={0.3 + 0.7 * heaterGlow} style={{ filter: `drop-shadow(0 0 ${22 * heaterGlow}px #ff8a3a)` }} />
              ))}
              <rect x={196} y={-30} width={22} height={70} rx={8} fill="#33466e" />
            </g>
            {/* lamp */}
            <g opacity={show(35.3)} transform="translate(1560,520)">
              <circle r={170} fill={`rgba(255,200,130,${0.22 * heaterGlow})`} style={{ filter: 'blur(30px)' }} />
              <path d="M -62 120 C -150 60, -170 -110, 0 -150 C 170 -110, 150 60, 62 120 Z" fill="rgba(147,163,192,0.06)" stroke="#93a3c0" strokeOpacity={0.6} strokeWidth={3} />
              <rect x={-56} y={120} width={112} height={62} rx={10} fill="#18233c" stroke="#33466e" strokeWidth={3} />
              <path d={Array.from({ length: 41 }, (_, i) => `${i === 0 ? 'M' : 'L'} ${-50 + i * 2.5} ${-10 + 16 * Math.sin(i * 0.8)}`).join(' ')} fill="none" stroke={hot(heaterGlow)} strokeWidth={5} style={{ filter: `drop-shadow(0 0 ${16 * heaterGlow}px #ffcf8a)` }} />
            </g>
          </svg>
          <Panel opacity={1} style={{ left: 110, top: 80 }}>
            <Kicker color={C.rho}>Sometimes the heat is the whole point</Kicker>
            <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1, marginTop: 10, opacity: show(36.8) }}>
              High-resistivity material, <span style={{ color: C.rho }}>hot on purpose</span>
            </div>
          </Panel>
          {[
            { x: 360, label: 'Heater', at: 33.4 },
            { x: 960, label: 'Toaster', at: 34.2 },
            { x: 1560, label: 'Lamp filament', at: 35.3 },
          ].map((it) => (
            <div key={it.label} style={{ position: 'absolute', left: it.x - 200, width: 400, top: 790, textAlign: 'center', fontFamily: 'Sora', fontSize: 40, fontWeight: 300, color: C.text, opacity: show(it.at) }}>
              {it.label}
            </div>
          ))}
        </AbsoluteFill>

        {/* the fuse */}
        <AbsoluteFill style={{ opacity: fuse }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <rect x={470} y={470} width={980} height={150} rx={75} fill="rgba(147,163,192,0.06)" stroke="#93a3c0" strokeOpacity={0.55} strokeWidth={3} />
            <Tube x={560} y={545} length={800} radius={11} frame={frame} flow={blown > 0.5 ? 0 : 2 + amps * 0.25} density={10} heat={fuseHeat} broken={blown} grain={0} seed={9} />
            <rect x={400} y={455} width={150} height={180} rx={18} fill="#26324d" stroke="#5b6c91" strokeWidth={3} />
            <rect x={1370} y={455} width={150} height={180} rx={18} fill="#26324d" stroke="#5b6c91" strokeWidth={3} />
            <circle cx={960} cy={545} r={120 * blown * (1 - ramp(frame, T(46.0), T(46.8)))} fill="#fff3d6" opacity={0.7} style={{ filter: 'blur(24px)' }} />
          </svg>
          <Panel opacity={1} style={{ left: 110, top: 80 }}>
            <Kicker>A fuse</Kicker>
            <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1, marginTop: 10 }}>A thin wire, designed to melt</div>
          </Panel>
          <Panel opacity={show(43.0)} style={{ left: 470, top: 720, display: 'flex', gap: 110 }}>
            <Meter label="Current" value={blown > 0.5 ? '0' : amps.toFixed(0)} unit="A" color={amps > 10 && blown < 0.5 ? C.rho : C.electron} size={110} />
            <Meter label="Rated for" value="10" unit="A" color={C.dim} size={110} />
            <div style={{ opacity: show(46.1), alignSelf: 'center', fontSize: 50, fontWeight: 300, color: C.electron }}>circuit broken</div>
          </Panel>
        </AbsoluteFill>

        {/* the power line */}
        <AbsoluteFill style={{ opacity: line }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <line x1={0} y1={762} x2={1920} y2={762} stroke="#1c2a47" strokeWidth={3} />
            <Tower x={200} s={0.84} />
            <Tower x={960} s={0.84} />
            <Tower x={1720} s={0.84} />
            {[0, 1].map((k) => {
              const d = Array.from({ length: 61 }, (_, i) => {
                const u = i / 60;
                const half = u < 0.5 ? u * 2 : (u - 0.5) * 2;
                const x = 200 + u * 1520 + (k ? 0 : 0);
                const y = 508 + k * 66 + 4 * half * (1 - half) * 70;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ');
              return (
                <g key={k}>
                  <path d={d} fill="none" stroke="#ff8a3a" strokeWidth={14} opacity={0.22 + 0.1 * Math.sin(frame * 0.12)} style={{ filter: 'blur(8px)' }} />
                  <path d={d} fill="none" stroke="#ffc48a" strokeWidth={3} />
                </g>
              );
            })}
          </svg>
          <Panel opacity={1} style={{ left: 110, top: 80 }}>
            <Kicker color={C.rho}>In a power line</Kicker>
            <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1, marginTop: 10 }}>that heat is pure loss</div>
          </Panel>
          <Panel opacity={show(53.2)} style={{ left: 110, right: 110, top: 800, display: 'flex', gap: 120 }}>
            <div style={{ flex: 1 }}>
              <Bar label="Current" value="100 %" fill={1} color={C.electron} />
            </div>
            <div style={{ flex: 1 }}>
              <Bar label="Halve the current" value="50 %" fill={0.5} color={C.electron} show={show(54.9)} />
            </div>
            <div style={{ flex: 1 }}>
              <Bar label="Loss falls to" value="25 %" fill={0.25} color={C.rho} show={show(56.6)} />
            </div>
          </Panel>
        </AbsoluteFill>

        {/* why high voltage */}
        <AbsoluteFill style={{ opacity: hv }}>
          <Panel opacity={1} style={{ left: 110, top: 80 }}>
            <Kicker>Why electricity crosses the country at hundreds of thousands of volts</Kicker>
            <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1, marginTop: 10 }}>The same power, sent two ways</div>
          </Panel>
          {[
            { x: 110, volts: '40 kV', amps: '2,500 A', aFill: 1, loss: '100', lFill: 1, at: 61.0, at2: 61.0, at3: 61.6 },
            { x: 1010, volts: '400 kV', amps: '250 A', aFill: 0.1, loss: '1', lFill: 0.01, at: 64.7, at2: 66.6, at3: 69.3 },
          ].map((c) => (
            <Panel key={c.volts} opacity={show(c.at)} style={{ left: c.x, top: 300, width: 800 }}>
              <div style={{ fontSize: 130, fontWeight: 300, letterSpacing: -3, color: c.x > 500 ? C.electron : C.text }}>{c.volts}</div>
              <Bar label="Current needed" value={c.amps} fill={c.aFill} color={C.electron} show={show(c.at2)} />
              <Bar label="Heat lost in the line" value={c.loss} fill={c.lFill} color={C.rho} show={show(c.at3)} />
            </Panel>
          ))}
          <Center opacity={show(69.6)} style={{ justifyContent: 'flex-end', paddingBottom: 90 }}>
            <Sub>ten times the voltage · one tenth of the current · one hundredth of the loss</Sub>
          </Center>
        </AbsoluteFill>

        {/* current rating */}
        <AbsoluteFill style={{ opacity: cable }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <rect x={300} y={430} width={1240} height={230} rx={115} fill={`rgba(${Math.round(lerp(38, 150, overload))},${Math.round(lerp(50, 44, overload))},${Math.round(lerp(77, 40, overload))},0.9)`} stroke="#5b6c91" strokeWidth={3} />
            <Tube x={300} y={545} length={1320} radius={52} frame={frame} flow={2 + 5 * overload} density={5} heat={overload} seed={10} />
          </svg>
          <Panel opacity={1} style={{ left: 110, top: 80 }}>
            <Kicker>It is also why</Kicker>
            <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1, marginTop: 10 }}>every cable has a current rating</div>
          </Panel>
          <Panel opacity={show(73.8)} style={{ left: 300, top: 680, width: 1240 }}>
            <div style={{ position: 'relative' }}>
              <Bar label="Current" value={`${Math.round(lerp(60, 150, overload))} %`} fill={lerp(0.4, 1, overload)} color={overload > 0.45 ? C.rho : C.electron} />
              <div style={{ position: 'absolute', left: '66.7%', bottom: -14, width: 3, height: 50, background: C.text }} />
              <div style={{ position: 'absolute', left: '66.7%', bottom: -56, transform: 'translateX(-50%)', fontFamily: 'Sora', fontSize: 26, color: C.dim }}>rated current</div>
            </div>
          </Panel>
          <Caption opacity={span(frame, T(77.6), T(79.9))} kicker="Push more through it" title="and the heat has nowhere to go" />
        </AbsoluteFill>
      </Scene>
    </Shell>
  );
};

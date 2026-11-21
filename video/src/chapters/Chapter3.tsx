import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../public/voice/ch3.json';
import { lerp, lerp3, ramp, span } from '../anim';
import { Caption } from '../scenes/overlays';
import { C } from '../theme';
import { Panel, Readout } from '../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../ui/Shell';
import { Tube } from '../ui/Tube';
import { Big, Center, Frac, Kicker, Sub, Sym } from '../ui/type';
import { findCalmElectron, positionAt, simulate } from '../world/sim';
import { WireWorld, type CameraPose } from '../world/WireWorld';

// Chapter 3 - What resistance is. Gain, scatter, reset; disorder is what
// scatters; resistance as push per unit of flow.
export const CH3_FRAMES = chapterFrames(voice.duration);
const LATTICE = { nx: 41, ny: 9, nz: 9 };
const PERFECT = { from: T(42.5), to: T(48.7) };

const SIDE = { pos: [1.5, 6.4, 12.5], target: [0, -0.6, 0], focus: 13.2, dof: 0.2, slab: 1.5 };
const CLOSE = { pos: [0.6, 3.0, 6.6], target: [0, 0, 0], focus: 7.2, dof: 0.26, slab: 1.3 };

// A sawtooth: speed builds, a scattering wipes it out, again and again.
const SAW = [0, 0.3, 0.3, 0.52, 0.52, 0.68, 0.68, 1];
const sawPath = (w: number, h: number, upTo: number) => {
  let d = `M 0 ${h}`;
  for (let i = 1; i < SAW.length; i++) {
    const a = SAW[i - 1];
    const b = SAW[i];
    if (a >= upTo) break;
    if (b === a) continue;
    const end = Math.min(b, upTo);
    const peak = ((end - a) / 0.3) * h * 0.78;
    d += ` L ${end * w} ${h - peak}`;
    if (end === b && b < 1) d += ` L ${b * w} ${h}`;
  }
  return d;
};

const SpeedGraph = ({ dashed, solid }: { dashed: number; solid: number }) => (
  <div>
    <Kicker style={{ fontSize: 19, letterSpacing: 4 }}>Forward speed of one electron</Kicker>
    <svg width="560" height="270" viewBox="-10 -20 580 290" style={{ marginTop: 14 }}>
      <line x1="0" y1="250" x2="560" y2="250" stroke={C.dim} strokeWidth="2" />
      <line x1="0" y1="250" x2="0" y2="0" stroke={C.dim} strokeWidth="2" />
      <text x="556" y="282" fill={C.dim} fontSize="22" fontFamily="Sora" textAnchor="end">
        time
      </text>
      <line x1="0" y1="250" x2={560 * dashed} y2={250 - 250 * dashed} stroke={C.rho} strokeWidth="3" strokeDasharray="12 10" />
      {dashed > 0.95 ? (
        <text x="548" y="34" fill={C.rho} fontSize="22" fontFamily="Sora" textAnchor="end">
          if nothing stopped it
        </text>
      ) : null}
      <path d={sawPath(560, 250, solid)} fill="none" stroke={C.electron} strokeWidth="4" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${C.electron})` }} />
    </svg>
  </div>
);

export const Chapter3 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const sim = useMemo(
    () =>
      simulate({ seed: 31, count: 200, frames: CH3_FRAMES, substeps: 4, half: [20.5, 4.5, 4.5], thermalSpeed: 0.16, accel: () => 0.008, tau: () => 22 }),
    [],
  );
  // A lattice with no disorder at all: nothing ever scatters.
  const perfectSim = useMemo(
    () =>
      simulate({ seed: 5, count: 200, frames: PERFECT.to - PERFECT.from + 2, substeps: 4, half: [20.5, 4.5, 4.5], thermalSpeed: 0.2, accel: () => 0.001, tau: () => 1e9 }),
    [],
  );
  const hero = useMemo(() => findCalmElectron(sim, T(15.5), T(33.5)), [sim]);
  const heroSmooth = useMemo(() => {
    return (f: number): [number, number, number] => {
      const acc = [0, 0, 0];
      let n = 0;
      for (let k = -14; k <= 14; k += 2) {
        const p = positionAt(sim, hero, Math.min(T(33.5), Math.max(T(15.5), f + k)));
        acc[0] += p[0];
        acc[1] += p[1];
        acc[2] += p[2];
        n++;
      }
      return [acc[0] / n, acc[1] / n, acc[2] / n];
    };
  }, [sim, hero]);

  // --- camera -------------------------------------------------------------
  const close = ramp(frame, T(6.8), T(9.6)) * (1 - ramp(frame, T(35.6), T(38.4)));
  const follow = ramp(frame, T(15.0), T(17.2)) * (1 - ramp(frame, T(33.0), T(36.0)));
  const h = heroSmooth(frame);
  const basePos = lerp3(SIDE.pos, CLOSE.pos, close);
  const baseTarget = lerp3(SIDE.target, CLOSE.target, close);
  const glide = frame * 0.003;
  const pose: CameraPose = {
    pos: [basePos[0] + glide + h[0] * follow, basePos[1] + h[1] * follow * 0.6, basePos[2]],
    target: [baseTarget[0] + glide * (1 - follow) + (h[0] - glide * 0) * follow, baseTarget[1] + h[1] * follow, baseTarget[2] + h[2] * follow],
    fov: 34,
    focus: lerp(SIDE.focus, CLOSE.focus, close),
    dof: lerp(SIDE.dof, CLOSE.dof, close),
  };
  const slab = lerp(SIDE.slab, CLOSE.slab, close);

  const tremble = 1 + 1.5 * Math.max(span(frame, T(8.2), T(36.4), 40), span(frame, T(50.6), T(55.6), 24));
  const flaws = Math.max(span(frame, T(12.4), T(36.4), 30), span(frame, T(51.6), T(55.6), 20));
  const perfect = span(frame, PERFECT.from, PERFECT.to, 22);
  const define = span(frame, T(55.5), T(62.8), 16);
  const measure = ramp(frame, T(62.8), T(63.6));
  const twoWires = span(frame, T(79.2), T(87.6), 14);
  const ohm = ramp(frame, T(87.6), T(88.3));

  const beat = (t: number) => Math.max(0, 1 - Math.abs(frame - T(t) - 6) / 16);
  const words = [
    { label: 'Gain', at: [28.2, 30.7] },
    { label: 'Scatter', at: [29.1, 31.4] },
    { label: 'Reset', at: [29.8, 32.2] },
  ];

  return (
    <Shell
      voice="ch3"
      frames={CH3_FRAMES}
      world={
        measure < 1 ? (
          <>
            <AbsoluteFill style={{ opacity: lerp(1, 0.36, define) }}>
              <WireWorld
                frame={frame}
                width={width}
                height={height}
                lattice={LATTICE}
                sim={sim}
                pose={pose}
                look={{
                  temperature: 0,
                  electronGain: lerp(1, 0.28, follow),
                  ionGain: 1.1,
                  fog: 0.045,
                  slab,
                  tremble,
                  flaws,
                  flashes: 0.55 * (1 - follow) * ramp(frame, T(4.6), T(5.4)),
                  hero: follow > 0.02 ? { index: hero, trail: 150, gain: follow } : undefined,
                }}
              />
            </AbsoluteFill>
            {perfect > 0 ? (
              <AbsoluteFill style={{ opacity: perfect }}>
                <WireWorld
                  frame={frame - PERFECT.from}
                  width={width}
                  height={height}
                  lattice={LATTICE}
                  sim={perfectSim}
                  pose={{ ...pose, pos: [SIDE.pos[0], SIDE.pos[1], SIDE.pos[2]], target: [0, -0.6, 0] }}
                  look={{ temperature: 0, electronGain: 1.15, ionGain: 1.15, fog: 0.045, slab: 1.5, tremble: 0, ionTint: '#ffa862' }}
                />
              </AbsoluteFill>
            ) : null}
          </>
        ) : null
      }
    >
      {/* the puzzle, and its answer */}
      <Panel opacity={span(frame, T(1.6), T(7.0))} style={{ right: 110, top: 86 }}>
        <SpeedGraph dashed={ramp(frame, T(2.0), T(3.9), Easing.out(Easing.quad))} solid={ramp(frame, T(5.0), T(6.6), Easing.linear)} />
      </Panel>
      <Caption opacity={span(frame, T(0.2), T(4.5))} kicker="A puzzle" title="The field keeps pushing. Why don’t they keep speeding up?" />
      <Caption opacity={span(frame, T(4.8), T(7.1))} kicker="The answer" title="They keep being interrupted" />

      <Caption opacity={span(frame, T(7.5), T(12.3))} kicker="Never perfectly still" title="The atoms tremble with heat" />
      <Caption opacity={span(frame, T(12.5), T(15.6))} kicker="Here and there" title="an impurity, or a flaw" />

      {/* following one electron */}
      <Caption opacity={span(frame, T(16.0), T(18.8))} kicker="Gain" title="It picks up a little speed from the field" />
      <Caption opacity={span(frame, T(19.0), T(23.6))} kicker="Scatter" title="…then flies off in a random direction" />
      <Caption opacity={span(frame, T(23.9), T(27.7))} kicker="Reset" title="Its forward progress is wiped out" />

      <Panel opacity={span(frame, T(28.0), T(33.0))} style={{ left: 0, right: 0, bottom: 110, display: 'flex', justifyContent: 'center', gap: 90 }}>
        {words.map((w) => {
          const lit = Math.max(...w.at.map(beat));
          const seen = ramp(frame, T(w.at[0]) - 2, T(w.at[0]) + 6);
          return (
            <div key={w.label} style={{ fontSize: 92, fontWeight: 300, letterSpacing: -2, opacity: seen * lerp(0.45, 1, lit), color: lit > 0.3 ? C.electron : C.text, transform: `scale(${1 + 0.08 * lit})`, textShadow: `0 0 ${50 * lit}px ${C.electron}` }}>
              {w.label}
            </div>
          );
        })}
      </Panel>
      <Panel opacity={span(frame, T(28.0), T(33.0))} style={{ right: 110, top: 86 }}>
        <SpeedGraph dashed={0} solid={ramp(frame, T(28.2), T(32.6), Easing.linear)} />
      </Panel>

      <Panel opacity={span(frame, T(33.2), T(36.3))} style={{ right: 110, top: 86, textAlign: 'right' }}>
        <Kicker>Scatterings every second, for every electron</Kicker>
        <div style={{ fontSize: 86, fontWeight: 300, letterSpacing: -1, marginTop: 12, fontVariantNumeric: 'tabular-nums' }}>
          40{',000'.repeat(Math.round(4 * ramp(frame, T(33.4), T(34.8), Easing.linear)))}
        </div>
      </Panel>

      <Caption opacity={span(frame, T(36.7), T(42.6))} kicker="What most textbooks leave out" title="Electrons are not simply bumping into the atoms" />
      <Caption opacity={span(frame, T(43.0), T(48.0))} kicker="A perfect, perfectly still lattice" title="would let them glide straight through" />
      <Caption opacity={span(frame, T(48.3), T(55.3))} kicker="What scatters them" title="Disorder: the trembling, and the flaws" />

      <Center opacity={define}>
        <Big size={180} style={{ textShadow: `0 0 80px ${C.electron}55` }}>
          Resistance
        </Big>
        <Sub style={{ opacity: ramp(frame, T(58.8), T(59.6)) }}>how hard a conductor makes it to keep charge flowing</Sub>
      </Center>

      {/* push per unit of flow */}
      <Scene opacity={measure * (1 - ohm)}>
        <AbsoluteFill style={{ opacity: 1 - ramp(frame, T(79.0), T(79.6)) }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <Tube x={420} y={600} length={1080} radius={74} frame={frame} flow={2.2} density={4} />
            {/* push */}
            <g opacity={ramp(frame, T(66.4), T(67.0))}>
              <path d="M 150 600 H 350 M 318 572 L 352 600 L 318 628" fill="none" stroke={C.rho} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
            </g>
            {/* flow */}
            <g opacity={ramp(frame, T(68.4), T(69.0))}>
              <path d="M 1560 600 H 1770 M 1738 572 L 1772 600 L 1738 628" fill="none" stroke={C.electron} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
          <Panel opacity={ramp(frame, T(66.4), T(67.0))} style={{ left: 150, top: 660, width: 260 }}>
            <Kicker color={C.rho}>Push</Kicker>
            <div style={{ fontSize: 44, fontWeight: 300, marginTop: 8, opacity: ramp(frame, T(70.3), T(70.9)) }}>Voltage</div>
            <div style={{ fontSize: 30, fontWeight: 300, color: C.dim, opacity: ramp(frame, T(71.2), T(71.8)) }}>in volts</div>
          </Panel>
          <Panel opacity={ramp(frame, T(68.4), T(69.0))} style={{ left: 1560, top: 660, width: 300 }}>
            <Kicker>Flow</Kicker>
            <div style={{ fontSize: 44, fontWeight: 300, marginTop: 8, opacity: ramp(frame, T(73.1), T(73.7)) }}>Current</div>
            <div style={{ fontSize: 30, fontWeight: 300, color: C.dim, opacity: ramp(frame, T(73.8), T(74.4)) }}>in amperes</div>
          </Panel>
          <Center opacity={ramp(frame, T(75.0), T(75.6))} style={{ justifyContent: 'flex-start', paddingTop: 110 }}>
            <div style={{ fontSize: 150, display: 'flex', alignItems: 'center', gap: 40 }}>
              <Sym show={ramp(frame, T(77.0), T(77.6))}>R</Sym>
              <Sym color={C.dim} show={ramp(frame, T(76.4), T(77.0))} style={{ fontStyle: 'normal' }}>
                =
              </Sym>
              <Frac top={<Sym color={C.rho}>V</Sym>} bottom={<Sym color={C.electron}>I</Sym>} show={ramp(frame, T(75.1), T(75.9))} />
              <Sub style={{ marginTop: 0, marginLeft: 30, opacity: ramp(frame, T(78.0), T(78.6)) }}>measured in ohms, Ω</Sub>
            </div>
          </Center>
          <Caption opacity={span(frame, T(63.2), T(69.2))} kicker="How do we measure it?" title="How much push, for each unit of flow?" />
        </AbsoluteFill>

        {/* two wires, same current, very different push */}
        <AbsoluteFill style={{ opacity: twoWires }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <Tube x={520} y={360} length={880} radius={66} frame={frame} flow={2.2} density={4} grain={0.15} seed={2} />
            <Tube x={520} y={720} length={880} radius={66} frame={frame} flow={2.2} density={4} grain={1.6} seed={3} color="#c9b8ff" opacity={ramp(frame, T(83.2), T(83.9))} />
          </svg>
          {[
            { y: 300, volts: '1 volt', ohms: '1 Ω', a: 79.5, b: 80.7, c: 82.1 },
            { y: 660, volts: '10 volts', ohms: '10 Ω', a: 83.8, b: 85.0, c: 86.4 },
          ].map((row) => (
            <div key={row.ohms}>
              <Panel opacity={ramp(frame, T(row.a), T(row.a) + 14)} style={{ left: 150, top: row.y, width: 330, textAlign: 'right' }}>
                <Kicker color={C.rho}>Push</Kicker>
                <div style={{ fontSize: 76, fontWeight: 300, letterSpacing: -2 }}>{row.volts}</div>
              </Panel>
              <Panel opacity={ramp(frame, T(row.b), T(row.b) + 14)} style={{ left: 1440, top: row.y, width: 200 }}>
                <Kicker>Flow</Kicker>
                <div style={{ fontSize: 76, fontWeight: 300, letterSpacing: -2 }}>1 A</div>
              </Panel>
              <Panel opacity={ramp(frame, T(row.c), T(row.c) + 14)} style={{ left: 1650, top: row.y, width: 240 }}>
                <Kicker color={C.dim}>Resistance</Kicker>
                <div style={{ fontSize: 76, fontWeight: 300, letterSpacing: -2, color: C.electron }}>{row.ohms}</div>
              </Panel>
            </div>
          ))}
        </AbsoluteFill>
      </Scene>

      <Scene opacity={ohm}>
        <Center>
          <Kicker style={{ marginBottom: 30 }}>Ohm’s law</Kicker>
          <div style={{ fontSize: 250, display: 'flex', alignItems: 'baseline', gap: 56 }}>
            <Sym color={C.rho} show={ramp(frame, T(89.4), T(89.9))}>
              V
            </Sym>
            <Sym color={C.dim} show={ramp(frame, T(89.9), T(90.4))} style={{ fontStyle: 'normal' }}>
              =
            </Sym>
            <Sym color={C.electron} show={ramp(frame, T(90.4), T(90.9))}>
              I
            </Sym>
            <Sym show={ramp(frame, T(91.2), T(91.7))}>R</Sym>
          </div>
        </Center>
      </Scene>
    </Shell>
  );
};

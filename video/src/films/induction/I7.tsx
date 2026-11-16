import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/induction/ch7.json';
import { lerp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Center, Frac, Kicker, Meter, Sym } from '../../ui/type';
import { BFIELD, CURRENT, drawWire, NORTH } from '../../world/magnet';
import { rgb, Stage3D, type Add } from '../../world/Stage3D';
import { at, Cap, COPPER, orbit, ring, shot, Timeline, VOICE, VOLT } from './kit';

// Chapter 7 - The transformer, and why the world runs on alternating current.
export const I7_FRAMES = chapterFrames(voice.duration);

// an iron core, two windings, and the flux running round the core
export const drawTransformer = (orb: Add | null, glow: Add | null, frame: number, n2: number, ac = 1, live = 1) => {
  const iron = rgb('#8f9bb6');
  if (orb) {
    for (let x = -3; x <= 3.01; x += 0.6) for (const y of [-2.1, 2.1]) for (const z of [-0.3, 0.3]) orb(x, y, z, 0.62, iron, 1);
    for (let y = -1.5; y <= 1.51; y += 0.6) for (const x of [-3, 3]) for (const z of [-0.3, 0.3]) orb(x, y, z, 0.62, iron, 1);
  }
  if (glow) {
    const s = ac ? Math.sin(frame * 0.12) : 0.8;
    for (let i = 0; i < 8; i++) {
      ring(glow, -3, -1.2 + i * 0.34, 0, 'y', 0.95, 0, COPPER, 0.7);
      ring(glow, -3, -1.2 + i * 0.34, 0, 'y', 0.95, frame * 1.4, CURRENT, Math.abs(s) * live, s > 0 ? 1 : -1);
    }
    for (let i = 0; i < n2; i++) {
      const y = -1.2 + (i * 2.38) / Math.max(1, n2 - 1);
      ring(glow, 3, y, 0, 'y', 0.95, 0, '#ffb36b', 0.7);
      if (ac) ring(glow, 3, y, 0, 'y', 0.95, frame * 1.4, VOLT, Math.abs(Math.cos(frame * 0.12)) * live, Math.cos(frame * 0.12) > 0 ? 1 : -1);
    }
    // the flux in the iron: round the core one way, then the other
    const c = rgb(BFIELD);
    const per = 20.4;
    for (let i = 0; i < 150; i++) {
      const d = (i / 150) * per;
      const [x, y] = d < 6 ? [-3 + d, 2.1] : d < 10.2 ? [3, 2.1 - (d - 6)] : d < 16.2 ? [3 - (d - 10.2), -2.1] : [-3, -2.1 + (d - 16.2)];
      const phase = (((i * (s > 0 ? 1 : -1) - frame * 0.6) % 15) + 15) % 15;
      const pulse = Math.exp(-(phase * phase) / 6);
      glow(x, y, 0.75, 0.1 + 0.14 * pulse, c, (0.3 + 0.7 * pulse) * Math.abs(s) * live);
    }
  }
};

export const I7 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const sT = Math.max(shot(frame, -1, 57.6), shot(frame, 79.6, 160));
  const sLine = shot(frame, 57.4, 79.8);
  const line = frame >= T(57.5) && frame < T(79.7);
  const n2 = frame < T(34.4) ? 8 : frame < T(38.5) ? 16 : frame < T(40.6) ? 4 : frame < T(48.2) ? 8 : 16;
  const dc = frame >= T(79.7) && frame < T(88.1);
  const chain = span(frame, T(68.9), T(79.6), 10);
  const hi = at(frame, 62.2);
  const ratio = n2 / 8;

  return (
    <Shell
      voice={VOICE(7)}
      frames={I7_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(sT, sLine) * lerp(1, 0.3, chain) }}>
          <Stage3D
            width={width}
            height={height}
            pose={line ? { pos: [0, 2.6, 16], target: [0, 0.2, 0], fov: 34, focus: 16, dof: 0.04 } : { ...orbit(frame, 16, 2.4, 3.5), target: [0.4, 0.5, 0] }}
            deep={line ? undefined : [0.1, 0.11, 0.14]}
            orbs={(add) => {
              if (!line) drawTransformer(add, null, frame, n2);
            }}
            glows={(add) => {
              if (!line) drawTransformer(null, add, frame, n2, dc ? 0 : 1, at(frame, 8.8));
              else {
                // the same power sent twice: low voltage and heavy current, or high voltage and light current
                drawWire(add, 1.6, 0, -10, 10, frame * 2.4, 1);
                for (let x = -10; x <= 10; x += 0.25) add(x, 1.6, 0, 0.9, rgb(NORTH), 0.16);
                drawWire(add, -1.6, 0, -10, 10, frame * 0.5, 1, hi);
                for (let x = -10; x <= 10; x += 0.25) add(x, -1.6, 0, 0.5, rgb(NORTH), 0.012 * hi);
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Panel opacity={span(frame, T(14.6), T(53.4))} style={{ right: 110, top: 60, display: 'flex', gap: 50 }}>
        <Meter label="Primary · 8 turns" value="100" unit="V" color={CURRENT} size={76} />
        <Meter label={`Secondary · ${n2} turns`} value={`${Math.round(100 * ratio)}`} unit="V" color={VOLT} size={76} />
        <div style={{ opacity: at(frame, 48.2) }}>
          <Meter label="Secondary current" value={`÷ ${ratio}`} color={C.electron} size={76} />
        </div>
      </Panel>
      <Panel opacity={span(frame, T(29.8), T(47.9))} style={{ left: 110, top: 60 }}>
        <div style={{ fontSize: 96, display: 'flex', alignItems: 'center', gap: 22 }}>
          <Frac
            width={120}
            top={
              <Sym color={VOLT}>
                V<sub style={{ fontSize: '0.45em' }}>s</sub>
              </Sym>
            }
            bottom={
              <Sym color={CURRENT}>
                V<sub style={{ fontSize: '0.45em' }}>p</sub>
              </Sym>
            }
          />
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Frac
            width={120}
            top={
              <Sym color={VOLT}>
                N<sub style={{ fontSize: '0.45em' }}>s</sub>
              </Sym>
            }
            bottom={
              <Sym color={CURRENT}>
                N<sub style={{ fontSize: '0.45em' }}>p</sub>
              </Sym>
            }
          />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(8.4))} kicker="Faraday’s ring: two coils on one iron core" title="It was the first transformer" />
      <Cap opacity={span(frame, T(8.6), T(21.9))} kicker="An alternating current in the first coil makes an alternating flux in the iron" title="That same flux passes through the second coil, and induces a voltage" />
      <Cap opacity={span(frame, T(22.2), T(34.3))} kicker="Each turn of either coil gets the same voltage" title="So the ratio of the voltages is the ratio of the turns" />
      <Cap opacity={span(frame, T(34.5), T(40.5))} kicker="Twice the turns, twice the voltage" title="Half as many gives half" />
      <Cap opacity={span(frame, T(40.7), T(53.4))} kicker="You do not get something for nothing: power in equals power out" title="Voltage up, current down, in the same ratio" />
      <Cap opacity={span(frame, T(53.6), T(61.8))} kicker="Why the whole world uses alternating current" title="The heat wasted in a line depends on the square of the current" />
      <Cap opacity={span(frame, T(62.2), T(68.8))} kicker="The same power at ten times the voltage" title="A tenth of the current, and a hundredth of the loss" />
      <Panel opacity={span(frame, T(58.0), T(68.8))} style={{ left: 110, top: 150 }}>
        <Meter label="Low voltage · heavy current" value="loss × 100" color={NORTH} size={64} />
      </Panel>
      <Panel opacity={span(frame, T(62.2), T(68.8))} style={{ left: 110, top: 610 }}>
        <Meter label="Ten times the voltage · a tenth of the current" value="loss × 1" color={C.electron} size={64} />
      </Panel>
      <Center opacity={chain}>
        <Kicker style={{ marginBottom: 30 }}>Step up for the journey, step down for the house</Kicker>
        <div style={{ fontSize: 76, fontWeight: 300, letterSpacing: -2, display: 'flex', gap: 28, justifyContent: 'center', alignItems: 'baseline' }}>
          {[
            ['20 kV', 'generator', 69.0, CURRENT],
            ['→', '', 71.4, C.dim],
            ['400 kV', 'long line', 71.4, VOLT],
            ['→', '', 75.0, C.dim],
            ['11 kV', 'street', 75.0, C.electron],
            ['→', '', 77.4, C.dim],
            ['230 V', 'house', 77.4, C.text],
          ].map(([v, what, t, color], i) => (
            <div key={i} style={{ opacity: at(frame, t as number), color: color as string, textAlign: 'center' }}>
              {v}
              <div style={{ fontSize: 28, color: C.dim, letterSpacing: 0 }}>{what}</div>
            </div>
          ))}
        </div>
      </Center>
      <Cap opacity={span(frame, T(79.8), T(88.0))} kicker="With direct current: a steady flux" title="And a steady flux induces nothing" />
      <Panel opacity={span(frame, T(83.1), T(88.0), 8)} style={{ right: 110, top: 60 }}>
        <Meter label="Secondary, on direct current" value="0" unit="V" color={VOLT} size={96} align="right" />
      </Panel>
      <Cap opacity={span(frame, T(88.2), T(94.7))} kicker="That one fact decided the great argument of the 1880s" title="Direct current, or alternating" />
      <Cap opacity={span(frame, T(94.9), T(102.4))} kicker="Practical transformers" title="Budapest, 1885 · William Stanley in the United States, 1886" />
      <Cap opacity={span(frame, T(102.6), T(160))} kicker="1895 · Niagara Falls drives alternating-current generators" title="The pattern of every power system since was set" />
      <Timeline frame={frame} already={[0, 1, 2]} events={[[4, 97.4], [5, 100.6], [6, 103.4]]} />
    </Shell>
  );
};

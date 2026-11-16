import { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac1/ch7.json';
import { span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { fibSphere } from '../../world/field';
import { mulberry32 } from '../../world/rng';
import { rgb } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { AShell, AStage, at, Cap, CYAN, hsl, PINK, ribbon, shot, SUN, sway, TEAL, Timeline, WHITE } from '../ac/kit';
import { VOICE } from './A1';

// Chapter 7 - Fifty or sixty: a compromise, two companies, and a country split in two.
export const A7_FRAMES = chapterFrames(voice.duration);
const EARLY: [string, number, number][] = [
  ['16⅔', 0.33, 12.0],
  ['25', 0.5, 13.6],
  ['40', 0.8, 14.8],
  ['50', 1.0, 15.8],
  ['60', 1.2, 16.8],
  ['133', 2.66, 17.8],
];
// a rough sketch of Japan as (longitude, latitude) spines, lit as a scatter of city lights
const SPINES: [number, number, number][][] = [
  [[131, 34.2, 0.5], [132.5, 34.5, 0.55], [134, 34.8, 0.6], [135.5, 35.0, 0.7], [136.9, 35.4, 0.8], [138.2, 35.8, 0.9], [139.5, 36.2, 0.9], [140.2, 37.4, 0.8], [140.6, 38.6, 0.7], [141, 39.8, 0.6], [141, 40.8, 0.5]],
  [[130.2, 33.5, 0.5], [130.9, 32.8, 0.7], [130.8, 31.9, 0.5]],
  [[132.8, 33.6, 0.4], [133.6, 33.7, 0.5], [134.3, 33.9, 0.35]],
  [[141, 42.2, 0.5], [142.3, 43.2, 1.1], [143.6, 43.6, 0.9], [144.6, 43.5, 0.5]],
];
const TOKYO: [number, number] = [139.7, 35.7];
const OSAKA: [number, number] = [135.5, 34.7];
const place = (lon: number, lat: number): [number, number] => [(lon - 137.5) * 0.55, -(lat - 37.6) * 0.7];

export const A7 = () => {
  const frame = useCurrentFrame();
  const bulb = useMemo(() => fibSphere(300), []);
  const lights = useMemo(() => {
    const r = mulberry32(31);
    const out: { x: number; z: number; east: boolean; tw: number }[] = [];
    for (const spine of SPINES)
      for (let i = 0; i < spine.length - 1; i++)
        for (let k = 0; k < 90; k++) {
          const t = r();
          const w = spine[i][2] + (spine[i + 1][2] - spine[i][2]) * t;
          const a = r() * 6.283;
          const d = Math.sqrt(r()) * w;
          const lon = spine[i][0] + (spine[i + 1][0] - spine[i][0]) * t + Math.cos(a) * d;
          const lat = spine[i][1] + (spine[i + 1][1] - spine[i][1]) * t + Math.sin(a) * d * 0.8;
          const [x, z] = place(lon, lat);
          out.push({ x, z, east: lon > 138.3, tw: r() * 6 });
        }
    return out;
  }, []);
  const which = frame < T(20.0) ? 0 : frame < T(35.6) ? 1 : frame < T(50.0) ? 2 : frame < T(71.4) ? 3 : 4;
  const vis = Math.max(shot(frame, -1, 20.1), shot(frame, 19.9, 35.7), shot(frame, 35.5, 50.1), shot(frame, 49.9, 71.5), shot(frame, 71.3, 150));
  const run = frame * 0.012;
  // the compromise: sweep the frequency from low to high and back to the comfortable middle
  const f = which === 1 ? (frame < T(27.9) ? 0.3 : frame < T(32.1) ? 2.4 : 1.0) : 1;
  const flick = f < 0.6 ? 0.5 + 0.5 * Math.sin(frame * 0.9) : 1;
  const size = 1 / Math.max(0.45, Math.min(f, 2));
  const split = at(frame, 63.0);
  const poses: CameraPose[] = [
    { pos: [4 + sway(frame), 4.2, 22], target: [0, -0.6, -4], fov: 34, focus: 24, dof: 0.02 },
    { pos: [1 + sway(frame), 2.2, 18], target: [0, -0.4, 0], fov: 34, focus: 18.5, dof: 0.03 },
    { pos: [1 + sway(frame), 2.4, 24], target: [0, -0.3, 0], fov: 34, focus: 24, dof: 0.025 },
    { pos: [-1.5 + sway(frame, 0.8), 14, 9], target: [-1.5, -3, 0.3], fov: 34, focus: 19, dof: 0.015 },
    { pos: [1 + sway(frame), 2.4, 24], target: [0, -0.3, 0], fov: 34, focus: 24, dof: 0.025 },
  ];

  return (
    <AShell
      voice={VOICE(7)}
      frames={A7_FRAMES}
      world={
        <AStage
          opacity={vis}
          pose={poses[which]}
          ground={which !== 3}
          orbs={(add) => {
            if (which === 1) for (let x = -1; x <= 1.01; x += 1) for (let y = 0; y <= 2.01; y += 1) for (const z of [-0.5, 0.5]) add(7 + x * 0.8 * size, -3 + 0.5 * size + y * 0.8 * size, z * size, 0.8 * size, rgb('#8f9bb6'), 1);
            if (which === 3) {
              add(...([place(...TOKYO)[0], FLOORY + 0.2, place(...TOKYO)[1]] as [number, number, number]), 0.5, rgb(CYAN), at(frame, 52.8));
              add(...([place(...OSAKA)[0], FLOORY + 0.2, place(...OSAKA)[1]] as [number, number, number]), 0.5, rgb(PINK), at(frame, 58.4));
            }
          }}
          scene={(add) => {
            if (which === 0) {
              // every company with its own frequency: six systems, six different waves
              EARLY.forEach(([, k, t], i) => ribbon(add, -12, 12, (x) => Math.sin((x * 0.1 * k - run * k) * 6.283) * 1.1, () => hsl(0.5 + i * 0.09, 0.95, 0.66), { z: 3 - i * 3.2, gain: at(frame, t), fill: false }));
            }
            if (which === 1) {
              // too low: the lamp flickers and the transformer is huge. Too high: the losses climb
              for (const p of bulb) add(-5.5 + p[0] * 1.6, 0.4 + p[1] * 1.6, p[2] * 1.6, 0.09, rgb(WHITE), 0.4);
              for (let i = 0; i <= 50; i++) add(-6.2 + i * 0.028, 0.3 + 0.3 * Math.sin(i * 0.9), 0, 0.2, rgb(SUN), flick);
              add(-5.5, 0.4, 0, 5, rgb(SUN), 0.45 * flick);
              ribbon(add, -2.4, 2.6, (x) => 0.4 + Math.sin((x * 0.3 * f - run * 3 * f) * 6.283) * 1.3, () => rgb(TEAL), { axis: 0.4, fill: false });
            }
            if (which === 2) {
              ribbon(add, -12, 12, (x) => 1.7 + Math.sin((x * 0.132 - run * 1.2) * 6.283) * 1.2, () => rgb(PINK), { axis: 1.7, gain: at(frame, 35.8) });
              ribbon(add, -12, 12, (x) => -1.5 + Math.sin((x * 0.11 - run) * 6.283) * 1.2, () => rgb(CYAN), { axis: -1.5, gain: at(frame, 39.6) });
            }
            if (which === 3) {
              // Japan at night: one grid, two frequencies, joined along a line across the main island
              for (const l of lights) {
                const tw = 0.75 + 0.25 * Math.sin(frame * 0.12 + l.tw);
                const c = split > 0.5 ? rgb(l.east ? CYAN : PINK) : rgb('#ffe9c4');
                add(l.x, FLOORY, l.z, 0.13, c, tw);
              }
              add(place(...TOKYO)[0], FLOORY + 0.2, place(...TOKYO)[1], 1.8, rgb(CYAN), 0.8 * at(frame, 52.8));
              add(place(...OSAKA)[0], FLOORY + 0.2, place(...OSAKA)[1], 1.8, rgb(PINK), 0.8 * at(frame, 58.4));
            }
            if (which === 4) {
              ribbon(add, -12, 12, (x) => 1.7 + Math.sin((x * 0.037 - run * 0.33) * 6.283) * 1.2, () => rgb(SUN), { axis: 1.7, gain: at(frame, 74.4) });
              ribbon(add, -12, 12, (x) => -1.5 + Math.sin((x * 0.88 - run * 8) * 6.283) * 1.2, () => rgb(TEAL), { axis: -1.5, gain: at(frame, 77.4), fill: false });
            }
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(11.1), T(19.9))} style={{ right: 110, top: 60, display: 'flex', gap: 40, alignItems: 'baseline' }}>
        {EARLY.map(([name, , t], i) => (
          <div key={name} style={{ fontFamily: 'Sora', fontSize: 70, fontWeight: 300, letterSpacing: -2, opacity: at(frame, t), color: `hsl(${(0.5 + i * 0.09) * 360}, 95%, 66%)` }}>
            {name}
          </div>
        ))}
        <div style={{ fontFamily: 'Sora', fontSize: 30, color: C.dim }}>Hz</div>
      </Panel>
      <Panel opacity={span(frame, T(22.3), T(35.5))} style={{ right: 110, top: 60, display: 'flex', gap: 50 }}>
        <Meter label="Frequency" value={f < 0.6 ? 'too low' : f > 2 ? 'too high' : '40 to 60 Hz'} color={TEAL} size={64} />
        <Meter label="Lamp" value={f < 0.6 ? 'flickers' : 'steady'} color={SUN} size={64} />
        <Meter label="Transformer" value={f < 0.6 ? 'large, heavy' : f > 2 ? 'small' : 'moderate'} color="#b8c2da" size={64} />
        <Meter label="Losses" value={f > 2 ? 'climbing' : 'low'} color={PINK} size={64} />
      </Panel>
      <Panel opacity={span(frame, T(35.8), T(49.9))} style={{ right: 110, top: 40, display: 'flex', gap: 56 }}>
        <Meter label="United States · Westinghouse" value="60" unit="Hz" color={PINK} size={76} />
        <div style={{ opacity: at(frame, 39.6) }}>
          <Meter label="Germany · AEG" value="50" unit="Hz" color={CYAN} size={76} />
        </div>
      </Panel>
      <Panel opacity={span(frame, T(52.8), T(71.3))} style={{ right: 110, top: 60, display: 'flex', gap: 56 }}>
        <div style={{ opacity: at(frame, 58.4) }}>
          <Meter label="1896 · Osaka · General Electric" value="60" unit="Hz" color={PINK} size={84} />
        </div>
        <Meter label="1895 · Tokyo · AEG" value="50" unit="Hz" color={CYAN} size={84} />
      </Panel>
      <Panel opacity={span(frame, T(74.4), T(150))} style={{ right: 110, top: 40, display: 'flex', gap: 56 }}>
        <Meter label="Some railways" value="16⅔" unit="Hz" color={SUN} size={76} />
        <div style={{ opacity: at(frame, 77.4) }}>
          <Meter label="Aircraft: small, light machines" value="400" unit="Hz" color={TEAL} size={76} />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(7.7))} kicker="Why fifty hertz? Or sixty, in the Americas?" title="There is no deep law of nature behind it" />
      <Cap opacity={span(frame, T(7.9), T(19.9))} kicker="In the early days" title="Every company picked its own" />
      <Cap opacity={span(frame, T(20.2), T(27.9))} kicker="The choice is a compromise" title="Too low: lamps flicker, and transformers must be large and heavy" />
      <Cap opacity={span(frame, T(28.1), T(35.5))} kicker="Too high: losses in lines and machines climb" title="Somewhere between forty and sixty is comfortable" />
      <Cap opacity={span(frame, T(35.8), T(49.9))} kicker="Each sold its equipment to its neighbours" title="And the world divided between them" />
      <Cap opacity={span(frame, T(50.2), T(62.9))} kicker="One country still shows the join" title="Tokyo bought at fifty hertz, Osaka at sixty" />
      <Cap opacity={span(frame, T(63.1), T(71.3))} kicker="Japan has run on two frequencies ever since" title="The halves exchange power only through converter stations" />
      <Cap opacity={span(frame, T(71.6), T(150))} kicker="Other choices survive where they suit the job" title="At a high frequency, transformers and motors can be small and light" />
      <Timeline frame={frame} already={[0]} events={[[1, 36.4], [2, 40.4], [3, 53.4], [4, 59.0]]} />
    </AShell>
  );
};
const FLOORY = -3.0;

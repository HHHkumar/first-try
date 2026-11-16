import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac1/ch2.json';
import { span } from '../../anim';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { rgb } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { AShell, AStage, at, Cap, CYAN, MINT, PINK, shot, SUN, sway, TEAL, Timeline, WHITE } from '../ac/kit';
import { drawCloud, drawWireShell, useCloud, VOICE } from './A1';

// Chapter 2 - Back and forth: the electrons only shuffle, yet the energy arrives.
export const A2_FRAMES = chapterFrames(voice.duration);

export const A2 = () => {
  const frame = useCurrentFrame();
  const cloud = useCloud(150, 6, 1.1);
  const long = useCloud(260, 11, 0.7);
  const which = frame < T(32.2) ? 0 : frame < T(43.3) ? 1 : frame < T(54.2) ? 2 : 3;
  const vis = Math.max(shot(frame, -1, 32.3), shot(frame, 32.1, 43.4), shot(frame, 43.2, 54.3), shot(frame, 54.1, 120));
  const stroke = Math.sin(frame * 0.14);
  const rock = Math.sin(frame * 0.12) * 0.9;
  const poses: CameraPose[] = [
    { pos: [2.5 + sway(frame), 1.8, 9], target: [0, 0, 0], fov: 34, focus: 9.5, dof: 0.05 },
    { pos: [5 + sway(frame), 3, 13], target: [0, -0.6, 0], fov: 34, focus: 14, dof: 0.04 },
    { pos: [2 + sway(frame), 3, 17], target: [0, -0.8, 0], fov: 34, focus: 17.5, dof: 0.035 },
    { pos: [1 + sway(frame), 2.6, 19], target: [0.5, -0.4, 0], fov: 34, focus: 19.5, dof: 0.035 },
  ];

  return (
    <AShell
      voice={VOICE(2)}
      frames={A2_FRAMES}
      world={
        <AStage
          opacity={vis}
          pose={poses[which]}
          orbs={(add) => {
            if (which === 0) drawCloud(add, cloud, frame, 0.35);
            if (which === 1) for (let x = -5; x <= 5.01; x += 0.7) for (let y = -2.6; y <= -1.39; y += 0.6) for (const z of [-0.9, -0.3, 0.3, 0.9]) add(x, y, z, 0.7, rgb('#c98a5a'), 1);
            if (which === 2) for (let i = 0; i < 22; i++) add(-9 + i * 0.86 + rock, -1 + (i % 2 ? 0.12 : -0.12), 0, 0.7, rgb(i % 2 ? PINK : CYAN), 1);
            if (which === 3) drawCloud(add, long, frame, 0.3, -0.4);
          }}
          scene={(add) => {
            if (which === 0) {
              drawWireShell(add, 6);
              // a ruler under the wire: the whole journey is a few thousandths of a millimetre
              const g = at(frame, 19.4);
              for (let x = -0.35; x <= 0.35; x += 0.03) add(x, -2.1, 1.2, 0.1, rgb(SUN), g);
              for (const x of [-0.35, 0.35]) for (let y = -2.3; y <= -1.9; y += 0.05) add(x, y, 1.2, 0.1, rgb(SUN), g);
            }
            if (which === 1) {
              // a handsaw: the blade goes forward and back and never travels anywhere, yet it cuts on every stroke
              const bx = stroke * 2.2;
              for (let i = 0; i <= 90; i++) {
                const x = -3.6 + i * 0.08 + bx;
                add(x, -0.5, 0, 0.16, rgb(WHITE), 0.9);
                add(x, -1.25 + 0.14 * Math.abs(((i * 0.5) % 1) - 0.5) * 4, 0, 0.16, rgb(WHITE), 0.9);
                if (i % 6 === 0) for (let y = -1.2; y <= -0.5; y += 0.12) add(x, y, 0, 0.09, rgb(TEAL), 0.5);
              }
              for (let i = 0; i < 30; i++) add(bx + 3.9 + i * 0.05, -0.2 - i * 0.02, 0, 0.2, rgb(PINK), 0.9);
              // sawdust, falling on both strokes
              for (let i = 0; i < 70; i++) {
                const life = (frame * 0.03 + i * 0.137) % 1;
                add(((i * 0.61) % 2) - 1 + stroke * 0.3, -1.3 - life * 1.8, ((i * 0.37) % 1) - 0.5 + 1.1, 0.1, rgb(SUN), 0.9 * (1 - life));
              }
            }
            if (which === 2) {
              // a long chain rocked at one end: the far end rocks at once, and a wheel there turns with it
              for (let i = 0; i < 70; i++) add(10.6 + Math.cos((i / 70) * 6.283 + rock * 0.8) * 1.6, -1 + Math.sin((i / 70) * 6.283 + rock * 0.8) * 1.6, 0, i % 10 === 0 ? 0.4 : 0.16, rgb(i % 10 === 0 ? SUN : WHITE), 0.9);
              add(-9.6 + rock, -1, 0, 1.6, rgb(MINT), 0.8);
            }
            if (which === 3) {
              // the push runs along the wire to the lamp far faster than any electron moves
              drawWireShell(add, 11, -0.4, 0.5, 1.0);
              const p = -11 + ((frame * 0.7) % 22);
              add(p, -0.4, 0, 2.6, rgb(MINT), 0.5);
              add(-12.2, -0.4, 0, 2.2, rgb(VIOLET_), 0.8);
              const hot = at(frame, 64.3);
              for (let i = 0; i <= 40; i++) add(11.6 + 0.3 * Math.sin(i * 0.9), -1.2 + i * 0.04, 0, 0.2, rgb(SUN), 0.5 + 0.5 * hot);
              add(11.6, -0.4, 0, 4.5, rgb(SUN), 0.25 + 0.3 * hot);
            }
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(15.1), T(32.0))} style={{ right: 110, top: 70 }}>
        <Meter label="The whole journey of an electron" value="0.003" unit="mm" color={SUN} size={96} align="right" />
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(11.5))} kicker="What are the electrons actually doing?" title="On steady current they drift less than a millimetre a second" />
      <Cap opacity={span(frame, T(11.7), T(19.3))} kicker="With alternating current they do not even get that far" title="A tiny distance one way, then the same distance back" />
      <Cap opacity={span(frame, T(19.5), T(29.7))} kicker="A few thousandths of a millimetre" title="The electrons in your lamp’s cable have been there since it was made" />
      <Cap opacity={span(frame, T(29.9), T(32.1), 8)} kicker="So" title="how does the energy arrive?" />
      <Cap opacity={span(frame, T(32.4), T(43.2))} kicker="Think of a handsaw" title="The blade never travels anywhere, but it cuts on every stroke" />
      <Cap opacity={span(frame, T(43.5), T(54.1))} kicker="Rock a long chain at one end" title="No link travels its length, and yet your effort arrives" />
      <Cap opacity={span(frame, T(54.4), T(64.2))} kicker="It is the same in the wire" title="Each electron pushes its neighbour. What travels is the push" />
      <Cap opacity={span(frame, T(64.4), T(120))} kicker="A filament does not care which way its electrons move" title="Either way they collide with the atoms, and it gets hot" />
      <Timeline frame={frame} already={[]} />
    </AShell>
  );
};
const VIOLET_ = '#b78bff';

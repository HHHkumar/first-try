import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/induction/ch8.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { CURRENT, NORTH } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import { drawGapField, drawPoleFaces } from '../magnetism/gap';
import { at, Cap, COPPER, orbit, plate, ring, shot, Timeline, VOICE } from './kit';

// Chapter 8 - Eddy currents: braking, heating, and laminated cores.
export const I8_FRAMES = chapterFrames(voice.duration);

export const I8 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const sGap = shot(frame, -1, 48.4);
  const sCore = shot(frame, 48.2, 120);
  const core = frame >= T(48.3);
  // the swinging plate: free at first, then caught by the field as it enters the gap
  const zAt = (f: number) => 6 * (1 - ramp(f, T(5.6), T(11.6), Easing.out(Easing.cubic)) + ramp(f, T(19.0), T(22.0), Easing.inOut(Easing.quad)) - ramp(f, T(24.0), T(29.6), Easing.out(Easing.cubic)));
  const swing = zAt(frame);
  const speed = Math.abs(zAt(frame + 1) - zAt(frame - 1)) * 15;
  // then a brake fin passing through again and again, slowing each time
  const pass = ((frame - T(33.4)) % 75) / 75;
  const braking = frame >= T(33.4) && frame < T(40.2);
  const bz = braking ? 7 - 14 * (1 - (1 - pass) ** 2.2) : swing;
  const eddy = braking ? (Math.abs(bz) < 3 ? 1 - pass : 0) : Math.min(1, speed * 0.5) * (Math.abs(bz) < 3.6 ? 1 : 0);
  const sheets = ramp(frame, T(61.6), T(63.6));

  return (
    <Shell
      voice={VOICE(8)}
      frames={I8_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(sGap, sCore) }}>
          <Stage3D
            width={width}
            height={height}
            pose={core ? orbit(frame, 12, 3, 6) : orbit(frame, 17, 3.6, 7)}
            orbs={(add) => {
              if (!core) drawPoleFaces(add);
            }}
            glows={(add) => {
              if (!core) {
                drawGapField(add, frame, 0.7);
                plate(add, 0, 0, bz, 1.7, 1.3, 1.6);
                // whirlpools of current inside the metal
                for (const dz of [-0.65, 0.65]) ring(add, 0.05, 0, bz + dz, 'x', 0.55, frame * 1.6, CURRENT, eddy, dz > 0 ? 1 : -1);
                if (!braking) for (let y = 1.7; y <= 5; y += 0.1) add(0, y, bz * (1 - (y - 1.7) / 6), 0.1, rgb('#c8d4ea'), 0.6);
              } else {
                // a transformer core in a changing flux: solid, then built from thin insulated sheets
                const n = sheets > 0.5 ? 9 : 1;
                for (let k = 0; k < n; k++) {
                  const x = n === 1 ? 0 : -1.6 + k * 0.4;
                  if (n === 1) for (const xx of [-1.2, -0.6, 0, 0.6, 1.2]) plate(add, xx, 0, 0, 1.8, 1.8, 1.1, '#8f9bb6');
                  else plate(add, x, 0, 0, 1.8, 1.8, 1.4, '#8f9bb6');
                }
                const a = at(frame, 56.3);
                if (n === 1) for (const r of [0.6, 1.1, 1.6]) ring(add, 1.35, 0, 0, 'x', r, frame * 1.6, NORTH, a);
                else for (let k = 0; k < n; k++) for (const [y, z] of [[0.9, 0.9], [-0.9, 0.9], [0.9, -0.9], [-0.9, -0.9]]) ring(add, -1.6 + k * 0.4, y, z, 'x', 0.16, frame, COPPER, 0.7);
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Cap opacity={span(frame, T(0.2), T(4.8))} kicker="Induction does not need a neat coil of wire" title="Any piece of metal will do" />
      <Cap opacity={span(frame, T(5.2), T(17.8))} kicker="Swing a solid copper plate into the gap of a strong magnet" title="Currents swirl inside the plate itself, like whirlpools in a stream" />
      <Cap opacity={span(frame, T(18.0), T(23.8))} kicker="1855 · Léon Foucault" title="They are called eddy currents" />
      <Cap opacity={span(frame, T(24.0), T(30.1))} kicker="By Lenz’s law, they oppose the motion" title="The plate stops as if it had hit something soft" />
      <Cap opacity={span(frame, T(30.3), T(40.0))} kicker="Roller coasters and high-speed trains brake this way" title="Nothing wears out, because nothing touches" />
      <Cap opacity={span(frame, T(40.4), T(48.2))} kicker="An induction cooker heats the pan with them" title="A metal detector finds a coin by them" />
      <Panel opacity={span(frame, T(9.4), T(40.0))} style={{ right: 110, top: 70 }}>
        <Meter label="Speed of the plate" value={`${Math.round(braking ? 100 * (1 - pass) ** 1.2 : Math.min(100, speed * 34))} %`} color={CURRENT} size={90} align="right" />
      </Panel>
      <Cap opacity={span(frame, T(48.6), T(55.9))} kicker="And sometimes it is a nuisance" title="A transformer’s iron core sits in a changing flux too" />
      <Cap opacity={span(frame, T(56.3), T(61.4))} kicker="If it were solid" title="Eddy currents would swirl through it and waste energy as heat" />
      <Cap opacity={span(frame, T(61.6), T(120))} kicker="So the core is built from thin sheets, each insulated from the next" title="The currents are confined to narrow slices, and the loss falls" />
      <Panel opacity={span(frame, T(56.3), T(120))} style={{ right: 110, top: 70 }}>
        <Meter label="Heat wasted in the core" value={sheets > 0.5 ? 'small' : 'large'} color={sheets > 0.5 ? C.electron : NORTH} size={90} align="right" />
      </Panel>
      <Timeline frame={frame} already={[0, 1, 2, 4, 5, 6]} events={[[3, 21.4]]} />
    </Shell>
  );
};

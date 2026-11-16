import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/fields/ch4.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Kicker } from '../../ui/type';
import { POS } from '../../world/field';
import { BFIELD } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import { at, B, Cap, drawWave, E, EFIELD, Ink, Line, shot, Timeline, VOICE } from './kit';

// Chapter 4 - Each makes the other: the electromagnetic wave.
export const F4_FRAMES = chapterFrames(voice.duration);

export const F4 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const halves = span(frame, T(-1), T(11.6), 12);
  const world = Math.max(shot(frame, 11.6, 34.4), shot(frame, 41.6, 120));
  const dominoes = span(frame, T(34.4), T(41.7), 10);
  const shake = span(frame, T(12.6), T(15.8), 10) * Math.sin(frame * 0.5) * 0.7;
  // the disturbance steps outward, one field raising the next
  const steps: [number, number][] = [[14.2, -6.5], [16.4, -5.2], [19.6, -3.8], [24.7, -2.2], [29.5, -0.6], [34.0, 0.6]];
  let front = -8;
  for (const [t, x] of steps) front = lerp(front, x, ramp(frame, T(t), T(t + 1.6), Easing.out(Easing.cubic)));
  front = lerp(front, 12, ramp(frame, T(41.9), T(52.0), Easing.inOut(Easing.quad)));
  const rope = span(frame, T(62.6), T(67.2), 10);
  const hump = ((frame - T(62.6)) * 9) % 900;

  return (
    <Shell
      voice={VOICE(4)}
      frames={F4_FRAMES}
      world={
        world > 0 ? (
          <AbsoluteFill style={{ opacity: world }}>
            <Stage3D
              width={width}
              height={height}
              pose={{ pos: [3 + Math.sin(frame * 0.003) * 1.5, 3.6, 16], target: [0.5, 0, 0], fov: 34, focus: 16.5, dof: 0.04 }}
              orbs={(add) => add(-8, shake, 0, 0.7, rgb(POS), 1 - ramp(frame, T(52.5), T(54.0)) * 0.6)}
              glows={(add) => {
                add(-8, shake, 0, 1.8, rgb(POS), 0.4);
                drawWave(add, -7.6, 11, frame, { front });
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Scene opacity={halves}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 220, textAlign: 'center' }}>
          <Kicker>Put the two halves side by side</Kicker>
          <Line size={84} top={60} opacity={at(frame, 2.8)}>
            A changing <B>magnetic field</B> makes an <E>electric field</E>
          </Line>
          <Line size={84} top={40} opacity={at(frame, 6.5)}>
            A changing <E>electric field</E> makes a <B>magnetic field</B>
          </Line>
          <Line size={50} top={70} color={C.dim} opacity={at(frame, 10.1)}>
            Do you see what follows?
          </Line>
        </Panel>
      </Scene>

      <Scene opacity={dominoes}>
        <Ink width={5}>
          <path d="M 300 700 H 1620" strokeOpacity={0.5} />
          {Array.from({ length: 14 }, (_, i) => {
            const fall = ramp(frame, T(35.0) + i * 9, T(35.0) + i * 9 + 14) * 62;
            return <rect key={i} x={380 + i * 84} y={520} width={22} height={180} transform={`rotate(${fall} ${402 + i * 84} 700)`} fill="rgba(215,230,255,0.1)" />;
          })}
        </Ink>
        <Cap opacity={span(frame, T(34.6), T(38.9))} kicker="Like a row of dominoes" title="Each one falling tips the next" />
        <Cap opacity={span(frame, T(39.1), T(41.6), 8)} kicker="Except that here" title="there are no dominoes" />
      </Scene>

      <Cap opacity={span(frame, T(11.8), T(16.2))} kicker="Take a charge and give it a shake" title={<span>Its <E>electric field</E> changes</span> as unknown as string} />
      <Cap opacity={span(frame, T(16.4), T(24.5))} kicker="That change makes a magnetic field" title={<span>And that <B>magnetic field</B> is new, so it is changing too</span> as unknown as string} />
      <Cap opacity={span(frame, T(24.7), T(34.3))} kicker="So it makes an electric field a little further out" title="which makes a magnetic field beyond that" />
      <Cap opacity={span(frame, T(41.9), T(49.8))} kicker="Each field creates the other, one step further on" title="The disturbance does not stay near the charge" />
      <Cap opacity={span(frame, T(50.0), T(56.1))} kicker="It travels outward by itself" title="The charge can stop, and the ripple carries on" />
      <Cap opacity={span(frame, T(56.3), T(62.4))} kicker="Maxwell had found, on paper" title="an electromagnetic wave" />
      <Ink opacity={rope} color="#f4ead2" width={5} style={{ pointerEvents: 'none' }}>
        <path d={`M 500 200 ${Array.from({ length: 91 }, (_, i) => `L ${500 + i * 10} ${200 - 90 * Math.exp(-((i * 10 - hump) ** 2) / 5000)}`).join(' ')}`} />
      </Ink>
      <Cap opacity={span(frame, T(62.6), T(67.1))} kicker="Flick a rope" title="The rope moves up and down while the hump travels along" />
      <Cap opacity={span(frame, T(67.3), T(80.7))} kicker="Both fields point across the direction of travel" title={<span>The <E>electric</E> one way, the <B>magnetic</B> at right angles to it, in step</span> as unknown as string} />
      <Cap opacity={span(frame, T(81.0), T(95))} kicker="This wave needs nothing to travel in" title="The fields carry themselves" />
      <Panel opacity={span(frame, T(67.3), T(95))} style={{ right: 110, top: 70, textAlign: 'right' }}>
        <div style={{ fontSize: 40, fontWeight: 300, color: EFIELD }}>electric field: up and down</div>
        <div style={{ fontSize: 40, fontWeight: 300, color: BFIELD, marginTop: 8 }}>magnetic field: side to side</div>
      </Panel>
      <Timeline frame={frame} already={[0, 3]} />
    </Shell>
  );
};

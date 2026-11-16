import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/fields/ch9.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, TAIL } from '../../ui/Shell';
import { Big, Center, Kicker, Sub } from '../../ui/type';
import { BFIELD } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';
import { at, B, Cap, drawWave, E, EndCard, GOLD, Line, Timeline, TIMELINE, VOICE } from './kit';

// Chapter 9 - Recap, a look ahead, and the closing card.
const END = 5.0;
export const F9_FRAMES = T(voice.duration + END) + TAIL;

export const F9 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const rules = span(frame, T(1.6), T(16.5), 10);
  const next = span(frame, T(30.4), T(48.6), 14);
  const dim = Math.max(rules * 0.75, next * 0.7);

  return (
    <Shell
      voice={VOICE(9)}
      frames={F9_FRAMES}
      fadeOut
      world={
        <AbsoluteFill style={{ opacity: lerp(1, 0.3, dim) }}>
          <Stage3D
            width={width}
            height={height}
            pose={{ pos: [3 + Math.sin(frame * 0.003) * 1.5, 3.6, 16], target: [0.5, 0, 0], fov: 34, focus: 16.5, dof: 0.04 }}
            glows={(add) => drawWave(add, -11, 12, frame)}
          />
        </AbsoluteFill>
      }
    >
      <Panel opacity={rules} style={{ left: 0, right: 0, top: 170, textAlign: 'center' }}>
        <Line size={62} opacity={at(frame, 1.8)}>
          Charge makes an <E>electric field</E>
        </Line>
        <Line size={62} top={16} opacity={at(frame, 4.2)}>
          Moving charge makes a <B>magnetic field</B>
        </Line>
        <Line size={62} top={50} opacity={at(frame, 7.0)}>
          A changing <B>magnetic field</B> makes an <E>electric field</E> <span style={{ color: C.dim, fontSize: 36, opacity: at(frame, 10.6) }}> Faraday</span>
        </Line>
        <Line size={62} top={16} opacity={at(frame, 11.8)}>
          A changing <E>electric field</E> makes a <B>magnetic field</B> <span style={{ color: C.dim, fontSize: 36, opacity: at(frame, 15.2) }}> Maxwell</span>
        </Line>
      </Panel>
      <Cap opacity={span(frame, T(16.6), T(25.5))} kicker="Because each makes the other" title="The two travel through empty space as a wave. Light is one kind of it" />
      <Cap opacity={span(frame, T(25.7), T(30.3))} kicker="And the two fields are really" title="two faces of one electromagnetic field" />

      <Center opacity={next}>
        <Kicker style={{ marginBottom: 22 }}>A changing magnetic field makes a voltage · next time, the last of the series</Kicker>
        <Big size={120} style={{ textShadow: `0 0 80px ${BFIELD}55` }}>
          Electromagnetic <span style={{ color: GOLD }}>induction</span>
        </Big>
        <Sub style={{ opacity: at(frame, 44.4) }}>it runs every generator and every transformer on Earth</Sub>
      </Center>

      <Timeline frame={frame} already={TIMELINE.map((_, i) => i)} opacity={1 - ramp(frame, T(48.3), T(48.9))} />
      <EndCard frame={frame} from={48.7} />
    </Shell>
  );
};

import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/fields/ch1.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker } from '../../ui/type';
import { POS } from '../../world/field';
import { BFIELD, drawWire } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import { at, B, Cap, E, EFIELD, ring, Timeline, VOICE } from './kit';

// Chapter 1 - Two fields, and the question of whether one can make the other.
export const F1_FRAMES = chapterFrames(voice.duration);

export const F1 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const left = lerp(1, 0.3, span(frame, T(18.8), T(31.5), 12));
  const right = at(frame, 18.8);
  const question = ramp(frame, T(40.4), T(41.2));

  return (
    <Shell
      voice={VOICE(1)}
      frames={F1_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: lerp(1, 0.28, question) }}>
          <Stage3D
            width={width}
            height={height}
            pose={{ pos: [0, 1.6, 17], target: [0, 0.4, 0], fov: 34, focus: 17, dof: 0.04 }}
            orbs={(add) => add(-5.4, 0.4, 0, 0.9, rgb(POS), 1)}
            glows={(add) => {
              // the electric field of a charge: straight out in every direction
              const e = rgb(EFIELD);
              for (let i = 0; i < 16; i++) {
                const a = (i / 16) * Math.PI * 2;
                for (let j = 6; j < 44; j++) {
                  const r = j * 0.085;
                  const phase = (((j - frame * 0.5 + i * 7) % 20) + 20) % 20;
                  const pulse = Math.exp(-(phase * phase) / 8);
                  add(-5.4 + Math.cos(a) * r, 0.4 + Math.sin(a) * r, 0, 0.1 + 0.1 * pulse, e, (0.6 + 0.4 * pulse) * left * (1 - j / 70));
                }
              }
              add(-5.4, 0.4, 0, 2.2, rgb(POS), 0.4);
              // the magnetic field of a current: rings round the wire
              drawWire(add, 0.4, 0, 1.2, 9.5, frame, 1, right);
              for (const x of [2.6, 4.6, 6.6, 8.4]) ring(add, x, 0.4, 0, 'x', 1.5, frame, BFIELD, right);
            }}
          />
        </AbsoluteFill>
      }
    >
      <Panel opacity={span(frame, T(3.9), T(40.2))} style={{ left: 150, top: 90, width: 720 }}>
        <Kicker>The electric field</Kicker>
        <div style={{ fontSize: 44, fontWeight: 300, marginTop: 8, lineHeight: 1.3 }}>
          made by <E>charge</E>
          <div style={{ fontSize: 30, color: C.dim, opacity: at(frame, 11.0) }}>pushes on any charge, moving or not</div>
        </div>
      </Panel>
      <Panel opacity={span(frame, T(18.8), T(40.2))} style={{ left: 1090, top: 90, width: 720 }}>
        <Kicker>The magnetic field</Kicker>
        <div style={{ fontSize: 44, fontWeight: 300, marginTop: 8, lineHeight: 1.3 }}>
          made by <B>charge in motion</B>
          <div style={{ fontSize: 30, color: C.dim, opacity: at(frame, 25.4) }}>pushes only on charge that is moving</div>
        </div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(18.6))} kicker="Over the last four videos" title="We have met two fields" />
      <Cap opacity={span(frame, T(31.6), T(40.2))} kicker="So far, the only thing connecting them is charge" title="A charge makes one field. Set it moving, and it makes the other" />
      <Center opacity={question}>
        <Kicker style={{ marginBottom: 26 }}>A deeper question</Kicker>
        <Big size={110}>
          Can one <E>field</E> make the <B>other</B>?
        </Big>
        <div style={{ fontSize: 44, fontWeight: 300, marginTop: 50, display: 'flex', gap: 70, justifyContent: 'center', color: C.dim }}>
          {[
            ['a phone charging on a pad', 52.4],
            ['a radio signal crossing an ocean', 55.6],
            ['light itself', 58.8],
          ].map(([w, t]) => (
            <span key={w} style={{ opacity: at(frame, t as number) }}>
              {w}
            </span>
          ))}
        </div>
      </Center>
      <Timeline frame={frame} already={[]} />
    </Shell>
  );
};

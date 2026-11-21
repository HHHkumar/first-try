import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/inductance/ch9.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, TAIL } from '../../ui/Shell';
import { Big, Center, Frac, Kicker, Sub, Sym } from '../../ui/type';
import { BFIELD, CURRENT } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';
import { at, Cap, coilPose, drawCoilField, drawCore, drawTurns, EndCard, GOLD, Timeline, TIMELINE, useCoil, VOICE, VOLT } from './kit';

// Chapter 9 - Recap, a look ahead, and the closing card.
const END = 5.0;
export const IND9_FRAMES = T(voice.duration + END) + TAIL;

export const Ind9 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const coil = useCoil();
  const build = ramp(frame, T(1.9), T(4.6));
  const drop = span(frame, T(4.8), T(7.2), 20);
  const current = build * (1 - 0.8 * drop);
  const core = ramp(frame, T(19.0), T(20.6));
  const next = span(frame, T(33.3), T(44.0), 14);

  return (
    <Shell
      voice={VOICE(9)}
      frames={IND9_FRAMES}
      fadeOut
      world={
        <AbsoluteFill style={{ opacity: lerp(1, 0.3, next) }}>
          <Stage3D
            width={width}
            height={height}
            pose={coilPose(frame)}
            deep={core > 0 ? [0.1, 0.11, 0.14] : undefined}
            orbs={(add) => drawCore(add, 6, core)}
            glows={(add) => {
              drawTurns(add, coil, frame * 0.8 * current, current);
              drawCoilField(add, coil, frame, current, 1 + core);
            }}
          />
        </AbsoluteFill>
      }
    >
      <Cap opacity={span(frame, T(1.8), T(6.9))} kicker="A magnetic field takes energy to build" title="and gives it back when it collapses" />
      <Cap opacity={span(frame, T(7.2), T(14.7))} kicker="So a coil opposes any change in its own current" title="That property is inductance, measured in henries" />
      <Panel opacity={span(frame, T(7.2), T(21.2))} style={{ right: 110, top: 70 }}>
        <div style={{ fontSize: 110, display: 'flex', alignItems: 'center', gap: 24 }}>
          <Sym color={VOLT}>V</Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Sym>L</Sym>
          <Frac
            width={170}
            top={
              <span>
                <Sym style={{ fontStyle: 'normal' }}>Δ</Sym>
                <Sym color={CURRENT}>I</Sym>
              </span>
            }
            bottom={
              <span>
                <Sym style={{ fontStyle: 'normal' }}>Δ</Sym>
                <Sym color={C.shape}>t</Sym>
              </span>
            }
          />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(14.9), T(21.2))} kicker="It grows with the square of the turns, and the area" title="and is multiplied by an iron core" />
      <Cap opacity={span(frame, T(21.4), T(26.5))} kicker="The energy is stored in the field" title="One half L I squared" />
      <Panel opacity={span(frame, T(21.4), T(26.5))} style={{ right: 110, top: 70 }}>
        <div style={{ fontSize: 120, display: 'flex', alignItems: 'center', gap: 26 }}>
          <Sym color={GOLD}>W</Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Frac width={70} top={<Sym>1</Sym>} bottom={<Sym>2</Sym>} />
          <Sym>L</Sym>
          <Sym color={CURRENT}>
            I<sup style={{ fontSize: '0.5em', fontStyle: 'normal' }}>2</sup>
          </Sym>
        </div>
      </Panel>
      <Cap opacity={span(frame, T(26.8), T(33.1))} kicker="In a circuit" title="It takes time to carry a current, passes a steady one, holds back a changing one" />

      <Center opacity={next}>
        <Kicker style={{ marginBottom: 22 }}>A changing magnetic field makes a voltage. Next time:</Kicker>
        <Big size={120} style={{ textShadow: `0 0 80px ${BFIELD}55` }}>
          <span style={{ color: C.field }}>Electric</span> and <span style={{ color: BFIELD }}>magnetic</span>
        </Big>
        <Sub style={{ opacity: at(frame, 40.4) }}>how the two fields are tied together</Sub>
      </Center>

      <Timeline frame={frame} already={TIMELINE.map((_, i) => i)} opacity={1 - ramp(frame, T(43.6), T(44.2))} />
      <EndCard frame={frame} from={44.0} />
    </Shell>
  );
};

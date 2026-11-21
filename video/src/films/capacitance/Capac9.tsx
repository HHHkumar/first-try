import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/capacitance/ch9.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, TAIL } from '../../ui/Shell';
import { Big, Center, Frac, Kicker, Sub, Sym } from '../../ui/type';
import { Stage3D } from '../../world/Stage3D';
import { at, Cap, drawPlates, EndCard, GOLD, PLATES, Timeline, TIMELINE, VOICE } from './kit';

// Chapter 9 - Recap, a look ahead, and the closing card.
const END = 5.0;
export const CAPAC9_FRAMES = T(voice.duration + END) + TAIL;

export const Capac9 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const charge = ramp(frame, T(5.6), T(9.0));
  const size = 1 + 0.42 * ramp(frame, T(15.4), T(17.2));
  const half = lerp(3.4, 2.0, ramp(frame, T(17.4), T(18.8)));
  const next = span(frame, T(32.4), T(43.4), 14);

  return (
    <Shell
      voice={VOICE(9)}
      frames={CAPAC9_FRAMES}
      fadeOut
      world={
        <AbsoluteFill style={{ opacity: lerp(1, 0.4, next) }}>
          <Stage3D
            width={width}
            height={height}
            pose={{ ...PLATES, pos: [PLATES.pos[0] + 3 + Math.sin(frame * 0.004), PLATES.pos[1] + 0.6, PLATES.pos[2] + 4], target: [3.2, -1.2, 0], focus: 24.4 }}
            fog={0.012}
            orbs={(add) => drawPlates(add, null, frame, { size, half })}
            glows={(add) => drawPlates(null, add, frame, { size, half, charge, lineGain: charge })}
          />
        </AbsoluteFill>
      }
    >
      <Cap opacity={span(frame, T(1.8), T(10.0))} kicker="A capacitor" title="Two conductors and a gap: charge is moved across, and stays" />
      <Cap opacity={span(frame, T(10.3), T(14.8))} kicker="Capacitance" title="The charge stored for each volt, in farads" />
      <Panel opacity={span(frame, T(10.3), T(21.0))} style={{ right: 110, top: 70 }}>
        <div style={{ fontSize: 120, display: 'flex', alignItems: 'center', gap: 26 }}>
          <Sym>C</Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Frac width={110} top={<Sym color={C.electron}>Q</Sym>} bottom={<Sym color={C.rho}>V</Sym>} />
          <span style={{ opacity: at(frame, 15.2), display: 'inline-flex', alignItems: 'center', gap: 26 }}>
            <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
              =
            </Sym>
            <Sym color={C.rho}>ε</Sym>
            <Frac color={C.shape} width={110} top={<Sym color={C.shape}>A</Sym>} bottom={<Sym color={C.shape}>d</Sym>} />
          </span>
        </div>
      </Panel>
      <Cap opacity={span(frame, T(15.1), T(21.0))} kicker="It grows with area, shrinks with the gap" title="and is multiplied by a dielectric" />
      <Cap opacity={span(frame, T(21.3), T(26.0))} kicker="The energy is stored in the field" title="One half C V squared" />
      <Panel opacity={span(frame, T(21.3), T(26.0))} style={{ right: 110, top: 70 }}>
        <div style={{ fontSize: 120, display: 'flex', alignItems: 'center', gap: 26 }}>
          <Sym color={GOLD}>W</Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Frac width={70} top={<Sym>1</Sym>} bottom={<Sym>2</Sym>} />
          <Sym>C</Sym>
          <Sym color={C.rho}>
            V<sup style={{ fontSize: '0.5em', fontStyle: 'normal' }}>2</sup>
          </Sym>
        </div>
      </Panel>
      <Cap opacity={span(frame, T(26.4), T(32.2))} kicker="In a circuit" title="It takes time to charge, blocks a steady current, passes a changing one" />

      <Center opacity={next}>
        <Kicker style={{ marginBottom: 22 }}>Next time: charges in motion</Kicker>
        <Big size={150} style={{ textShadow: `0 0 80px ${C.electron}55` }}>
          Magnetism
        </Big>
        <Sub style={{ opacity: at(frame, 40.0) }}>a second field that nobody expected</Sub>
      </Center>

      <Timeline frame={frame} already={TIMELINE.map((_, i) => i)} opacity={1 - ramp(frame, T(43.0), T(43.6))} />
      <EndCard frame={frame} from={43.3} />
    </Shell>
  );
};

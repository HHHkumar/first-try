import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/fields/ch3.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Kicker } from '../../ui/type';
import { NEG, POS } from '../../world/field';
import { BFIELD, drawWire } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import { at, B, Cap, E, EFIELD, ring, shot, Timeline, VOICE } from './kit';

// Chapter 3 - The missing piece: Maxwell and the gap in the capacitor.
export const F3_FRAMES = chapterFrames(voice.duration);

export const F3 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const intro = span(frame, T(-1), T(20.5), 12);
  const world = shot(frame, 20.5, 120);
  const charge = ramp(frame, T(25.8), T(62.0));
  const eGain = at(frame, 54.0) * (0.3 + 0.7 * charge);
  const fix = at(frame, 64.6);
  const puzzle = span(frame, T(42.0), T(51.6), 10);

  return (
    <Shell
      voice={VOICE(3)}
      frames={F3_FRAMES}
      world={
        world > 0 ? (
          <AbsoluteFill style={{ opacity: world }}>
            <Stage3D
              width={width}
              height={height}
              pose={{ pos: [5 + Math.sin(frame * 0.003) * 1.5, 3.2, 14.5], target: [0, 0, 0], fov: 34, focus: 15.5, dof: 0.04 }}
              glows={(add) => {
                drawWire(add, 0, 0, -10, -1.3, frame, 1);
                drawWire(add, 0, 0, 1.3, 10, frame, 1);
                for (const x of [-8, -5.8, -3.6, 3.6, 5.8, 8]) ring(add, x, 0, 0, 'x', 1.5, frame, BFIELD, at(frame, 28.6));
                // the two plates, face on to each other, and the charge gathering on them
                for (const side of [-1, 1])
                  for (let i = 0; i < 150; i++) {
                    const r = 2 * Math.sqrt((i + 0.5) / 150);
                    const a = i * 2.39996;
                    add(side * 1.3, Math.cos(a) * r, Math.sin(a) * r, 0.2, rgb(side < 0 ? POS : NEG), 0.25 + 0.6 * charge);
                  }
                // the electric field in the gap, growing as the plates charge
                const e = rgb(EFIELD);
                for (let i = 0; i < 26; i++) {
                  const r = 1.8 * Math.sqrt((i + 0.5) / 26);
                  const a = i * 2.39996;
                  for (let j = 0; j <= 22; j++) {
                    const phase = (((j - frame * 0.4 + i * 5) % 12) + 12) % 12;
                    add(-1.2 + j * 0.109, Math.cos(a) * r, Math.sin(a) * r, phase < 1.5 ? 0.13 : 0.07, e, (phase < 1.5 ? 0.9 : 0.4) * eGain);
                  }
                }
                // Maxwell's addition: the changing electric field has rings of magnetic field too
                for (const x of [-0.7, 0.7]) ring(add, x, 0, 0, 'x', 2.6, frame, BFIELD, fix);
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Scene opacity={intro}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 230, textAlign: 'center' }}>
          <Kicker>Faraday: a brilliant experimenter, with almost no mathematics</Kicker>
          <div style={{ fontSize: 60, fontWeight: 300, color: C.dim, marginTop: 60, opacity: at(frame, 6.0) }}>1861 · James Clerk Maxwell</div>
          <Big size={88} style={{ marginTop: 16, opacity: at(frame, 9.4) }}>
            turns Faraday’s pictures into equations
          </Big>
          <div style={{ fontSize: 50, fontWeight: 300, marginTop: 60, opacity: at(frame, 16.6), color: C.rho }}>and finds that the rules do not quite fit together</div>
        </Panel>
      </Scene>
      <Cap opacity={span(frame, T(20.8), T(33.4))} kicker="A capacitor being charged" title="Current in the wire, and rings of magnetic field around it" />
      <Cap opacity={span(frame, T(33.7), T(41.8))} kicker="Between the plates there is a gap" title="No charge crosses it. There is no current there at all" />
      <Cap opacity={span(frame, T(42.0), T(51.5))} kicker="So what happens to the magnetic field?" title="Does it simply stop at the plate? A field cannot be cut off like that" />
      <Panel opacity={puzzle} style={{ left: 0, right: 0, top: 120, textAlign: 'center' }}>
        <div style={{ fontSize: 200, fontWeight: 300, color: C.rho, textShadow: `0 0 60px ${C.rho}` }}>?</div>
      </Panel>
      <Cap opacity={span(frame, T(51.8), T(61.3))} kicker="But the gap is not empty" title={<span>The <E>electric field</E> between the plates is growing every instant</span> as unknown as string} />
      <Cap opacity={span(frame, T(61.5), T(69.5))} kicker="Maxwell’s proposal" title={<span>A changing <E>electric field</E> makes a <B>magnetic field</B>, just as a current does</span> as unknown as string} />
      <Cap opacity={span(frame, T(69.7), T(77.2))} kicker="With that one addition" title="The rings carry on smoothly round the gap, and the rules fit everywhere" />
      <Cap opacity={span(frame, T(77.4), T(95))} kicker="Nobody had ever seen this effect" title="Maxwell added it because the mathematics demanded it" />
      <Timeline frame={frame} already={[0]} events={[[3, 6.0]]} />
    </Shell>
  );
};

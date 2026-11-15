import { useMemo } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from '../theme';
import { simulate } from '../world/sim';
import { WireWorld, type CameraPose } from '../world/WireWorld';
import { Caption, Vignette } from './overlays';

const LATTICE = { nx: 41, ny: 9, nz: 9 };
export const STYLE_TEST_FRAMES = 540;
const FIELD_ON = 240;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: number[], b: number[], t: number) => a.map((v, i) => lerp(v, b[i], t)) as [number, number, number];

export type StyleTestProps = { hot?: boolean };

export const StyleTest = ({ hot = false }: StyleTestProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const sim = useMemo(
    () =>
      simulate({
        seed: 7,
        count: 260,
        frames: STYLE_TEST_FRAMES,
        substeps: 6,
        half: [20.5, 4.5, 4.5],
        thermalSpeed: 0.3,
        accel: (f) => -0.011 * interpolate(f, [FIELD_ON, FIELD_ON + 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        tau: () => (hot ? 4.5 : 11),
      }),
    [hot],
  );

  // Shot 1: gliding down a channel of the lattice. Shot 2: pulling out to the side.
  const move = interpolate(frame, [200, 330], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const glide = frame * 0.012;
  const inside = { pos: [-15 + glide, 0.5, 0.5], target: [6 + glide, 0.2, 0.1] };
  const side = { pos: [1.5 + glide * 0.4, 6.4, 12.5], target: [0 + glide * 0.4, -0.6, 0] };
  const pose: CameraPose = {
    pos: lerp3(inside.pos, side.pos, move),
    target: lerp3(inside.target, side.target, move),
    fov: lerp(52, 34, move),
    focus: lerp(7, 13.2, move),
    dof: lerp(0.085, 0.2, move),
  };

  const captionA = interpolate(frame, [20, 40, 190, 210], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const captionB = interpolate(frame, [FIELD_ON + 30, FIELD_ON + 55, 510, 535], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <WireWorld
        frame={frame}
        width={width}
        height={height}
        lattice={LATTICE}
        sim={sim}
        pose={pose}
        look={{ temperature: hot ? 1 : 0, electronGain: 1, ionGain: hot ? 1.3 : 1.1, fog: lerp(0.13, 0.045, move), slab: lerp(6, 1.5, move) }}
      />
      <Vignette />
      {hot ? (
        <Caption opacity={Math.max(captionA, captionB)} kicker="Hotter metal" title="The lattice shakes harder, and scatters more" />
      ) : (
        <>
          <Caption opacity={captionA} kicker="No voltage" title="Free electrons, in constant random motion" />
          <Caption opacity={captionB} kicker="Voltage applied" title="The whole crowd leans one way: drift" />
        </>
      )}
    </AbsoluteFill>
  );
};

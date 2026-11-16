import { useMemo } from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { Vignette } from '../../scenes/overlays';
import { C } from '../../theme';
import { Kicker } from '../../ui/type';
import { drawCharge, drawLines, POS, traceLines, type Charge } from '../../world/field';
import { Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';

// Thumbnail for "The Invisible Push" (render at --scale=0.66667 for 1280x720).
const POSE: CameraPose = { pos: [-2.5, 2.2, 10.5], target: [-3.6, 0, 0], fov: 34, focus: 10.6, dof: 0.09 };

export const ChargeThumb = () => {
  const { width, height } = useVideoConfig();
  const charges: Charge[] = useMemo(() => [{ x: -1.2, y: 0.2, z: 0, q: 1 }, { x: 3.4, y: -0.4, z: 0, q: -1 }], []);
  const lines = useMemo(() => traceLines(charges, { perCharge: 60, bound: 14 }), [charges]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Stage3D
        width={width}
        height={height}
        pose={POSE}
        orbs={(add) => charges.forEach((c) => drawCharge(add, () => {}, c, POSE.pos, 0.5))}
        glows={(add) => {
          charges.forEach((c) => drawCharge(() => {}, add, c, POSE.pos, 0.5));
          drawLines(add, lines, 20, 1.3, undefined, { bold: true });
        }}
      />
      <Vignette />
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(3,6,13,0.94) 0%, rgba(3,6,13,0.75) 36%, rgba(3,6,13,0) 62%)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 110, fontFamily: 'Sora', color: C.text }}>
        <Kicker style={{ fontSize: 40, letterSpacing: 8 }}>Charge and the electric field</Kicker>
        <div style={{ fontSize: 178, fontWeight: 600, letterSpacing: -5, lineHeight: 1.02, marginTop: 18 }}>
          The
          <br />
          invisible
          <br />
          <span style={{ color: POS }}>push</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import { useMemo } from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { Vignette } from '../../scenes/overlays';
import { C } from '../../theme';
import { Kicker } from '../../ui/type';
import { drawLines, traceLines } from '../../world/field';
import { barPoles, BFIELD, drawBarMagnet } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';

// Thumbnail for "The Second Field" (render at --scale=0.66667 for 1280x720).
export const MagThumb = () => {
  const { width, height } = useVideoConfig();
  const poles = useMemo(() => barPoles(0, 0, 2.5), []);
  const lines = useMemo(() => traceLines(poles, { perCharge: 22, planar: true, bound: 13 }), [poles]);
  const pose = { pos: [-2.6, 1.6, 17] as [number, number, number], target: [-3.6, -0.1, 0] as [number, number, number], fov: 34, focus: 17.5, dof: 0.035 };
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Stage3D width={width} height={height} pose={pose} orbs={(add) => drawBarMagnet(add, 0, 0, 2.5)} glows={(add) => drawLines(add, lines, 12, 1.6, BFIELD, { bold: true })} />
      <Vignette />
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(3,6,13,0.94) 0%, rgba(3,6,13,0.72) 36%, rgba(3,6,13,0) 60%)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 110, fontFamily: 'Sora', color: C.text }}>
        <Kicker style={{ fontSize: 40, letterSpacing: 8 }}>Magnetism</Kicker>
        <div style={{ fontSize: 172, fontWeight: 600, letterSpacing: -5, lineHeight: 1.02, marginTop: 18 }}>
          The second
          <br />
          <span style={{ color: BFIELD }}>field</span>
        </div>
        <div style={{ fontSize: 54, fontWeight: 300, color: C.dim, marginTop: 30 }}>what moving charge does</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, useVideoConfig } from 'remotion';
import { Vignette } from '../../scenes/overlays';
import { C } from '../../theme';
import { Kicker } from '../../ui/type';
import { CURRENT } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';
import { drawGenerator } from './I1';
import { rotMagnet } from './kit';

// Thumbnail for "The Field That Moves the World" (render at --scale=0.66667 for 1280x720).
export const IThumb = () => {
  const { width, height } = useVideoConfig();
  const pose = { pos: [-1, 2.4, 14] as [number, number, number], target: [-5.8, 0, 0] as [number, number, number], fov: 34, focus: 14.5, dof: 0.03 };
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Stage3D width={width} height={height} pose={pose} orbs={(add) => rotMagnet(add, 0.6, 1.7)} glows={(add) => drawGenerator(null, add, 14, 0.6)} />
      <Vignette />
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(3,6,13,0.94) 0%, rgba(3,6,13,0.75) 40%, rgba(3,6,13,0) 62%)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 110, fontFamily: 'Sora', color: C.text }}>
        <Kicker style={{ fontSize: 40, letterSpacing: 8 }}>Electromagnetic induction</Kicker>
        <div style={{ fontSize: 150, fontWeight: 600, letterSpacing: -5, lineHeight: 1.02, marginTop: 18 }}>
          The field that
          <br />
          <span style={{ color: CURRENT }}>moves</span> the world
        </div>
        <div style={{ fontSize: 54, fontWeight: 300, color: C.dim, marginTop: 30 }}>how motion becomes electricity</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

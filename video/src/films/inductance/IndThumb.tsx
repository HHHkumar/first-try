import { AbsoluteFill, useVideoConfig } from 'remotion';
import { Vignette } from '../../scenes/overlays';
import { C } from '../../theme';
import { Kicker } from '../../ui/type';
import { CURRENT } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';
import { drawCoilField, drawTurns, useCoil } from './kit';

// Thumbnail for "The Current That Won't Stop" (render at --scale=0.66667 for 1280x720).
export const IndThumb = () => {
  const { width, height } = useVideoConfig();
  const coil = useCoil();
  const pose = { pos: [1, 3.2, 15] as [number, number, number], target: [-5.8, -0.2, 0] as [number, number, number], fov: 34, focus: 16, dof: 0.035 };
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Stage3D
        width={width}
        height={height}
        pose={pose}
        glows={(add) => {
          drawTurns(add, coil, 12, 1);
          drawCoilField(add, coil, 12, 1, 1.2);
        }}
      />
      <Vignette />
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(3,6,13,0.94) 0%, rgba(3,6,13,0.78) 40%, rgba(3,6,13,0) 64%)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 110, fontFamily: 'Sora', color: C.text }}>
        <Kicker style={{ fontSize: 40, letterSpacing: 8 }}>Inductance</Kicker>
        <div style={{ fontSize: 150, fontWeight: 600, letterSpacing: -5, lineHeight: 1.02, marginTop: 18 }}>
          The current
          <br />
          that <span style={{ color: CURRENT }}>won’t stop</span>
        </div>
        <div style={{ fontSize: 54, fontWeight: 300, color: C.dim, marginTop: 30 }}>why a coil fights every change</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

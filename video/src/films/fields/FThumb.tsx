import { AbsoluteFill, useVideoConfig } from 'remotion';
import { Vignette } from '../../scenes/overlays';
import { C } from '../../theme';
import { Kicker } from '../../ui/type';
import { BFIELD } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';
import { drawWave, EFIELD, GOLD } from './kit';

// Thumbnail for "Two Fields, One Light" (render at --scale=0.66667 for 1280x720).
export const FThumb = () => {
  const { width, height } = useVideoConfig();
  const pose = { pos: [9, 3.6, 13] as [number, number, number], target: [0, 0.6, 0] as [number, number, number], fov: 34, focus: 13, dof: 0.03 };
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Stage3D width={width} height={height} pose={pose} glows={(add) => drawWave(add, -4, 14, 10, { gain: 1.3, amp: 2.2, k: 1.1 })} />
      <Vignette />
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(3,6,13,0.94) 0%, rgba(3,6,13,0.75) 38%, rgba(3,6,13,0) 62%)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 110, fontFamily: 'Sora', color: C.text }}>
        <Kicker style={{ fontSize: 40, letterSpacing: 8 }}>Electric and magnetic fields</Kicker>
        <div style={{ fontSize: 168, fontWeight: 600, letterSpacing: -5, lineHeight: 1.02, marginTop: 18 }}>
          <span style={{ color: EFIELD }}>Two</span> <span style={{ color: BFIELD }}>fields</span>,
          <br />
          one <span style={{ color: GOLD }}>light</span>
        </div>
        <div style={{ fontSize: 54, fontWeight: 300, color: C.dim, marginTop: 30 }}>how each one makes the other</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

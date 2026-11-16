import { AbsoluteFill, useVideoConfig } from 'remotion';
import { Vignette } from '../../scenes/overlays';
import { C } from '../../theme';
import { Kicker } from '../../ui/type';
import { Stage3D } from '../../world/Stage3D';
import { drawPlates } from './kit';

// Thumbnail for "The Space Between" (render at --scale=0.66667 for 1280x720).
export const CapacThumb = () => {
  const { width, height } = useVideoConfig();
  const pose = { pos: [3.5, 3.4, 15] as [number, number, number], target: [-4.2, -0.2, 0] as [number, number, number], fov: 34, focus: 16, dof: 0.035 };
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Stage3D width={width} height={height} pose={pose} fog={0.012} orbs={(add) => drawPlates(add, null, 12, {})} glows={(add) => drawPlates(null, add, 12, { lineGain: 1.5 })} />
      <Vignette />
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(3,6,13,0.94) 0%, rgba(3,6,13,0.72) 36%, rgba(3,6,13,0) 60%)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 110, fontFamily: 'Sora', color: C.text }}>
        <Kicker style={{ fontSize: 40, letterSpacing: 8 }}>Capacitance</Kicker>
        <div style={{ fontSize: 172, fontWeight: 600, letterSpacing: -5, lineHeight: 1.02, marginTop: 18 }}>
          The space
          <br />
          <span style={{ color: C.electron }}>between</span>
        </div>
        <div style={{ fontSize: 54, fontWeight: 300, color: C.dim, marginTop: 30 }}>where a capacitor keeps its energy</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

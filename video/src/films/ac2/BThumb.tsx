import { AbsoluteFill } from 'remotion';
import { sora } from '../../fonts';
import { AStage, BG, CYAN, PINK, TEAL } from '../ac/kit';
import { coil, pair } from './kit';

// Thumbnail for "Out of Step" (render at --scale=0.66667 for 1280x720).
export const BThumb = () => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <AStage
      pose={{ pos: [3, 2.2, 17], target: [-1.5, 0.1, 0], fov: 34, focus: 17, dof: 0.02 }}
      scene={(add) => {
        pair(add, { x0: 0.5, x1: 16, th: (x) => 0.4 + (x - 0.5) * 0.9, axis: 1.2, amp: 2.2 }, Math.PI / 2, { iAmp: 1 });
        coil(add, 5.5, -2.0, 1, 12, 1, { len: 4, r: 0.9 });
      }}
    />
    <AbsoluteFill style={{ mixBlendMode: 'screen', background: 'radial-gradient(ellipse 60% 55% at 18% 22%, rgba(0,220,200,0.28), rgba(0,220,200,0) 70%), radial-gradient(ellipse 55% 60% at 85% 30%, rgba(214,60,255,0.26), rgba(214,60,255,0) 70%)' }} />
    <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(11,7,34,0.92) 0%, rgba(11,7,34,0.7) 38%, rgba(11,7,34,0) 60%)' }} />
    <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 110, fontFamily: sora, color: '#f3f0ff' }}>
      <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: 8, textTransform: 'uppercase', color: TEAL }}>Alternating current · 2</div>
      <div style={{ fontSize: 176, fontWeight: 600, letterSpacing: -5, lineHeight: 1.02, marginTop: 18 }}>
        <span style={{ color: PINK }}>Out</span> of
        <br />
        <span style={{ color: CYAN }}>step</span>
      </div>
      <div style={{ fontSize: 54, fontWeight: 300, opacity: 0.75, marginTop: 30 }}>why coils and capacitors shift the current</div>
    </AbsoluteFill>
  </AbsoluteFill>
);

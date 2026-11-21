import { AbsoluteFill } from 'remotion';
import { sora } from '../../fonts';
import { AStage, BG, CYAN, phaseColor, PINK, ribbon, TEAL } from '../ac/kit';

// Thumbnail for "Back and Forth" (render at --scale=0.66667 for 1280x720).
export const AThumb = () => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <AStage
      pose={{ pos: [3, 2.2, 17], target: [-1.5, 0.1, 0], fov: 34, focus: 17, dof: 0.02 }}
      scene={(add) => ribbon(add, 0.5, 16, (x) => Math.sin(0.4 - (x - 0.5) * 0.9) * 2.7, (x) => phaseColor((0.4 - (x - 0.5) * 0.9) / 6.283), { size: 0.28 })}
    />
    <AbsoluteFill style={{ mixBlendMode: 'screen', background: 'radial-gradient(ellipse 60% 55% at 18% 22%, rgba(0,220,200,0.28), rgba(0,220,200,0) 70%), radial-gradient(ellipse 55% 60% at 85% 30%, rgba(214,60,255,0.26), rgba(214,60,255,0) 70%)' }} />
    <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(11,7,34,0.92) 0%, rgba(11,7,34,0.7) 38%, rgba(11,7,34,0) 60%)' }} />
    <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 110, fontFamily: sora, color: '#f3f0ff' }}>
      <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: 8, textTransform: 'uppercase', color: TEAL }}>Alternating current · 1</div>
      <div style={{ fontSize: 176, fontWeight: 600, letterSpacing: -5, lineHeight: 1.02, marginTop: 18 }}>
        <span style={{ color: PINK }}>Back</span> and
        <br />
        <span style={{ color: CYAN }}>forth</span>
      </div>
      <div style={{ fontSize: 54, fontWeight: 300, opacity: 0.75, marginTop: 30 }}>the shape of AC, and what 230 V means</div>
    </AbsoluteFill>
  </AbsoluteFill>
);

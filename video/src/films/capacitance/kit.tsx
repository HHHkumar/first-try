import { AbsoluteFill } from 'remotion';
import { ramp } from '../../anim';
import { sora } from '../../fonts';
import { C } from '../../theme';
import { T } from '../../ui/Shell';
import { Timeline as BaseTimeline } from '../charge/kit';

// Pieces shared by every chapter of "The Space Between" (capacitance).
export { at, Cap, drawPlates, Ink, shot } from '../charge/kit';
export const VOICE = (n: number) => `capacitance/ch${n}`;
export const GOLD = '#ffe08a';
export const PLATES = { pos: [6.5, 4.2, 19] as [number, number, number], target: [0, -0.3, 0] as [number, number, number], fov: 34, focus: 20.4, dof: 0.03 };

export const TIMELINE = [
  { year: '1745', name: 'von Kleist' },
  { year: '1746', name: 'Musschenbroek' },
  { year: '1746', name: 'Nollet' },
  { year: '1749', name: 'Franklin’s battery' },
  { year: '1782', name: 'Volta’s condenser' },
  { year: '1837', name: 'Faraday' },
  { year: '1860s', name: 'Maxwell' },
  { year: '1881', name: 'The farad' },
] as const;

export const Timeline = (props: { frame: number; already: number[]; events?: [number, number][]; opacity?: number }) => <BaseTimeline {...props} entries={TIMELINE} />;

// The closing card every film in the series ends on.
export const EndCard = ({ frame, from }: { frame: number; from: number }) => {
  const o = ramp(frame, T(from), T(from + 0.7));
  return o <= 0 ? null : (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: o, fontFamily: sora, color: C.text, background: `rgba(3,6,13,${0.82 * o})` }}>
      <div style={{ display: 'flex', gap: 60, fontSize: 104, fontWeight: 300, letterSpacing: -2 }}>
        {['Like', 'Share', 'Subscribe'].map((w, i) => (
          <span key={w} style={{ opacity: ramp(frame, T(from + 0.5 + i * 0.5), T(from + 0.9 + i * 0.5)), color: i === 2 ? C.electron : C.text, textShadow: i === 2 ? `0 0 60px ${C.electron}88` : undefined }}>
            {w}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 44, fontSize: 46, fontWeight: 400, color: C.rho, letterSpacing: 1, opacity: ramp(frame, T(from + 2.0), T(from + 2.6)) }}>youtube.com/@electricalmcqs</div>
    </AbsoluteFill>
  );
};

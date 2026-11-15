import { useMemo } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from '../theme';
import { sora, stix } from '../fonts';
import { simulate } from '../world/sim';
import { WireWorld } from '../world/WireWorld';
import { Vignette } from './overlays';

const LATTICE = { nx: 41, ny: 9, nz: 9 };
export const FORMULA_FRAMES = 150;

const Term = ({ children, color, label, show }: { children: React.ReactNode; color: string; label?: string; show: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: show, transform: `translateY(${(1 - show) * 24}px)` }}>
    <div style={{ color, textShadow: `0 0 42px ${color}66` }}>{children}</div>
    {label ? (
      <div style={{ fontFamily: sora, fontStyle: 'normal', fontSize: 24, fontWeight: 600, letterSpacing: 5, textTransform: 'uppercase', color, marginTop: 26, opacity: 0.9 }}>
        {label}
      </div>
    ) : null}
  </div>
);

export const FormulaCard = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const sim = useMemo(
    () => simulate({ seed: 3, count: 220, frames: FORMULA_FRAMES, substeps: 6, half: [20.5, 4.5, 4.5], thermalSpeed: 0.3, accel: () => -0.011, tau: () => 11 }),
    [],
  );
  const at = (delay: number) => spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const dim = interpolate(frame, [0, 30], [1, 0.42], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <AbsoluteFill style={{ opacity: dim }}>
        <WireWorld
          frame={frame}
          width={width}
          height={height}
          lattice={LATTICE}
          sim={sim}
          pose={{ pos: [-6 + frame * 0.01, 4.5, 12], target: [0, 0, 0], fov: 36, focus: 2, dof: 0.2 }}
          look={{ temperature: 0, electronGain: 0.9, ionGain: 1, fog: 0.05 }}
        />
      </AbsoluteFill>
      <Vignette />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 44, fontFamily: stix, fontStyle: 'italic', fontSize: 190, lineHeight: 1, color: C.text }}>
          <Term color={C.text} show={at(10)}>
            <span>R</span>
          </Term>
          <Term color={C.dim} show={at(18)}>
            <span style={{ fontStyle: 'normal' }}>=</span>
          </Term>
          <Term color={C.rho} label="material" show={at(34)}>
            <span>ρ</span>
          </Term>
          <Term color={C.shape} label="shape" show={at(58)}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -92 }}>
              <span>L</span>
              <div style={{ width: 170, height: 6, borderRadius: 3, background: C.shape, margin: '14px 0 10px', boxShadow: `0 0 30px ${C.shape}88` }} />
              <span>A</span>
            </div>
          </Term>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

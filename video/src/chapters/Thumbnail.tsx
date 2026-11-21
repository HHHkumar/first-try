import { useMemo } from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { Vignette } from '../scenes/overlays';
import { C } from '../theme';
import { Frac, Kicker, Sym } from '../ui/type';
import { simulate } from '../world/sim';
import { WireWorld } from '../world/WireWorld';

// Still image for the video's thumbnail (render at --scale=0.6667 for 1280x720).
export const Thumbnail = () => {
  const { width, height } = useVideoConfig();
  const sim = useMemo(
    () => simulate({ seed: 7, count: 260, frames: 120, substeps: 4, half: [20.5, 4.5, 4.5], thermalSpeed: 0.3, accel: () => 0.006, tau: () => 11 }),
    [],
  );
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <WireWorld
        frame={100}
        width={width}
        height={height}
        lattice={{ nx: 41, ny: 9, nz: 9 }}
        sim={sim}
        pose={{ pos: [3.2, 3.4, 7.4], target: [-1.2, -0.2, 0], fov: 34, focus: 8.2, dof: 0.24 }}
        look={{ temperature: 0.25, electronGain: 1.5, ionGain: 1.35, fog: 0.05, slab: 1.6, flashes: 0.8 }}
      />
      <Vignette />
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(3,6,13,0.92) 0%, rgba(3,6,13,0.72) 38%, rgba(3,6,13,0) 68%)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 110, fontFamily: 'Sora', color: C.text }}>
        <Kicker style={{ fontSize: 40, letterSpacing: 8 }}>Inside the wire</Kicker>
        <div style={{ fontSize: 170, fontWeight: 600, letterSpacing: -5, lineHeight: 1.02, marginTop: 18 }}>
          Why wires
          <br />
          <span style={{ color: C.rho }}>resist</span>
        </div>
        <div style={{ fontSize: 150, display: 'flex', alignItems: 'center', gap: 34, marginTop: 44 }}>
          <Sym>R</Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Sym color={C.rho}>ρ</Sym>
          <Frac color={C.shape} width={120} top={<Sym color={C.shape}>L</Sym>} bottom={<Sym color={C.shape}>A</Sym>} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

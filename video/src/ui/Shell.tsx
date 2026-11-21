import type { ReactNode } from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { ramp } from '../anim';
import { Vignette } from '../scenes/overlays';
import { C, FPS } from '../theme';

export const LEAD = 20; // frames of picture before the voice starts
export const TAIL = 26;
export const chapterFrames = (voiceSeconds: number) => LEAD + Math.ceil(voiceSeconds * FPS) + TAIL;
// narration time (seconds) -> frame
export const T = (seconds: number) => Math.round(LEAD + seconds * FPS);

type Props = { voice: string; frames: number; world?: ReactNode; children: ReactNode; fadeIn?: boolean; fadeOut?: boolean };

// Common frame for a chapter: 3D world at the back, haze and vignette, 2D on
// top, narration, and a soft fade at each end.
export const Shell = ({ voice, frames, world, children, fadeIn = true, fadeOut = true }: Props) => {
  const frame = useCurrentFrame();
  const veil = Math.max(fadeIn ? 1 - ramp(frame, 0, 12) : 0, fadeOut ? ramp(frame, frames - 16, frames - 2) : 0);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      {world}
      <Vignette />
      {children}
      <AbsoluteFill style={{ backgroundColor: C.bg0, opacity: veil }} />
      <Sequence from={LEAD}>
        <Audio src={staticFile(`voice/${voice}.mp3`)} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Full-screen 2D scene that crossfades over the world.
export const Scene = ({ opacity, children, solid = true }: { opacity: number; children: ReactNode; solid?: boolean }) =>
  opacity <= 0 ? null : (
    <AbsoluteFill style={{ opacity }}>
      {solid ? (
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 90% at 50% 45%, ${C.bg1} 0%, ${C.bg0} 100%)` }} />
      ) : null}
      <AbsoluteFill>{children}</AbsoluteFill>
    </AbsoluteFill>
  );

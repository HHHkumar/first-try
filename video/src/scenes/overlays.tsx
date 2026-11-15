import { AbsoluteFill } from 'remotion';
import { C } from '../theme';
import { sora } from '../fonts';

// Colour haze (screened on) plus a vignette. Cheap atmosphere for every shot.
export const Vignette = () => (
  <>
    <AbsoluteFill
      style={{
        mixBlendMode: 'screen',
        background:
          'radial-gradient(ellipse 55% 60% at 22% 30%, rgba(43,108,255,0.13), rgba(43,108,255,0) 70%), radial-gradient(ellipse 50% 55% at 78% 72%, rgba(255,122,58,0.07), rgba(255,122,58,0) 70%), radial-gradient(ellipse 45% 50% at 85% 18%, rgba(43,108,255,0.08), rgba(43,108,255,0) 70%)',
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at 50% 46%, rgba(3,6,13,0) 42%, rgba(3,6,13,0.55) 78%, rgba(2,4,9,0.92) 100%)',
      }}
    />
  </>
);

export const Caption = ({ opacity, kicker, title }: { opacity: number; kicker: string; title: string }) => (
  <AbsoluteFill style={{ justifyContent: 'flex-end', padding: '0 0 92px 110px', opacity }}>
    <div
      style={{
        fontFamily: sora,
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: 5,
        textTransform: 'uppercase',
        color: C.electron,
        marginBottom: 14,
        transform: `translateY(${(1 - opacity) * 10}px)`,
      }}
    >
      {kicker}
    </div>
    <div
      style={{
        fontFamily: sora,
        fontSize: 46,
        fontWeight: 300,
        color: C.text,
        letterSpacing: -0.5,
        textShadow: '0 2px 30px rgba(3,6,13,0.9)',
        transform: `translateY(${(1 - opacity) * 16}px)`,
      }}
    >
      {title}
    </div>
  </AbsoluteFill>
);

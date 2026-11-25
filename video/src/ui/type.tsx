import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { sora, stix } from '../fonts';
import { C } from '../theme';
import { kicker } from './hud';

// A symbol set in the mathematics face.
export const Sym = ({ children, color = C.text, show = 1, size, style }: { children: ReactNode; color?: string; show?: number; size?: number; style?: CSSProperties }) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: stix,
      fontStyle: 'italic',
      color,
      fontSize: size,
      opacity: show,
      transform: `translateY(${(1 - show) * 22}px)`,
      textShadow: `0 0 40px ${color}55`,
      ...style,
    }}
  >
    {children}
  </span>
);

export const Frac = ({ top, bottom, color = C.text, show = 1, width = 150 }: { top: ReactNode; bottom: ReactNode; color?: string; show?: number; width?: number }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', opacity: show, lineHeight: 1 }}>
    {top}
    <span style={{ width, height: 5, borderRadius: 3, background: color, margin: '12px 0 8px', boxShadow: `0 0 26px ${color}88` }} />
    {bottom}
  </span>
);

// Centred block of big type over the scene.
export const Center = ({ children, opacity = 1, style }: { children: ReactNode; opacity?: number; style?: CSSProperties }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity, fontFamily: sora, color: C.text, ...style }}>{children}</AbsoluteFill>
);

export const Big = ({ children, size = 150, style }: { children: ReactNode; size?: number; style?: CSSProperties }) => (
  <div style={{ fontFamily: sora, fontWeight: 300, fontSize: size, letterSpacing: -3, lineHeight: 1.05, textAlign: 'center', textShadow: '0 4px 60px rgba(3,6,13,0.95)', ...style }}>{children}</div>
);

export const Sub = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ fontFamily: sora, fontWeight: 300, fontSize: 40, color: C.dim, marginTop: 22, textAlign: 'center', textShadow: '0 2px 30px rgba(3,6,13,0.95)', ...style }}>{children}</div>
);

export const Kicker = ({ children, color = C.electron, style }: { children: ReactNode; color?: string; style?: CSSProperties }) => (
  <div style={{ ...kicker, color, ...style }}>{children}</div>
);

// Small label with a value, for meters beside a drawing.
export const Meter = ({ label, value, unit, color = C.text, size = 76, align = 'left' }: { label: string; value: string; unit?: string; color?: string; size?: number; align?: 'left' | 'right' | 'center' }) => (
  <div style={{ fontFamily: sora, textAlign: align }}>
    <div style={{ ...kicker, fontSize: 19, letterSpacing: 4, color: C.dim }}>{label}</div>
    <div style={{ fontSize: size, fontWeight: 300, letterSpacing: -2, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.15 }}>
      {value}
      {unit ? <span style={{ fontSize: size * 0.42, color: C.dim, letterSpacing: 0 }}> {unit}</span> : null}
    </div>
  </div>
);

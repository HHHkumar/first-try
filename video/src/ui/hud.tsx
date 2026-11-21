import type { CSSProperties, ReactNode } from 'react';
import { C } from '../theme';
import { sora } from '../fonts';

export const kicker: CSSProperties = {
  fontFamily: sora,
  fontSize: 22,
  fontWeight: 600,
  letterSpacing: 5,
  textTransform: 'uppercase',
  color: C.electron,
};

export const Panel = ({ children, opacity, style }: { children: ReactNode; opacity: number; style: CSSProperties }) => (
  <div
    style={{
      position: 'absolute',
      opacity,
      transform: `translateY(${(1 - opacity) * 18}px)`,
      fontFamily: sora,
      color: C.text,
      ...style,
    }}
  >
    {children}
  </div>
);

// A big read-out with a small label above it.
export const Readout = ({ label, value, unit, color = C.text }: { label: string; value: string; unit?: string; color?: string }) => (
  <div>
    <div style={kicker}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 10 }}>
      <span style={{ fontSize: 108, fontWeight: 300, letterSpacing: -3, color, fontVariantNumeric: 'tabular-nums', textShadow: '0 4px 40px rgba(3,6,13,0.9)' }}>{value}</span>
      {unit ? <span style={{ fontSize: 40, fontWeight: 300, color: C.dim }}>{unit}</span> : null}
    </div>
  </div>
);

export const Snail = ({ size = 64, color = C.rho }: { size?: number; color?: string }) => (
  <svg width={size * 1.5} height={size} viewBox="0 0 96 64" fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 56 H70 C82 56 88 48 88 38 C88 32 84 28 80 30" />
    <path d="M80 30 L86 14 M76 30 L74 14" />
    <circle cx="40" cy="34" r="22" />
    <path d="M40 34 m0 -12 a12 12 0 1 1 -12 12 a7 7 0 1 0 7 -7" />
  </svg>
);

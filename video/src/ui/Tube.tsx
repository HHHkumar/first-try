import { useId, useMemo } from 'react';
import { C } from '../theme';
import { mulberry32 } from '../world/rng';

// A length of wire seen from outside: a tinted glass cylinder with the electron
// crowd drifting through it and its cross-section showing at the right-hand end.
type Props = {
  x: number; // left end
  y: number; // centre line
  length: number;
  radius: number; // half the thickness
  frame: number;
  color?: string; // material tint
  flow?: number; // px per frame the crowd drifts
  density?: number; // electrons per 10,000 px^2
  heat?: number; // 0..1 glow of the wire itself
  grain?: number; // 0..1 how cluttered the inside is (obstacles)
  opacity?: number;
  seed?: number;
  lanes?: number; // dashed lane markings inside
  laneOpacity?: number;
  broken?: number; // 0..1 a gap opening in the middle (a blown fuse)
};

export const Tube = ({ x, y, length, radius, frame, color = C.ion, flow = 1.2, density = 5, heat = 0, grain = 0.35, opacity = 1, seed = 1, lanes = 0, laneOpacity = 1, broken = 0 }: Props) => {
  const id = useId().replace(/:/g, '');
  const cap = Math.max(6, radius * 0.36);
  const dots = useMemo(() => {
    const rand = mulberry32(seed * 977 + 13);
    return Array.from({ length: 900 }, () => ({ u: rand(), v: rand() * 2 - 1, s: 0.6 + rand() * 0.8, ph: rand() * 6.28 }));
  }, [seed]);
  const n = Math.min(dots.length, Math.round((length * radius * 2 * density) / 10000));
  const nGrain = Math.min(dots.length, Math.round((length * radius * 2 * 9 * grain) / 10000));
  const gap = broken * 90;
  const mid = x + length / 2;
  const hot = `rgba(255,${Math.round(150 - 60 * heat)},${Math.round(60 - 30 * heat)},1)`;
  return (
    <g opacity={opacity}>
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.42" />
          <stop offset="22%" stopColor={color} stopOpacity="0.16" />
          <stop offset="70%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
        <clipPath id={`c${id}`}>
          {broken > 0 ? (
            <>
              <rect x={x} y={y - radius} width={length / 2 - gap / 2} height={radius * 2} />
              <rect x={mid + gap / 2} y={y - radius} width={length / 2 - gap / 2} height={radius * 2} />
            </>
          ) : (
            <rect x={x} y={y - radius} width={length} height={radius * 2} />
          )}
        </clipPath>
      </defs>
      {heat > 0.02 ? (
        <rect x={x - 30} y={y - radius - 30} width={length + 60} height={radius * 2 + 60} rx={radius + 30} fill={hot} opacity={heat * 0.22} style={{ filter: 'blur(26px)' }} />
      ) : null}
      <g clipPath={`url(#c${id})`}>
        <rect x={x} y={y - radius} width={length} height={radius * 2} fill={`url(#b${id})`} />
        {heat > 0.02 ? <rect x={x} y={y - radius} width={length} height={radius * 2} fill={hot} opacity={heat * 0.45} /> : null}
        {dots.slice(0, nGrain).map((d, i) => (
          <circle key={`g${i}`} cx={x + ((d.u * 7.31) % 1) * length} cy={y + d.v * radius * 0.86} r={5} fill={color} opacity={0.6} />
        ))}
        {Array.from({ length: Math.max(0, lanes - 1) }, (_, i) => (
          <line
            key={`l${i}`}
            x1={x}
            x2={x + length}
            y1={y - radius + ((i + 1) * radius * 2) / lanes}
            y2={y - radius + ((i + 1) * radius * 2) / lanes}
            stroke={C.text}
            strokeOpacity={0.4 * laneOpacity}
            strokeWidth={2}
            strokeDasharray="26 22"
            strokeDashoffset={-frame * flow}
          />
        ))}
        {dots.slice(0, n).map((d, i) => {
          const px = x + ((((d.u * length + frame * flow * d.s) % length) + length) % length);
          const py = y + d.v * radius * 0.84 + Math.sin(frame * 0.21 * d.s + d.ph) * 3;
          return (
            <g key={i}>
              <circle cx={px} cy={py} r={10} fill={C.electron} opacity={0.2} />
              <circle cx={px} cy={py} r={3.8} fill={C.electronCore} />
            </g>
          );
        })}
      </g>
      {/* outline, far cap, and the cross-section at the near end */}
      <line x1={x} x2={x + length} y1={y - radius} y2={y - radius} stroke={color} strokeOpacity={0.75} strokeWidth={2} />
      <line x1={x} x2={x + length} y1={y + radius} y2={y + radius} stroke={color} strokeOpacity={0.55} strokeWidth={2} />
      <ellipse cx={x} cy={y} rx={cap} ry={radius} fill={C.bg0} stroke={color} strokeOpacity={0.7} strokeWidth={2} />
      <ellipse cx={x} cy={y} rx={cap} ry={radius} fill={color} opacity={0.12} />
      <ellipse cx={x + length} cy={y} rx={cap} ry={radius} fill={C.bg0} />
      <ellipse cx={x + length} cy={y} rx={cap} ry={radius} fill={color} opacity={0.34 + heat * 0.4} stroke={color} strokeWidth={2.5} />
      {broken > 0 ? <rect x={mid - gap / 2} y={y - radius - 4} width={gap} height={radius * 2 + 8} fill={C.bg0} opacity={Math.min(1, broken * 3)} /> : null}
    </g>
  );
};

// |<---- label ---->| under or over something.
export const Dimension = ({ x1, x2, y, label, color = C.shape, opacity = 1, above = false }: { x1: number; x2: number; y: number; label: string; color?: string; opacity?: number; above?: boolean }) => (
  <g opacity={opacity} stroke={color} strokeWidth={2} fill="none">
    <line x1={x1} x2={x2} y1={y} y2={y} />
    <line x1={x1} x2={x1} y1={y - 10} y2={y + 10} />
    <line x1={x2} x2={x2} y1={y - 10} y2={y + 10} />
    <text x={(x1 + x2) / 2} y={above ? y - 18 : y + 44} fill={color} stroke="none" fontSize={34} textAnchor="middle" fontFamily="'STIX Two', serif" fontStyle="italic">
      {label}
    </text>
  </g>
);

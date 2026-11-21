import { AbsoluteFill } from 'remotion';
import { C } from '../theme';

// The room before we dive into the wire: a switch, a cable, a lamp.
export const LAMP = { x: 1330, y: 430 };
export const CABLE_POINT = { x: 900, y: 96 }; // where the camera enters the cable
const cable = `M 470 640 L 470 150 Q 470 96 524 96 L ${LAMP.x - 54} 96 Q ${LAMP.x} 96 ${LAMP.x} 150 L ${LAMP.x} ${LAMP.y - 96}`;

type Props = {
  frame: number;
  on: number; // 0 = dark, 1 = lamp lit
  race: number; // opacity of the pulses racing along the cable
};

const glow = (x: number, y: number, rx: number, ry: number, stops: string, opacity: number) => (
  <div
    style={{
      position: 'absolute',
      left: x - rx,
      top: y - ry,
      width: rx * 2,
      height: ry * 2,
      background: `radial-gradient(ellipse closest-side, ${stops})`,
      opacity,
      mixBlendMode: 'screen',
    }}
  />
);

export const Room = ({ frame, on, race }: Props) => {
  const flicker = on * (0.95 + 0.05 * Math.sin(frame * 0.9) * Math.sin(frame * 0.37));
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 85% at 69% 42%, ${C.bg1} 0%, ${C.bg0} 100%)` }}>
      {/* floor */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 880, bottom: 0, background: 'linear-gradient(#0c1730, #03060d)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 879, height: 2, background: '#1c2a47' }} />

      {/* light: wide wash, downward cone, hot core, pool on the floor */}
      {glow(LAMP.x, LAMP.y + 40, 900, 760, 'rgba(255,170,90,0.20), rgba(255,150,70,0.06) 55%, rgba(255,150,70,0)', flicker)}
      {glow(LAMP.x, LAMP.y + 300, 430, 470, 'rgba(255,205,140,0.26), rgba(255,180,100,0.08) 60%, rgba(255,180,100,0)', flicker)}
      {glow(LAMP.x, LAMP.y + 36, 250, 250, 'rgba(255,240,205,0.85), rgba(255,200,120,0.35) 35%, rgba(255,160,80,0)', flicker)}
      {glow(LAMP.x, 905, 620, 58, 'rgba(255,200,130,0.34), rgba(255,180,100,0)', flicker)}

      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="shade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3a4763" />
            <stop offset="100%" stopColor="#141c2e" />
          </linearGradient>
        </defs>

        {/* cable */}
        <path d={cable} fill="none" stroke="#2a3a5c" strokeWidth="5" strokeLinecap="round" />
        <path d={cable} fill="none" stroke={C.electron} strokeWidth="9" strokeLinecap="round" opacity={on * 0.16} />
        <path d={cable} fill="none" stroke={C.electron} strokeWidth="2.2" strokeLinecap="round" opacity={on * 0.55} />
        {/* what we imagine: charge racing from switch to lamp */}
        <path
          d={cable}
          fill="none"
          stroke={C.electronCore}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="34 190"
          strokeDashoffset={-frame * 46}
          opacity={race}
        />
        <path
          d={cable}
          fill="none"
          stroke={C.electron}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="34 190"
          strokeDashoffset={-frame * 46}
          opacity={race * 0.3}
        />

        {/* lamp: cord cap, shade, bulb */}
        <rect x={LAMP.x - 16} y={LAMP.y - 100} width={32} height={40} rx={6} fill="#26324d" />
        <path d={`M ${LAMP.x - 34} ${LAMP.y - 62} L ${LAMP.x + 34} ${LAMP.y - 62} L ${LAMP.x + 150} ${LAMP.y + 22} L ${LAMP.x - 150} ${LAMP.y + 22} Z`} fill="url(#shade)" />
        <ellipse cx={LAMP.x} cy={LAMP.y + 22} rx={150} ry={13} fill="#0b1222" />
        <circle cx={LAMP.x} cy={LAMP.y + 36} r={34} fill="#3b4660" />
        <circle cx={LAMP.x} cy={LAMP.y + 36} r={34} fill="#fff6e0" opacity={on} />

        {/* switch plate */}
        <rect x={428} y={640} width={84} height={128} rx={12} fill="#18233c" stroke="#33466e" strokeWidth="2" />
        <rect x={454} y={672} width={32} height={64} rx={8} fill="#0c1424" />
        <rect x={457} y={704 - 28 * on} width={26} height={28} rx={6} fill={on > 0.5 ? C.electron : '#5b6c91'} />
      </svg>
    </AbsoluteFill>
  );
};

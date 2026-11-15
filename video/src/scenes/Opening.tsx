import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C } from '../theme';
import { Caption } from './overlays';

export const OPENING_FRAMES = 150;
const SWITCH_AT = 45;

// The room before we dive into the wire: a switch, a cable, a lamp.
export const Opening = () => {
  const frame = useCurrentFrame();
  const on = interpolate(frame, [SWITCH_AT, SWITCH_AT + 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flicker = on * (0.94 + 0.06 * Math.sin(frame * 0.9) * Math.sin(frame * 0.37));
  const lampX = 1330;
  const lampY = 430;
  // Cable: from the switch up the wall, across the ceiling, down to the lamp.
  const cable = `M 470 640 L 470 150 Q 470 96 524 96 L ${lampX - 54} 96 Q ${lampX} 96 ${lampX} 150 L ${lampX} ${lampY - 96}`;
  const cableLength = 170 + 490 + 85 + (lampX - 578) + 85 + (lampY - 246);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 69% 44%, ${C.bg1} 0%, ${C.bg0} 68%)` }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff3d6" stopOpacity="0.95" />
            <stop offset="12%" stopColor="#ffd08a" stopOpacity="0.7" />
            <stop offset="38%" stopColor="#ff9a4a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ff8a3a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="coneGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="26%">
            <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.3" />
            <stop offset="55%" stopColor="#ffb060" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#ffb060" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffc27a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffb060" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="shade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3a4763" />
            <stop offset="100%" stopColor="#141c2e" />
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d1830" />
            <stop offset="100%" stopColor="#03060d" />
          </linearGradient>
          <filter id="glowLine" filterUnits="userSpaceOnUse" x="-100" y="-100" width="2120" height="1280">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* floor */}
        <rect x="0" y="880" width="1920" height="200" fill="url(#floor)" />
        <line x1="0" y1="880" x2="1920" y2="880" stroke="#1c2a47" strokeWidth="2" />

        {/* light cone and pool on the floor */}
        <g opacity={flicker}>
          <ellipse cx={lampX} cy={lampY + 250} rx={520} ry={470} fill="url(#coneGlow)" />
          <ellipse cx={lampX} cy={900} rx={560} ry={60} fill="url(#pool)" />
          <circle cx={lampX} cy={lampY + 28} r={520} fill="url(#bulbGlow)" />
        </g>

        {/* cable */}
        <path d={cable} fill="none" stroke="#2a3a5c" strokeWidth="5" strokeLinecap="round" />
        <path
          d={cable}
          fill="none"
          stroke={C.electron}
          strokeWidth="5"
          strokeLinecap="round"
          opacity={on * 0.9}
          filter="url(#glowLine)"
        />
        <path d={cable} fill="none" stroke={C.electronCore} strokeWidth="1.6" strokeLinecap="round" opacity={on * 0.85} strokeDasharray={`${cableLength}`} />

        {/* lamp: cord cap, shade, bulb */}
        <rect x={lampX - 16} y={lampY - 100} width={32} height={40} rx={6} fill="#26324d" />
        <path d={`M ${lampX - 34} ${lampY - 62} L ${lampX + 34} ${lampY - 62} L ${lampX + 150} ${lampY + 22} L ${lampX - 150} ${lampY + 22} Z`} fill="url(#shade)" />
        <ellipse cx={lampX} cy={lampY + 22} rx={150} ry={13} fill="#0b1222" />
        <circle cx={lampX} cy={lampY + 36} r={34} fill={on > 0.5 ? '#fff6e0' : '#3b4660'} />
        <circle cx={lampX} cy={lampY + 36} r={34} fill="#ffcf8a" opacity={flicker * 0.6} filter="url(#glowLine)" />

        {/* switch plate */}
        <rect x={428} y={640} width={84} height={128} rx={12} fill="#18233c" stroke="#33466e" strokeWidth="2" />
        <rect x={454} y={672} width={32} height={64} rx={8} fill="#0c1424" />
        <rect x={457} y={on > 0.5 ? 676 : 704} width={26} height={28} rx={6} fill={on > 0.5 ? C.electron : '#5b6c91'} />
      </svg>
      <Caption
        opacity={interpolate(frame, [SWITCH_AT + 18, SWITCH_AT + 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        kicker="The paradox"
        title="The lamp lights at once. The electrons barely move."
      />
    </AbsoluteFill>
  );
};

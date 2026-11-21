import { AbsoluteFill } from 'remotion';
import { caveat } from '../fonts';

// Style B - "Sketchbook": ink line on graph paper with loose watercolour
// washes and handwritten notes, like a good teacher's notebook.
const INK = '#1d2a44';
const RED = '#d8492f';
const BLUE = '#2f6fd8';
const PAPER = '#f3f5f1';

export const StyleB = () => (
  <AbsoluteFill style={{ backgroundColor: PAPER }}>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 H 0 V 40" fill="none" stroke="#9db4d6" strokeOpacity="0.35" strokeWidth="1.2" />
        </pattern>
        <pattern id="gridBold" width="200" height="200" patternUnits="userSpaceOnUse">
          <path d="M 200 0 H 0 V 200" fill="none" stroke="#9db4d6" strokeOpacity="0.5" strokeWidth="1.8" />
        </pattern>
        {/* a slight wobble, so lines look drawn by hand */}
        <filter id="hand" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="7" />
        </filter>
        <filter id="wash" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="9" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26" />
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <marker id="arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" orient="auto">
          <path d="M 1 1 L 11 6 L 1 11" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        </marker>
      </defs>
      <rect width="1920" height="1080" fill="url(#grid)" />
      <rect width="1920" height="1080" fill="url(#gridBold)" />

      <g transform="translate(-300,40)">
      {/* watercolour washes */}
      <g filter="url(#wash)">
        <rect x={690} y={250} width={90} height={520} fill={RED} opacity={0.3} />
        <rect x={1150} y={250} width={90} height={520} fill={BLUE} opacity={0.3} />
        <rect x={790} y={270} width={350} height={480} fill="#f2c94c" opacity={0.2} />
      </g>

      <g filter="url(#hand)" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
        {/* plates */}
        <rect x={700} y={260} width={70} height={500} />
        <rect x={1160} y={260} width={70} height={500} />
        {/* circuit */}
        <path d="M 700 510 H 420 V 880 H 900" />
        <path d="M 1230 510 H 1510 V 880 H 1030" />
        {/* battery */}
        <path d="M 900 820 V 940 M 940 850 V 910 M 990 820 V 940 M 1030 850 V 910" strokeWidth={6} />
        <path d="M 940 880 H 990" strokeWidth={3} strokeDasharray="6 8" />
        {/* field arrows */}
        {[330, 420, 510, 600, 690].map((y) => (
          <path key={y} d={`M 790 ${y} H 1140`} strokeWidth={3} markerEnd="url(#arrow)" />
        ))}
        {/* gap dimension */}
        <path d="M 770 200 H 1160 M 770 180 V 220 M 1160 180 V 220" strokeWidth={3} />
      </g>
      <g filter="url(#hand)" strokeLinecap="round" strokeWidth={5} fill="none">
        {[310, 400, 490, 580, 670].map((y) => (
          <path key={y} d={`M 720 ${y} H 750 M 735 ${y - 15} V ${y + 15}`} stroke={RED} />
        ))}
        {[310, 400, 490, 580, 670].map((y) => (
          <path key={y} d={`M 1180 ${y} H 1210`} stroke={BLUE} />
        ))}
      </g>

      <g fontFamily={caveat} fill={INK}>
        <text x={965} y={170} fontSize={56} textAnchor="middle">
          gap d
        </text>
        <text x={640} y={250} fontSize={64} fill={RED} textAnchor="end">
          +Q
        </text>
        <text x={1290} y={250} fontSize={64} fill={BLUE}>
          −Q
        </text>
        <text x={965} y={800} fontSize={52} textAnchor="middle">
          electric field E
        </text>
        <text x={965} y={1010} fontSize={56} textAnchor="middle">
          battery, V
        </text>
      </g>
      </g>
      <g fontFamily={caveat} fill={INK}>
        <text x={1300} y={200} fontSize={118} fontWeight={700}>
          Capacitance
        </text>
        <path d="M 1302 226 C 1440 244, 1600 214, 1800 234" fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" filter="url(#hand)" />
        <text x={1300} y={440} fontSize={132} fontWeight={700}>
          C = Q / V
        </text>
        <text x={1300} y={520} fontSize={54}>
          charge stored per volt
        </text>
        <text x={1300} y={720} fontSize={100} fontWeight={700} fill={BLUE}>
          C = εA / d
        </text>
        <text x={1300} y={796} fontSize={50}>
          bigger plates, smaller gap:
        </text>
        <text x={1300} y={852} fontSize={50}>
          more capacitance
        </text>
        <text x={1300} y={1010} fontSize={46} fill="#5b6c91">
          Style B · Sketchbook
        </text>
      </g>
    </svg>
  </AbsoluteFill>
);

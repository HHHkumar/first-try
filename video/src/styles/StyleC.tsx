import { AbsoluteFill } from 'remotion';
import { fredoka } from '../fonts';
import { mulberry32 } from '../world/rng';

// Style C - "Cut paper": bold flat shapes with soft layered shadows and little
// electron characters. Friendly, bright, very easy to read at a glance.
const BG = '#22265c';
const BG2 = '#2f3585';
const CORAL = '#ff6b5e';
const MINT = '#5ee6c4';
const SUN = '#ffd24a';
const CREAM = '#fff4e2';

const Electron = ({ x, y, r = 30, look = 0 }: { x: number; y: number; r?: number; look?: number }) => (
  <g transform={`translate(${x},${y})`}>
    <circle cx={5} cy={7} r={r} fill="#10133a" opacity={0.35} />
    <circle r={r} fill={MINT} />
    <circle cx={-r * 0.3 + look} cy={-r * 0.12} r={r * 0.2} fill={CREAM} />
    <circle cx={r * 0.3 + look} cy={-r * 0.12} r={r * 0.2} fill={CREAM} />
    <circle cx={-r * 0.3 + look * 1.6} cy={-r * 0.1} r={r * 0.09} fill={BG} />
    <circle cx={r * 0.3 + look * 1.6} cy={-r * 0.1} r={r * 0.09} fill={BG} />
    <rect x={-r * 0.32} y={r * 0.34} width={r * 0.64} height={r * 0.13} rx={r * 0.06} fill={BG} />
  </g>
);

export const StyleC = () => {
  const rand = mulberry32(8);
  const crowd = Array.from({ length: 22 }, (_, i) => ({ x: 1242 + (i % 3) * 62 + rand() * 14, y: 250 + Math.floor(i / 3) * 76 + rand() * 16 }));
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 90% at 50% 40%, ${BG2}, ${BG})`, fontFamily: fredoka }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {/* soft blobs behind */}
        <circle cx={260} cy={880} r={300} fill="#3b42a3" opacity={0.5} />
        <circle cx={1700} cy={170} r={240} fill="#3b42a3" opacity={0.5} />

        <g transform="translate(250,50)">
        {/* wires */}
        <path d="M 720 520 H 470 V 900 H 880 M 1400 520 H 1560 V 900 H 1080" fill="none" stroke="#10133a" strokeOpacity={0.35} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" transform="translate(8,10)" />
        <path d="M 720 520 H 470 V 900 H 880 M 1400 520 H 1560 V 900 H 1080" fill="none" stroke={CREAM} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />

        {/* battery */}
        <rect x={868} y={832} width={220} height={136} rx={30} fill="#10133a" opacity={0.35} transform="translate(8,10)" />
        <rect x={868} y={832} width={220} height={136} rx={30} fill={SUN} />
        <rect x={1088} y={872} width={26} height={56} rx={10} fill={SUN} />
        <text x={930} y={928} fontSize={80} fontWeight={600} fill={BG} textAnchor="middle">
          +
        </text>
        <text x={1030} y={924} fontSize={80} fontWeight={600} fill={BG} textAnchor="middle">
          −
        </text>

        {/* field band */}
        {[300, 410, 520, 630, 740].map((y) => (
          <g key={y}>
            <path d={`M 850 ${y} H 1190`} stroke={SUN} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 34" />
            <path d={`M 1160 ${y - 22} L 1196 ${y} L 1160 ${y + 22}`} fill="none" stroke={SUN} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}

        {/* plates */}
        <rect x={700} y={210} width={120} height={620} rx={36} fill="#10133a" opacity={0.35} transform="translate(10,12)" />
        <rect x={700} y={210} width={120} height={620} rx={36} fill={CORAL} />
        <rect x={1220} y={210} width={200} height={620} rx={36} fill="#10133a" opacity={0.35} transform="translate(10,12)" />
        <rect x={1220} y={210} width={200} height={620} rx={36} fill="#4a52c9" />
        {[290, 410, 530, 650, 770].map((y) => (
          <text key={y} x={760} y={y} fontSize={84} fontWeight={600} fill={CREAM} textAnchor="middle">
            +
          </text>
        ))}
        {crowd.map((e, i) => (
          <Electron key={i} x={e.x} y={e.y} r={30} look={-5} />
        ))}
        </g>
      </svg>
      <div style={{ position: 'absolute', left: 90, top: 150, width: 600, color: CREAM }}>
        <div style={{ fontSize: 104, fontWeight: 600, letterSpacing: -2 }}>Capacitance</div>
        <div style={{ fontSize: 40, color: MINT, lineHeight: 1.2 }}>storing charge, held apart by a gap</div>
        <div style={{ display: 'inline-block', background: CREAM, color: BG, borderRadius: 34, padding: '12px 40px', fontSize: 100, fontWeight: 600, boxShadow: '10px 12px 0 rgba(16,19,58,0.35)', marginTop: 70 }}>
          C = Q / V
        </div>
        <div style={{ fontSize: 40, marginTop: 34, color: SUN }}>charge stored for every volt</div>
      </div>
      <div style={{ position: 'absolute', left: 90, bottom: 60, fontSize: 36, color: '#a9b0ff' }}>Style C · Cut paper</div>
      <div style={{ position: 'absolute', left: 810, top: 130, width: 400, fontSize: 42, color: CORAL, textAlign: 'center', lineHeight: 1.1 }}>short of electrons</div>
      <div style={{ position: 'absolute', left: 1370, top: 130, width: 400, fontSize: 42, color: MINT, textAlign: 'center', lineHeight: 1.1 }}>electrons pile up</div>
    </AbsoluteFill>
  );
};

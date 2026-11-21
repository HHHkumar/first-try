import { AbsoluteFill, useVideoConfig } from 'remotion';
import { sora } from '../../fonts';
import { rgb, Stage3D, type Add } from '../../world/Stage3D';

// Three candidate looks for the alternating-current series, on one hero shot:
// the turning loop between its poles, drawing a sine wave on an unrolling ribbon.
type Look = {
  name: string;
  note: string;
  bg: string;
  haze: string;
  floor: string;
  north: string;
  south: string;
  field: string;
  wire: string;
  accent: string;
  text: string;
  wave: (u: number) => [number, number, number];
  mirror: number;
};
const hsl = (h: number, s: number, l: number): [number, number, number] => {
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    return l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
};
export const LOOKS: Record<string, Look> = {
  A: {
    name: 'A · Aurora',
    note: 'deep indigo, teal and magenta light, the wave coloured by its phase',
    bg: '#0b0722',
    haze: 'radial-gradient(ellipse 60% 55% at 18% 22%, rgba(0,220,200,0.30), rgba(0,220,200,0) 70%), radial-gradient(ellipse 55% 60% at 85% 30%, rgba(214,60,255,0.28), rgba(214,60,255,0) 70%), radial-gradient(ellipse 90% 40% at 50% 100%, rgba(60,90,255,0.35), rgba(60,90,255,0) 75%)',
    floor: '#42e8ff',
    north: '#ff4fa3',
    south: '#35c9ff',
    field: '#7dffb0',
    wire: '#ffffff',
    accent: '#5ff5e0',
    text: '#f3f0ff',
    wave: (u) => hsl((0.86 + u * 0.75) % 1, 0.95, 0.66),
    mirror: 0.16,
  },
  B: {
    name: 'B · Sunrise',
    note: 'warm plum and amber, a glowing horizon, gold and coral objects',
    bg: '#1c0b24',
    haze: 'radial-gradient(ellipse 110% 45% at 50% 78%, rgba(255,140,60,0.50), rgba(255,140,60,0) 72%), radial-gradient(ellipse 70% 50% at 50% 60%, rgba(255,70,120,0.30), rgba(255,70,120,0) 70%), radial-gradient(ellipse 60% 50% at 15% 10%, rgba(120,70,255,0.28), rgba(120,70,255,0) 70%)',
    floor: '#ff9a6b',
    north: '#ff6b4a',
    south: '#3fd6c8',
    field: '#ffe08a',
    wire: '#fff4dd',
    accent: '#ffc65a',
    text: '#fff5ea',
    wave: (u) => hsl(0.02 + 0.13 * (0.5 + 0.5 * Math.sin(u * 6.283)), 1, 0.66),
    mirror: 0.22,
  },
  C: {
    name: 'C · Prism',
    note: 'deep teal studio, every quantity in its own bright colour, a mirror floor',
    bg: '#04161f',
    haze: 'radial-gradient(ellipse 50% 60% at 50% 30%, rgba(80,200,255,0.26), rgba(80,200,255,0) 70%), radial-gradient(ellipse 40% 40% at 10% 85%, rgba(255,214,70,0.22), rgba(255,214,70,0) 70%), radial-gradient(ellipse 40% 40% at 92% 80%, rgba(255,80,160,0.24), rgba(255,80,160,0) 70%)',
    floor: '#9fb8ff',
    north: '#ff3b5c',
    south: '#3b7bff',
    field: '#b6ff4a',
    wire: '#ffffff',
    accent: '#ffd646',
    text: '#f2fbff',
    wave: (u) => (Math.sin(u * 6.283) >= 0 ? [1, 0.84, 0.27] : [0.25, 0.9, 1]),
    mirror: 0.3,
  },
};

const FLOOR = -3.2;
export const StyleAC = ({ look }: { look: keyof typeof LOOKS }) => {
  const { width, height } = useVideoConfig();
  const L = LOOKS[look];
  const angle = 0.9;
  const frame = 20;
  const draw = (glow: Add, flip: number, gain: number) => {
    const Y = (y: number) => (flip > 0 ? y : 2 * FLOOR - y);
    // the field across the gap
    const f = rgb(L.field);
    for (const y of [-1.6, -0.8, 0, 0.8, 1.6])
      for (const z of [-2, -1, 0, 1, 2])
        for (let i = 0; i <= 80; i++) {
          const phase = (((i - frame * 0.8 + y * 9 + z * 5) % 40) + 40) % 40;
          const pulse = Math.exp(-(phase * phase) / 14);
          glow(-8 + i * 0.1, Y(y), z, 0.07 + 0.1 * pulse, f, (0.35 + 0.6 * pulse) * gain);
        }
    // the loop, and the bright point on it that draws the wave
    const w = rgb(L.wire);
    const cx = -4 + Math.cos(angle) * 2.3;
    const cy = Math.sin(angle) * 2.3;
    for (let i = 0; i <= 50; i++) {
      const z = -2 + i * 0.08;
      glow(cx, Y(cy), z, 0.2, w, 0.9 * gain);
      glow(-8 - cx, Y(-cy), z, 0.2, w, 0.9 * gain);
    }
    for (const z of [-2, 2]) for (let i = 0; i <= 50; i++) glow(-8 - cx + (i / 50) * (2 * cx + 8), Y(-cy + (i / 50) * 2 * cy), z, 0.2, w, 0.9 * gain);
    glow(cx, Y(cy), 2, 1.3, L.wave(0), gain);
    // the ribbon unrolling to the right, carrying the wave
    for (let i = 0; i <= 520; i++) {
      const x = -0.5 + i * 0.026;
      const u = i / 190;
      const y = Math.sin(angle + u * 6.283) * 2.3;
      const c = L.wave(u);
      glow(x, Y(y), 2, 0.2, c, gain);
      if (i % 3 === 0) for (let j = 1; j < 9; j++) glow(x, Y((y * j) / 9), 2, 0.09, c, 0.22 * gain);
      if (i % 4 === 0) glow(x, Y(0), 2, 0.07, w, 0.5 * gain);
    }
    for (let i = 0; i < 40; i++) glow(cx + ((-0.5 - cx) * i) / 40, Y(cy), 2, 0.08, w, 0.5 * gain);
  };

  return (
    <AbsoluteFill style={{ backgroundColor: L.bg }}>
      <Stage3D
        width={width}
        height={height}
        bg={L.bg}
        fog={0.014}
        pose={{ pos: [6, 2.6, 21], target: [2.2, -0.4, 0], fov: 34, focus: 21, dof: 0.03 }}
        deep={[0.12, 0.08, 0.2]}
        orbs={(add) => {
          for (const side of [-1, 1]) for (let x = 0; x < 3; x++) for (let y = -2; y <= 2.01; y += 0.8) for (let z = -2.4; z <= 2.41; z += 0.8) add(-4 + side * (5 + x * 0.8), y, z, 0.8, rgb(side < 0 ? L.north : L.south), 1);
        }}
        glows={(add) => {
          // a floor of light running to the horizon
          const fl = rgb(L.floor);
          for (let x = -40; x <= 40; x += 2) for (let z = -60; z <= 14; z += 0.5) add(x, FLOOR, z, 0.07, fl, 0.5);
          for (let z = -60; z <= 14; z += 2) for (let x = -40; x <= 40; x += 0.5) add(x, FLOOR, z, 0.07, fl, 0.5);
          draw(add, -1, L.mirror);
          draw(add, 1, 1);
          for (const side of [-1, 1]) for (let y = -2; y <= 2.01; y += 0.8) for (let z = -2.4; z <= 2.41; z += 0.8) add(-4 + side * 5.8, 2 * FLOOR - y, z, 1.4, rgb(side < 0 ? L.north : L.south), L.mirror * 0.8);
        }}
      />
      <AbsoluteFill style={{ mixBlendMode: 'screen', background: L.haze }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)' }} />
      <AbsoluteFill style={{ fontFamily: sora, color: L.text, padding: '70px 110px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 5, textTransform: 'uppercase', color: L.accent }}>{L.name}</div>
            <div style={{ fontSize: 30, fontWeight: 300, opacity: 0.75, marginTop: 6 }}>{L.note}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.7 }}>Frequency</div>
            <div style={{ fontSize: 110, fontWeight: 300, letterSpacing: -3, lineHeight: 1, color: L.accent }}>
              50 <span style={{ fontSize: 44, opacity: 0.7 }}>Hz</span>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 110, bottom: 90 }}>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 5, textTransform: 'uppercase', color: L.accent }}>One turn of the loop</div>
          <div style={{ fontSize: 50, fontWeight: 300, marginTop: 10, textShadow: '0 2px 30px rgba(0,0,0,0.7)' }}>draws one complete wave: one cycle</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

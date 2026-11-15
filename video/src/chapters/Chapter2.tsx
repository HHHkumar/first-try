import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../public/voice/ch2.json';
import { lerp, lerp3, ramp, span } from '../anim';
import { Caption } from '../scenes/overlays';
import { C } from '../theme';
import { Panel, Readout } from '../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../ui/Shell';
import { Big, Center, Kicker } from '../ui/type';
import { meanVelocityX, simulate } from '../world/sim';
import { WireWorld, type CameraPose } from '../world/WireWorld';

// Chapter 2 - Inside the metal. The lattice, the electron gas, random motion,
// drift, and why the lamp still lights at once.
export const CH2_FRAMES = chapterFrames(voice.duration);
const LATTICE = { nx: 41, ny: 9, nz: 9 };
const FIELD_ON = T(47.6);

const POSES = {
  channel: { pos: [-15, 0.5, 0.5], target: [6, 0.2, 0.1], fov: 52, focus: 7, dof: 0.085, fog: 0.13, slab: 6 },
  side: { pos: [1.5, 6.4, 12.5], target: [0, -0.6, 0], fov: 34, focus: 13.2, dof: 0.2, fog: 0.045, slab: 1.5 },
  far: { pos: [0, 10, 46], target: [0, -0.5, 0], fov: 30, focus: 47, dof: 0.02, fog: 0.007, slab: 6 },
};
type PoseKey = keyof typeof POSES;
const blend = (a: PoseKey, b: PoseKey, t: number) => {
  const A = POSES[a];
  const B = POSES[b];
  return {
    pos: lerp3(A.pos, B.pos, t),
    target: lerp3(A.target, B.target, t),
    fov: lerp(A.fov, B.fov, t),
    focus: lerp(A.focus, B.focus, t),
    dof: lerp(A.dof, B.dof, t),
    fog: lerp(A.fog, B.fog, t),
    slab: lerp(A.slab, B.slab, t),
  };
};

const Battery = () => (
  <svg width="170" height="92" viewBox="0 0 170 92" fill="none">
    <rect x="3" y="14" width="146" height="64" rx="12" stroke={C.text} strokeOpacity="0.8" strokeWidth="3" />
    <rect x="151" y="32" width="14" height="28" rx="4" fill={C.text} fillOpacity="0.8" />
    <rect x="14" y="25" width="62" height="42" rx="5" fill={C.electron} fillOpacity="0.85" />
    <rect x="82" y="25" width="56" height="42" rx="5" fill={C.rho} fillOpacity="0.85" />
    <path d="M34 46 H56" stroke={C.bg0} strokeWidth="5" strokeLinecap="round" />
    <path d="M99 46 H121 M110 35 V57" stroke={C.bg0} strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const Chapter2 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const sim = useMemo(
    () =>
      simulate({
        seed: 7,
        count: 260,
        frames: CH2_FRAMES,
        substeps: 4,
        half: [20.5, 4.5, 4.5],
        thermalSpeed: 0.3,
        accel: (f) => 0.0062 * ramp(f, FIELD_ON, FIELD_ON + 50),
        tau: () => 11,
        // a gentle wander at first; the real frenzy is revealed at "not resting"
        speedScale: (f) => lerp(0.2, 1, ramp(f, T(27.6), T(29.6))),
      }),
    [],
  );

  // Where the centre of the whole crowd has got to since the field came on.
  const crowd = useMemo(() => {
    const out = new Float32Array(CH2_FRAMES + 1);
    for (let f = FIELD_ON; f <= CH2_FRAMES; f++) out[f] = out[f - 1] + meanVelocityX(sim, f);
    return out;
  }, [sim]);
  // Share of electrons heading right just now (averaged over a few frames).
  const rightShare = useMemo(() => {
    const { count, substeps, half } = sim.params;
    const raw = new Float32Array(CH2_FRAMES + 1);
    for (let f = 1; f <= CH2_FRAMES; f++) {
      const s = Math.min(sim.steps - 1, f * substeps);
      let right = 0;
      for (let i = 0; i < count; i++) {
        let d = sim.positions[(s * count + i) * 3] - sim.positions[((s - 1) * count + i) * 3];
        if (Math.abs(d) > half[0]) d = -d;
        if (d > 0) right++;
      }
      raw[f] = right / count;
    }
    return (f: number) => {
      let sum = 0;
      let n = 0;
      for (let k = -8; k <= 8; k++) {
        const g = f + k;
        if (g >= 1 && g <= CH2_FRAMES) {
          sum += raw[g];
          n++;
        }
      }
      return n ? sum / n : 0.5;
    };
  }, [sim]);

  // --- camera -------------------------------------------------------------
  const toSide = ramp(frame, T(4.6), T(8.6));
  const toFar = ramp(frame, T(68.8), T(72.6));
  const p = toFar > 0 ? blend('side', 'far', toFar) : blend('channel', 'side', toSide);
  const glide = frame * 0.004 * (1 - toFar);
  const pose: CameraPose = {
    pos: [p.pos[0] + glide, p.pos[1], p.pos[2]],
    target: [p.target[0] + glide, p.target[1], p.target[2]],
    fov: p.fov,
    focus: p.focus,
    dof: p.dof,
  };

  // --- the push, passed along at nearly light speed -----------------------
  const sweep = (start: number, end: number) => (frame >= start && frame <= end ? lerp(-24, 24, (frame - start) / (end - start)) : null);
  const pulseX = sweep(T(76.6), T(77.5)) ?? sweep(T(77.9), T(78.8)) ?? sweep(T(92.0), T(92.9));
  const pipe = span(frame, T(79.6), T(89.9), 16);
  const electrons = ramp(frame, T(10.3), T(12.4));
  const field = ramp(frame, FIELD_ON, FIELD_ON + 30);

  // --- pipe analogy -------------------------------------------------------
  const tapOpen = ramp(frame, T(83.0), T(83.5));
  const flowPx = Math.max(0, frame - T(83.2)) * 0.9; // the water only creeps
  const spacing = 46;

  const share = rightShare(frame);
  const crowdPx = Math.min(1, crowd[Math.min(frame, CH2_FRAMES)] / 60);

  return (
    <Shell
      voice="ch2"
      frames={CH2_FRAMES}
      world={
        pipe < 1 ? (
          <AbsoluteFill>
            <WireWorld
              frame={frame}
              width={width}
              height={height}
              lattice={LATTICE}
              sim={sim}
              pose={pose}
              look={{
                temperature: 0,
                electronGain: electrons * lerp(1, 1.5, toFar),
                ionGain: 1.1,
                fog: p.fog,
                slab: p.slab,
                pulse: pulseX === null ? undefined : { x: pulseX, width: 2.6, gain: 3.2 },
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      {/* field: a gentle push on every electron */}
      {field > 0 && toFar < 1 ? (
        <AbsoluteFill style={{ opacity: 0.2 * field * (1 - toFar) }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%">
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 9 }, (_, col) => {
                const x = ((col * 240 + frame * 5 + row * 60) % 2160) - 120;
                const y = 170 + row * 190;
                return <path key={`${row}-${col}`} d={`M ${x} ${y - 16} L ${x + 22} ${y} L ${x} ${y + 16}`} fill="none" stroke={C.field} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />;
              }),
            )}
          </svg>
        </AbsoluteFill>
      ) : null}

      <Panel opacity={span(frame, T(1.3), T(4.4))} style={{ right: 110, top: 86 }}>
        <Readout label="Magnification" value={`× ${Math.round(Math.pow(10, 8 * ramp(frame, T(1.4), T(3.4), Easing.out(Easing.quad)))).toLocaleString('en-US')}`} />
      </Panel>
      <Caption opacity={span(frame, T(4.8), T(9.1))} kicker="Copper" title="A lattice: atoms in a neat, repeating grid" />
      <Caption opacity={span(frame, T(9.5), T(12.8))} kicker="Each atom" title="lets go of one outer electron" />
      <Caption opacity={span(frame, T(13.1), T(19.4))} kicker="Free electrons" title="They wander through the whole metal, like a gas" />

      <Panel opacity={span(frame, T(19.9), T(27.3))} style={{ right: 110, top: 86, textAlign: 'right' }}>
        <Kicker>Free electrons in a 1 mm speck of copper</Kicker>
        <div style={{ fontSize: 78, fontWeight: 300, letterSpacing: -1, marginTop: 12, fontVariantNumeric: 'tabular-nums' }}>
          85{',000'.repeat(Math.round(6 * ramp(frame, T(22.4), T(24.6), Easing.linear)))}
        </div>
        <div style={{ fontSize: 34, fontWeight: 300, color: C.dim, opacity: ramp(frame, T(24.4), T(25.0)) }}>eighty-five billion billion</div>
      </Panel>

      <Panel opacity={span(frame, T(28.3), T(36.1))} style={{ right: 110, top: 86 }}>
        <Readout label="Speed of every electron" value={Math.round(1600 * ramp(frame, T(31.4), T(34.4), Easing.out(Easing.cubic))).toLocaleString('en-US')} unit="km / s" />
      </Panel>
      <Caption opacity={span(frame, T(28.3), T(36.1))} kicker="No battery connected" title="And still they never rest" />

      {/* left against right */}
      <Panel opacity={span(frame, T(36.4), T(46.4))} style={{ left: 260, right: 260, bottom: 96 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 34, fontWeight: 300, marginBottom: 16 }}>
          <span>◀ heading left</span>
          <span style={{ opacity: ramp(frame, T(43.4), T(44.0)), color: C.electron }}>net flow: zero</span>
          <span>heading right ▶</span>
        </div>
        <div style={{ position: 'relative', height: 14, borderRadius: 7, background: C.field, overflow: 'hidden', opacity: 0.9 }}>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: `${share * 100}%`, background: C.electron }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 3, marginLeft: -1.5, background: C.bg0 }} />
        </div>
      </Panel>
      <Center opacity={span(frame, T(45.3), T(46.9), 8)}>
        <Big size={130}>No current</Big>
      </Center>

      {/* battery and field */}
      <Panel opacity={span(frame, T(46.9), T(55.2))} style={{ left: 110, bottom: 96, display: 'flex', alignItems: 'center', gap: 36 }}>
        <Battery />
        <div>
          <Kicker color={C.field}>Electric field along the wire</Kicker>
          <div style={{ fontSize: 46, fontWeight: 300, marginTop: 10 }}>A gentle push on every electron</div>
        </div>
      </Panel>

      {/* the lean of the whole crowd */}
      <Panel opacity={span(frame, T(57.4), T(68.4))} style={{ left: 260, right: 260, bottom: 96 }}>
        <Kicker style={{ marginBottom: 40 }}>Centre of the whole crowd</Kicker>
        <div style={{ position: 'relative', height: 2, background: 'rgba(147,163,192,0.4)' }}>
          <div style={{ position: 'absolute', left: '50%', top: -14, width: 2, height: 28, background: 'rgba(147,163,192,0.7)' }} />
          <div style={{ position: 'absolute', left: '50%', top: -1, height: 4, width: `${crowdPx * 46}%`, background: C.electron, boxShadow: `0 0 18px ${C.electron}` }} />
          <div style={{ position: 'absolute', left: `${50 + crowdPx * 46}%`, top: -11, marginLeft: -11, width: 22, height: 22, borderRadius: 11, background: C.electronCore, boxShadow: `0 0 26px 8px ${C.electron}` }} />
          <div style={{ position: 'absolute', left: '50%', top: 22, transform: 'translateX(-50%)', fontSize: 21, color: C.dim }}>where it began</div>
        </div>
      </Panel>
      <Panel opacity={span(frame, T(63.6), T(68.4))} style={{ right: 110, top: 86, textAlign: 'right' }}>
        <Kicker>That slow lean</Kicker>
        <div style={{ fontSize: 120, fontWeight: 300, letterSpacing: -3, opacity: ramp(frame, T(65.4), T(65.9)) }}>Drift</div>
        <div style={{ fontSize: 40, fontWeight: 300, color: C.dim, opacity: ramp(frame, T(66.6), T(67.2)) }}>and drift is the current</div>
      </Panel>

      {/* the push */}
      <Caption opacity={span(frame, T(70.8), T(75.0))} kicker="The paradox, solved" title="The wire is already full, from end to end" />
      <Panel opacity={span(frame, T(75.1), T(79.6))} style={{ left: 110, bottom: 96 }}>
        <Kicker color={C.rho}>Push at one end</Kicker>
        <div style={{ fontSize: 46, fontWeight: 300, marginTop: 10 }}>The push travels at close to the speed of light</div>
      </Panel>

      {/* a pipe already full of water */}
      <Scene opacity={pipe}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs>
            <clipPath id="pipeClip">
              <rect x={300} y={470} width={1320} height={140} rx={20} />
            </clipPath>
          </defs>
          <rect x={300} y={470} width={1320} height={140} rx={20} fill="rgba(111,227,255,0.07)" stroke="#5b6c91" strokeWidth={3} />
          <g clipPath="url(#pipeClip)">
            {Array.from({ length: 34 }, (_, col) =>
              Array.from({ length: 3 }, (_, row) => {
                const x = 300 - spacing * 3 + ((((col * spacing + flowPx) % (34 * spacing)) + 34 * spacing) % (34 * spacing));
                return <circle key={`${col}-${row}`} cx={x + (row % 2) * 23} cy={500 + row * 40} r={18} fill="#2b6cff" fillOpacity={0.5} stroke="#7fb6ff" strokeOpacity={0.55} strokeWidth={2} />;
              }),
            )}
            {/* the water that has just come in */}
            <circle cx={300 + 20 + flowPx} cy={540} r={20} fill={C.rho} opacity={tapOpen} />
          </g>
          {/* tap */}
          <rect x={236} y={440} width={64} height={200} rx={14} fill="#18233c" stroke="#33466e" strokeWidth={3} />
          <g transform={`rotate(${tapOpen * 90} 268 412)`}>
            <rect x={228} y={404} width={80} height={16} rx={8} fill={C.rho} />
          </g>
          <rect x={262} y={412} width={12} height={34} fill="#5b6c91" />
          {/* water leaving the far end at once */}
          {Array.from({ length: 7 }, (_, i) => {
            const t = (Math.max(0, frame - T(83.35)) * 0.045 + i / 7) % 1;
            const live = frame > T(83.35) + (i / 7) * 22 ? 1 : 0;
            return <ellipse key={i} cx={1650 + t * 60} cy={560 + t * t * 330} rx={11} ry={15} fill="#4d8dff" opacity={live * (1 - t) * 0.9} />;
          })}
          <g opacity={ramp(frame, T(86.6), T(87.3)) * (1 - ramp(frame, T(89.3), T(89.9)))}>
            <line x1={320 + flowPx} y1={585} x2={320 + flowPx} y2={690} stroke={C.rho} strokeWidth={2} />
            <text x={320 + flowPx} y={732} fill={C.rho} fontSize={34} fontFamily="Sora">
              the water that just entered
            </text>
          </g>
          <g opacity={ramp(frame, T(84.0), T(84.6)) * (1 - ramp(frame, T(89.3), T(89.9)))}>
            <text x={1620} y={420} fill={C.electron} fontSize={34} fontFamily="Sora" textAnchor="end">
              water leaves the far end at once
            </text>
          </g>
        </svg>
        <Caption opacity={span(frame, T(80.0), T(89.7))} kicker="Think of a pipe" title="that is already full of water" />
      </Scene>

      <Center opacity={ramp(frame, T(90.3), T(90.9))} style={{ justifyContent: 'flex-start', paddingTop: 110 }}>
        <Big size={104}>The electrons crawl.</Big>
        <Big size={104} style={{ color: C.electron, opacity: ramp(frame, T(91.8), T(92.3)), marginTop: 10 }}>
          The message flies.
        </Big>
      </Center>
    </Shell>
  );
};

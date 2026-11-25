import { useMemo } from 'react';
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../public/voice/ch1.json';
import { lerp, lerp3, makeCues, ramp, span, type Word } from '../anim';
import { sora, stix } from '../fonts';
import { Caption, Vignette } from '../scenes/overlays';
import { C, FPS } from '../theme';
import { Panel, Readout, Snail, kicker } from '../ui/hud';
import { CABLE_POINT, LAMP, Room } from '../ui/Room';
import { simulate } from '../world/sim';
import { WireWorld, type CameraPose } from '../world/WireWorld';

// Chapter 1 - The paradox. The lamp lights at once, yet the electrons crawl.
const LEAD = 36; // frames of picture before the voice starts
const TAIL = 54;
export const CH1_FRAMES = LEAD + Math.ceil(voice.duration * FPS) + TAIL;
const LATTICE = { nx: 41, ny: 9, nz: 9 };

// Real numbers for 1 A in a 1 mm^2 copper wire: v = I / (n A e).
const DRIFT_MM_S = 1 / (8.5e28 * 1e-6 * 1.602e-19) * 1000; // about 0.073 mm/s
const SECONDS_PER_METRE = 1000 / DRIFT_MM_S; // about 3 h 47 min

export const Chapter1 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const at = useMemo(() => makeCues(voice.words as Word[], LEAD), []);

  // Here the electrons are shown as the textbook imagines them: a slow, steady
  // creep. Chapter 2 reveals the frantic motion hidden underneath.
  const sim = useMemo(
    () =>
      simulate({
        seed: 21,
        count: 230,
        frames: CH1_FRAMES,
        substeps: 2,
        half: [20.5, 4.5, 4.5],
        thermalSpeed: 0.016,
        accel: () => 0.00045,
        tau: () => 16,
      }),
    [],
  );

  // --- the room -----------------------------------------------------------
  const switchOn = at('switch', 1, 0.2);
  const on = interpolate(frame, [switchOn, switchOn + 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const roomIn = ramp(frame, 0, 24);
  const race = span(frame, at('electrons'), at('Right?', 1, 0.7), 10);
  const diveStart = at("Let's");
  const diveEnd = at('Here', 1, 0.3);
  const dive = ramp(frame, diveStart, diveEnd, Easing.in(Easing.cubic));
  const roomScale = Math.exp(dive * Math.log(70));
  const roomOpacity = roomIn * (1 - ramp(frame, lerp(diveStart, diveEnd, 0.55), diveEnd));

  // --- inside the wire ----------------------------------------------------
  const wireStart = Math.round(lerp(diveStart, diveEnd, 0.5));
  const arrive = ramp(frame, wireStart, at('barely'), Easing.out(Easing.cubic));
  const wireOpacity = ramp(frame, wireStart, diveEnd);
  const titleAt = at('resistance.');
  const title = ramp(frame, titleAt - 4, titleAt + 26, Easing.out(Easing.cubic));
  const wonder = span(frame, at('holding'), titleAt, 20); // "what is holding them back?"
  const drift = frame * 0.004;
  const pose: CameraPose = {
    pos: lerp3([1.5, 15, 34], [1.5 + drift, 6.4, 12.5], arrive),
    target: [drift, -0.6, 0],
    fov: 34,
    focus: lerp(36, 13.2, arrive),
    dof: lerp(0.03, 0.2, arrive),
  };

  // --- overlays -----------------------------------------------------------
  const speedIn = at('drift');
  const speedCount = ramp(frame, at('less'), at('second.', 1, 0.2), Easing.out(Easing.quad));
  const hudOut = at('So', 2, -0.3);
  const snailIn = at('snail', 1, -0.3);
  const snailOut = at('To', 1, -0.1);
  const raceT = ramp(frame, snailIn + 8, snailOut - 6, Easing.linear);
  const metreIn = at('To');
  const metreT = ramp(frame, metreIn + 12, at('hours.', 1, 0.35), Easing.inOut(Easing.quad));
  const elapsed = metreT * SECONDS_PER_METRE;
  const lampInset = span(frame, at('how', 1, -0.2), at('And', 4, 0.3), 14);
  const fadeOut = 1 - ramp(frame, CH1_FRAMES - 24, CH1_FRAMES - 2);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      {frame >= wireStart ? (
        <AbsoluteFill style={{ opacity: wireOpacity * lerp(1, 0.38, title) }}>
          <WireWorld
            frame={frame}
            width={width}
            height={height}
            lattice={LATTICE}
            sim={sim}
            pose={pose}
            look={{ temperature: 0, electronGain: 1.15, ionGain: 1.05 + 0.5 * wonder, fog: lerp(0.014, 0.045, arrive), slab: lerp(6, 1.5, arrive) }}
          />
        </AbsoluteFill>
      ) : null}

      {roomOpacity > 0 ? (
        <AbsoluteFill
          style={{
            opacity: roomOpacity,
            transform: `scale(${roomScale})`,
            transformOrigin: `${CABLE_POINT.x}px ${CABLE_POINT.y}px`,
            filter: dive > 0.02 ? `blur(${dive * 5}px)` : undefined,
          }}
        >
          <Room frame={frame} on={on} race={race} />
        </AbsoluteFill>
      ) : null}

      <Vignette />

      <Caption opacity={span(frame, at('In'), speedIn - 4)} kicker="The wire" title="1 ampere through 1 mm² of copper" />

      {/* drift speed */}
      <Panel opacity={span(frame, speedIn, hudOut)} style={{ right: 110, top: 86, textAlign: 'right' }}>
        <div style={{ display: 'inline-block', textAlign: 'left' }}>
          <Readout label="Drift speed" value={(DRIFT_MM_S * speedCount).toFixed(2)} unit="mm / s" />
        </div>
      </Panel>

      {/* snail against electron, on a ruler */}
      <Panel opacity={span(frame, snailIn, snailOut)} style={{ left: 110, right: 110, bottom: 96 }}>
        <div style={{ ...kicker, marginBottom: 22 }}>One second later</div>
        {[
          { label: 'Garden snail', speed: 'about 1 mm / s', color: C.rho, x: raceT, icon: <Snail size={58} /> },
          { label: 'Electron', speed: '0.07 mm / s', color: C.electron, x: raceT * DRIFT_MM_S, icon: null },
        ].map((lane) => (
          <div key={lane.label} style={{ display: 'flex', alignItems: 'center', gap: 28, height: 84 }}>
            <div style={{ width: 440, fontSize: 28, fontWeight: 300, whiteSpace: 'nowrap' }}>
              {lane.label} <span style={{ color: C.dim, fontSize: 21 }}>{lane.speed}</span>
            </div>
            <div style={{ position: 'relative', flex: 1, height: 2, background: 'rgba(147,163,192,0.35)' }}>
              <div style={{ position: 'absolute', left: 0, top: -1, height: 4, width: `${lane.x * 92}%`, background: lane.color, boxShadow: `0 0 18px ${lane.color}` }} />
              <div style={{ position: 'absolute', left: `${lane.x * 92}%`, top: lane.icon ? -56 : -8, transform: 'translateX(-30%)' }}>
                {lane.icon ?? <div style={{ width: 16, height: 16, borderRadius: 8, background: C.electronCore, boxShadow: `0 0 22px 6px ${C.electron}` }} />}
              </div>
            </div>
          </div>
        ))}
      </Panel>

      {/* one metre of wire, and the clock */}
      <Panel opacity={span(frame, metreIn, hudOut)} style={{ left: 110, right: 110, bottom: 96 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 70 }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...kicker, marginBottom: 46 }}>One metre of wire</div>
            <div style={{ position: 'relative', height: 2, background: 'rgba(147,163,192,0.4)' }}>
              {Array.from({ length: 11 }, (_, i) => (
                <div key={i} style={{ position: 'absolute', left: `${i * 10}%`, top: -(i % 5 === 0 ? 16 : 9), width: 2, height: i % 5 === 0 ? 16 : 9, background: 'rgba(147,163,192,0.6)' }} />
              ))}
              <div style={{ position: 'absolute', left: 0, top: -1, height: 4, width: `${metreT * 100}%`, background: C.electron, boxShadow: `0 0 18px ${C.electron}` }} />
              <div style={{ position: 'absolute', left: `${metreT * 100}%`, top: -8, marginLeft: -8, width: 16, height: 16, borderRadius: 8, background: C.electronCore, boxShadow: `0 0 22px 6px ${C.electron}` }} />
              <div style={{ position: 'absolute', left: 0, top: 18, fontSize: 21, color: C.dim }}>0</div>
              <div style={{ position: 'absolute', right: 0, top: 18, fontSize: 21, color: C.dim }}>1 m</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginBottom: -34 }}>
            <svg width="118" height="118" viewBox="-60 -60 120 120">
              <circle r="54" fill="none" stroke="rgba(147,163,192,0.5)" strokeWidth="2" />
              {Array.from({ length: 12 }, (_, i) => (
                <line key={i} x1="0" y1="-54" x2="0" y2={i % 3 === 0 ? -43 : -48} stroke="rgba(147,163,192,0.7)" strokeWidth="2" transform={`rotate(${i * 30})`} />
              ))}
              <line x1="0" y1="4" x2="0" y2="-28" stroke={C.text} strokeWidth="4" strokeLinecap="round" transform={`rotate(${(elapsed / 43200) * 360})`} />
              <line x1="0" y1="6" x2="0" y2="-44" stroke={C.electron} strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${(elapsed / 3600) * 360})`} />
              <circle r="4" fill={C.text} />
            </svg>
            <div style={{ fontSize: 84, fontWeight: 300, letterSpacing: -2, fontVariantNumeric: 'tabular-nums', minWidth: 400 }}>
              {Math.floor(elapsed / 3600)}
              <span style={{ fontSize: 36, color: C.dim }}> h </span>
              {String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')}
              <span style={{ fontSize: 36, color: C.dim }}> min</span>
            </div>
          </div>
        </div>
      </Panel>

      {/* the lamp, still lit, while the electrons crawl */}
      <Panel opacity={lampInset} style={{ left: 110, top: 86, display: 'flex', alignItems: 'center', gap: 30 }}>
        <div style={{ width: 230, height: 230, borderRadius: 115, overflow: 'hidden', position: 'relative', border: '2px solid rgba(147,163,192,0.4)' }}>
          <div style={{ position: 'absolute', width: 1920, height: 1080, transform: 'scale(0.5)', transformOrigin: '0 0', left: -LAMP.x * 0.5 + 115, top: -(LAMP.y + 20) * 0.5 + 115 }}>
            <Room frame={frame} on={1} race={0} />
          </div>
        </div>
        <div>
          <div style={kicker}>Meanwhile</div>
          <div style={{ fontSize: 44, fontWeight: 300, marginTop: 10 }}>The lamp lit instantly</div>
        </div>
      </Panel>

      {/* the word that answers both questions */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: title * fadeOut }}>
        <div
          style={{
            fontFamily: sora,
            fontWeight: 300,
            fontSize: 190,
            letterSpacing: lerp(26, -4, title),
            color: C.text,
            textShadow: `0 0 80px ${C.electron}55`,
          }}
        >
          Resistance
        </div>
        <div
          style={{
            fontFamily: stix,
            fontStyle: 'italic',
            fontSize: 50,
            color: C.dim,
            marginTop: 26,
            opacity: ramp(frame, at('see'), at('see', 1, 0.8)),
          }}
        >
          see it, don’t just calculate it
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: C.bg0, opacity: 1 - fadeOut }} />

      <Sequence from={LEAD}>
        <Audio src={staticFile('voice/ch1.mp3')} />
      </Sequence>
    </AbsoluteFill>
  );
};

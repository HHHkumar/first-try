import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/capacitance/ch3.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Frac, Kicker, Meter, Sub, Sym } from '../../ui/type';
import { NEG } from '../../world/field';
import { Stage3D } from '../../world/Stage3D';
import { at, Cap, drawPlates, Ink, PLATES, Timeline, VOICE } from './kit';

// Chapter 3 - Capacitance. Charge per volt; the bucket; the farad.
export const CAPAC3_FRAMES = chapterFrames(voice.duration);
const SIZES = [
  { unit: 'microfarad', sym: 'µF', pow: '10⁻⁶ F', use: 'smoothing a power supply', t: 45.2 },
  { unit: 'nanofarad', sym: 'nF', pow: '10⁻⁹ F', use: 'timing and filters', t: 47.4 },
  { unit: 'picofarad', sym: 'pF', pow: '10⁻¹² F', use: 'tuning a radio', t: 48.6 },
];

export const Capac3 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const world = 1 - ramp(frame, T(13.8), T(14.5));
  const formula = span(frame, T(13.9), T(21.0), 12);
  const bucket = span(frame, T(20.8), T(34.6), 12);
  const farad = ramp(frame, T(34.4), T(35.0));
  const double = ramp(frame, T(5.4), T(7.0));
  const volts = 6 * (1 + double);
  const fill = ramp(frame, T(22.8), T(27.0));
  const level = 760 - 330 * fill;

  return (
    <Shell
      voice={VOICE(3)}
      frames={CAPAC3_FRAMES}
      world={
        world > 0 ? (
          <AbsoluteFill style={{ opacity: world }}>
            <Stage3D
              width={width}
              height={height}
              pose={{ ...PLATES, pos: [PLATES.pos[0] + Math.sin(frame * 0.004), PLATES.pos[1], PLATES.pos[2]] }}
              fog={0.012}
              orbs={(add) => drawPlates(add, null, frame, {})}
              glows={(add) => drawPlates(null, add, frame, { charge: 0.5 + 0.5 * double, lineGain: 0.6 + 0.6 * double })}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Panel opacity={span(frame, T(1.4), T(13.8))} style={{ right: 110, top: 80, display: 'flex', gap: 56 }}>
        <Meter label="Voltage" value={volts.toFixed(1)} unit="V" color={C.rho} size={80} />
        <Meter label="Charge" value={(volts * 1.0).toFixed(1)} unit="µC" color={C.electron} size={80} />
        <div style={{ opacity: at(frame, 8.6) }}>
          <Meter label="Charge ÷ voltage" value="1.0" unit="µC per volt" size={80} />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(5.2))} kicker="How much charge do two plates hold?" title="That depends on the voltage" />
      <Cap opacity={span(frame, T(5.5), T(13.8))} kicker="Double the voltage, double the charge" title="The ratio between them never changes" />

      <Scene opacity={Math.max(formula, bucket, farad)}>
        <Center opacity={formula}>
          <Kicker style={{ marginBottom: 30 }}>The charge stored for each volt</Kicker>
          <div style={{ fontSize: 250, display: 'flex', alignItems: 'center', gap: 50 }}>
            <Sym show={at(frame, 18.0, 0.4)}>C</Sym>
            <Sym color={C.dim} show={at(frame, 18.6, 0.4)} style={{ fontStyle: 'normal' }}>
              =
            </Sym>
            <Frac width={200} show={at(frame, 19.1, 0.4)} top={<Sym color={C.electron}>Q</Sym>} bottom={<Sym color={C.rho} show={at(frame, 19.9, 0.4)}>V</Sym>} />
          </div>
          <Big size={70} style={{ marginTop: 40, opacity: at(frame, 14.2) }}>
            Capacitance
          </Big>
        </Center>

        {/* two buckets, the same depth of water */}
        <AbsoluteFill style={{ opacity: bucket }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <defs>
              <clipPath id="narrow">
                <rect x={420} y={330} width={140} height={430} />
              </clipPath>
              <clipPath id="wide">
                <rect x={860} y={330} width={620} height={430} />
              </clipPath>
            </defs>
            <rect x={420} y={level} width={140} height={760 - level} fill={NEG} opacity={0.45} clipPath="url(#narrow)" />
            <rect x={860} y={level} width={620} height={760 - level} fill={NEG} opacity={0.45} clipPath="url(#wide)" />
            <line x1={330} y1={level} x2={1570} y2={level} stroke={C.rho} strokeWidth={2} strokeDasharray="10 8" opacity={at(frame, 23.0)} />
          </svg>
          <Ink>
            <path d="M 420 300 V 760 H 560 V 300" />
            <path d="M 860 300 V 760 H 1480 V 300" />
          </Ink>
          <Panel opacity={at(frame, 22.6)} style={{ left: 110, top: 430, width: 280, textAlign: 'right', color: C.rho }}>
            <div style={{ fontSize: 40, fontWeight: 300 }}>depth</div>
            <div style={{ fontSize: 30, color: C.dim }}>the voltage</div>
          </Panel>
          <Panel opacity={at(frame, 25.0)} style={{ left: 1520, top: 560, width: 320, color: C.electron }}>
            <div style={{ fontSize: 40, fontWeight: 300 }}>amount of water</div>
            <div style={{ fontSize: 30, color: C.dim }}>the charge</div>
          </Panel>
          <Panel opacity={at(frame, 32.0)} style={{ left: 860, top: 790, width: 620, textAlign: 'center' }}>
            <div style={{ fontSize: 46, fontWeight: 300 }}>width of the bucket</div>
            <div style={{ fontSize: 32, color: C.dim }}>the capacitance</div>
          </Panel>
          <Panel opacity={1} style={{ left: 110, top: 80 }}>
            <Kicker>Think of a bucket</Kicker>
            <div style={{ fontSize: 60, fontWeight: 300, letterSpacing: -1, marginTop: 10 }}>The same depth, very different amounts</div>
          </Panel>
        </AbsoluteFill>

        {/* the farad */}
        <AbsoluteFill style={{ opacity: farad }}>
          <Panel opacity={1} style={{ left: 110, top: 130, width: 800 }}>
            <Kicker>The unit of capacitance</Kicker>
            <div style={{ fontSize: 170, fontWeight: 300, letterSpacing: -4, lineHeight: 1.05 }}>1 farad</div>
            <Sub style={{ textAlign: 'left', marginTop: 10, opacity: at(frame, 38.4) }}>one coulomb for each volt</Sub>
            <Sub style={{ textAlign: 'left', marginTop: 10, color: C.electron, opacity: at(frame, 36.4) }}>named after Michael Faraday</Sub>
            <Big size={64} style={{ textAlign: 'left', marginTop: 50, color: C.rho, opacity: at(frame, 41.0) }}>
              and it is enormous
            </Big>
          </Panel>
          <div style={{ position: 'absolute', left: 1020, top: 250, width: 800 }}>
            {SIZES.map((s) => (
              <div key={s.sym} style={{ display: 'flex', alignItems: 'baseline', gap: 30, marginBottom: 54, opacity: at(frame, s.t - 1.2), fontFamily: 'Sora', color: C.text }}>
                <div style={{ width: 170, fontSize: 96, fontWeight: 300, color: C.electron }}>{s.sym}</div>
                <div>
                  <div style={{ fontSize: 44, fontWeight: 300 }}>
                    {s.unit} <span style={{ color: C.dim, fontSize: 34 }}>{s.pow}</span>
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 300, color: C.dim }}>{s.use}</div>
                </div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Scene>
      <Timeline frame={frame} already={[0, 1, 2]} events={[[7, 36.4]]} />
    </Shell>
  );
};

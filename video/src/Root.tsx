import { Composition } from 'remotion';
import { Chapter1, CH1_FRAMES } from './chapters/Chapter1';
import { Chapter2, CH2_FRAMES } from './chapters/Chapter2';
import { Chapter3, CH3_FRAMES } from './chapters/Chapter3';
import { Chapter4, CH4_FRAMES } from './chapters/Chapter4';
import { Chapter5, CH5_FRAMES } from './chapters/Chapter5';
import { Chapter6, CH6_FRAMES } from './chapters/Chapter6';
import { Chapter7, CH7_FRAMES } from './chapters/Chapter7';
import { Chapter8, CH8_FRAMES } from './chapters/Chapter8';
import { Thumbnail } from './chapters/Thumbnail';
import { StyleA } from './styles/StyleA';
import { StyleB } from './styles/StyleB';
import { StyleC } from './styles/StyleC';
import { Charge1, CHARGE1_FRAMES } from './films/charge/Charge1';
import { Charge2, CHARGE2_FRAMES } from './films/charge/Charge2';
import { Charge3, CHARGE3_FRAMES } from './films/charge/Charge3';
import { Charge4, CHARGE4_FRAMES } from './films/charge/Charge4';
import { Charge5, CHARGE5_FRAMES } from './films/charge/Charge5';
import { Charge6, CHARGE6_FRAMES } from './films/charge/Charge6';
import { Charge7, CHARGE7_FRAMES } from './films/charge/Charge7';
import { Charge8, CHARGE8_FRAMES } from './films/charge/Charge8';
import { Charge9, CHARGE9_FRAMES } from './films/charge/Charge9';
import { FPS, H, W } from './theme';

// Film 2: The Invisible Push (charge and the electric field).
const charge = [
  { id: 'Charge1', component: Charge1, frames: CHARGE1_FRAMES },
  { id: 'Charge2', component: Charge2, frames: CHARGE2_FRAMES },
  { id: 'Charge3', component: Charge3, frames: CHARGE3_FRAMES },
  { id: 'Charge4', component: Charge4, frames: CHARGE4_FRAMES },
  { id: 'Charge5', component: Charge5, frames: CHARGE5_FRAMES },
  { id: 'Charge6', component: Charge6, frames: CHARGE6_FRAMES },
  { id: 'Charge7', component: Charge7, frames: CHARGE7_FRAMES },
  { id: 'Charge8', component: Charge8, frames: CHARGE8_FRAMES },
  { id: 'Charge9', component: Charge9, frames: CHARGE9_FRAMES },
];

// Each chapter renders on its own; scripts/assemble.mjs joins them.
const chapters = [
  { id: 'Chapter1', component: Chapter1, frames: CH1_FRAMES },
  { id: 'Chapter2', component: Chapter2, frames: CH2_FRAMES },
  { id: 'Chapter3', component: Chapter3, frames: CH3_FRAMES },
  { id: 'Chapter4', component: Chapter4, frames: CH4_FRAMES },
  { id: 'Chapter5', component: Chapter5, frames: CH5_FRAMES },
  { id: 'Chapter6', component: Chapter6, frames: CH6_FRAMES },
  { id: 'Chapter7', component: Chapter7, frames: CH7_FRAMES },
  { id: 'Chapter8', component: Chapter8, frames: CH8_FRAMES },
];

export const Root = () => (
  <>
    {[...chapters, ...charge].map((c) => (
      <Composition key={c.id} id={c.id} component={c.component} durationInFrames={c.frames} fps={FPS} width={W} height={H} />
    ))}
    {/* style options for the rest of the series */}
    <Composition id="StyleA" component={StyleA} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="StyleB" component={StyleB} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="StyleC" component={StyleC} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={FPS} width={W} height={H} />
  </>
);

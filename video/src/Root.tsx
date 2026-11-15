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
import { FPS, H, W } from './theme';

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
    {chapters.map((c) => (
      <Composition key={c.id} id={c.id} component={c.component} durationInFrames={c.frames} fps={FPS} width={W} height={H} />
    ))}
    <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={FPS} width={W} height={H} />
  </>
);

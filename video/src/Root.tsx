import { Composition } from 'remotion';
import { FPS, H, W } from './theme';
import { Chapter1, CH1_FRAMES } from './chapters/Chapter1';
import { Chapter2, CH2_FRAMES } from './chapters/Chapter2';
import { Chapter3, CH3_FRAMES } from './chapters/Chapter3';
import { Chapter4, CH4_FRAMES } from './chapters/Chapter4';
import { Chapter5, CH5_FRAMES } from './chapters/Chapter5';
import { Chapter6, CH6_FRAMES } from './chapters/Chapter6';
import { Chapter7, CH7_FRAMES } from './chapters/Chapter7';
import { Chapter8, CH8_FRAMES } from './chapters/Chapter8';
import { FormulaCard, FORMULA_FRAMES } from './scenes/FormulaCard';
import { Opening, OPENING_FRAMES } from './scenes/Opening';
import { StyleTest, STYLE_TEST_FRAMES } from './scenes/StyleTest';

// Style-approval compositions. The chapter compositions replace these once the
// look is agreed.
export const Root = () => (
  <>
    <Composition id="Chapter1" component={Chapter1} durationInFrames={CH1_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Chapter2" component={Chapter2} durationInFrames={CH2_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Chapter3" component={Chapter3} durationInFrames={CH3_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Chapter4" component={Chapter4} durationInFrames={CH4_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Chapter5" component={Chapter5} durationInFrames={CH5_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Chapter6" component={Chapter6} durationInFrames={CH6_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Chapter7" component={Chapter7} durationInFrames={CH7_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Chapter8" component={Chapter8} durationInFrames={CH8_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="StyleTest" component={StyleTest} durationInFrames={STYLE_TEST_FRAMES} fps={FPS} width={W} height={H} defaultProps={{ hot: false }} />
    <Composition id="StyleHot" component={StyleTest} durationInFrames={STYLE_TEST_FRAMES} fps={FPS} width={W} height={H} defaultProps={{ hot: true }} />
    <Composition id="FormulaCard" component={FormulaCard} durationInFrames={FORMULA_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Opening" component={Opening} durationInFrames={OPENING_FRAMES} fps={FPS} width={W} height={H} />
  </>
);

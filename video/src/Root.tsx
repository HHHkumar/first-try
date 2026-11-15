import { Composition } from 'remotion';
import { FPS, H, W } from './theme';
import { Chapter1, CH1_FRAMES } from './chapters/Chapter1';
import { Chapter2, CH2_FRAMES } from './chapters/Chapter2';
import { FormulaCard, FORMULA_FRAMES } from './scenes/FormulaCard';
import { Opening, OPENING_FRAMES } from './scenes/Opening';
import { StyleTest, STYLE_TEST_FRAMES } from './scenes/StyleTest';

// Style-approval compositions. The chapter compositions replace these once the
// look is agreed.
export const Root = () => (
  <>
    <Composition id="Chapter1" component={Chapter1} durationInFrames={CH1_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Chapter2" component={Chapter2} durationInFrames={CH2_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="StyleTest" component={StyleTest} durationInFrames={STYLE_TEST_FRAMES} fps={FPS} width={W} height={H} defaultProps={{ hot: false }} />
    <Composition id="StyleHot" component={StyleTest} durationInFrames={STYLE_TEST_FRAMES} fps={FPS} width={W} height={H} defaultProps={{ hot: true }} />
    <Composition id="FormulaCard" component={FormulaCard} durationInFrames={FORMULA_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Opening" component={Opening} durationInFrames={OPENING_FRAMES} fps={FPS} width={W} height={H} />
  </>
);

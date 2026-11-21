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
import { ChargeThumb } from './films/charge/ChargeThumb';
import { Capac1, CAPAC1_FRAMES } from './films/capacitance/Capac1';
import { Capac2, CAPAC2_FRAMES } from './films/capacitance/Capac2';
import { Capac3, CAPAC3_FRAMES } from './films/capacitance/Capac3';
import { Capac4, CAPAC4_FRAMES } from './films/capacitance/Capac4';
import { Capac5, CAPAC5_FRAMES } from './films/capacitance/Capac5';
import { Capac6, CAPAC6_FRAMES } from './films/capacitance/Capac6';
import { Capac7, CAPAC7_FRAMES } from './films/capacitance/Capac7';
import { Capac8, CAPAC8_FRAMES } from './films/capacitance/Capac8';
import { Capac9, CAPAC9_FRAMES } from './films/capacitance/Capac9';
import { CapacThumb } from './films/capacitance/CapacThumb';
import { Mag1, MAG1_FRAMES } from './films/magnetism/Mag1';
import { Mag2, MAG2_FRAMES } from './films/magnetism/Mag2';
import { Mag3, MAG3_FRAMES } from './films/magnetism/Mag3';
import { Mag4, MAG4_FRAMES } from './films/magnetism/Mag4';
import { Mag5, MAG5_FRAMES } from './films/magnetism/Mag5';
import { Mag6, MAG6_FRAMES } from './films/magnetism/Mag6';
import { Mag7, MAG7_FRAMES } from './films/magnetism/Mag7';
import { Mag8, MAG8_FRAMES } from './films/magnetism/Mag8';
import { Mag9, MAG9_FRAMES } from './films/magnetism/Mag9';
import { Mag10, MAG10_FRAMES } from './films/magnetism/Mag10';
import { Ind1, IND1_FRAMES } from './films/inductance/Ind1';
import { Ind2, IND2_FRAMES } from './films/inductance/Ind2';
import { Ind3, IND3_FRAMES } from './films/inductance/Ind3';
import { Ind4, IND4_FRAMES } from './films/inductance/Ind4';
import { Ind5, IND5_FRAMES } from './films/inductance/Ind5';
import { Ind6, IND6_FRAMES } from './films/inductance/Ind6';
import { Ind7, IND7_FRAMES } from './films/inductance/Ind7';
import { Ind8, IND8_FRAMES } from './films/inductance/Ind8';
import { Ind9, IND9_FRAMES } from './films/inductance/Ind9';
import { F1, F1_FRAMES } from './films/fields/F1';
import { F2, F2_FRAMES } from './films/fields/F2';
import { F3, F3_FRAMES } from './films/fields/F3';
import { F4, F4_FRAMES } from './films/fields/F4';
import { F5, F5_FRAMES } from './films/fields/F5';
import { F6, F6_FRAMES } from './films/fields/F6';
import { F7, F7_FRAMES } from './films/fields/F7';
import { F8, F8_FRAMES } from './films/fields/F8';
import { F9, F9_FRAMES } from './films/fields/F9';
import { FThumb } from './films/fields/FThumb';
import { I1, I1_FRAMES } from './films/induction/I1';
import { I2, I2_FRAMES } from './films/induction/I2';
import { I3, I3_FRAMES } from './films/induction/I3';
import { I4, I4_FRAMES } from './films/induction/I4';
import { I5, I5_FRAMES } from './films/induction/I5';
import { I6, I6_FRAMES } from './films/induction/I6';
import { I7, I7_FRAMES } from './films/induction/I7';
import { I8, I8_FRAMES } from './films/induction/I8';
import { I9, I9_FRAMES } from './films/induction/I9';
import { I10, I10_FRAMES } from './films/induction/I10';
import { IThumb } from './films/induction/IThumb';
import { A1, A1_FRAMES } from './films/ac1/A1';
import { A2, A2_FRAMES } from './films/ac1/A2';
import { A3, A3_FRAMES } from './films/ac1/A3';
import { A4, A4_FRAMES } from './films/ac1/A4';
import { A5, A5_FRAMES } from './films/ac1/A5';
import { A6, A6_FRAMES } from './films/ac1/A6';
import { A7, A7_FRAMES } from './films/ac1/A7';
import { A8, A8_FRAMES } from './films/ac1/A8';
import { A9, A9_FRAMES } from './films/ac1/A9';
import { AThumb } from './films/ac1/AThumb';
import { B1, B1_FRAMES } from './films/ac2/B1';
import { B2, B2_FRAMES } from './films/ac2/B2';
import { B3, B3_FRAMES } from './films/ac2/B3';
import { B4, B4_FRAMES } from './films/ac2/B4';
import { B5, B5_FRAMES } from './films/ac2/B5';
import { B6, B6_FRAMES } from './films/ac2/B6';
import { B7, B7_FRAMES } from './films/ac2/B7';
import { B8, B8_FRAMES } from './films/ac2/B8';
import { B9, B9_FRAMES } from './films/ac2/B9';
import { BThumb } from './films/ac2/BThumb';
import { S1, S1_FRAMES } from './films/shorts/S1';
import { S2, S2_FRAMES } from './films/shorts/S2';
import { S3, S3_FRAMES } from './films/shorts/S3';
import { S4, S4_FRAMES } from './films/shorts/S4';
import { S5, S5_FRAMES } from './films/shorts/S5';
import { S6, S6_FRAMES } from './films/shorts/S6';
import { S7, S7_FRAMES } from './films/shorts/S7';
import { S8, S8_FRAMES } from './films/shorts/S8';
import { S9, S9_FRAMES } from './films/shorts/S9';
// SHORTS-IMPORTS
import { StyleAC } from './films/ac/StyleAC';
import { IndThumb } from './films/inductance/IndThumb';
import { MagThumb } from './films/magnetism/MagThumb';
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

// Film 3: The Space Between (capacitance).
const capacitance = [
  { id: 'Capac1', component: Capac1, frames: CAPAC1_FRAMES },
  { id: 'Capac2', component: Capac2, frames: CAPAC2_FRAMES },
  { id: 'Capac3', component: Capac3, frames: CAPAC3_FRAMES },
  { id: 'Capac4', component: Capac4, frames: CAPAC4_FRAMES },
  { id: 'Capac5', component: Capac5, frames: CAPAC5_FRAMES },
  { id: 'Capac6', component: Capac6, frames: CAPAC6_FRAMES },
  { id: 'Capac7', component: Capac7, frames: CAPAC7_FRAMES },
  { id: 'Capac8', component: Capac8, frames: CAPAC8_FRAMES },
  { id: 'Capac9', component: Capac9, frames: CAPAC9_FRAMES },
];

// Film 4: The Second Field (magnetism).
const inductance = [
  { id: 'Ind1', component: Ind1, frames: IND1_FRAMES },
  { id: 'Ind2', component: Ind2, frames: IND2_FRAMES },
  { id: 'Ind3', component: Ind3, frames: IND3_FRAMES },
  { id: 'Ind4', component: Ind4, frames: IND4_FRAMES },
  { id: 'Ind5', component: Ind5, frames: IND5_FRAMES },
  { id: 'Ind6', component: Ind6, frames: IND6_FRAMES },
  { id: 'Ind7', component: Ind7, frames: IND7_FRAMES },
  { id: 'Ind8', component: Ind8, frames: IND8_FRAMES },
  { id: 'Ind9', component: Ind9, frames: IND9_FRAMES },
];
const fields = [
  { id: 'F1', component: F1, frames: F1_FRAMES },
  { id: 'F2', component: F2, frames: F2_FRAMES },
  { id: 'F3', component: F3, frames: F3_FRAMES },
  { id: 'F4', component: F4, frames: F4_FRAMES },
  { id: 'F5', component: F5, frames: F5_FRAMES },
  { id: 'F6', component: F6, frames: F6_FRAMES },
  { id: 'F7', component: F7, frames: F7_FRAMES },
  { id: 'F8', component: F8, frames: F8_FRAMES },
  { id: 'F9', component: F9, frames: F9_FRAMES },
];
const induction = [
  { id: 'I1', component: I1, frames: I1_FRAMES },
  { id: 'I2', component: I2, frames: I2_FRAMES },
  { id: 'I3', component: I3, frames: I3_FRAMES },
  { id: 'I4', component: I4, frames: I4_FRAMES },
  { id: 'I5', component: I5, frames: I5_FRAMES },
  { id: 'I6', component: I6, frames: I6_FRAMES },
  { id: 'I7', component: I7, frames: I7_FRAMES },
  { id: 'I8', component: I8, frames: I8_FRAMES },
  { id: 'I9', component: I9, frames: I9_FRAMES },
  { id: 'I10', component: I10, frames: I10_FRAMES },
];
const ac2 = [
  { id: 'B1', component: B1, frames: B1_FRAMES },
  { id: 'B2', component: B2, frames: B2_FRAMES },
  { id: 'B3', component: B3, frames: B3_FRAMES },
  { id: 'B4', component: B4, frames: B4_FRAMES },
  { id: 'B5', component: B5, frames: B5_FRAMES },
  { id: 'B6', component: B6, frames: B6_FRAMES },
  { id: 'B7', component: B7, frames: B7_FRAMES },
  { id: 'B8', component: B8, frames: B8_FRAMES },
  { id: 'B9', component: B9, frames: B9_FRAMES },
];
const ac1 = [
  { id: 'A1', component: A1, frames: A1_FRAMES },
  { id: 'A2', component: A2, frames: A2_FRAMES },
  { id: 'A3', component: A3, frames: A3_FRAMES },
  { id: 'A4', component: A4, frames: A4_FRAMES },
  { id: 'A5', component: A5, frames: A5_FRAMES },
  { id: 'A6', component: A6, frames: A6_FRAMES },
  { id: 'A7', component: A7, frames: A7_FRAMES },
  { id: 'A8', component: A8, frames: A8_FRAMES },
  { id: 'A9', component: A9, frames: A9_FRAMES },
];
const magnetism = [
  { id: 'Mag1', component: Mag1, frames: MAG1_FRAMES },
  { id: 'Mag2', component: Mag2, frames: MAG2_FRAMES },
  { id: 'Mag3', component: Mag3, frames: MAG3_FRAMES },
  { id: 'Mag4', component: Mag4, frames: MAG4_FRAMES },
  { id: 'Mag5', component: Mag5, frames: MAG5_FRAMES },
  { id: 'Mag6', component: Mag6, frames: MAG6_FRAMES },
  { id: 'Mag7', component: Mag7, frames: MAG7_FRAMES },
  { id: 'Mag8', component: Mag8, frames: MAG8_FRAMES },
  { id: 'Mag9', component: Mag9, frames: MAG9_FRAMES },
  { id: 'Mag10', component: Mag10, frames: MAG10_FRAMES },
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
    {[...chapters, ...charge, ...capacitance, ...magnetism, ...inductance, ...fields, ...induction, ...ac1, ...ac2].map((c) => (
      <Composition key={c.id} id={c.id} component={c.component} durationInFrames={c.frames} fps={FPS} width={W} height={H} />
    ))}
    {/* style options for the rest of the series */}
    <Composition id="StyleA" component={StyleA} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="StyleB" component={StyleB} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="StyleC" component={StyleC} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="FThumb" component={FThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="AcStyleA" component={StyleAC} defaultProps={{ look: 'A' as const }} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="AcStyleB" component={StyleAC} defaultProps={{ look: 'B' as const }} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="AcStyleC" component={StyleAC} defaultProps={{ look: 'C' as const }} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="S1" component={S1} durationInFrames={S1_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S2" component={S2} durationInFrames={S2_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S3" component={S3} durationInFrames={S3_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S4" component={S4} durationInFrames={S4_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S5" component={S5} durationInFrames={S5_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S6" component={S6} durationInFrames={S6_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S7" component={S7} durationInFrames={S7_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S8" component={S8} durationInFrames={S8_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S9" component={S9} durationInFrames={S9_FRAMES} fps={FPS} width={1080} height={1920} />
    {/* SHORTS */}
    <Composition id="BThumb" component={BThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="AThumb" component={AThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="IThumb" component={IThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="IndThumb" component={IndThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="MagThumb" component={MagThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="CapacThumb" component={CapacThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="ChargeThumb" component={ChargeThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={FPS} width={W} height={H} />
  </>
);

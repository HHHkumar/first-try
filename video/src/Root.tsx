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
    {[...chapters, ...charge, ...capacitance, ...magnetism, ...inductance].map((c) => (
      <Composition key={c.id} id={c.id} component={c.component} durationInFrames={c.frames} fps={FPS} width={W} height={H} />
    ))}
    {/* style options for the rest of the series */}
    <Composition id="StyleA" component={StyleA} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="StyleB" component={StyleB} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="StyleC" component={StyleC} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="IndThumb" component={IndThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="MagThumb" component={MagThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="CapacThumb" component={CapacThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="ChargeThumb" component={ChargeThumb} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={FPS} width={W} height={H} />
  </>
);

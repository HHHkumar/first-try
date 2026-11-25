import { Config } from '@remotion/cli/config';

// No GPU on the render machine: draw WebGL with the software ANGLE backend.
Config.setChromiumOpenGlRenderer('swangle');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);

import { Config } from '@remotion/cli/config';
import { webpackOverride } from './src/bundler-override';

Config.setStillImageFormat('png');
// No webpack cache: it grows ~100MB per rebuild and filled the disk once.
Config.setCachingEnabled(false);
Config.overrideWebpackConfig(webpackOverride);

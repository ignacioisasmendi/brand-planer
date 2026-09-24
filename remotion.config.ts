import { Config } from '@remotion/cli/config';
import { webpackOverride } from './src/bundler-override';

Config.setStillImageFormat('png');
Config.overrideWebpackConfig(webpackOverride);

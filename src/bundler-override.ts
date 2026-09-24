import { enableTailwind } from '@remotion/tailwind-v4';
import type { WebpackOverrideFn } from '@remotion/bundler';

/** Shared by remotion.config.ts (studio) and scripts/render.ts (bundle()). */
export const webpackOverride: WebpackOverrideFn = (config) => enableTailwind(config);

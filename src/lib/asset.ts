import { staticFile } from 'remotion';

/** `assets/photos/x.jpg` → served from public/; absolute URLs pass through. */
export function asset(src: string): string {
  return /^(https?:|data:)/.test(src) ? src : staticFile(src.replace(/^\/+/, ''));
}

export const PLATFORMS = ['instagram', 'tiktok', 'facebook', 'linkedin'] as const;
export type Platform = (typeof PLATFORMS)[number];

export const platformIcon = (p: Platform | 'twitter' | 'youtube' | 'canva') =>
  staticFile(`assets/social/${p}-circle.svg`);

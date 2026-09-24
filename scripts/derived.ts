/**
 * Marketing tokens that the spa does not define, expressed ONLY as mixes of
 * spa tokens. No hex values live here: `--brand` is copied from the spa's
 * light `--primary` by sync-tokens, and everything else is a `color-mix()` of
 * spa custom properties, so a palette change in the spa flows through.
 *
 * Each entry is `[name, lightValue, darkValue]`.
 */
export const DERIVED: Array<[name: string, light: string, dark: string]> = [
  // Brand-tinted surfaces: pills, soft chips, coupon fills, dashed outlines.
  ['brand-tint-1', mix('brand', 6, 'card'), mix('brand', 12, 'card')],
  ['brand-tint-2', mix('brand', 12, 'card'), mix('brand', 20, 'card')],
  ['brand-tint-3', mix('brand', 24, 'card'), mix('brand', 32, 'card')],
  ['brand-tint-4', mix('brand', 45, 'card'), mix('brand', 55, 'card')],

  // Brand-coloured text that keeps contrast on dark surfaces.
  ['brand-text', 'var(--brand)', mix('brand', 62, 'foreground')],

  // The brand "stage" — the panel mockups float on. Light is exactly the
  // spa's release-screen panel (`from-accent via-primary/25 to-primary/40` on
  // a card); dark keeps the brand hue instead of flipping to the dark primary.
  ['stage-from', 'var(--accent)', mix('brand', 46, 'background')],
  ['stage-via', mix('brand', 25, 'card'), mix('brand', 20, 'background')],
  ['stage-to', mix('brand', 40, 'card'), mix('brand', 30, 'background')],
  // Hairline / hand-drawn decoration on top of the stage.
  ['stage-ink', mix('foreground', 60, 'stage-via'), mix('foreground', 55, 'stage-via')],
];

function mix(a: string, pct: number, b: string): string {
  return `color-mix(in srgb, var(--${a}) ${pct}%, var(--${b}))`;
}

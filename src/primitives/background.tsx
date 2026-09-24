import { z } from 'zod';
import type { CSSProperties } from 'react';

export const backgroundSchema = z.object({
  /**
   * flat     — plain surface
   * gradient — the brand stage (accent → brand), as behind release visuals
   * grid     — surface with a faint grid fading out from the centre
   * glow     — surface with a soft brand glow in the top-right corner
   */
  variant: z.enum(['flat', 'gradient', 'grid', 'glow']).default('flat'),
  /** Which surface token flat/grid/glow sit on. */
  surface: z.enum(['card', 'background', 'muted']).default('card'),
  /** Grid cell size in px. */
  cell: z.number().default(64),
});

const STAGE =
  'radial-gradient(120% 90% at 100% 0%, color-mix(in srgb, var(--stage-from) 70%, transparent) 0%, transparent 60%),' +
  'linear-gradient(160deg, var(--stage-from) 0%, var(--stage-via) 55%, var(--stage-to) 100%)';

/** Fills its positioned parent. Put it first inside a `relative` box. */
export function Background({ variant = 'flat', surface = 'card', cell = 64 }: z.input<typeof backgroundSchema>) {
  const base = `var(--${surface})`;
  let style: CSSProperties;
  switch (variant) {
    case 'gradient':
      style = { background: STAGE };
      break;
    case 'grid': {
      const line = 'color-mix(in srgb, var(--border) 80%, transparent)';
      style = {
        backgroundColor: base,
        backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
        backgroundSize: `${cell}px ${cell}px`,
        backgroundPosition: 'center',
        maskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%, #000 40%, transparent 100%)',
      };
      return (
        <div className="absolute inset-0" style={{ backgroundColor: base }}>
          <div className="absolute inset-0" style={style} />
        </div>
      );
    }
    case 'glow':
      style = {
        background: `radial-gradient(70% 60% at 100% 0%, var(--brand-tint-3) 0%, transparent 70%), radial-gradient(50% 50% at 0% 100%, var(--brand-tint-1) 0%, transparent 70%), ${base}`,
      };
      break;
    default:
      style = { background: base };
  }
  return <div className="absolute inset-0" style={style} />;
}

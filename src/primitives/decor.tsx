import { z } from 'zod';
import { usePiece } from '../lib/context';
import { localized, tr } from '../lib/i18n';

const decorColor = z.enum(['white', 'brand', 'ink', 'card', 'foreground']);
const COLOR: Record<z.infer<typeof decorColor>, string> = {
  white: '#fff',
  card: 'var(--card)',
  brand: 'var(--brand)',
  ink: 'var(--stage-ink)',
  foreground: 'var(--foreground)',
};

export const sparkleSchema = z.object({
  size: z.number().default(28),
  color: decorColor.default('card'),
  opacity: z.number().default(1),
});

/** Four-point sparkle, scattered on brand stages. */
export function Sparkle({ size = 28, color = 'card', opacity = 1 }: z.input<typeof sparkleSchema>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ fill: COLOR[color], opacity }}>
      <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" />
    </svg>
  );
}

export const handArrowSchema = z.object({
  /** rise = release-screen curve · swoop = PLANER30 banner curve · loop = downward curl ending right (integration handoff). */
  variant: z.enum(['rise', 'swoop', 'loop']).default('rise'),
  width: z.number().default(210),
  height: z.number().default(420),
  color: decorColor.default('ink'),
  strokeWidth: z.number().default(1.5),
  flip: z.boolean().default(false),
});

const ARROWS = {
  rise: {
    viewBox: '0 0 200 400',
    body: 'M40 390 C 150 330, 150 250, 110 170 C 90 120, 100 70, 100 20',
    head: 'M72 50 L100 20 L128 50',
  },
  swoop: {
    viewBox: '0 0 120 600',
    body: 'M50 560 C 100 470, 85 360, 50 300 C 25 255, 30 150, 58 70',
    head: 'M32 96 L58 66 L80 100',
  },
  loop: {
    viewBox: '0 0 140 130',
    body: 'M22 4 C 12 40, 14 78, 42 88 C 70 98, 78 64, 58 58 C 38 52, 34 92, 60 104 C 80 113, 105 114, 128 112',
    head: 'M110 98 L130 112 L108 124',
  },
};

/** Hand-drawn arrow: upward growth gesture (rise, swoop) shared by release art and campaigns, or a downward curl (loop). */
export function HandArrow({
  variant = 'rise',
  width = 210,
  height = 420,
  color = 'ink',
  strokeWidth = 1.5,
  flip = false,
}: z.input<typeof handArrowSchema>) {
  const a = ARROWS[variant];
  return (
    <svg
      viewBox={a.viewBox}
      width={width}
      height={height}
      fill="none"
      preserveAspectRatio="none"
      style={{ stroke: COLOR[color], transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible' }}
    >
      <path d={a.body} strokeWidth={strokeWidth} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d={a.head} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export const couponTicketSchema = z.object({
  eyebrow: localized,
  title: localized,
  code: z.string(),
  foot: localized.optional(),
  stubValue: localized,
  stubUnit: localized,
});

/**
 * A tear-off pass with a promo code — campaign art (PLANER30). Laid out on a
 * fixed 430×250 box; scale it with the layer's `zoom`.
 */
export function CouponTicket({ eyebrow, title, code, foot, stubValue, stubUnit }: z.input<typeof couponTicketSchema>) {
  const { locale } = usePiece();
  const notch = 'radial-gradient(circle 17px at 318px 0, #0000 98%, #000), radial-gradient(circle 17px at 318px 100%, #0000 98%, #000)';
  return (
    <div
      style={{
        filter:
          'drop-shadow(0 24px 40px color-mix(in srgb, var(--brand) 22%, transparent)) drop-shadow(0 4px 10px color-mix(in srgb, var(--brand) 10%, transparent))',
      }}
    >
      <div
        className="flex bg-card text-card-foreground"
        style={{ width: 430, height: 250, borderRadius: 22, mask: notch, maskComposite: 'intersect', WebkitMaskComposite: 'source-in' }}
      >
        <div style={{ width: 318, padding: '30px 26px 0 30px' }}>
          <span className="block font-semibold uppercase text-brand-text" style={{ fontSize: 13, letterSpacing: '0.2em' }}>
            {tr(eyebrow, locale)}
          </span>
          <h3 className="m-0" style={{ marginTop: 10, fontSize: 30, fontWeight: 760, lineHeight: 1.1, letterSpacing: '-0.03em', whiteSpace: 'pre-line' }}>
            {tr(title, locale)}
          </h3>
          <div
            className="bg-brand-tint-1 text-center text-brand-text"
            style={{
              marginTop: 22,
              border: '2.5px dashed var(--brand-tint-4)',
              borderRadius: 14,
              padding: '12px 0',
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '0.08em',
            }}
          >
            {code}
          </div>
          {foot && (
            <div className="text-center font-semibold uppercase text-muted-foreground" style={{ marginTop: 10, fontSize: 13.5, letterSpacing: '0.16em' }}>
              {tr(foot, locale)}
            </div>
          )}
        </div>
        <div className="relative flex flex-1 flex-col items-center justify-center bg-brand-tint-1">
          <div className="absolute left-0" style={{ top: 24, bottom: 24, borderLeft: '2.5px dashed var(--brand-tint-3)' }} />
          <div style={{ fontSize: 60, fontWeight: 820, letterSpacing: '-0.04em', lineHeight: 1 }}>{tr(stubValue, locale)}</div>
          <div
            className="font-semibold uppercase text-muted-foreground"
            style={{ marginTop: 14, writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 14, letterSpacing: '0.22em' }}
          >
            {tr(stubUnit, locale)}
          </div>
        </div>
      </div>
    </div>
  );
}

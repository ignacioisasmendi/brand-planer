import { z } from 'zod';
import { staticFile } from 'remotion';
import { platformIcon, PLATFORMS, type Platform } from '../lib/asset';
import { Icon } from '../lib/icon';
import { Logo, Wordmark } from './brand';
import { HandArrow } from './decor';
import { usePiece } from '../lib/context';

/** Third-party logos kept in public/assets/partners/<name>.svg, in their own colours. */
export const PARTNERS = ['claude'] as const;
export type Partner = (typeof PARTNERS)[number];

/** What a tile can show: Planer (wordmark or bare mark), a partner, or a social network. */
export const INTEGRATION_LOGOS = ['planer', 'planer-mark', ...PARTNERS, ...PLATFORMS] as const;
type IntegrationLogo = (typeof INTEGRATION_LOGOS)[number];

export const integrationTilesSchema = z.object({
  left: z.enum(INTEGRATION_LOGOS).default('planer'),
  right: z.enum(INTEGRATION_LOGOS).default('claude'),
  /** Side of each square tile in px; everything else scales from it. */
  size: z.number().default(380),
  /** Lucide icon in the badge between the tiles. */
  icon: z.string().default('Check'),
  /** Draw the tinted panel behind the tiles (off when placed on a stage). */
  panel: z.boolean().default(true),
});

/** A logo at `height` px: Planer's wordmark, or a square mark (Planer, partner, platform). */
function IntegrationLogoMark({ logo, height }: { logo: IntegrationLogo; height: number }) {
  if (logo === 'planer') return <Wordmark size={height} />;
  if (logo === 'planer-mark') return <Logo size={height} />;
  const src = (PARTNERS as readonly string[]).includes(logo)
    ? staticFile(`assets/partners/${logo}.svg`)
    : platformIcon(logo as Platform);
  return <img src={src} width={height} height={height} alt="" />;
}

function TileLogo({ logo, size }: { logo: IntegrationLogo; size: number }) {
  return <IntegrationLogoMark logo={logo} height={logo === 'planer' ? size * 0.19 : size * 0.34} />;
}

/**
 * "Planer ✓ Partner" integration card: two logo tiles joined by a round badge
 * on a brand-tinted panel, the classic integrations-directory graphic.
 */
export function IntegrationTiles(input: Partial<z.input<typeof integrationTilesSchema>>) {
  const { left, right, size, icon, panel } = integrationTilesSchema.parse(input);
  const gap = size * 0.04;
  const badge = size * 0.23;
  const tile = (logo: IntegrationLogo) => (
    <div
      className="flex items-center justify-center bg-card shadow-xs"
      style={{ width: size, height: size, borderRadius: size * 0.07 }}
    >
      <TileLogo logo={logo} size={size} />
    </div>
  );
  return (
    <div
      className={panel ? 'bg-brand-tint-2' : undefined}
      style={panel ? { padding: size * 0.34, borderRadius: size * 0.1 } : undefined}
    >
      <div className="relative flex" style={{ gap }}>
        {tile(left)}
        {tile(right)}
        <span
          className="absolute flex items-center justify-center rounded-full bg-brand-tint-2 text-brand-text"
          style={{
            width: badge,
            height: badge,
            left: size + gap / 2 - badge / 2,
            top: size / 2 - badge / 2,
            boxShadow: `0 0 0 ${size * 0.025}px var(--card)`,
          }}
        >
          <Icon name={icon} size={badge * 0.5} strokeWidth={2.6} />
        </span>
      </div>
    </div>
  );
}

export const logoChipSchema = z.object({
  logo: z.enum(INTEGRATION_LOGOS).default('planer'),
  /** Logo height in px; the chip's padding and radius scale from it. */
  size: z.number().default(64),
  /** Translucent ring around the chip, to lift it off a tinted stage. */
  halo: z.boolean().default(true),
});

/** A logo on a rounded card chip, with an optional translucent halo. Tilt it with the layer's `rotate`. */
export function LogoChip(input: Partial<z.input<typeof logoChipSchema>>) {
  const { logo, size, halo } = logoChipSchema.parse(input);
  const { theme } = usePiece();
  // A light glassy ring in both themes; a card-coloured one would read as a dark border in dark mode.
  const ring = halo ? `0 0 0 ${size * 0.13}px color-mix(in srgb, white ${theme === 'dark' ? 18 : 45}%, transparent), ` : '';
  return (
    <div
      className="inline-flex items-center justify-center bg-card"
      style={{
        padding: `${size * 0.42}px ${size * (logo === 'planer' ? 0.62 : 0.8)}px`,
        borderRadius: size * 0.36,
        boxShadow: `${ring}0 ${size * 0.12}px ${size * 0.4}px color-mix(in srgb, var(--brand) 18%, transparent)`,
      }}
    >
      <IntegrationLogoMark logo={logo} height={size} />
    </div>
  );
}

export const integrationHandoffSchema = z.object({
  from: z.enum(INTEGRATION_LOGOS).default('planer'),
  to: z.enum(INTEGRATION_LOGOS).default('claude'),
  /** Width of the scene in px; its height is 0.6× that. */
  width: z.number().default(1120),
  /** Draw the tinted panel behind the scene (off when placed on a stage). */
  panel: z.boolean().default(true),
});

/**
 * "Planer ↘ partner": a tilted Planer chip handing off to a tilted partner chip
 * through a hand-drawn curl, on a strong brand tint.
 */
export function IntegrationHandoff(input: Partial<z.input<typeof integrationHandoffSchema>>) {
  const { from, to, width, panel } = integrationHandoffSchema.parse(input);
  const u = width / 1120; // the scene is laid out on a 1120×672 grid
  const at = (x: number, y: number, rotate: number) =>
    ({ position: 'absolute', left: x * u, top: y * u, transform: `translate(-50%, -50%) rotate(${rotate}deg)` }) as const;
  return (
    <div
      className={panel ? 'bg-brand-tint-4' : undefined}
      style={{ position: 'relative', width, height: 672 * u, borderRadius: panel ? 44 * u : undefined }}
    >
      <div style={at(430, 222, -6)}>
        <LogoChip logo={from} size={96 * u} />
      </div>
      <div style={{ position: 'absolute', left: 488 * u, top: 342 * u }}>
        <HandArrow variant="loop" color="foreground" width={170 * u} height={152 * u} strokeWidth={8 * u} />
      </div>
      <div style={at(812, 470, 5)}>
        <LogoChip logo={to} size={96 * u} />
      </div>
    </div>
  );
}

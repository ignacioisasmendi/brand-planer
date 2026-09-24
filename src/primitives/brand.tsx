import { z } from 'zod';
import { LOGO_SVG, LOGO_VIEWBOX } from '../tokens/logo';
import { platformIcon, PLATFORMS } from '../lib/asset';
import { Icon } from '../lib/icon';

export const logoSchema = z.object({
  /** Rendered width/height in px. */
  size: z.number().default(48),
});

/** The Planer mark (brand violet in both themes). */
export function Logo({ size = 48 }: Partial<z.infer<typeof logoSchema>>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={LOGO_VIEWBOX}
      fill="none"
      className="shrink-0"
      dangerouslySetInnerHTML={{ __html: LOGO_SVG }}
    />
  );
}

export const wordmarkSchema = z.object({
  /** Height of the mark in px; the word scales with it. */
  size: z.number().default(46),
});

/** Mark + "planer" wordmark, as on the PLANER30 banner. */
export function Wordmark({ size = 46 }: Partial<z.infer<typeof wordmarkSchema>>) {
  return (
    <div className="flex items-center text-foreground" style={{ gap: size * 0.26 }}>
      <Logo size={size} />
      <span
        className="font-bold"
        style={{ fontSize: size * 0.65, letterSpacing: '-0.02em', lineHeight: 1 }}
      >
        planer
      </span>
    </div>
  );
}

export const logoLockupSchema = z.object({
  size: z.number().default(64),
  /** A social network logo next to Planer's… */
  platform: z.enum(PLATFORMS).optional(),
  /** …or a lucide icon (PascalCase) in a neutral circle, e.g. "Plug". */
  icon: z.string().optional(),
});

/** Planer ⇄ partner, the release screen's opening lockup. */
export function LogoLockup({ size = 64, platform, icon }: Partial<z.infer<typeof logoLockupSchema>>) {
  const partner = platform || icon;
  return (
    <div className="flex items-center" style={{ gap: size * 0.28 }}>
      <Logo size={size} />
      {partner && (
        <>
          <Icon name="ArrowLeftRight" className="text-muted-foreground" size={size * 0.4} strokeWidth={2} />
          {platform ? (
            <img src={platformIcon(platform)} width={size} height={size} alt="" />
          ) : (
            <span
              className="flex items-center justify-center rounded-full border bg-card text-foreground shadow-xs"
              style={{ width: size, height: size }}
            >
              <Icon name={icon!} size={size * 0.5} strokeWidth={2} />
            </span>
          )}
        </>
      )}
    </div>
  );
}

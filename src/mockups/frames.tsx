import type { ReactNode } from 'react';
import { BatteryFull, Lock, Signal, Wifi } from 'lucide-react';
import { z } from 'zod';
import { cn } from '../lib/cn';

export const phoneFrameSchema = z.object({
  /** Outer width in px; height follows a modern iPhone ratio. */
  width: z.number().default(390),
  /** Screen background token. */
  screen: z.enum(['background', 'card', 'black']).default('background'),
  /** Status-bar clock. */
  time: z.string().default('9:41'),
  /** Vertically centre the content instead of stacking it from the top. */
  center: z.boolean().default(false),
  /** Inner padding of the screen content, px. */
  padding: z.number().default(0),
});

/**
 * A neutral, modern phone (rounded bezel + dynamic island + status bar).
 * Content flows inside the screen below the status bar. The bezel is the
 * foreground token, so it reads dark on light pieces and light-ish on dark.
 */
export function PhoneFrame({
  width = 390,
  screen = 'background',
  time = '9:41',
  center = false,
  padding = 0,
  children,
}: z.input<typeof phoneFrameSchema> & { children?: ReactNode }) {
  const height = Math.round(width * 2.07);
  const bezel = width * 0.035;
  const radius = width * 0.15;
  return (
    <div
      // Dark bezel in both themes: near-foreground on light, the secondary surface on dark.
      className="relative bg-[color-mix(in_srgb,var(--foreground)_92%,var(--background))] dark:bg-secondary"
      style={{
        width,
        height,
        borderRadius: radius,
        padding: bezel,
        boxShadow: '0 40px 80px -20px color-mix(in srgb, var(--brand) 35%, transparent), inset 0 0 0 2px var(--border)',
      }}
    >
      <div
        className={cn(
          'relative flex h-full w-full flex-col overflow-hidden',
          screen === 'black' ? 'bg-black text-white' : screen === 'card' ? 'bg-card text-foreground' : 'bg-background text-foreground',
        )}
        style={{ borderRadius: radius - bezel }}
      >
        <div className="relative flex shrink-0 items-center justify-between px-[8%] text-[15px] font-semibold" style={{ height: 50 }}>
          <span>{time}</span>
          <span className="flex items-center gap-1.5">
            <Signal className="size-4" strokeWidth={2.5} />
            <Wifi className="size-4" strokeWidth={2.5} />
            <BatteryFull className="size-5" strokeWidth={2} />
          </span>
          <span className="absolute top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-black" style={{ width: width * 0.3, height: 32 }} />
        </div>
        <div className={cn('flex min-h-0 flex-1 flex-col items-center', center && 'justify-center')} style={{ padding, gap: 12 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export const browserFrameSchema = z.object({
  width: z.number().default(960),
  height: z.number().default(600),
  url: z.string().default('app.planer.com.ar'),
});

/** Minimal desktop browser window — for showing Planer's web app. */
export function BrowserFrame({
  width = 960,
  height = 600,
  url = 'app.planer.com.ar',
  children,
}: z.input<typeof browserFrameSchema> & { children?: ReactNode }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card text-foreground shadow-2xl" style={{ width, height }}>
      <div className="flex h-11 shrink-0 items-center gap-3 border-b bg-muted/60 px-4">
        <span className="flex gap-1.5">
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <span key={c} className="size-3 rounded-full" style={{ background: c }} />
          ))}
        </span>
        <span className="mx-auto flex h-7 w-1/2 items-center justify-center gap-1.5 rounded-md bg-background text-xs text-muted-foreground">
          <Lock className="size-3" /> {url}
        </span>
        <span className="w-12" />
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden bg-background">{children}</div>
    </div>
  );
}

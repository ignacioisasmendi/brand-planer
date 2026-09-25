import * as React from 'react'
import { Crown } from 'lucide-react'

import { Button } from './ui'
import { cn } from '../../lib/cn'

/**
 * Founder-pricing grace-window banner.
 *
 * Mirrors `components/dashboard/founder-banner.tsx`: shown to hand-picked
 * FUNDADOR users during their pay-by grace window, in amber while the window is
 * open and destructive once it has expired (at which point their posts are
 * paused).
 */

export interface FounderBannerProps extends React.ComponentProps<'div'> {
  /** Days left in the grace window. `<= 1` switches to the last-day copy. */
  daysLeft?: number
  /** Renders the expired variant: destructive tint and the "elegí un plan" copy. */
  expired?: boolean
  announcementLabel?: string
}

export function FounderBanner({
  daysLeft = 3,
  expired = false,
  announcementLabel = 'Ver anuncio',
  className,
  ...props
}: FounderBannerProps) {
  const label = expired
    ? 'Terminó tu período Fundador — tus posteos están pausados. Elegí un plan para volver a publicar'
    : daysLeft <= 1
      ? 'Último día para fijar tu precio Fundador'
      : `Te quedan ${daysLeft} días para fijar tu precio Fundador`

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg border p-3',
        expired
          ? 'border-destructive/40 bg-destructive/5'
          : 'border-amber-500/40 bg-amber-500/5',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Crown className={cn('h-4 w-4', expired ? 'text-destructive' : 'text-amber-600')} />
        <p className="text-sm font-medium">{label}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="ghost" size="sm">
          {announcementLabel}
        </Button>
        <Button size="sm">{expired ? 'Elegir mi plan' : 'Fijar mi precio'}</Button>
      </div>
    </div>
  )
}

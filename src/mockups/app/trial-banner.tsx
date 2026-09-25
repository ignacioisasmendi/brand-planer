import * as React from 'react'
import { Sparkles } from 'lucide-react'

import { Button } from './ui'
import { cn } from '../../lib/cn'

/**
 * Free-trial countdown banner.
 *
 * Mirrors `components/dashboard/trial-banner.tsx`: the strip shown above the
 * workspace to users on the 15-day trial, linking to the upgrade page. In the
 * app it hides itself for non-trial users; here it always renders, since the
 * point is to have the banner as design material.
 */

export interface TrialBannerProps extends React.ComponentProps<'div'> {
  /** Days remaining. `0` switches the copy to the last-day wording. */
  daysLeft?: number
  cta?: string
}

export function TrialBanner({
  daysLeft = 8,
  cta = 'Mejorar ahora',
  className,
  ...props
}: TrialBannerProps) {
  const label =
    daysLeft <= 0
      ? 'Tu prueba gratis termina hoy'
      : `Te quedan ${daysLeft} días de prueba gratis`

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg border border-primary/40 bg-primary/5 p-3',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium">{label}</p>
      </div>
      <Button size="sm">{cta}</Button>
    </div>
  )
}

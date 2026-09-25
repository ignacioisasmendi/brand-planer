import * as React from 'react'

import { cn } from '../../lib/cn'

/**
 * Compact plan indicator shown under the client name in the sidebar.
 *
 * Mirrors `components/dashboard/sidebar-plan-badge.tsx`. The dot appears only
 * once the worst usage meter on the account crosses 80% (amber) or 100% (red) —
 * it is the sidebar's only hint that an upgrade is due.
 */

export type PlanUsageTone = 'normal' | 'amber' | 'red'

export interface PlanBadgeProps extends React.ComponentProps<'span'> {
  /** Rendered as "Plan {{plan}}" — the app title-cases the raw plan enum. */
  plan?: string
  tone?: PlanUsageTone
}

export function PlanBadge({
  plan = 'Pro',
  tone = 'normal',
  className,
  ...props
}: PlanBadgeProps) {
  const dotClass =
    tone === 'red' ? 'bg-destructive' : tone === 'amber' ? 'bg-amber-500' : null

  return (
    <span
      className={cn('flex items-center gap-1.5 text-xs text-muted-foreground', className)}
      {...props}
    >
      Plan {plan}
      {dotClass && <span className={cn('inline-block h-1.5 w-1.5 rounded-full', dotClass)} />}
    </span>
  )
}

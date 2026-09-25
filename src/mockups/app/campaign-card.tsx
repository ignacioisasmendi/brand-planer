import * as React from 'react'
import { Calendar, FileText, MoreHorizontal } from 'lucide-react'

import { Button } from './ui'
import { Card, CardContent } from './ui'
import { cn } from '../../lib/cn'

/**
 * A campaign, as it appears on the campaigns grid.
 *
 * Mirrors `components/dashboard/campaigns/campaign-card.tsx`: an accent strip
 * in the campaign's own colour, the name behind a matching dot, an optional
 * two-line description, then the date range and publication count.
 *
 * The accent is a free-form CSS colour (the app stores a hex on the campaign
 * and falls back to `#6366f1`), so it is applied inline rather than as a class.
 */

export interface CampaignCardProps extends React.ComponentProps<'div'> {
  name?: string
  description?: string
  /** Any CSS colour. Defaults to the app's own fallback indigo. */
  color?: string
  /** Pre-formatted, e.g. `1 mar 2026`. */
  startDate?: string
  endDate?: string
  postCount?: number
}

export function CampaignCard({
  name = 'Lanzamiento primavera',
  description = 'Serie de reels y carruseles para acompañar la salida de la colección nueva.',
  color = '#6366f1',
  startDate = '1 mar 2026',
  endDate = '30 abr 2026',
  postCount = 14,
  className,
  ...props
}: CampaignCardProps) {
  const range =
    startDate && endDate
      ? `${startDate} → ${endDate}`
      : startDate
        ? `Desde ${startDate}`
        : endDate
          ? `Hasta ${endDate}`
          : null

  return (
    <div className={cn('w-full', className)} {...props}>
      <Card className="overflow-hidden py-0">
        <div className="flex h-1.5 w-full" style={{ backgroundColor: color }} />
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <div
                className="mt-0.5 size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <h3 className="truncate text-sm font-semibold">{name}</h3>
            </div>
            <Button variant="ghost" size="icon" className="size-7 shrink-0">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>

          {description && (
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{description}</p>
          )}

          <div className="mt-3 flex flex-col gap-1">
            {range && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5" />
                <span>{range}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="size-3.5" />
              <span>{postCount} publicaciones</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

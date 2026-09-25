import * as React from 'react'
import {
  FolderPlus,
  Folder,
  HardDrive,
  ImageIcon,
  MoreVertical,
  Play,
  Upload,
  VideoIcon,
} from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from './ui'
import { Button } from './ui'
import { Checkbox } from './ui'
import { Separator } from './ui'
import { cn } from '../../lib/cn'

import { AppFrame, type AppFrameProps } from './app-frame'

/**
 * The media library screen, as a static screen.
 *
 * Mirrors `components/media/media-library.tsx` + `media-grid.tsx`,
 * `media-card.tsx`, `folder-card.tsx` and `storage-usage-indicator.tsx`: a
 * bordered card filling the page, with a header (title, description, storage
 * meter, folder breadcrumb) over a scrolling body of folder cards and a
 * square-tile media grid.
 *
 * Thumbnails are gradient tiles rather than images — the DS ships no binary
 * assets, and a tinted tile reads as a photo grid at card scale.
 */

export type MediaTint = 'violet' | 'amber' | 'teal' | 'rose' | 'slate' | 'lime'

const TINT: Record<MediaTint, string> = {
  violet: 'bg-gradient-to-br from-violet-400 to-fuchsia-300',
  amber: 'bg-gradient-to-br from-amber-300 to-orange-400',
  teal: 'bg-gradient-to-br from-teal-300 to-cyan-500',
  rose: 'bg-gradient-to-br from-rose-300 to-pink-500',
  slate: 'bg-gradient-to-br from-slate-300 to-slate-500',
  lime: 'bg-gradient-to-br from-lime-300 to-emerald-400',
}

export interface MediaFolderEntry {
  name: string
  itemCount: number
}

export interface MediaAsset {
  type?: 'IMAGE' | 'VIDEO'
  /** Gradient tint standing in for the real thumbnail. */
  tint?: MediaTint
  /** Rendered in the bottom-right badge, videos only (e.g. `0:24`). */
  duration?: string
  /** Drives the "Se usa en N publicaciones" badge. */
  usageCount?: number
  selected?: boolean
  /** Renders the empty-state icon instead of a tint — an asset with no preview. */
  noPreview?: boolean
}

export interface MediaScreenProps extends Omit<AppFrameProps, 'active' | 'topbar'> {
  title?: string
  description?: string
  /** Storage meter copy — mirrors `storageUsed` ("{{used}} de {{limit}} usados"). */
  storageUsed?: string
  storageLimit?: string
  /** 0–100. At ≥80 the meter turns amber, at ≥100 destructive, as in the app. */
  storagePct?: number
  folders?: MediaFolderEntry[]
  items?: MediaAsset[]
}

// Names kept short enough to clear the folder card's `truncate` at the grid's
// narrowest column — a clipped folder name reads as a bug in launch imagery.
const DEFAULT_FOLDERS: MediaFolderEntry[] = [
  { name: 'Primavera 2026', itemCount: 18 },
  { name: 'Reels y video', itemCount: 24 },
  { name: 'Producto', itemCount: 47 },
  { name: 'Logos y marca', itemCount: 6 },
]

const DEFAULT_ITEMS: MediaAsset[] = [
  { type: 'IMAGE', tint: 'violet', usageCount: 3, selected: true },
  { type: 'VIDEO', tint: 'amber', duration: '0:24' },
  { type: 'IMAGE', tint: 'teal' },
  { type: 'IMAGE', tint: 'rose', usageCount: 1 },
  { type: 'VIDEO', tint: 'slate', duration: '1:08' },
  { type: 'IMAGE', tint: 'lime' },
  { type: 'IMAGE', tint: 'amber', usageCount: 2 },
  { type: 'IMAGE', tint: 'violet' },
  { type: 'VIDEO', tint: 'teal', duration: '0:15' },
  { type: 'IMAGE', tint: 'slate' },
]

export function MediaScreen({
  title = 'Biblioteca de Medios',
  description = 'Sube y reutiliza imágenes y videos para tus publicaciones',
  storageUsed = '2,4 GB',
  storageLimit = '5 GB',
  storagePct = 48,
  folders = DEFAULT_FOLDERS,
  items = DEFAULT_ITEMS,
  ...frame
}: MediaScreenProps) {
  // Meter thresholds copied from storage-usage-indicator.tsx.
  const barColor =
    storagePct >= 100 ? 'bg-destructive' : storagePct >= 80 ? 'bg-amber-500' : 'bg-primary'
  const meterText =
    storagePct >= 100
      ? 'text-destructive'
      : storagePct >= 80
        ? 'text-amber-600'
        : 'text-muted-foreground'

  return (
    <AppFrame active="media" {...frame}>
      <div className="flex h-full p-6">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card">
          {/* ── Page header ──────────────────────────────────────── */}
          <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>

              {/* Storage meter — StorageUsageIndicator */}
              <div className="mt-2 flex items-center gap-2">
                <HardDrive className={cn('h-3.5 w-3.5 shrink-0', meterText)} />
                <span className={cn('text-xs tabular-nums', meterText)}>
                  {storageUsed} de {storageLimit} usados
                </span>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn('h-full rounded-full', barColor)}
                    style={{ width: `${storagePct}%` }}
                  />
                </div>
              </div>

              {/* Folder breadcrumb — at the library root */}
              <div className="mt-2">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage>Biblioteca de medios</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline">
                <FolderPlus className="mr-1.5 h-4 w-4" />
                Nueva carpeta
              </Button>
              <Button type="button">
                <Upload className="mr-1.5 h-4 w-4" />
                Subir medios
              </Button>
            </div>
          </div>

          <Separator />

          {/* ── Folders + files ──────────────────────────────────── */}
          <div className="flex-1 space-y-6 overflow-hidden px-6 py-4">
            {folders.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-medium text-muted-foreground">Carpetas</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {folders.map((folder) => (
                    <div
                      key={folder.name}
                      className="group relative flex items-center gap-3 rounded-lg border bg-card px-3 py-3"
                    >
                      <Folder className="h-8 w-8 shrink-0 fill-primary/10 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{folder.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {folder.itemCount === 1
                            ? '1 elemento'
                            : `${folder.itemCount} elementos`}
                        </p>
                      </div>
                      <MoreVertical className="h-4 w-4 shrink-0 text-muted-foreground opacity-0" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              {folders.length > 0 && (
                <h2 className="mb-3 text-sm font-medium text-muted-foreground">Archivos</h2>
              )}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {items.map((item, i) => {
                  const isVideo = item.type === 'VIDEO'
                  return (
                    <div
                      key={i}
                      className={cn(
                        'group relative aspect-square overflow-hidden rounded-lg border bg-muted',
                        item.selected && 'ring-2 ring-primary ring-offset-1',
                      )}
                    >
                      {item.noPreview ? (
                        <div className="flex h-full w-full items-center justify-center">
                          {isVideo ? (
                            <VideoIcon className="h-8 w-8 text-muted-foreground/30" />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                          )}
                        </div>
                      ) : (
                        <div
                          className={cn('h-full w-full', TINT[item.tint ?? 'violet'])}
                        />
                      )}

                      {/* Video play affordance */}
                      {isVideo && !item.noPreview && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 shadow-lg backdrop-blur-sm">
                            <Play className="h-4 w-4 fill-white text-white" />
                          </div>
                        </div>
                      )}

                      {/* Duration badge */}
                      {isVideo && item.duration && (
                        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-white backdrop-blur-sm">
                          {item.duration}
                        </span>
                      )}

                      {/* "Used in N posts" badge */}
                      {!!item.usageCount && (
                        <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                          {item.usageCount === 1
                            ? 'Se usa en 1 publicación'
                            : `Se usa en ${item.usageCount} publicaciones`}
                        </span>
                      )}

                      {/* Selection checkbox — shown when selected */}
                      {item.selected && (
                        <div className="absolute left-2 top-2">
                          <Checkbox
                            checked
                            className="border-white/80 bg-black/20 backdrop-blur-sm data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                          />
                        </div>
                      )}

                      {item.selected && (
                        <div className="pointer-events-none absolute inset-0 bg-primary/15" />
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppFrame>
  )
}

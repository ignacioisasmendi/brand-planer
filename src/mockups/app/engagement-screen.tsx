import * as React from 'react'
import { CornerDownRight, Heart, RefreshCw, Send } from 'lucide-react'

import { Avatar, AvatarFallback } from './ui'
import { Badge } from './ui'
import { Button } from './ui'
import { Card, CardContent } from './ui'
import { Input } from './ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui'
import { cn } from '../../lib/cn'

import { AppFrame, type AppFrameProps } from './app-frame'

/**
 * The engagement / comment inbox screen, as a static screen.
 *
 * Mirrors `components/dashboard/engagement/engagement-content.tsx` +
 * `comment-thread.tsx`: an account picker over a list of published posts, each
 * with its comment threads and an inline reply box.
 */

export interface EngagementComment {
  author: string
  text: string
  when: string
  likes: number
  reply?: { text: string; when: string }
}

export interface EngagementPost {
  title: string
  when: string
  commentCount: number
  comments: EngagementComment[]
}

export interface EngagementScreenProps extends Omit<AppFrameProps, 'active' | 'topbar'> {
  account?: string
  posts?: EngagementPost[]
}

const DEFAULT_POSTS: EngagementPost[] = [
  {
    title: 'Lanzamiento colección primavera',
    when: 'Publicado hace 2 h',
    commentCount: 24,
    comments: [
      {
        author: 'lucia.mendez',
        text: '¡Me encanta! ¿Hacen envíos a Córdoba? 😍',
        when: 'hace 40 min',
        likes: 12,
        reply: { text: '¡Gracias Lucía! Sí, enviamos a todo el país 💜', when: 'hace 22 min' },
      },
      {
        author: 'martin.rios',
        text: '¿Qué talles tienen disponibles?',
        when: 'hace 1 h',
        likes: 3,
      },
    ],
  },
  {
    title: 'Behind the scenes del estudio',
    when: 'Publicado ayer',
    commentCount: 11,
    comments: [
      {
        author: 'sofi.branding',
        text: 'Qué buena edición, ¿con qué la hicieron?',
        when: 'hace 5 h',
        likes: 8,
      },
    ],
  },
]

export function EngagementScreen({
  account = '@estudio.norte',
  posts = DEFAULT_POSTS,
  ...frame
}: EngagementScreenProps) {
  return (
    <AppFrame active="feedback" {...frame}>
      <div className="h-full overflow-hidden p-5">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {/* Page header — mirrors engagement-content.tsx: title left, account
              selector + Actualizar right. The shell renders no topbar here. */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-semibold">Interacción</h1>
            <div className="flex items-center gap-2">
              <Select defaultValue="norte">
                <SelectTrigger size="sm" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="norte">{account}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-1.5 size-4" /> Actualizar
              </Button>
            </div>
          </div>

          {posts.map((post) => (
            <Card key={post.title} className="gap-0 py-4">
              <CardContent className="px-4">
                {/* Post header */}
                <div className="flex items-center gap-3 pb-3">
                  <div className="size-10 shrink-0 rounded-lg bg-gradient-to-br from-primary/25 to-primary/5" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.when}</p>
                  </div>
                  <Badge variant="secondary" className="tabular-nums">
                    {post.commentCount} comentarios
                  </Badge>
                </div>

                {/* Threads */}
                <div className="flex flex-col border-t pt-3">
                  {post.comments.map((c, i) => (
                    <div key={c.author} className={cn('flex gap-3 py-2.5', i > 0 && 'border-t')}>
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="text-[10px]">
                          {c.author.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{c.author}</span>{' '}
                          <span className="text-muted-foreground">· {c.when}</span>
                        </p>
                        <p className="mt-0.5 text-sm">{c.text}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 tabular-nums">
                            <Heart className="size-3" /> {c.likes}
                          </span>
                          <span>Responder</span>
                        </div>

                        {c.reply && (
                          <div className="mt-2 flex gap-2 rounded-md bg-muted/60 p-2">
                            <CornerDownRight className="size-3.5 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                              <p className="text-xs">
                                <span className="font-medium">{account}</span>{' '}
                                <span className="text-muted-foreground">· {c.reply.when}</span>
                              </p>
                              <p className="mt-0.5 text-xs">{c.reply.text}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply box */}
                <div className="flex items-center gap-2 border-t pt-3">
                  <Input readOnly placeholder="Escribí una respuesta…" className="h-8 text-xs" />
                  <Button size="sm">
                    <Send /> Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppFrame>
  )
}

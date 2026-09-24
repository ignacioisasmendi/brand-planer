import {
  Bookmark,
  Globe,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Repeat2,
  Send,
  Share2,
  ThumbsUp,
  X,
} from 'lucide-react';
import { z } from 'zod';
import { asset, platformIcon, PLATFORMS } from '../lib/asset';
import { cn } from '../lib/cn';
import { usePiece } from '../lib/context';
import { localized, tr, type Locale } from '../lib/i18n';
import { FLOAT_CARD } from './ui';

export const postCardSchema = z.object({
  platform: z.enum(PLATFORMS).default('instagram'),
  /** Account display name ("Café Origen"). */
  name: z.string().default('Café Origen'),
  /** Handle without @ ("cafe.origen"). */
  handle: z.string().default('cafe.origen'),
  /** Avatar image under public/ (e.g. assets/photos/cafe-icon.png). */
  avatar: z.string().default('assets/photos/cafe-icon.png'),
  /** Post media under public/. */
  image: z.string().default('assets/photos/cafe-especialidad.jpg'),
  caption: localized.default({ es: 'Nuevo blend de temporada, desde hoy en la barra.', en: 'New seasonal blend, at the bar from today.' }),
  /** Relative time label ("1 h"). */
  time: localized.default('1 h'),
  likes: z.string().default('214'),
  comments: z.string().default('38'),
  shares: z.string().default('12'),
  /** Card width in px at app scale (scale the whole layer with `zoom`). */
  width: z.number().default(300),
  /** Media aspect, width / height. Defaults per platform. */
  aspect: z.number().optional(),
});
export type PostCardProps = z.input<typeof postCardSchema>;

const L = {
  es: {
    more: '…Ver más', comments: 'comentarios', shares: 'compartidos',
    fb: ['Me gusta', 'Comentar', 'Enviar', 'Compartir'],
    li: ['Recomendar', 'Comentar', 'Compartir', 'Enviar'],
    likedBy: 'Me gusta:', others: 'personas', followers: 'seguidores', sound: 'sonido original',
  },
  en: {
    more: '…See more', comments: 'comments', shares: 'shares',
    fb: ['Like', 'Comment', 'Send', 'Share'],
    li: ['Like', 'Comment', 'Repost', 'Send'],
    likedBy: 'Liked by', others: 'people', followers: 'followers', sound: 'original sound',
  },
} satisfies Record<Locale, unknown>;

/**
 * A post as it looks in each network's own feed — the thing Planer schedules.
 * Instagram and Facebook follow the release visuals; TikTok is the 9:16 player,
 * LinkedIn the feed update. Demo data only.
 */
export function PostCard(input: PostCardProps) {
  const p = postCardSchema.parse(input);
  const { locale } = usePiece();
  const t = L[locale];
  const caption = tr(p.caption, locale);
  const time = tr(p.time, locale);
  const Avatar = ({ size, badge }: { size: number; badge?: boolean }) => (
    <div className="relative shrink-0">
      <img src={asset(p.avatar)} alt="" className="rounded-full bg-muted object-cover" style={{ width: size, height: size }} />
      {badge && (
        <img
          src={platformIcon(p.platform)}
          alt=""
          className="absolute -right-0.5 -bottom-0.5 rounded-full ring-2 ring-card"
          style={{ width: size * 0.4, height: size * 0.4 }}
        />
      )}
    </div>
  );
  const Media = ({ aspect, className }: { aspect: number; className?: string }) => (
    <div className={cn('overflow-hidden bg-muted', className)} style={{ aspectRatio: String(p.aspect ?? aspect) }}>
      <img src={asset(p.image)} alt="" className="h-full w-full object-cover" />
    </div>
  );

  if (p.platform === 'tiktok') {
    return (
      <div className="relative overflow-hidden rounded-xl bg-black text-white shadow-2xl" style={{ width: p.width, aspectRatio: String(p.aspect ?? 9 / 16) }}>
        <img src={asset(p.image)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <div className="absolute right-2 bottom-16 flex flex-col items-center gap-3.5 text-[10px] font-semibold">
          <Avatar size={34} />
          {[
            [Heart, p.likes],
            [MessageCircle, p.comments],
            [Bookmark, p.shares],
            [Share2, ''],
          ].map(([Icon, n], i) => {
            const I = Icon as typeof Heart;
            return (
              <span key={i} className="flex flex-col items-center gap-0.5">
                <I className="size-6 fill-white/95" strokeWidth={1.5} />
                {n as string}
              </span>
            );
          })}
        </div>
        <div className="absolute right-14 bottom-3 left-3">
          <p className="text-[13px] font-semibold">@{p.handle}</p>
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-white/90">{caption}</p>
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-white/80">
            <Music2 className="size-3" /> {t.sound} · {p.name}
          </p>
        </div>
      </div>
    );
  }

  if (p.platform === 'instagram') {
    return (
      <div className={cn(FLOAT_CARD, 'overflow-hidden rounded-xl shadow-2xl')} style={{ width: p.width }}>
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <div className="rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-[2px]">
            <div className="rounded-full bg-card p-[1.5px]">
              <Avatar size={28} />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] leading-tight font-semibold">{p.handle}</p>
            <p className="text-[11px] text-muted-foreground">{p.name}</p>
          </div>
          <MoreHorizontal className="size-4 text-muted-foreground" />
        </div>
        <Media aspect={4 / 5} />
        <div className="px-3 pt-2.5 pb-3">
          <div className="flex items-center gap-3.5">
            <Heart className="size-5 fill-[#F33E58] text-[#F33E58]" />
            <MessageCircle className="size-5" />
            <Send className="size-5" />
            <Bookmark className="ml-auto size-5" />
          </div>
          <p className="mt-2 text-[12px] font-semibold">
            {t.likedBy} {p.likes} {t.others}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug">
            <span className="font-semibold">{p.handle}</span> {caption}
          </p>
          <p className="mt-1 text-[10px] tracking-wide text-muted-foreground uppercase">{time}</p>
        </div>
      </div>
    );
  }

  if (p.platform === 'linkedin') {
    return (
      <div className={cn(FLOAT_CARD, 'rounded-xl shadow-2xl')} style={{ width: p.width }}>
        <div className="flex items-start gap-2.5 p-3 pb-2">
          <img src={asset(p.avatar)} alt="" className="size-10 rounded-md bg-muted object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] leading-tight font-semibold">{p.name}</p>
            <p className="text-[11px] text-muted-foreground">
              4.812 {t.followers}
            </p>
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              {time} · <Globe className="size-2.5" />
            </p>
          </div>
          <MoreHorizontal className="size-4 text-muted-foreground" />
        </div>
        <p className="px-3 pb-2 text-[12px] leading-snug text-foreground/85">
          {caption} <span className="text-muted-foreground">{t.more}</span>
        </p>
        <Media aspect={1.91} />
        <div className="flex items-center justify-between px-3 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="flex -space-x-1">
              <span className="flex size-4 items-center justify-center rounded-full bg-[#0A66C2] ring-2 ring-card">
                <ThumbsUp className="size-2.5 fill-white text-white" />
              </span>
              <span className="flex size-4 items-center justify-center rounded-full bg-[#DF704D] ring-2 ring-card">
                <Heart className="size-2.5 fill-white text-white" />
              </span>
            </span>
            {p.likes}
          </span>
          <span>
            {p.comments} {t.comments} · {p.shares} {t.shares}
          </span>
        </div>
        <div className="mx-3 grid grid-cols-4 border-t border-border/60 py-2 text-[10px] text-muted-foreground">
          {t.li.map((label, i) => {
            const I = [ThumbsUp, MessageCircle, Repeat2, Send][i];
            return (
              <span key={label} className="flex items-center justify-center gap-1 whitespace-nowrap">
                <I className="size-3" />
                {label}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  // facebook — mirrors spa/components/releases/visuals/facebook-launch-visual.tsx
  return (
    <div className={cn(FLOAT_CARD, 'rounded-xl p-3 shadow-2xl')} style={{ width: p.width }}>
      <div className="flex items-start gap-2.5">
        <Avatar size={36} badge />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] leading-tight font-semibold">{p.name}</p>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            {time} · <Globe className="size-2.5" />
          </p>
        </div>
        <MoreHorizontal className="size-4 text-muted-foreground" />
        <X className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-[12px] text-foreground/80">
        {caption} <span className="text-muted-foreground">{t.more}</span>
      </p>
      <Media aspect={236 / 190} className="mt-2 rounded-md" />
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="flex -space-x-1">
            <span className="flex size-4 items-center justify-center rounded-full bg-[#1877F2] ring-2 ring-card">
              <ThumbsUp className="size-2.5 fill-white text-white" />
            </span>
            <span className="flex size-4 items-center justify-center rounded-full bg-[#F33E58] ring-2 ring-card">
              <Heart className="size-2.5 fill-white text-white" />
            </span>
          </span>
          {p.likes}
        </span>
        <span>
          {p.comments} {t.comments} · {p.shares} {t.shares}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-4 border-t border-border/60 pt-2 text-[10px] text-muted-foreground">
        {t.fb.map((label, i) => {
          const I = [ThumbsUp, MessageCircle, Send, Share2][i];
          return (
            <span key={label} className="flex items-center justify-center gap-0.5 whitespace-nowrap">
              <I className="size-3" />
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

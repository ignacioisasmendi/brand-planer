import { CalendarClock, Clapperboard, Copy } from 'lucide-react';
import { z } from 'zod';
import { asset } from '../lib/asset';
import { cn } from '../lib/cn';
import { usePiece } from '../lib/context';
import { localized, tr } from '../lib/i18n';

const TINTS = {
  violet: 'bg-gradient-to-br from-violet-400 to-fuchsia-300',
  amber: 'bg-gradient-to-br from-amber-300 to-orange-400',
  teal: 'bg-gradient-to-br from-teal-300 to-cyan-500',
  rose: 'bg-gradient-to-br from-rose-300 to-pink-500',
  slate: 'bg-gradient-to-br from-slate-300 to-slate-500',
  lime: 'bg-gradient-to-br from-lime-300 to-emerald-400',
};

const cell = z.object({
  /** Image under public/; falls back to a gradient `tint`. */
  image: z.string().optional(),
  tint: z.enum(['violet', 'amber', 'teal', 'rose', 'slate', 'lime']).default('slate'),
  /** Badge date for a scheduled post, e.g. "3 oct". Omit for published ones. */
  scheduled: z.string().optional(),
  /** Blue "NEW" badge + ring: the post being previewed. */
  isNew: z.boolean().default(false),
  format: z.enum(['post', 'reel', 'carousel']).default('post'),
});

export const feedGridSchema = z.object({
  username: z.string().default('cafe.origen'),
  avatar: z.string().default('assets/photos/cafe-icon.png'),
  posts: z.string().default('248'),
  followers: z.string().default('12,4 mil'),
  following: z.string().default('310'),
  bio: localized.default({ es: 'Café de especialidad ☕ Palermo, Buenos Aires', en: 'Specialty coffee ☕ Palermo, Buenos Aires' }),
  cells: z.array(cell).default([]),
  width: z.number().default(360),
});

/**
 * The spa's feed preview (components/instagram-preview: ProfileHeader +
 * PostsGrid): an Instagram profile with scheduled posts slotted into the grid,
 * each marked with a CalendarClock date badge.
 */
export function FeedGrid(input: z.input<typeof feedGridSchema>) {
  const p = feedGridSchema.parse(input);
  const { locale } = usePiece();
  const t = locale === 'en' ? ['Posts', 'Followers', 'Following'] : ['Publicaciones', 'Seguidores', 'Seguidos'];
  return (
    <div className="overflow-hidden bg-card text-foreground" style={{ width: p.width }}>
      <div className="px-4 pt-3">
        <div className="mb-3 flex items-center gap-4">
          <img src={asset(p.avatar)} alt="" className="h-20 w-20 shrink-0 rounded-full bg-muted object-cover" />
          <div className="flex flex-1 justify-around text-center">
            {[p.posts, p.followers, p.following].map((n, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-sm font-semibold">{n}</span>
                <span className="text-xs text-muted-foreground">{t[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="m-0 mb-0.5 text-sm font-semibold">@{p.username}</p>
        <p className="m-0 mb-3 text-xs leading-tight whitespace-pre-wrap">{tr(p.bio, locale)}</p>
      </div>
      <div className="grid grid-cols-3 gap-px">
        {p.cells.map((c, i) => {
          const FormatIcon = c.format === 'reel' ? Clapperboard : c.format === 'carousel' ? Copy : null;
          return (
            <div key={i} className={cn('relative aspect-square overflow-hidden', c.isNew && 'z-10 ring-2 ring-[#0095f6] ring-inset')}>
              {c.image ? (
                <img src={asset(c.image)} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className={cn('h-full w-full', TINTS[c.tint])} />
              )}
              {FormatIcon && <FormatIcon className="absolute top-1 right-1 h-3.5 w-3.5 text-white drop-shadow-md" />}
              {c.isNew ? (
                <div className="absolute bottom-1 left-1 rounded bg-[#0095f6] px-1 py-0.5 text-[8px] leading-none font-bold text-white">NEW</div>
              ) : c.scheduled ? (
                <div className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded bg-black/70 px-1 py-0.5 text-[8px] leading-none font-semibold text-white">
                  <CalendarClock className="h-2.5 w-2.5" />
                  {c.scheduled}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

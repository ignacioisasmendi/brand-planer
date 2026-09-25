/**
 * Full Planer screens, ported from spa/components/design-system/{screens,composites}
 * (themselves faithful mirrors of the real app). Each is wrapped here with a fixed
 * pixel box and a zod schema so content JSON can use it as a layer.
 *
 * Every prop the spa screen accepts passes through (`.passthrough()`), e.g.
 * AnalyticsScreen's `kpis`, `trend`, `topPosts`, or AppFrame's `clientName`.
 * UI chrome is Spanish only, as in the spa design-system copies.
 */
import type { ComponentType, ReactNode } from 'react';
import { z } from 'zod';
import { cn } from '../lib/cn';
import { AnalyticsScreen as Analytics } from './app/analytics-screen';
import { AppFrame as Frame } from './app/app-frame';
import { CalendarScreen as Calendar } from './app/calendar-screen';
import { CampaignCard as Campaign } from './app/campaign-card';
import { DashboardScreen as Dashboard } from './app/dashboard-screen';
import { EngagementScreen as Engagement } from './app/engagement-screen';
import { FounderBanner as Founder } from './app/founder-banner';
import { MediaScreen as Media } from './app/media-screen';
import { PlanBadge as Plan } from './app/plan-badge';
import { SchedulePostModal as Composer } from './app/schedule-post-modal-screen';
import { TasksScreen as Tasks } from './app/tasks-screen';
import { TrialBanner as Trial } from './app/trial-banner';

const box = (width: number, height: number) =>
  z
    .object({
      /** Screen size in px (app scale; use the layer's `zoom` to blow it up). */
      width: z.number().default(width),
      height: z.number().default(height),
      /** Drop the rounded border + shadow, e.g. when inside a BrowserFrame. */
      bare: z.boolean().default(false),
    })
    .passthrough();

function screen<P extends object>(C: ComponentType<P>, w: number, h: number, extra?: (p: Record<string, unknown>) => Record<string, unknown>) {
  const schema = box(w, h);
  function Screen(input: z.input<typeof schema> & { children?: ReactNode }) {
    const { width, height, bare, ...rest } = schema.parse(input) as z.output<typeof schema> & Record<string, unknown>;
    const props = { ...rest, ...(extra?.({ width, height }) ?? {}), children: input.children, className: 'h-full w-full' };
    return (
      <div className={cn('overflow-hidden bg-background text-foreground', !bare && 'rounded-xl border shadow-2xl')} style={{ width, height }}>
        <C {...(props as P)} />
      </div>
    );
  }
  return { schema, Screen };
}

// Sidebar is w-64 (256px); content column is max-w-5xl with p-4, card p-6.
const analytics = screen(Analytics, 1240, 812, ({ width }) => ({
  chartWidth: Math.min(1024, (width as number) - 256 - 32) - 48 - 2,
}));
export const analyticsScreenSchema = analytics.schema;
export const AnalyticsScreen = analytics.Screen;

const dashboard = screen(Dashboard, 1240, 780);
export const dashboardScreenSchema = dashboard.schema;
export const DashboardScreen = dashboard.Screen;

const engagement = screen(Engagement, 1240, 780);
export const engagementScreenSchema = engagement.schema;
export const EngagementScreen = engagement.Screen;

const media = screen(Media, 1240, 780);
export const mediaScreenSchema = media.schema;
export const MediaScreen = media.Screen;

const calendar = screen(Calendar, 1240, 780);
export const calendarScreenSchema = calendar.schema;
export const CalendarScreen = calendar.Screen;

const tasks = screen(Tasks, 1240, 780);
export const tasksScreenSchema = tasks.schema;
export const TasksScreen = tasks.Screen;

const composer = screen(Composer, 1100, 720);
export const schedulePostModalSchema = composer.schema;
export const SchedulePostModal = composer.Screen;

const frame = screen(Frame, 1240, 780);
export const appFrameSchema = frame.schema;
export const AppFrame = frame.Screen;

// Composites: small pieces, no fixed box.
const loose = <P extends object>(C: ComponentType<P>, width?: number) => {
  const schema = z.object({ width: z.number().optional() }).passthrough();
  function Loose(input: z.input<typeof schema>) {
    const { width: w = width, ...rest } = schema.parse(input) as { width?: number } & Record<string, unknown>;
    return (
      <div style={{ width: w }} className="text-foreground">
        <C {...(rest as P)} />
      </div>
    );
  }
  return { schema, Loose };
};

const campaign = loose(Campaign, 340);
export const campaignCardSchema = campaign.schema;
export const CampaignCard = campaign.Loose;

const plan = loose(Plan);
export const planBadgeSchema = plan.schema;
export const PlanBadge = plan.Loose;

const trial = loose(Trial, 720);
export const trialBannerSchema = trial.schema;
export const TrialBanner = trial.Loose;

const founder = loose(Founder, 720);
export const founderBannerSchema = founder.schema;
export const FounderBanner = founder.Loose;

/**
 * Layers: how content JSON composes primitives + mockups without code.
 * A layer names a catalog component, its props, and where it sits:
 *
 *   { "use": "PostCard", "props": {...}, "x": 130, "y": 34, "zoom": 1.5 }
 *
 * x/y are px from the top-left of the stage the layer lives in (right/bottom
 * work too). `zoom` scales the component's layout (CSS zoom), so mockups built
 * at app scale can be blown up for artwork. Frames (PhoneFrame, BrowserFrame)
 * take nested `children` layers that flow inside their screen.
 */
import type { ComponentType, CSSProperties } from 'react';
import { z } from 'zod';
import * as M from '../mockups';
import * as P from '../primitives';

type Entry = { schema: z.ZodTypeAny; C: ComponentType<any> };

/** Every component usable from content JSON, by its catalog name. */
export const REGISTRY = {
  // primitives
  Logo: { schema: P.logoSchema, C: P.Logo },
  Wordmark: { schema: P.wordmarkSchema, C: P.Wordmark },
  LogoLockup: { schema: P.logoLockupSchema, C: P.LogoLockup },
  Pill: { schema: P.pillSchema, C: P.Pill },
  Eyebrow: { schema: P.eyebrowSchema, C: P.Eyebrow },
  Headline: { schema: P.headlineSchema, C: P.Headline },
  Subhead: { schema: P.subheadSchema, C: P.Subhead },
  BigStat: { schema: P.bigStatSchema, C: P.BigStat },
  Cta: { schema: P.ctaSchema, C: P.Cta },
  Sparkle: { schema: P.sparkleSchema, C: P.Sparkle },
  HandArrow: { schema: P.handArrowSchema, C: P.HandArrow },
  CouponTicket: { schema: P.couponTicketSchema, C: P.CouponTicket },
  // mockups
  PostCard: { schema: M.postCardSchema, C: M.PostCard },
  PublicationCard: { schema: M.publicationCardSchema, C: M.PublicationCard },
  CalendarWeek: { schema: M.calendarWeekSchema, C: M.CalendarWeek },
  KanbanColumn: { schema: M.kanbanColumnSchema, C: M.KanbanColumn },
  PhoneFrame: { schema: M.phoneFrameSchema, C: M.PhoneFrame },
  BrowserFrame: { schema: M.browserFrameSchema, C: M.BrowserFrame },
  AnalyticsCard: { schema: M.analyticsCardSchema, C: M.AnalyticsCard },
  NotificationToast: { schema: M.notificationToastSchema, C: M.NotificationToast },
  AvatarStack: { schema: M.avatarStackSchema, C: M.AvatarStack },
  NotebookPage: { schema: M.notebookPageSchema, C: M.NotebookPage },
  FeedGrid: { schema: M.feedGridSchema, C: M.FeedGrid },
} satisfies Record<string, Entry>;

export type LayerName = keyof typeof REGISTRY;

export interface Layer {
  use: LayerName;
  props?: Record<string, unknown>;
  x?: number;
  y?: number;
  right?: number;
  bottom?: number;
  zoom?: number;
  rotate?: number;
  opacity?: number;
  children?: Layer[];
}

export const layerSchema: z.ZodType<Layer> = z.lazy(() =>
  z
    .object({
      use: z.enum(Object.keys(REGISTRY) as [LayerName, ...LayerName[]]),
      props: z.record(z.unknown()).optional(),
      x: z.number().optional(),
      y: z.number().optional(),
      right: z.number().optional(),
      bottom: z.number().optional(),
      zoom: z.number().optional(),
      rotate: z.number().optional(),
      opacity: z.number().optional(),
      children: z.array(layerSchema).optional(),
    })
    .superRefine((l, ctx) => {
      const r = REGISTRY[l.use].schema.safeParse(l.props ?? {});
      if (!r.success) {
        for (const issue of r.error.issues) {
          ctx.addIssue({ ...issue, path: ['props', ...issue.path], message: `${l.use}: ${issue.message}` });
        }
      }
    }),
);

export const layersSchema = z.array(layerSchema).default([]);

function RenderLayer({ layer, flow }: { layer: Layer; flow?: boolean }) {
  const { C } = REGISTRY[layer.use] as Entry;
  const positioned = !flow || layer.x !== undefined || layer.y !== undefined || layer.right !== undefined || layer.bottom !== undefined;
  // CSS zoom scales the element's own offsets too; divide so x/y stay stage px.
  const z = layer.zoom ?? 1;
  const at = (v?: number) => (v === undefined ? undefined : v / z);
  const style: CSSProperties = {
    position: positioned ? 'absolute' : 'relative',
    left: at(layer.x),
    top: at(layer.y),
    right: at(layer.right),
    bottom: at(layer.bottom),
    zoom: layer.zoom,
    transform: layer.rotate ? `rotate(${layer.rotate}deg)` : undefined,
    opacity: layer.opacity,
    flexShrink: 0,
  };
  return (
    <div style={style}>
      <C {...(layer.props ?? {})}>
        {layer.children?.map((child, i) => <RenderLayer key={i} layer={child} flow />)}
      </C>
    </div>
  );
}

/** Draws layers in order (later = on top) inside a positioned box. */
export function Layers({ layers }: { layers: Layer[] }) {
  return (
    <>
      {layers.map((l, i) => (
        <RenderLayer key={i} layer={l} />
      ))}
    </>
  );
}

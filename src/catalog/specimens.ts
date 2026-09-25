/**
 * The catalog specimens: one entry per component (or variant) with the props,
 * zoom and box it is shown at. Shared by `npm run catalog` (one PNG each, for
 * CATALOG.md) and the ComponentSheet (`npm run sheet`, all of them on one page).
 * Add a row here whenever a primitive or mockup is added to REGISTRY.
 */

export type Group = 'Primitives' | 'Mockups';

export type Spec = {
  group: Group;
  /** Catalog name — a REGISTRY key. */
  use: string;
  /** Short variant note shown under the name (e.g. "platform: tiktok"). */
  note?: string;
  props?: Record<string, unknown>;
  zoom?: number;
  width: number;
  height: number;
  surface?: 'card' | 'stage';
};

export const SPECIMENS: Spec[] = [
  // primitives
  { group: 'Primitives', use: 'Logo', props: { size: 120 }, width: 400, height: 240 },
  { group: 'Primitives', use: 'Wordmark', props: { size: 72 }, width: 500, height: 240 },
  { group: 'Primitives', use: 'LogoLockup', props: { size: 90, platform: 'instagram' }, width: 500, height: 240 },
  { group: 'Primitives', use: 'Pill', props: { label: 'Nuevo', size: 22 }, width: 400, height: 200 },
  { group: 'Primitives', use: 'Eyebrow', props: { label: 'Para agencias', size: 22 }, width: 400, height: 200 },
  { group: 'Primitives', use: 'Headline', props: { text: 'Tu semana, [[programada]]', size: 64 }, width: 800, height: 240 },
  { group: 'Primitives', use: 'Subhead', props: { text: 'en tus **primeros 2 meses**, en cualquier plan.', size: 30 }, width: 800, height: 200 },
  { group: 'Primitives', use: 'BigStat', props: { value: '30%', suffix: 'OFF', size: 150 }, width: 600, height: 260 },
  { group: 'Primitives', use: 'Cta', props: { label: 'Probalo gratis', size: 28 }, width: 500, height: 200 },
  { group: 'Primitives', use: 'Sparkle', props: { size: 80, color: 'brand' }, width: 300, height: 200 },
  { group: 'Primitives', use: 'HandArrow', props: { width: 120, height: 240 }, width: 300, height: 300, surface: 'stage' },
  {
    group: 'Primitives',
    use: 'CouponTicket',
    props: { eyebrow: 'Pase reservado', title: 'Tu lugar\nen Planer', code: 'PLANER30', foot: 'Cualquier plan', stubValue: '2', stubUnit: 'Meses' },
    width: 600, height: 360, surface: 'stage',
  },
  { group: 'Primitives', use: 'IntegrationTiles', props: { left: 'planer', right: 'claude', size: 200 }, width: 700, height: 440 },
  { group: 'Primitives', use: 'IntegrationHandoff', props: { from: 'planer', to: 'claude', width: 640 }, width: 700, height: 440 },
  { group: 'Primitives', use: 'LogoChip', props: { logo: 'planer', size: 56 }, width: 500, height: 240, surface: 'stage' },
  // mockups
  { group: 'Mockups', use: 'PostCard', note: 'platform: instagram', props: { platform: 'instagram' }, zoom: 1.2, width: 520, height: 640, surface: 'stage' },
  { group: 'Mockups', use: 'PostCard', note: 'platform: facebook', props: { platform: 'facebook', width: 260 }, zoom: 1.4, width: 520, height: 640, surface: 'stage' },
  { group: 'Mockups', use: 'PostCard', note: 'platform: tiktok', props: { platform: 'tiktok', width: 250, image: 'assets/photos/cafetera.jpg' }, zoom: 1.2, width: 520, height: 640, surface: 'stage' },
  { group: 'Mockups', use: 'PostCard', note: 'platform: linkedin', props: { platform: 'linkedin', width: 320 }, zoom: 1.2, width: 520, height: 640, surface: 'stage' },
  { group: 'Mockups', use: 'PublicationCard', props: { caption: 'Lanzamiento del blend de primavera', image: 'assets/photos/cafe-especialidad.jpg', approved: true }, zoom: 1.4, width: 500, height: 560 },
  {
    group: 'Mockups',
    use: 'CalendarWeek',
    props: {
      days: 5,
      posts: [
        { day: 3, time: '09:30', caption: 'Colección primavera', status: 'published', image: 'assets/photos/croissant.jpg' },
        { day: 4, time: '12:00', caption: 'Nuevo blend', status: 'scheduled', image: 'assets/photos/cafe-especialidad.jpg' },
        { day: 6, time: '18:00', caption: 'Detrás de la barra', platform: 'tiktok', status: 'draft', tint: 'teal' },
      ],
    },
    width: 900, height: 560,
  },
  {
    group: 'Mockups',
    use: 'KanbanColumn',
    props: {
      name: 'En progreso',
      tasks: [
        { title: 'Editar video de lanzamiento', labels: ['Video'], priority: 'URGENT', dueDate: '12 mar', cover: 'red' },
        { title: 'Escribir copies de la semana', labels: ['Contenido'], priority: 'HIGH', checklistDone: 3, checklistTotal: 5 },
      ],
    },
    zoom: 1.3, width: 560, height: 520,
  },
  { group: 'Mockups', use: 'NotebookPage', props: { editedBy: 'Ana', blocks: [{ type: 'paragraph', text: 'Tono cálido y cercano.' }, { type: 'todos', items: [{ text: 'Fotos del latte art', done: true }, { text: 'Programar el lanzamiento' }] }] }, width: 700, height: 560 },
  {
    group: 'Mockups',
    use: 'FeedGrid',
    props: {
      cells: [
        { scheduled: '3 oct', image: 'assets/photos/cafe-especialidad.jpg' },
        { scheduled: '1 oct', tint: 'amber', format: 'reel' },
        { image: 'assets/photos/croissant.jpg' },
        { image: 'assets/photos/coffee.jpg', format: 'carousel' },
        { tint: 'rose' },
        { image: 'assets/photos/cafetera.jpg' },
      ],
    },
    zoom: 1.2, width: 520, height: 560, surface: 'stage',
  },
  { group: 'Mockups', use: 'PhoneFrame', props: { width: 300, center: true }, width: 500, height: 700, surface: 'stage' },
  { group: 'Mockups', use: 'BrowserFrame', props: { width: 700, height: 400 }, width: 900, height: 560, surface: 'stage' },
  { group: 'Mockups', use: 'AnalyticsCard', props: { chart: 'bars', label: 'Tasa de interacción', value: '5,0%' }, zoom: 2, width: 500, height: 360 },
  { group: 'Mockups', use: 'NotificationToast', note: 'variant: pill', props: { icon: 'Clock', title: 'Jueves 29', meta: '11:45' }, zoom: 2, width: 500, height: 200 },
  { group: 'Mockups', use: 'NotificationToast', note: 'variant: toast', props: { variant: 'toast', platform: 'instagram', title: 'Publicado en Instagram', meta: 'Nuevo blend de temporada · hace 1 min' }, zoom: 1.6, width: 700, height: 240 },
  { group: 'Mockups', use: 'AvatarStack', props: { extra: 4, size: 48, label: '7 personas' }, width: 500, height: 200 },
  // app screens + composites (ported from spa/components/design-system)
  { group: 'Mockups', use: 'DashboardScreen', width: 1300, height: 840 },
  { group: 'Mockups', use: 'AnalyticsScreen', width: 1300, height: 872 },
  { group: 'Mockups', use: 'EngagementScreen', width: 1300, height: 840 },
  { group: 'Mockups', use: 'MediaScreen', width: 1300, height: 840 },
  { group: 'Mockups', use: 'CalendarScreen', width: 1300, height: 840 },
  { group: 'Mockups', use: 'CalendarScreen', note: 'view: week', props: { view: 'week' }, width: 1300, height: 840 },
  { group: 'Mockups', use: 'TasksScreen', width: 1300, height: 840 },
  { group: 'Mockups', use: 'SchedulePostModal', width: 1160, height: 780 },
  { group: 'Mockups', use: 'AppFrame', note: 'active: tools', props: { active: 'tools' }, width: 1300, height: 840 },
  { group: 'Mockups', use: 'CampaignCard', zoom: 1.3, width: 560, height: 380 },
  { group: 'Mockups', use: 'PlanBadge', zoom: 2.5, width: 400, height: 160 },
  { group: 'Mockups', use: 'TrialBanner', zoom: 1.2, width: 900, height: 180 },
  { group: 'Mockups', use: 'FounderBanner', zoom: 1.2, width: 900, height: 180 },
];

/** File name of a specimen's thumbnail in docs/catalog/ (without .png). */
export function specimenName(spec: Spec, index: number): string {
  const same = SPECIMENS.slice(0, index).filter((s) => s.use === spec.use).length;
  const platform = (spec.props?.platform as string | undefined) ?? '';
  return same === 0 && !platform ? spec.use : `${spec.use}-${platform || same + 1}`;
}

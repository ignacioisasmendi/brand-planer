# CLAUDE.md — brand (graphics as code)

Planer's marketing graphics: Remotion 4 + React 19 + Tailwind v4 + zod. See the workspace
[../CLAUDE.md](../CLAUDE.md). The vocabulary lives in [CATALOG.md](CATALOG.md); the workflow
and hard rules live in the user-level `brand-graphics` skill.

## Commands

```bash
npm run render -- content/<yyyy-mm>-<slug>   # every JSON in the folder → out/<folder>/<file>-<locale>-<theme>.png
npm run studio                               # Remotion Studio: templates + Specimen
npm run catalog                              # re-render docs/catalog/ thumbnails
npm run sync-tokens                          # regenerate src/tokens/ from ../spa (run after spa token changes)
npm run typecheck                            # tsc --noEmit
```

## Layout

- `src/tokens/`: **generated**, do not edit. Derived marketing tokens (brand tints, the
  stage gradient) are `color-mix()` rules in `scripts/derived.ts`.
- `src/primitives/`, `src/mockups/`: components, each with a zod schema, registered in
  `src/templates/stage.tsx` (`REGISTRY`) so content JSON can use them as layers.
- `src/templates/`: `layouts.tsx` (SplitLayout / PosterLayout) + `index.tsx` (the 7 formats).
- `content/`: one folder per piece. `content/_catalog/` has the demos (also Studio defaults).
- `out/`: renders (git-ignored).

## Gotchas

- CSS `zoom` scales an element's own `left`/`top`. Layers and stage canvases divide
  offsets by the zoom to compensate, so keep that when touching `RenderLayer`/`Stage`.
- `cn()` is clsx + tailwind-merge, like the spa. Without the merge, overrides such as the
  status badge colours lose to the base `bg-primary`.
- Renders put temp files in `.cache/tmp` (the disk is tight; a render once filled it).
- Remotion's `Still` merges `defaultProps` under input props: a default `zoom` or size
  leaks into renders that don't set it.

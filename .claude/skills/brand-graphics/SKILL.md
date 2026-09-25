---
name: brand-graphics
description: Make Planer marketing graphics with the brand system (graphics as code, Remotion) in /home/nacho/Documents/planer/brand. Use for any request for a banner, gráfica, pieza, imagen de release, post / carrusel / story para Instagram, post de LinkedIn, portada, email banner, OG image or social card for Planer, e.g. "armá un banner para…", "haceme un post anunciando…", "la imagen del release de…", "una story para…". Planer workspace only.
---

# Planer brand graphics

Every Planer marketing image is produced by the **brand** repo
(`/home/nacho/Documents/planer/brand`): Remotion + React + Tailwind v4, with tokens
generated from the spa's design system. Pieces are **content JSON** rendered
through **templates** that compose **primitives** and **mockups**. You never lay
out an image from scratch.

## Flow

1. **Read `brand/CATALOG.md`.** It is the vocabulary: every template, primitive and
   mockup, with exact names, props and thumbnails. When the user names one
   ("usá PostCard en un IgPost"), that is the literal component or template.
   To see them all at once, open `brand/docs/catalog/sheet-light.png` (every component
   under its name; regenerate with `npm run sheet`).
2. **Pick an existing template** for the format:
   ReleaseHero 1600×900 · IgPost 1080² · IgCarouselSlide 1080×1350 · IgStory 1080×1920 ·
   LinkedInPost 1200×627 · EmailBanner 1200×600 · OgImage 1200×630.
3. **Write the JSON** at `brand/content/<yyyy-mm>-<slug>/<template-file>.json`
   (`release-hero`, `ig-post`, `ig-carousel-slide[-NN]`, `ig-story`, `linkedin-post`,
   `email-banner`, `og-image`). Start from the closest existing piece in `content/`
   (`content/_catalog/` has one demo per template). Set `variants` for the
   locales and themes wanted, and `scale` (3 for release images, 2 for anything
   retina, else 1).
4. **Render:** `cd /home/nacho/Documents/planer/brand && npm run render -- content/<folder>`
   → `out/<folder>/<file>-<locale>-<theme>.png`. Zod validates the props first; fix
   whatever it reports.
5. **Open every PNG with Read and review it.** Look for:
   - text cut off, overflowing, or wrapping into a lone orphan word
   - copy colliding with layers, layers colliding with each other or bleeding off by accident
   - contrast, especially in dark, and brand-violet text on tinted fills
   - alignment: copy aligned to its column, even margins, nothing floating randomly
   Adjust (`headlineSize`, layer `x`/`y`/`zoom`/`rotate`, copy length), re-render
   and look again until it is clean. Never deliver a PNG you have not looked at.
6. **Deliver the paths** (absolute) plus a line on what each variant is.

## Hard rules

- **Font is Inter, always** (the local variable woff2 the system loads). Geist Mono
  only for code or tabular numbers. No other fonts, no Google Fonts.
- **Colours come only from `src/tokens`**, generated from `spa/app/globals.css` by
  `npm run sync-tokens`. Use semantic Tailwind utilities (`bg-card`,
  `text-muted-foreground`, `bg-brand`, `bg-brand-tint-2`, `text-brand-text`…) or
  `var(--token)`. The brand violet `--brand` (#9b5ad7) is the same in both themes
  and is for logo, brand surfaces and campaign accents. UI inside mockups uses the
  theme's `--primary`, as the app does. Never type a hex. Platform logo colours
  inside mockups, copied from the spa, are the only exception.
- **No loose HTML, no ad-hoc styles, no screenshots of the app.** If a piece needs
  something that does not exist, **first add it as a reusable component or template**:
  1. component in `src/primitives/` or `src/mockups/` with a zod `…Schema`. For
     product UI, copy styles from the real spa component, never import from the spa.
  2. register it in `REGISTRY` in `src/templates/stage.tsx` (or add the template to
     `TEMPLATES` in `src/templates/index.tsx` with a demo in `content/_catalog/`)
  3. add a specimen to `src/catalog/specimens.ts`, a row to `CATALOG.md`, and run
     `npm run catalog && npm run sheet`

  Then use it from the JSON.
- **Copy is Spanish, rioplatense with voseo** ("Programá", "Tenés", "Probalo"),
  unless the user asks for English. For bilingual pieces use `{ "es": …, "en": … }`,
  and the English is a natural rewrite, not a literal translation. No emoji-heavy
  hype, no "¡Increíble!". Lead with what the user can do.
- Demo data is fictional and neutral ("Café Origen", "Estudio Norte"). Never use
  real clients or handles. Photos live in `brand/public/assets/photos/`.
- `npm run typecheck` must pass after touching code. Don't commit unless asked.

## Handy details

- Copy markup inside any text: `**bold**` (foreground, for muted subheads),
  `[[accent]]` (brand violet), `\n` (line break).
- Layer `zoom` scales a component without moving it; `x`/`y` stay in canvas px.
  ReleaseHero's `stage.canvas` of 520×440 is the spa release-visual canvas, so the
  coordinates of `spa/components/releases/visuals/*.tsx` carry over 1:1.
- Studio for live tweaking: `npm run studio` (Templates folder + a `Specimen`
  composition for trying one component on its own).
- Disk is tight on this machine. Renders keep their temp files in `brand/.cache/`
  and clean up after themselves. If a render fails with ENOSPC, tell the user.
- Release announcements go through the `release-notes` agent, which uses
  ReleaseHero via this same system.

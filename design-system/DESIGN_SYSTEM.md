# Lepas UAE Design System

Source: the brand custom properties in lepasuae.com's `:root` (`--color-lepas-*`, `--font-source-sans-3`), plus its component markup (buttons, headings, cards).
The code mirrors these values in `tailwind.config.ts` (`lepas.*`), `app/globals.css`, and `design-system/tokens.json`. If a value changes, update all three.

## 1. Colours

### Primitives

| Token | Hex | Tailwind | Site variable | Role |
|---|---|---|---|---|
| `color/amber` | `#eb9201` | `lepas-amber` | `--color-lepas-amber` | Primary accent: CTAs, active states, focus, eyebrows |
| `color/amber-hover` | `#d68300` | `lepas-amber-hover` | `--color-lepas-amber-hover` | CTA hover |
| `color/black` | `#0a0a0a` | `lepas-black` | `--color-lepas-dark` | Dark sections, hero, footer |
| `color/graphite` | `#111111` | `lepas-graphite` | `--color-lepas-near-black` | Deep gradients |
| `color/ink` | `#1a1a1a` | `lepas-ink` | `--color-lepas-ink` | Body text, raised dark surfaces |
| `color/form-ink` | `#090e15` | `lepas-form-ink` | `--color-lepas-form-ink` | Dark form fields |
| `color/navy` | `#04182f` | `lepas-navy` | `--color-lepas-navy` | Secondary brand surface |
| `color/steel` | `#404040` | `lepas-steel` | — | Secondary text on light |
| `color/ash` | `#767676` | `lepas-ash` | — | Muted text on light (4.5:1 on white) |
| `color/mist` | `#bababa` | `lepas-mist` | — | Muted text on dark |
| `color/fog` | `#e0e0e0` | `lepas-fog` | — | Borders, dividers |
| `color/sand` | `#f3f2ef` | `lepas-sand` | — | Muted light surface |
| `color/cream` | `#f5f0eb` | `lepas-cream` | `--color-lepas-cream` | Warm light surface |
| `color/error` | `#c43000` | `lepas-error` | `--color-lepas-error` | Form errors |
| `color/success` | `#4caf50` | `lepas-success` | `--color-lepas-success` | Confirmations, completed steps |
| `color/whatsapp` | `#25d366` | literal | — | WhatsApp FAB only |

Alpha variants come from Tailwind opacity modifiers (`white/70`, `lepas-ink/25`…).

### Semantic

| Role | Token | → Primitive |
|---|---|---|
| Background | `bg/default` · `bg/inverse` · `bg/inverse-raised` · `bg/muted` · `bg/warm` · `bg/brand-deep` · `bg/field-dark` | white · black · ink · sand · cream · navy · form-ink |
| Text | `text/primary` · `text/secondary` · `text/muted` · `text/accent` | ink · steel · ash · amber |
| Text on dark | `text/on-inverse` · `-secondary` · `-muted` | white · white-a70 · white-a60 |
| Text on amber | `text/on-accent` | black |
| Border | `border/default` · `border/strong` · `border/focus` · `border/on-inverse` | fog · black-a25 · amber · white-a10 |
| Accent | `accent/primary` · `accent/primary-hover` | amber · amber-hover |
| Status | `status/error` · `status/success` | error · success |

**Contrast note:** text on amber is black, as on EXEED. Black on amber is 8.2:1 (6.7:1 on amber-hover), which passes WCAG AA and AAA. White on amber is only 2.4:1, so don't use it for text.

## 2. Typography

**Source Sans 3** (`next/font/google` → `--font-source-sans`) is used for both body and display text, matching lepasuae.com. **Almarai** loads for Arabic (`lang=ar`).

| Step | Size / line | Weight | Case | Use |
|---|---|---|---|---|
| display | clamp(32px, 3vw, 50px) / 1.08 | 700 | upper | Section statements ("PREMIUM PERFORMANCE. SPACE FOR ALL.") — `.heading-display` |
| h1 | 48 / 52 | 700 | upper | Page hero |
| h2 | 40 / 44 | 700 | upper | Section titles |
| h3 | 30 / 36 | 700 | — | Sub-sections |
| h4 | 20 / 28 | 700 | — | Card titles, footer column heads |
| body-lg | 18 / 28 | 400 | — | Section intros |
| body | 16 / 24 | 400 | — | Paragraphs |
| body-sm | 14 / 20 | 400 | — | Meta, footer links |
| button | 14 / 20 | 600, 0.025em | — | `.btn*` |
| nav | 15 / 15 | 400 | upper | Header links |
| eyebrow | 14 / 20 | 600, 0.25em | upper | `.eyebrow`, in amber |
| label | 12 / 16 | 500, 0.25em | upper | Form labels |
| caption | 12 / 16 | 400 | — | Helper text, dates |

## 3. Spacing & layout

4-based scale (`space/4` … `space/144`), the same as Tailwind's defaults.
- Container `.container-lepas`: max-width 1440, side padding 24 / 40 / 56 (base / md / lg). This follows the site's `--spacing-site: clamp(24px, 5vw, 80px)`.
- Section padding: 80 / 112 (base / md), set in `components/ui/Section.tsx`.
- Header height: `--header-h: clamp(56px, 4.63vw, 80px)`.

## 4. Radius

| Token | Value | Use |
|---|---|---|
| `radius/none` | 0 | All buttons, inputs, selects, checkboxes, images, media tiles and image cards (square, as on EXEED) |
| `radius/pill` | 100px (`rounded-pill`) | Optional pill chips |
| `radius/2xl` | 16px | Text-only panels (specs, testimonials, form and summary panels) |
| `radius/xl` | 12px | Small text-only tiles |
| `radius/full` | 9999px | Dots, toggles, round icon buttons |

## 5. Elevation

| Token | Use |
|---|---|
| `shadow/sm` | Card rest |
| `shadow/md` | Card hover |
| `shadow/lg` | FABs, dropdowns, scrolled header |
| `shadow/2xl` | Mega menu, search, chat panel |

## 6. Components

All components live in `components/`. Pages compose them; they never restyle them.

### Button (`components/ui/Button.tsx`, `.btn*` in globals.css)
Square (radius 0), padding 10 × 28, 14px semibold, tracking 0.025em, gap 8. Primary scales to 1.02 on hover and 0.98 on press. Disabled is 50% opacity.

| Variant | Fill | Text | Border | Hover |
|---|---|---|---|---|
| `primary` | amber | black | amber | amber-hover |
| `outline` | — | ink | ink-a25 | border ink, fill ink-a5 |
| `outline-light` | — | white | white-a60 | border white, fill white-a10 |
| `dark` | ink | white | ink | black |

### Inputs (`.input-field`, `.input-field-light`)
Square corners (radius 0), padding 12 × 16, 14px. The focus border is amber on both variants. The dark variant fills with form-ink.

### Checkbox / Range (`.checkbox-field*`, `.range-field*`)
Accent colour is amber.

### Toggle (`components/ui/Toggle.tsx`)
Segmented pill. The active segment is amber with white text.

### Card (`components/ui/Card.tsx`)
White, border fog, radius 16, shadow/sm. On hover: border steel-a40, shadow/md, lift 4px.

### Section (`components/ui/Section.tsx`) and PageHero (`components/ui/PageHero.tsx`)
Section switches between light and dark using `light`. PageHero is a full-bleed image with a dark gradient and an h1 at the bottom left.

### Navbar / Footer
The Navbar shows the Lepas wordmark | Al Ghurair Mobility lockup and uppercase 15px links in white-a70 → white. Its CTA is the primary pill. The Footer sits on black with the footer wordmark, six link columns, and social icons.

## 7. Assets

All brand imagery is in `public/design/assets/**`, mirroring lepasuae.com paths. Icons are in `public/svg/**`, video in `public/video/*.mp4`, and brochures in `public/brochures/`.
Model imagery is per slug (`l4`, `l6`, `l8`): `shades/`, `exterior/`, `interior/`, `performance/`, `safety/`, `lifestyle/`.

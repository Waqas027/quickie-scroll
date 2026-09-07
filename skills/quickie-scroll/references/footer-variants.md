# Footer variants

The footer is the film's last frame, not a link dump. Sixteen variants, each a
**layout + a motion recipe**. The user picks exactly one; the pick drives the
design. Never ship a generic centred row of links because the variant question
felt optional.

Wiring is data-only — a variant is a slug on the footer act:

```js
{ kind: 'footer', variant: 'luxury', tone: 'dark', /* content keys */ }
```

The engine renders one block list and applies the variant's CSS delta. Adding a
variant later = one entry in this file + one rule block in `quickie-scroll.js`
(`FOOT_VARIANTS` + the `.sw-foot--<slug>` rules). No skill logic changes.

---

## Content keys

Ask which of these the user wants (multi-select). Only what they pick is
rendered — an unpicked block emits **no DOM at all**, so it can never leave a
gap in the layout.

| Ask them | Key | Shape |
|---|---|---|
| Logo / wordmark | `brand`, `logo` | `brand: 'KALLA'` — or `logo: '/logo.svg'` for an image |
| Tagline | `tagline` | one line under the mark |
| Big closing line | `headline` | the footer's own headline; word-animated in the split variants below |
| Navigation | `links` | `[{ label, href }]` — a flat row |
| Product / grouped links | `columns` | `[{ title, links: [{ label, href }] }]` |
| Social links | `social` | `[{ label, href }]` — external `href`s open in a new tab |
| Contact | `contact` | `[{ label, href }]` — `mailto:` / `tel:` / plain address lines |
| Newsletter | `newsletter` | `{ title, placeholder, action: { label } }` |
| CTA button | `cta` | `{ label, href }` or `{ primary: {…}, secondary: {…} }` |
| Legal links | `legal` | `[{ label, href }]` — rendered small and dim |
| Copyright | `note` | `'© 2026 KALLA'` |
| Image / product shot | `media`, `mediaAlt` | a path; masked-reveals on entry |
| Marquee text | `marquee` | one phrase; repeated and scrolled |
| Custom content | `html` | verbatim markup |

Blocks always render in this source order — `brand, headline, marquee, media,
columns, links, social, contact, newsletter, cta, custom, legal, note` — and
each carries its index as `--sw-i`, which is what drives the stagger. The
variant's CSS re-places them; it never needs them re-ordered in the DOM.

## Motion, once, for all sixteen

Built into the engine — no Framer Motion, no GSAP, no dependency:

- **Reveal on entry.** An `IntersectionObserver` adds `is-in` when the footer
  comes into view. Blocks rise and fade in sequence, `--sw-i × --sw-stagger`.
- **Staggered typography.** Variants marked *word-split* below break the
  headline into `<span>`s that arrive one word at a time.
- **Parallax.** The engine's existing scroll read writes `--sw-py` (−1…1, the
  footer's travel through the viewport) on each footer. Variants use it for
  drift; nothing extra listens to scroll.
- **Magnetic hover.** One delegated `pointermove` per footer, desktop only —
  links lean toward the cursor via `--sw-mx/--sw-my`.
- **Reduced motion.** `prefers-reduced-motion: reduce` skips the observer
  entirely: everything is visible, static, and the marquee stops.

Per-variant knobs: `--sw-stagger` (default 80ms), `--sw-rise` (26px),
`--sw-pop` (scale). Anything more is that variant's own rules.

---

## The library

### 1. `minimal` — Minimal / Clean
**Layout** One hairline row: mark left, links centre, copyright right.
**Direction** Quiet. Small type, one rule, plenty of air, no boxes.
**Content** brand, links, legal, note.
**Motion** Single soft fade-up of the row. The default, and the right answer for a
site whose weight is all above it.

### 2. `luxury` — Luxury / Cinematic
**Layout** Centred column, wide letter-spaced wordmark over a hairline, generous
vertical air.
**Direction** Fashion-house end card. Restrained palette, display type, nothing
competing.
**Content** brand, tagline, links, social, note.
**Motion** Slow stagger (130ms), long rise, and the wordmark drifts on `--sw-py`
parallax as the footer settles.

### 3. `type` — Large Typography *(word-split)*
**Layout** The wordmark or headline set enormous, edge to edge; everything else a
small bottom row beneath it.
**Direction** The type *is* the layout. One colour, negative tracking, no imagery.
**Content** brand or headline, links, note.
**Motion** Word-by-word arrival, 60ms apart, each word rising out of its own line
box. Fast enough to read as one gesture.

### 4. `editorial` *(word-split)*
**Layout** Magazine masthead: closing line across two thirds, link columns in the
last third, an optional full-bleed image below.
**Direction** Print. Serif display, mono labels, asymmetric column widths.
**Content** headline, brand, columns, media, legal, note.
**Motion** Headline words first, then columns in sequence, then the image behind a
clip-path wipe from the bottom.

### 5. `split` — Split Layout
**Layout** Two panels meeting at the centre line: identity left, everything
actionable right. The halves carry different tones.
**Direction** Hard division, no gutter, the seam is the design.
**Content** brand, tagline, columns or links, cta, note.
**Motion** The halves slide in from opposite edges and meet — left from −x, right
from +x — then the inner blocks stagger.

### 6. `cta` — Full-Width CTA *(word-split)*
**Layout** One full-bleed band: the ask set large and centred, the button under
it, a thin legal strip at the very bottom.
**Direction** The whole footer is a button. Accent-tinted ground, one focal point.
**Content** headline, cta or newsletter, legal, note.
**Motion** Band scales up from 0.96 as it enters, headline words stagger, the
button arrives last with a magnetic hover.

### 7. `product` — Product-Focused
**Layout** Product shot occupying the left five columns, closing line and links on
the right.
**Direction** The last look at the thing the film was about. Image does the work.
**Content** media, headline, links, cta, note.
**Motion** Image reveals behind a clip-path mask and settles from a 1.08 scale;
copy staggers in against it.

### 8. `cinematic` — Dark Cinematic
**Layout** Full-bleed dark band, centred mark, a slow accent glow behind it,
mono-set links.
**Direction** End credits. Near-black ground, low-contrast text, HUD lettering
carried down from the film.
**Content** brand, links, social, note.
**Motion** Long fade from black, the glow drifting on `--sw-py`, links fading up
last — the film ending rather than the page stopping.

### 9. `bento` — Bento / Grid
**Layout** Every content block becomes its own rounded tile in a 12-column grid;
tiles of unequal span.
**Direction** Soft-cornered cards, alternating tones, generous inner padding.
**Content** anything — the more blocks picked, the better this reads.
**Motion** Tiles pop in diagonally, each from 0.94 scale, 70ms apart.

### 10. `nav` — Navigation-Focused
**Layout** Four to six link columns across the full width; the mark reduced to a
small block above them.
**Direction** Sitemap done well. Mono column headings, quiet link rows.
**Content** brand, columns (the point of this one), legal, note.
**Motion** Columns wipe up in sequence; each link inside underlines on hover from
the left.

### 11. `social` — Social / Community
**Layout** Social links set large as their own row — names, not icons — with the
mark and copyright small beneath.
**Direction** The handles are the headline.
**Content** brand, social, links, note.
**Motion** Each social link scales and leans magnetically toward the cursor; the
row arrives with a wide 110ms stagger.

### 12. `newsletter` — Newsletter-Focused
**Layout** The capture form centred and oversized, everything else demoted to a
thin row under it.
**Direction** One job. The field is the widest element on the page.
**Content** newsletter (required), headline, links, legal, note.
**Motion** Form rises last and widest, after the line above it; the field's ring
draws on focus.

### 13. `story` — Brand Story
**Layout** Mark and a short paragraph on the left, links and contact on the right —
a closing note rather than a directory.
**Direction** Editorial calm, body copy at reading size, one column of prose.
**Content** brand, tagline, headline, contact, links, note.
**Motion** Prose fades up as one block (no per-word noise), the right column
staggers after it.

### 14. `interactive` — Interactive / Animated
**Layout** Oversized link list where each row is a full-width hit target, with a
marquee strip above.
**Direction** Playful and loud. Rows invert on hover.
**Content** marquee, links, social, cta, note.
**Motion** Marquee runs continuously; every link and button is magnetic; rows
sweep an accent fill from the left on hover.

### 15. `experimental` — Experimental / Creative *(word-split)*
**Layout** Deliberately off-grid — headline pushed off the left edge, blocks at
mixed sizes and offsets.
**Direction** Broken grid, overlap, rotation. Use when the film itself is strange.
**Content** headline, marquee, links, social, custom, note.
**Motion** Words arrive rotated and straighten; blocks land at slight offsets;
magnetic hover throughout.

### 16. `depth` — 3D / Depth-Based
**Layout** Layered planes on a shared perspective — mark furthest back, links
mid, CTA closest.
**Direction** Depth by scale and shadow, not by texture. Keep the tilt small.
**Content** brand, headline, links, cta, note.
**Motion** Planes translate on Z as `--sw-py` advances, and the whole footer tilts
a degree or two toward the cursor. Subtle — past ~3° it reads as a gimmick.

---

## Picking one

- Film-heavy hero, little else on the page → `luxury`, `cinematic`, `type`.
- Real product site with a sitemap → `nav`, `split`, `bento`.
- The page exists to capture an email → `newsletter`, `cta`.
- The product is a physical object → `product`, `editorial`.
- Brand-led, community-led → `story`, `social`, `interactive`.
- Only when the film is already unconventional → `experimental`, `depth`.

Match the footer's tone to the film's last frame, not to the brief. A dark
descent that ends in `bento` on white reads as two sites glued together —
`tone: 'dark'` keeps the palette continuous.

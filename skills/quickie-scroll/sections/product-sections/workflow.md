# Product sections — the workflow (SKILL Step 1, question 6a)

*Runs once the chapter plan exists and the generic acts have been chosen, immediately
before the footer question. Produces `PRODUCT_SECTIONS[]`.*

**Read with:** [`selection-rules.md`](selection-rules.md) ·
[`section-library.md`](section-library.md) ·
[`animation-patterns.md`](animation-patterns.md) ·
[`quality-rules.md`](quality-rules.md) · [`../acts.md`](../acts.md)

---

## Why this exists

The film is the journey and the acts are the argument. What is missing between them is the
part that makes a product site read as *finished*: sections that keep interrogating the
actual product after the camera has stopped moving — its anatomy, its material, its
behaviour, its life.

These are never picked from a fixed menu. They are reasoned from **this** product, **this**
industry, **this** look and **this** chapter plan, and every one of them is animation-driven.
A static two-column feature grid is not a product section.

## Where it sits in the interview

| | Question | Sets |
|---|---|---|
| 5 | Chapters | the journey the sections must continue |
| 6 | The page after the film | statement / cards / cta / reviews / testimonials |
| **6a** | **Product sections — this file** | **`PRODUCT_SECTIONS[]`** |
| 6b | Footer | variant + contents |

It cannot run earlier: without the chapter plan you cannot tell which sections would repeat
a scene the film already delivers.

## The four steps

**1 — Re-read the brief before choosing anything.** `SUBJECT`, `LOOK`, `PALETTE`,
`CHAPTERS[]`, the sorted `REFS`, and the acts just chosen. The recommendation is only as
good as this read; skipping it is how a generic list gets produced.

**2 — Choose at least five.** Reason them out with
[`selection-rules.md`](selection-rules.md), drawing from — and extending —
[`section-library.md`](section-library.md). Five is the floor, not the target; six or seven
is fine for a rich product, and a thin one is better served by five strong sections than
nine weak ones.

**3 — Present them as a checklist the user can multi-select.** `AskUserQuestion` with
`multiSelect: true` where available; a numbered list with "pick any" otherwise. Lead with
one line saying *why these ones*, then one line per section: the name, what it shows, and
its motion in a phrase — so the user is choosing a moving thing, not a heading.

> **Based on your product and the journey we planned, I'd add these sections after the
> film. They pick up where the last chapter leaves off, and each one is a motion beat
> rather than a text block:**
>
> - ☐ **Bottle Anatomy** — cap, collar, glass and base separate out. *Layers drift apart on scroll, each labelled as it lands.*
> - ☐ **Glass & Material Detail** — macro on the facets and the weight. *Slow scale-through with a clip-path wipe between surfaces.*
> - ☐ **The Oud Story** — where the note comes from. *Horizontal rail of three stills, text revealing per panel.*
> - ☐ **Scent Experience** — top / heart / base. *Pinned scene, the three notes cross-fading as you scroll through it.*
> - ☐ **Final Reveal** — the bottle whole again, lit. *Depth planes converge, headline splits in on the settle.*
>
> Pick any number — or none, if the film plus the panels is already the site you want.

**4 — Place the chosen ones and say the order back.** Use the ladder below, then read the
full page order to the user in one line before writing anything. Correcting the order now
is free; correcting it after the copy is written is not.

## The placement ladder

Selected sections are woven into the page, not appended to it:

```
main scroll film
  → reveal / continuation      (picks the film up on its last frame)
  → detail / anatomy / craft   (the close read)
  → feature / capability       (what it does)
  → interactive showcase       (what the visitor can do with it)
  → story / experience / life  (why it matters)
  → statement · reviews · testimonials · cards   (the acts, from ../acts.md)
  → cta
  → animated footer
```

A section only moves out of its rung when the product argues for it — a car's interior
belongs before its performance, a SaaS product's use-cases belong before its architecture.
Say why when you move one.

## Assets: prefer frames you already have

Every one of these sections wants imagery, and the build's image budget is **one generated
image** ([`../../core/rules.md`](../../core/rules.md) §2). Take section imagery from the
film first:

```bash
ffmpeg -i assets/videos/03-detail.mp4 -vf "select=eq(n\,42)" -vsync 0 assets/frames/sec-detail.png
```

Frames pulled out of the rendered clips are free, frame-exact against the film, and
guaranteed to be the same product under the same light — which is most of what makes these
sections feel like a continuation rather than a different site. Only propose a **new**
generation when no frame in the chain can carry the section, and when you do, say so and
get a go before rendering ([`../../video/rendering.md`](../../video/rendering.md)).

## What to record

For each selected section: `id` (slug), `title`, `purpose`, `pattern` (from
[`animation-patterns.md`](animation-patterns.md)), `assets` (which frames or which new
generation), `position` (its rung), and the copy. They belong in `README.md` under the page
structure and in `brief.md` as production rows if any need an asset
([`../../project/documents.md`](../../project/documents.md)).

## Where they land in the build

As acts, after the film, in the order agreed:

- **Next.js** — a component per section, motion via Framer Motion or CSS
  ([`animation-patterns.md`](animation-patterns.md)), rendered below `<QuickieScroll/>`.
- **Standalone preview / engine** — `{ kind: 'html', tone, html }`. **No engine change is
  needed**, and none should be made ([`../../platforms/web/engine-config.md`](../../platforms/web/engine-config.md)).
- **App targets** — the same sections as scrolled Flutter/Compose widgets below the scrub
  view; the motion patterns translate, the DOM specifics do not.

Every section must clear [`quality-rules.md`](quality-rules.md) before it ships.

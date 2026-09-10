# Example interview — "create perfume website"

What the skill actually asks, in order, for the prompt **"create perfume website"**.
Source of truth: [`skills/quickie-scroll/discovery/interview.md`](skills/quickie-scroll/discovery/interview.md).
Nothing here is invented — it is that file walked with a perfume brand in the chair.

---

## Q0. References — **skipped**

Only asked if the user attached images or dropped Pinterest/Dribbble links. "create perfume
website" has none, so the skill goes straight to Q1.

If they *had* attached a bottle photo, this becomes question one, and it sounds like:

> I see three images. I'm reading the bottle shot as the **product anchor** — the actual
> thing the film has to render faithfully — and the other two as **style inspiration**
> (mood, palette, grade), not objects to reproduce. Correct me if that's backwards.

Why first: a locked product anchor changes the look, the chapters and every clip prompt.

---

## Q1. Target — website, app, or both

> Is this a **website**, a **mobile app**, or both?
>
> - **Website** — 16:9 landscape film, built as a Next.js project. *(Recommended — this
>   is what you asked for.)*
> - **Mobile app** — 9:16 portrait chain, natively composed, never a crop.
> - **Both** — two chains. Roughly double the render workload.

"perfume **website**" already answers this, so the skill confirms rather than interrogates
and moves on. `TARGET=web`.

If the answer had involved an app, `bash tools/detect-target.sh` runs *before* this question
and its result is non-negotiable: Flutter found → Flutter scaffold; Android SDK only →
Compose scaffold; both → asks which (recommends Flutter); **neither → stops and offers the
website instead**, never silently downgrades.

---

## Q2. Subject — the only genuinely open question

> What should this be about? Your business, a client's, or just an idea — a word or a
> sentence is fine.

For perfume the skill is listening for four things, and will follow up on whichever is
missing:

- **Brand name** — goes in the HUD, the nav, the footer. `BRAND_NAME`
- **The one-line pitch** — "a smoky oud for winter nights", not "we sell fragrance".
- **The hero product** — one bottle, one scent, or a whole house? One object films far
  better than a range.
- **Tone** — heritage/apothecary, clinical/modern-niche, or hedonist/night-out. This is
  what separates two perfume sites that use the same look.

---

## Q3. Look — the art direction

Three or four of the seven get presented by name and feel. For perfume these are the
natural shortlist:

> - **`warm-craft`** — golden practical light, hands and materials, oils and glass.
>   *(The default for fragrance. Food, drink, perfume.)*
> - **`product-noir`** — one object, near-black, a single light source raking across glass.
>   *(A bottle with a story. Best for one hero product.)*
> - **`technical-white`** — the bottle exploded into its parts on a bone-white field,
>   converging back together. *(Niche/molecular positioning, "the formula".)*
> - **`monolith-ambient`** — one sculptural form, looping, no scrub. *(A fragrance house
>   presenting itself rather than a product.)*

One look per build. Own brand palette? The look's preamble stays, only the hexes are
swapped. Full library: [`art-direction/looks.md`](skills/quickie-scroll/art-direction/looks.md).

---

## Q4. Camera — the film's personality

Always asked. Three architectures:

> - **One continuous walkthrough** — a single unbroken take through the world. The default
>   for anything photoreal, and what perfume usually wants.
> - **Fly through the world** — dive-and-connect. Miniature/diorama looks only.
> - **Locked isometric glide** — a continuous take with the camera pinned to one axis.

Recorded as `CAMERA`. This decides the clip count later, so it is asked before chapters.

---

## Q5. Chapters — count first, then content

> How long should the film be? **2** (teaser), **4** (short journey), or **6** (full film —
> the maximum; past six the scroll pacing stops being comfortable).

Then it proposes that many, drawn from the subject's own logic, and lets the user edit.
A four-chapter perfume proposal looks roughly like:

| # | Chapter | What the camera does |
|---|---------|----------------------|
| 1 | The raw material | Resin, petal, or bark in raw light — before it is anything |
| 2 | The making | Distillation, oils, glass; hands, not machines |
| 3 | The bottle | The first full reveal of the product itself |
| 4 | Worn | The bottle in a room, on skin, at the hour the scent is for |

Copy rules that keep it from reading as a template:
[`animation/scene-planning.md`](skills/quickie-scroll/animation/scene-planning.md).

---

## Not a question — the page after the film

The user is **never** asked what follows the film. No multi-select, no "film only", no "do
you want a footer?". The skill designs it: **4–5 premium sections specific to this project,
plus a mandatory context-aware footer**
([`sections/post-film.md`](skills/quickie-scroll/sections/post-film.md)).

For the perfume brand above, having established a warm-craft film that ends on the bottle
in a lit room, the reasoning runs:

- **Primary action** — buy, but a fragrance is bought on evocation, not specification.
- **Content opportunity** — the notes and the source of the raw material; the film showed
  the making but never named anything.
- **Visual opportunity** — the bottle deserves an interactive detail moment; the raw
  materials deserve a gallery with real depth.

And the plan that comes out of it:

| # | Section | Why it's here | Motion |
|---|---------|---------------|--------|
| 01 | **Olfactory pyramid** | The film evoked the scent; this is the first moment it can be *described*. Top/heart/base revealed as the visitor scrolls through the composition. | Scroll-linked layer separation, Framer Motion |
| 02 | **Source story** | The film opened on raw material without naming it. Real origins, real growers. | Horizontal rail, masked image reveals |
| 03 | **Bottle anatomy** | Glass, weight, the stopper — the tactile argument for the price. | Hover hotspots, spring scale |
| 04 | **The collection** | Three other scents; the visitor who liked this one needs somewhere to go. | Staggered entrance, static compositions |
| 05 | **Acquire** | The ask, sized to a considered purchase — not a newsletter bar. | Subtle reveal |
| — | **Footer** | Wordmark, stockists, contact. No newsletter — this brand sells through stockists, so it would be a dead affordance. | Subtle reveal |

Section 01 opens on the same warm practical light and film grain the last frame ends on, so
the page never announces that the video finished. The plan goes into `README.md` under
**After the film** before anything is built, and the user can push back on it there.

There is deliberately no "statement → cards → testimonials → CTA" in that list. If a plan
comes out looking like that, it was defaulted rather than designed.

---

## Q6. Mobile

> Desktop only, or a native 9:16 portrait chain as well? A portrait chain roughly doubles
> the video workload.

Phone hardening (seek coalescing, iOS playback priming, safe-area insets) is always on
either way — that isn't a "mobile version", it's the page not breaking when a phone visits.

---

## Q7. Asset source — how the video actually gets made

> **Automatic** — I render it here through a connected tool. I'll give you the estimated
> spend and wait for a go before anything renders.
>
> **Manual** — I hand you a numbered prompt pack and you render it in your own tool.
> For a 4-chapter continuous take that's **1 image + 4 clips**, doubled if you want the
> portrait chain, plus ~15% re-roll headroom.

One hard check on the manual path: **does your video tool accept a start frame?** If it
can't, it can't hold a seam between clips, and the skill will steer you to one that can
rather than ship an unseamed film.

---

## After the last question

Before a single prompt file is written, the skill writes two documents:

- **`README.md`** — what this project is.
- **`brief.md`** — where production is.

No overlap, both short enough to skim.

---

## What the interview must have captured

`REFS` · `TARGET` · `APP_STACK` · `SUBJECT` · `BRAND_NAME` · `TONE` · `LOOK` · `PALETTE` ·
`N` · `CAMERA` · `CHAPTERS[]` · `MOBILE` · `ASSET_SOURCE`

Plus `POST_FILM[]` — the 4–5 sections and the footer, derived rather than asked.

If any of those is still blank, the interview isn't finished.

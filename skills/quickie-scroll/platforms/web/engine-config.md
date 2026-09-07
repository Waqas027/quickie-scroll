# Engine config — the knobs that carry the cinematic feel

*What to set on `mountQuickieScroll`'s config beyond the clip list. The scaffold itself is
[`nextjs.md`](nextjs.md); the engine source is
[`engine/quickie-scroll.js`](../../engine/quickie-scroll.js).*

**Read with:** [`animation/scene-planning.md`](../../animation/scene-planning.md) ·
[`sections/acts.md`](../../sections/acts.md) · [`footer/workflow.md`](../../footer/workflow.md)

---

Beyond the chain and the copy, four things carry the cinematic feel.

## `hud` — the corner instrumentation

System label, live `FRAME nnn` counter, registration brackets, scroll verb. Every reference
film wears some version of it; it is what makes a full-bleed clip read as a *film* rather
than a background video. Wording comes from the look
([`art-direction/looks.md`](../../art-direction/looks.md)).

## `align` per chapter

Which side of the frame each chapter speaks from. The readability scrim follows it
automatically. **Alternate it** — see
[`animation/scene-planning.md`](../../animation/scene-planning.md).

## `acts` — the editorial page after the film

The film's chrome fades out as they arrive. Four built-in kinds — `statement`, `cards`,
`cta`, `footer` — plus `{ kind:'html', tone, html }`, which is where reviews, testimonials,
product sections ([`sections/product-sections/`](../../sections/product-sections/workflow.md)),
a second animated section and any custom section land; no engine change needed.

Give every act the film's palette, type and accent, and let the first one sit directly on
the last frame: a hard rule or a colour jump at that boundary is what makes a site feel
like two sites glued together. Options and ordering:
[`sections/acts.md`](../../sections/acts.md).

## `variant` on the footer act

The sixteen-variant footer library ([`footer/variants.md`](../../footer/variants.md), chosen
at interview question 6b). The slug drives layout *and* motion: reveal-on-entry, per-block
stagger, word-split headlines, parallax drift, clip-path image reveals, marquee, magnetic
hover, depth planes — all built in, all reduced-motion aware. The footer's own motion needs
no Framer Motion.

```js
{ kind: 'footer', variant: 'luxury', tone: 'dark', /* content keys */ }
```

## Pacing — `scroll` and `linger`

Two per-chapter knobs. Full guidance:
[`animation/scene-planning.md`](../../animation/scene-planning.md) → *Pacing*.

## Theming

Theme with the CSS variables in [`index-template.html`](index-template.html); the visual
identity comes from the film, so the chrome stays quiet.

## Teardown is not optional

`mountQuickieScroll` returns a `{ destroy }` handle; the React wrapper calls it in the
`useEffect` cleanup. React StrictMode mounts effects twice in dev, and without teardown you
get two engines, two rAF loops and a scrub fighting itself.

# Engine config — the knobs that carry the cinematic feel

*What to set on `mountQuickieScroll`'s config beyond the clip list. The scaffold itself is
[`nextjs.md`](nextjs.md); the engine source is
[`engine/quickie-scroll.js`](../../engine/quickie-scroll.js).*

**Read with:** [`animation/scene-planning.md`](../../animation/scene-planning.md) ·
[`sections/post-film.md`](../../sections/post-film.md)

---

Beyond the chain and the copy, five things carry the cinematic feel.

## The chrome knobs — `brand.mark`, `nav`, `navPlace`, `route`, `routeSide`

The header mark, the chapter nav and the scroll-progress rail. Each has variants, and each is
**chosen per build** from the subject and the look — the defaults (`pill mark + pills + right
+ dots + right`) are what made two unrelated builds read as the same site. Variants, how to
pick, and the README block that records the choice:
[`chrome.md`](chrome.md) and [`core/rules.md`](../../core/rules.md) §19.

## `hud` — the corner instrumentation

System label, live `FRAME nnn` counter, registration brackets, scroll verb. Every reference
film wears some version of it; it is what makes a full-bleed clip read as a *film* rather
than a background video. Wording comes from the look
([`art-direction/looks.md`](../../art-direction/looks.md)).

`hud.system` sits directly under the brand lockup — **never set it to the brand name**, or
the name prints twice, 44px apart, and reads as a bug. Instrumentation, not branding:
[`chrome.md`](chrome.md).

## `align` per chapter

Which side of the frame each chapter speaks from. The readability scrim follows it
automatically. **Alternate it** — see
[`animation/scene-planning.md`](../../animation/scene-planning.md).

## `acts` — the post-film sections

The wire format for the page after the film. The concept is *4–5 designed sections plus a
mandatory footer*, decided by the skill and never asked
([`sections/post-film.md`](../../sections/post-film.md)); `acts` is just the array they land
in. Don't rename the key — the CSS classes and the `.d.ts` depend on it.

The film's chrome fades out as they arrive. Four built-in kinds — `statement`, `cards`,
`cta`, `footer` — plus `{ kind:'html', tone, html }`. **`html` is where most sections land**:
a product showcase, a configurator, a map, a gallery, a comparison, an interactive lineup —
markup rendered by a React component in the Next build. No engine change needed for any of
it. A config that uses only `statement` / `cards` / `cta` is the signature of a generic
plan, not of a well-configured engine.

Give every section the film's palette, type and accent, and let the first one sit directly
on the last frame: a hard rule or a colour jump at that boundary is what makes a site feel
like two sites glued together. The footer is always present and always last.

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

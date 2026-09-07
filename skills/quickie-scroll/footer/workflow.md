# Footer — the two questions (SKILL Step 6b)

*How the footer gets chosen and how the answer reaches the engine. The library itself is
[`variants.md`](variants.md).*

**Read with:** [`footer/variants.md`](variants.md) ·
[`footer/content-options.md`](content-options.md) · [`footer/motion.md`](motion.md) ·
[`sections/acts.md`](../sections/acts.md)

---

The footer is the film's last frame, and a generic centred row of links throws away the
whole descent. **Read [`variants.md`](variants.md) before asking** — it carries each
variant's layout, visual direction, content fit and motion recipe.

Asked whenever the page has anything after the film. Never pick a variant silently.

## First, the variant — single-select, exactly one

Don't paste all sixteen at a user. Offer three or four that suit the film you just designed
(the *Picking one* section of [`variants.md`](variants.md) maps page types to variants) and
say the rest are available on request:

| | | | |
|---|---|---|---|
| `minimal` Minimal / Clean | `luxury` Luxury / Cinematic | `type` Large Typography | `editorial` Editorial |
| `split` Split Layout | `cta` Full-Width CTA | `product` Product-Focused | `cinematic` Dark Cinematic |
| `bento` Bento / Grid | `nav` Navigation-Focused | `social` Social / Community | `newsletter` Newsletter-Focused |
| `story` Brand Story | `interactive` Interactive / Animated | `experimental` Experimental / Creative | `depth` 3D / Depth-Based |

## Then the contents — multi-select

Logo/wordmark · tagline · closing headline · navigation · product or grouped link columns ·
social · contact · newsletter · CTA button · legal links · copyright · image or product
shot · marquee text · custom.

Collect the actual copy and hrefs for everything chosen. The key names and shapes are in
[`content-options.md`](content-options.md).

## How the answer reaches the engine

The variant slug goes straight into the act — `{ kind: 'footer', variant: 'luxury', … }` —
and **it is what drives the design**. A key the user didn't pick renders no element at all,
so an unpicked block can never open a gap in the layout.

Match `tone` to the film's last frame. A dark descent that ends on a white footer reads as
two sites glued together.

## Motion is already built in

**Every footer is animated.** The engine ships scroll-triggered reveal
(`IntersectionObserver`), per-block stagger, word-by-word headlines in the split variants,
parallax drift off the engine's own scroll read, clip-path image reveals, marquee, magnetic
hover, and depth planes — all keyed to the variant, all honouring `prefers-reduced-motion`.
The full contract is [`motion.md`](motion.md).

**Don't reach for Framer Motion or GSAP for the footer**; it would duplicate this and pull a
dependency into a zero-dependency file. Those stay for custom `html` acts
([`sections/acts.md`](../sections/acts.md)).

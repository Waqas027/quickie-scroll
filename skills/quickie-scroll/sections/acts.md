# The page after the film — the acts

*The editorial page that scrolls up over the finished film. Asked at
[`discovery/interview.md`](../discovery/interview.md) question 6; rendered by the engine's
`acts` array.*

**Read with:** [`footer/workflow.md`](../footer/workflow.md) ·
[`platforms/web/engine-config.md`](../platforms/web/engine-config.md) ·
[`platforms/web/nextjs.md`](../platforms/web/nextjs.md)

---

## Always ask, and let them pick several

A scroll cinematic on its own is a hero, not a product site. Every reference build that
reads as a *website* continues past the film into editorial panels that scroll up over the
last frame. Ask as a **multi-select** (`AskUserQuestion` with `multiSelect: true` where
available) and collect the copy for each one chosen:

| Option | Engine `kind` | What it is |
|---|---|---|
| Statement | `statement` | The one idea the film was about, set large on paper. |
| Proof cards | `cards` | Two or three proof points. |
| Reviews | `cards` (tone `light`) | Star/score cards — short, many, scannable. |
| Testimonials | `html` | One to three quotes with attribution, set large. |
| CTA | `cta` | The ask, with an email capture. |
| Another animated section | `html` | A second, smaller motion beat below the film — see below. |
| Extra motion / interaction | — | Scroll reveals, counters, hovers layered onto the acts above. |
| Custom section | `html` | Anything they describe. |
| Nothing — end at the film | — | A pure hero. |

A footer is appended whenever anything follows the film — a page that ends mid-panel reads
as broken — unless they picked "nothing". Which footer is its own question:
[`footer/workflow.md`](../footer/workflow.md). Never pick one silently.

"Film only" is a legitimate answer — but it must be the user's answer, not your default.

## The product's own sections are a separate question

The acts above are the *argument*. The sections that keep working the **product** itself —
anatomy, material, craft, feature expansion, interactive showcase, story — are proposed
separately at interview question 6a, reasoned per product rather than picked from a menu,
and they sit **between the film and the acts**:
[`product-sections/workflow.md`](product-sections/workflow.md).

## Order them so the page descends from image to argument to ask

**product sections → statement → reviews or testimonials → cards → animated section → cta →
footer.**

Say the order back; it's easier to correct now than after the copy is written.

## Keep the handover visually continuous

The acts inherit the film's palette, type and accent; the first act sits directly on the
film's last frame with no hard rule and no colour jump, and the film dims and its chrome
fades as they arrive (the engine does this). A hard rule or a colour jump at that boundary
is what makes a site feel like two sites glued together.

## Extra motion goes below the film

An "additional animated section" is CSS or Framer Motion **below** the film — never a
second scrubbed video, and never a second scroll driver over the film's scroll range
([`core/rules.md`](../core/rules.md) §9). The footer's own motion is built into the engine
and needs nothing extra ([`footer/motion.md`](../footer/motion.md)).

## Where they land in the engine

Four built-in kinds — `statement`, `cards`, `cta`, `footer` — plus
`{ kind: 'html', tone, html }`, which is where reviews, testimonials, product sections, a
second animated section and any custom section land. No engine change is needed for any of
them. Config shapes: [`platforms/web/engine-config.md`](../platforms/web/engine-config.md).

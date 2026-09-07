# The one start frame — SKILL Step 3

*The only generated image in the build.*

**Read with:** [`core/rules.md`](../core/rules.md) §2 ·
[`art-direction/looks.md`](../art-direction/looks.md) ·
[`art-direction/realism.md`](../art-direction/realism.md) ·
[`discovery/references.md`](../discovery/references.md)

---

One image: the opening frame of scene 1. It is the start frame of clip 1, chapter 1's
poster, the reduced-motion still, and the style reference every later re-roll is judged
against — the whole film inherits its grade, its light and its lens from this one file. It
is worth two or three re-rolls; it is the cheapest re-roll in the build.

**Chapters 2…N get no image prompt.** Their posters are `first-NN.png`, extracted from
their own accepted clips — free, and frame-exact against the film. If you find yourself
writing `prompts/images/02-*.md`, the chain has been broken somewhere upstream.

## Composition

**Compose for the centre** in landscape (the page renders every clip `object-fit: cover`);
compose for the **upper-middle third** in portrait, where the lower third belongs to the
app's copy and the system gesture bar. Either way, **the direction the camera will travel
must be visible in the frame** — the doorway, the opening, the horizon it heads for. A
start frame with no exit forces clip 1 to invent one, and it usually invents a cut.

## With a product reference

This image carries the product lock clause and, where the model accepts an image input, the
product photo itself as reference. If the supplied photo is noisy — busy background, phone
lighting, a watermark — render a clean product plate first
(`prompts/images/00-product-plate.md`) and use that as the reference instead. One extra
generation, and it removes the most common cause of product drift. Clause and procedure:
[`discovery/references.md`](../discovery/references.md).

## Validate before continuing

[`pipeline/scripts.md`](../pipeline/scripts.md) §2: correct aspect within a few percent,
≥1536 px wide landscape / ≥1080 px portrait, no text in frame, exit visible, and — with a
product — shape, proportions, colour, materials and markings all matching.

---

## The image prompt file — `prompts/images/01-<slug>.md`

````markdown
# 01 · <Chapter label> — the start frame

This is the **only** image the build needs. Every later scene starts on the previous
clip's rendered last frame, not on a new still.

- **Render in:** any image model (Midjourney / Nano Banana / Imagen / Flux / DALL·E)
  <!-- with a product reference: a model that accepts an image input, e.g. Nano Banana, Flux Kontext -->
- **Aspect:** 3:2 landscape · **min width:** 1536 px   <!-- 9:16, ≥1080 px for the app -->
- **Reference image:** `refs/product/<file>` — <or "— none —"> 
- **Save as:** `assets/images/01-<slug>.png`
- **Used for:** the start frame of clip 01, chapter 1's poster, and the reduced-motion still

## Prompt

```text
<PREAMBLE — verbatim from art-direction/looks.md>
Render a wide 3:2 landscape image, at least 1536 px wide.
<PRODUCT LOCK — verbatim, only when a product reference was supplied>
Subject: <what is in THIS frame — the space, the object, the light, 2–3 concrete props>.
Composition: the focal subject horizontally centred with a little headroom; nothing
essential at the far left or right edges. <the exit — the doorway, opening or direction
the camera will travel toward — visible in frame>.
Absolutely no text, no letters, no numbers, no logos, no watermarks.
```

## Accept when
- [ ] 3:2, ≥ 1536 px wide
- [ ] No text anywhere in the frame
- [ ] Subject centred; **the direction the camera will travel is visible in frame**
- [ ] With a product reference: shape, proportion, colour, material and markings all match
- [ ] It is a frame you would be happy to look at for eight seconds — the whole film
      inherits its grade, its light and its lens
````

Get this one right before anything else renders. It is the only asset the entire chain
inherits from, so a re-roll here costs one generation and a re-roll later costs the tail
of the film.


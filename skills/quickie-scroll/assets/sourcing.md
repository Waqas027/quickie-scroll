# Web asset sourcing — real imagery with provenance

*Use at Step 8 when an approved section needs imagery that the user did not supply.*

**Read with:** [`discovery/experience-brief.md`](../discovery/experience-brief.md) ·
[`discovery/references.md`](../discovery/references.md) · [`sections/post-film.md`](../sections/post-film.md)

Do not wait for the user to ask for images. Create an asset shot list from the approved
section plan, then use web/image search for only the missing visuals. Search by the real
subject, place, season, activity, angle, light and intended composition—not vague nouns
such as `travel` or `food`.

## Source selection

1. Prefer user-supplied or client-owned assets.
2. For illustrative photography, prefer sources with a clear reusable license and a stable
   asset page (for example, Unsplash or Pexels), and verify the asset page's current terms.
3. For a real place, operator or product, use its official press/media kit only when its
   stated terms permit the intended use. Do not treat a search thumbnail as an asset.
4. Reject watermarked, low-resolution, misleading, duplicate, unlicensed or uncertain
   material. Never scrape, bypass a paywall, or hotlink arbitrary image-search URLs.

For every adopted asset, write `assets/SOURCES.md`:

```markdown
| Local file | Section / role | Source page | Creator / owner | License or permission checked | Notes |
|---|---|---|---|---|---|
| public/assets/editorial/alps-dawn.jpg | Destination explorer | https://… | Name | Unsplash License, checked YYYY-MM-DD | cropped for 4:5 card |
```

Keep attribution in the delivered site when the license requires it. Never use a source to
imply endorsement. Generated images are recorded as generated, including the model/tool
and prompt file; user-provided files are recorded as user-provided.

## Use assets as design material, not a card-grid substitute

Plan crops before coding: a wide establishing image, vertical editorial crop, close detail,
and a small thumbnail answer different compositions. Use `next/image` for ordinary section
images, responsive sizes and meaningful alt text; preserve the original locally with a
stable descriptive filename. Do not force every sourced image into identical cards.

Use layered imagery, masked crops, horizontal galleries, route/map overlays, progressive
detail, comparison states or controlled parallax where they serve the visitor's job. On
mobile, preserve the information hierarchy and tap targets; disable decorative parallax if
it harms performance or motion preferences.

If a required real-world *claim* cannot be verified — a hotel, a price, an award, a rating —
remove the claim or choose a different section. Never fill that gap with invented hotels,
prices, offers, ratings or testimonials.

A missing **image** is a different problem, and it has its own answer below.

---

## When no image can be sourced — write the spec, don't paint a gradient

A section that was designed around a photograph and ships with a gradient, a solid fill, a
CSS illustration or an empty box in its place is a broken section, not a simplified one.
The visitor sees a hole; the user sees a design that quietly abandoned itself.

**When a required image cannot be sourced or licensed, write an asset specification instead
and keep the layout intact.**

```text
<project>/assets/
  asset-prompts/            one .md spec per missing image
    hero-product.md
    product-01.md
    destination-01.md
  SOURCES.md                provenance for everything that WAS sourced
public/assets/
  placeholders/             the neutral stand-ins the page ships with
```

The page still renders. Each unsourced slot ships a **neutral, correctly-proportioned
stand-in** carrying the look's palette at low contrast, the asset name, and `alt` text
describing the intended image. It reserves exactly the space the real file will occupy, so
dropping the generated image in later changes nothing else on the page. That is not the same
thing as a decorative gradient standing in for content: it is a labelled gap with a spec
attached.

### The spec format

One file per missing image. Every field, every time — the point is that whoever generates it
later never has to guess what was intended.

```markdown
# product-01.webp

Used in        Featured Products
Position       Product card #1, top-left of the 3-column grid
Local path     public/assets/products/product-01.webp
Aspect ratio   4:5 (portrait)
Dimensions     1200 × 1500 px minimum
Text overlay   None — the name sits below the card
Crop safety    Product must stay inside the centre 70%; the card crops the outer edge on mobile

Subject        Crispy chicken burger, sesame bun, visible lettuce and sauce.
Composition    Centred three-quarter product shot, burger fills ~70% of the frame,
               clean negative space on all four sides for the card crop.
Background     Flat warm neutral, matching the look's --sw-bg at 92%.
Lighting       Soft directional key from the upper left, commercial food photography,
               no hard specular highlights on the bun.
Palette        Warm amber and cream; accent #C9822F may appear in the sauce only.
Focal point    The layered cross-section at the front of the stack.
Must include   Visible steam absent; sesame seeds sharp; sauce not pooling.
Must avoid     Hands, branded packaging, restaurant interior, text, watermark, motion blur.

## Generation prompt
High-end commercial food photograph of a crispy chicken burger with a sesame-seed bun,
fresh lettuce and a warm amber sauce, centred three-quarter view on a flat warm-neutral
background, soft directional key light from the upper left, shallow depth of field,
food-styling quality, 4:5 portrait, no text, no hands, no packaging.

## Negative prompt
text, watermark, logo, hands, people, packaging, restaurant interior, motion blur,
low resolution, oversaturated
```

### The rules around it

- **Placement is recorded before the spec is written.** Section, position within the
  section, local path, aspect ratio. A spec that says "a nice burger photo" and nothing about
  where it goes has failed at its only job.
- **The local path in the spec is the path the page already references.** Generate the image,
  save it to that path, and the site is finished — no markup changes.
- **List every spec in `README.md`** under *Assets pending*, with one line each, so the user
  knows exactly what is outstanding and where it lands.
- **Tell the user at handover** — how many images are pending, which sections are affected,
  and that the page ships complete once those files exist.
- **A spec is the fallback, not the plan.** Search first, thoroughly and by the real subject.
  Reach for a spec when sourcing genuinely failed, not when it looked like work.
- **Never let a spec stand in for a real identifiable product** the user supplied a reference
  for ([`core/rules.md`](../core/rules.md) §4), and never write a spec that would fabricate a
  real-world entity — a specific hotel, a specific landmark presented as one it isn't
  ([`core/rules.md`](../core/rules.md) §13).

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

If a required real-world item cannot be verified or licensed, remove that claim/asset,
label it as a visual concept where appropriate, or select a different section. Never fill
the gap with invented hotels, prices, offers, ratings or testimonials.

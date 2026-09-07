# QA — SKILL Step 9

*Do not skip. In a browser (headless is fine).*

**Read with:** [`validation/troubleshooting.md`](troubleshooting.md) ·
[`core/quality.md`](../core/quality.md) ·
[`platforms/web/nextjs.md`](../platforms/web/nextjs.md) → *QA additions*

---

- **Seams.** Screenshot just before and just after each seam; the two frames must be
  near-identical. Judge by **composition, not PSNR** — a correctly frame-locked seam reads
  ~18–25 dB from codec shimmer alone. A real mismatch shows as different content, not
  softness. If they pop, the connector used a still instead of a rendered frame
  ([`animation/chain.md`](../animation/chain.md)).
- **Scrubbing works at all.** Console clean, `video.seekable.end(0) > 0` (the blob path is
  working), `currentTime` tracks scroll across each clip's band. A video frozen at frame 0
  means `seekable = [0,0]` — the blob load failed and it's falling back to a host that
  doesn't serve byte ranges.
- **The handover to the acts.** Scroll past the last seam: the copy, route rail, HUD and
  hint must fade, the film must dim, and the editorial panels must scroll cleanly over it.
- **Each product section.** Scroll into it once at desktop width and once at ~390 px: its
  one motion idea must fire, its copy must be real, nothing may overflow its padding box,
  and every hover-only interaction must have a tap equivalent
  ([`sections/product-sections/quality-rules.md`](../sections/product-sections/quality-rules.md)).
  Pinned sections must release the scroll cleanly into the next one.
- **The footer reveal.** Scroll into it once: blocks must stagger in, not appear
  pre-revealed and not stay hidden. Confirm the rendered variant is the one the user
  chose, and that no block the user did not pick left an empty column behind it.
- **Reduced motion.** `prefers-reduced-motion` must fall back to the stills — no video
  loads at all, no particles.
- **Phone**, throttled 4–6× CPU, scrolled fast: the clip tracks without freezing, the first
  chapter shows its poster immediately and the video takes over on first scroll (the iOS
  priming path — test Safari specifically, it's the one that goes blank). Slowly scroll so
  the URL bar collapses: the page must not jump. If the portrait chain shipped, confirm
  `videoWidth < videoHeight` in the Network panel — a downscaled 16:9 file is not the
  mobile version.
- **App:** the on-device checklist in
  [`platforms/flutter/flutter.md`](../platforms/flutter/flutter.md) or
  [`platforms/android/android.md`](../platforms/android/android.md).

---

## Regression scenarios

A change to the engine, the footer library or the act kinds is not done until it has been
run against the shapes that historically broke:

- **1 scene, 2 scenes, 4 scenes, 6 scenes** — a single-chapter film has no seam and must
  still scrub, dim and hand over to the acts.
- **Architecture A and B** — B with a `null` connector slot must still complete the page.
- **A product-reference build** and a build with none.
- **Multiple style references** — the extraction table in `README.md` must show more than
  one reference contributing.
- **Every act combination**, including film-only (no acts, no footer) and acts-without-CTA.
- **Product sections: none, one, and five** — including a pinned section directly above the
  first act, and two different product types (one physical, one software) to confirm the
  suggestion set actually differs between them.
- **Each footer variant** at desktop and phone width, with all content keys and with only
  two — an unpicked key must render no element, not an empty column.
- **`prefers-reduced-motion`** on, for both the film and the footer.
- **Phone width (≈390 px) and desktop (≈1440 px)** — nothing may overflow its padding box
  or scroll the page horizontally.

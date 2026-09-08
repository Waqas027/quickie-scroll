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

A change to the engine or the act kinds is not done until it has been
run against the shapes that historically broke:

- **1 scene, 2 scenes, 4 scenes, 6 scenes** — a single-chapter film has no seam and must
  still scrub, dim and hand over to the acts.
- **Architecture A and B** — B with a `null` connector slot must still complete the page.
- **A product-reference build** and a build with none.
- **Multiple style references** — the extraction table in `README.md` must show more than
  one reference contributing.
- **Every act combination**, including film-only (no acts, no footer) and acts-without-CTA.
- **`prefers-reduced-motion`** on.
- **Phone width (≈390 px) and desktop (≈1440 px)** — nothing may overflow its padding box
  or scroll the page horizontally.

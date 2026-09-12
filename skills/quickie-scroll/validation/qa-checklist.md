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
- **The handover to the post-film page.** Scroll past the last seam: the copy, route rail,
  HUD and hint must fade, the film must dim, and the sections must scroll cleanly over it.
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

## The chrome

*The header and the progress rail, judged against [`platforms/web/chrome.md`](../platforms/web/chrome.md).
This is the section that catches "every site we build looks the same".*

- **`README.md` has a Chrome block** naming all five decisions and chapter 1's `align`, each
  with a reason. No block = the chrome was inherited, not designed.
- **The brand mark is this brand's.** A designed inline SVG, the user's real logo, or a
  deliberate wordmark-only. **The default accent pill (`.sw-brand__mark` with no
  `--custom`) is a fail** unless the README says why it is right here.
- **`hud.system` does not repeat the brand name.** Read the top-left corner: the name must
  appear once.
- **The combination differs from the last build's.** `pills + right + dots + right` on a
  second consecutive build is a fail.
- **Nothing in the top bar collides or clips.** At 1440px and 1024px: brand, nav and top CTA
  each fully visible, none overlapping the HUD frame counter, none running off the edge.
- **The progress rail is readable.** Hover and active states legible against the *brightest*
  frame of the film, not just the first one — screenshot the active label over the brightest
  chapter and look at it. A washed-out chip nobody can read is the bug this replaced.
- **The rail tracks and navigates.** Scroll through every chapter: the active marker updates
  each time, and clicking any marker jumps to that chapter.
- **The rail is not on top of the copy.** If chapters use `align:'right'`, the rail is on the
  left, or off.
- **Phone (≈390px):** nav hidden, rail collapsed to ticks with a ≥28px touch target, nothing
  overlapping the chapter copy.

---

## The post-film page

Judged as part of the same piece as the film, not as a website appended to one.
→ [`sections/post-film.md`](../sections/post-film.md)

**Count and structure**

- **4 or 5 creative sections.** Not 3, not 8.
- **A footer exists**, it is last, and it is not counted as one of the 4–5.
- No section-selection question was ever put to the user.

**Selection**

- Every section has a stated reason to exist for *this* subject in `README.md`.
- The set is not the default shape (statement → cards → testimonials → CTA).
- The CTA, if present, matches the primary action — and was not added reflexively.
- Reviews/testimonials appear only if they fit the subject, and none are fabricated.

**Continuity**

- Section 01 opens on the film's palette, type, grain, light direction and spacing.
- No hard rule, no colour jump, no white band at the boundary.
- Scrolling from the last frame into section 01 reads as one experience — take the two
  screenshots and look at them side by side.
- Every section shares the film's visual language; none reads as an imported component.

**Motion**

- The major interactive sections use Framer Motion / Motion, and actually work — a
  portalled section must animate, not sit there as dead markup.
- Any static section is static on purpose, with the reason recorded.
- **No second scroll driver over the film's range** ([`core/rules.md`](../core/rules.md) §9).

**Content integrity**

- User-supplied references were used before anything was sourced; no identifiable product
  was swapped for a lookalike.
- No fabricated places, businesses, specifications or awards; nothing static presented as
  live; demo data labelled in the page and in `README.md`.
- Every adopted web image has a source, creator/owner, license/use status and local filename
  recorded in `assets/SOURCES.md`; no arbitrary hotlinks or unverified search thumbnails.
- **No gradient, solid fill, CSS illustration or empty box sits where a photograph belongs.**
  Walk every image slot: either a real image loads, or a labelled stand-in reserves the exact
  space *and* `assets/asset-prompts/<name>.md` exists for it.
- Every spec names its section, its position within the section, the local path the page
  already references, the aspect ratio and a full generation prompt — enough to generate and
  drop in without touching the layout.
- Pending assets are listed in `README.md` and were named to the user at handover.
- The primary action works with keyboard and touch, including visible focus states and an
  understandable empty/demo state for interactive modules.

**Craft**

- No Bootstrap-style card rows, ordinary Tailwind grids, plain pricing tables or
  heading-paragraph-three-cards blocks.
- No repeated card grid dominating the page.
- Phone (≈390 px): every section keeps its composition and nothing overflows.

---

## Regression scenarios

A change to the engine or the act kinds is not done until it has been
run against the shapes that historically broke:

- **1 scene, 2 scenes, 4 scenes, 6 scenes** — a single-chapter film has no seam and must
  still scrub, dim and hand over to the post-film sections.
- **Architecture A and B** — B with a `null` connector slot must still complete the page.
- **A product-reference build** and a build with none.
- **Multiple style references** — the extraction table in `README.md` must show more than
  one reference contributing.
- **4-section and 5-section plans**, with and without a CTA, and with at least one
  portalled interactive section. The engine's empty-`acts` path still has to render (a
  film-only build is no longer produced, but the guard must not throw).
- **`prefers-reduced-motion`** on.
- **Phone width (≈390 px) and desktop (≈1440 px)** — nothing may overflow its padding box
  or scroll the page horizontally.

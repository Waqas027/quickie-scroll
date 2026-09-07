# Animation patterns — the motion vocabulary these sections are built from

*Every section in [`section-library.md`](section-library.md) resolves to one of these. Pick
the pattern first, then write the markup for it.*

**Read with:** [`section-library.md`](section-library.md) ·
[`quality-rules.md`](quality-rules.md) ·
[`../../platforms/web/nextjs.md`](../../platforms/web/nextjs.md) ·
[`../../footer/motion.md`](../../footer/motion.md)

---

## The patterns

| Pattern | What it does | Build it with | Watch for |
|---|---|---|---|
| **Reveal on entry** | Blocks rise and fade as the section enters. The default; almost every section uses it for its copy. | `IntersectionObserver` + a CSS class, one-shot — the footer does exactly this ([`../../footer/motion.md`](../../footer/motion.md)) | a toggle instead of a one-shot makes the page twitch |
| **Stagger cascade** | The same reveal, indexed, so parts land in sequence. | `--sw-i` per child multiplied by a stagger constant, or Framer `staggerChildren` | over 8 children the tail lands after the eye has moved on |
| **Text split reveal** | A headline arriving word by word or line by line. | wrap words in spans, stagger them | never split body copy — it wrecks selection and screen readers |
| **Pin and advance** | The section holds still while its content advances through states. The strongest pattern here, and the most expensive. | `position: sticky` plus scroll progress over the section's own band | **only below the film, never over it** ([`../../core/rules.md`](../../core/rules.md) §9) |
| **Scale-through** | A slow push into an image, 1.0 to 1.06. | `transform: scale()` on scroll progress | keep it under ~8% or it reads as a zoom, not a camera |
| **Parallax layers** | Foreground and background moving at different rates. | two or three layers, different multipliers | a transform on an ancestor of the film breaks it ([`../../validation/troubleshooting.md`](../../validation/troubleshooting.md)) |
| **Mask / clip-path reveal** | An image opening from a line, a circle or an edge. | animate `clip-path` (compositor-friendly) | animating `width`/`height` instead costs a layout per frame |
| **Layer separation** | Parts drifting apart along one axis, then re-stacking. | per-layer `translate` from scroll progress | needs pre-separated art; check it exists first |
| **Horizontal rail** | Panels moving sideways while the page scrolls down. | pinned track plus `translateX` on progress | must fall back to a native horizontal swipe on phones |
| **Morph / cross-fade** | One state becoming another in place. | two stacked plates, opacity on progress | both plates must share framing, or it reads as a cut |
| **Split compare** | A draggable or scroll-driven wipe between two states. | a clip-path on the top plate driven by pointer or progress | give it a keyboard-reachable control too |
| **Hotspot** | Points on an image that open detail. | absolutely-positioned buttons plus a popover | they are buttons: focusable, escapable, not hover-only |
| **Magnetic / hover lift** | An element leaning toward the cursor. | `transform` from pointer offset, spring-eased | pointer-only — every hover state needs a tap equivalent |
| **Counter** | Figures counting up as they enter. | `requestAnimationFrame` from the same `IntersectionObserver` | run once, and land on the exact number |
| **Depth planes** | Elements at different z-depths converging or separating. | scaled and translated layers, blur on the far ones | blur is expensive — two planes, not five |
| **Float** | A knocked-out product drifting on a slow sine. | a long-duration CSS keyframe | needs a clean cut-out ([`../../tools/knockout.py`](../../tools/knockout.py)) |

## Four rules that apply to every one of them

**1 — Never a second scroll driver over the film.** Product sections live *below* the film,
past its scroll range. Anything that pins, scrubs or hijacks scroll inside the film's band
fights the engine and the scrub loses ([`../../core/rules.md`](../../core/rules.md) §9).

**2 — Vary the pattern across the set.** Five sections that all reveal-and-stagger read as
one long section. Alternate: a pinned scene, then a static reveal, then a rail, then a
macro scale-through. The variation *is* the pacing.

**3 — Reduced motion is a real branch, not an afterthought.** Under
`prefers-reduced-motion: reduce` every pattern here degrades to its final state: content
visible, images at rest, counters showing their number, pinned scenes flattened into a
stacked sequence. Nothing may be unreachable without motion.

**4 — Animate `transform`, `opacity` and `clip-path` only.** Everything else costs layout
or paint per frame, and these sections run right after a video scrub that already owns the
main thread. `will-change` on the one element that needs it, not on the section.

## What to build it with

- **Next.js** — Framer Motion for orchestration (`whileInView`, `useScroll`,
  `staggerChildren`) where it earns its weight; plain CSS plus `IntersectionObserver` for
  simple reveals. It is already in the scaffold's dependency budget
  ([`../../platforms/web/nextjs.md`](../../platforms/web/nextjs.md)); nothing else gets
  added for these sections.
- **Standalone preview** — an `html` act with inline CSS and one `IntersectionObserver`.
  The engine adds no motion to an `html` act, and it should not be changed to.
- **Flutter / Android** — the patterns translate as widgets: reveal becomes
  `AnimatedOpacity` on a visibility fraction, pin-and-advance becomes a
  `SliverPersistentHeader` driven by scroll progress, a rail becomes a `PageView`. The
  pattern survives; the DOM specifics do not.

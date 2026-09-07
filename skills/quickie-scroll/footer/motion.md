# Footer motion — one contract for all sixteen

*Built into the engine — no Framer Motion, no GSAP, no dependency.*

**Read with:** [`footer/variants.md`](variants.md) · [`engine/quickie-scroll.js`](../engine/quickie-scroll.js)

---

Built into the engine — no Framer Motion, no GSAP, no dependency:

- **Reveal on entry.** An `IntersectionObserver` adds `is-in` when the footer
  comes into view. Blocks rise and fade in sequence, `--sw-i × --sw-stagger`.
- **Staggered typography.** Variants marked *word-split* below break the
  headline into `<span>`s that arrive one word at a time.
- **Parallax.** The engine's existing scroll read writes `--sw-py` (−1…1, the
  footer's travel through the viewport) on each footer. Variants use it for
  drift; nothing extra listens to scroll.
- **Magnetic hover.** One delegated `pointermove` per footer, desktop only —
  links lean toward the cursor via `--sw-mx/--sw-my`.
- **Reduced motion.** `prefers-reduced-motion: reduce` skips the observer
  entirely: everything is visible, static, and the marquee stops.

Per-variant knobs: `--sw-stagger` (default 80ms), `--sw-rise` (26px),
`--sw-pop` (scale). Anything more is that variant's own rules.


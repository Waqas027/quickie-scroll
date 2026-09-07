# Quality rules — what a product section must clear

*The bar. A section that fails any of these is rewritten or dropped, not shipped smaller.*

**Read with:** [`../../core/quality.md`](../../core/quality.md) ·
[`animation-patterns.md`](animation-patterns.md) ·
[`../../validation/qa-checklist.md`](../../validation/qa-checklist.md)

---

## Every section, before it ships

- **It is about the product.** Not the brand's values, not the process of buying, not "why
  choose us". Those are acts ([`../acts.md`](../acts.md)). If the product could be swapped
  for another and the section still worked, it is not a product section.
- **It carries exactly one motion idea.** One pattern, executed well. Two patterns in one
  section is the same mistake as two camera moves in one clip
  ([`../../video/prompting.md`](../../video/prompting.md)).
- **It does not repeat a chapter.** Checked by beat, not by title
  ([`selection-rules.md`](selection-rules.md) → *the anti-duplication pass*).
- **The product is still the same product.** Any imagery — extracted frame, new generation
  or the user's own photo — holds the silhouette, colours, finish, label and markings
  ([`../../core/rules.md`](../../core/rules.md) §4). A section that restyles the product is
  rejected exactly as a clip would be.
- **It inherits the film's world.** Same palette, same type, same accent, same grade. A
  section that introduces its own visual language turns one site into two
  ([`../acts.md`](../acts.md) → *keep the handover visually continuous*).
- **It works with motion off.** `prefers-reduced-motion: reduce` leaves every word readable
  and every image visible, with nothing dependent on an animation that never runs.
- **It works on a phone.** Nothing overflows its padding box, nothing scrolls the page
  sideways at ~390 px, hover-only interactions have tap equivalents, and pinned scenes have
  a scroll length a thumb can actually get through.
- **It is keyboard- and screen-reader-reachable.** Hotspots, tabs and comparison handles are
  real controls with real focus states, not decorated divs.
- **It carries real copy.** Written from the user's own words about their own product.
  Placeholder copy in a section the user selected is an unfinished section.
- **It earns its scroll length.** A pinned scene costs a screen-height of scroll per state.
  Three states is a section; seven is a second film the user did not ask for.

## When to drop one instead of fixing it

Drop it — and say plainly why — when the assets it needs cannot be extracted from the chain
and are not worth a new generation, when it duplicates a beat a stronger section already
carries, or when its motion only makes sense on a desktop with a pointer. Four sections the
build actually delivers beat five where one is a placeholder.

## Handing them to QA

Each selected section adds one line to the QA pass: scroll into it once at desktop width and
once at phone width, with motion on and then with `prefers-reduced-motion` forced. The
regression list is in [`../../validation/qa-checklist.md`](../../validation/qa-checklist.md).

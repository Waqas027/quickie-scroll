# Quality — the bar every build clears

*What "good" means here, and how to judge it. The laws are in [`rules.md`](rules.md);
this file is the standard the output is measured against.*

**Read with:** [`art-direction/realism.md`](../art-direction/realism.md) ·
[`video/prompting.md`](../video/prompting.md) ·
[`validation/qa-checklist.md`](../validation/qa-checklist.md)

---

## Realism is prompt work, not post work

Every photoreal prompt names a real lens and aperture, exactly one light source, a specific
imperfection (grain, dust, wear), and explicit depth separation ("foreground passing faster
than background"). All seven clauses are in
[`art-direction/realism.md`](../art-direction/realism.md) — apply every one of them, and
check for them again when reviewing a clip.

## When the prompt's blocks conflict

**reference accuracy → motion control → continuity → cinematic quality.**
Drop the adjective before you drop a lock.

## Rejection is cheaper than repair

- A rejected clip goes to `assets/rejected/NN-<slug>-take<X>.mp4` with a one-line cause,
  and its frames are **never** extracted. Advancing off a bad handoff frame poisons every
  leg after it.
- Do not crossfade over a bad start frame, and do not "fix it in the next clip" — the next
  clip inherits the error and every clip after it does too.
- The start still is worth two or three re-rolls; it is the cheapest re-roll in the build,
  because the whole film inherits its grade, its light and its lens.

Loop and criteria: [`project/handoff-loop.md`](../project/handoff-loop.md).
Validation scripts: [`pipeline/scripts.md`](../pipeline/scripts.md) §2 and §5.

## Previz cheaply

Run the whole chain at the lowest tier first, approve the journey and the pacing, then
re-render the final legs at full quality. The chain is seamless at every tier, so previz
translates directly. Suggest it unprompted when the budget reads tight.

## The finished build must be

- **One film, not six clips.** Byte-identical preamble, one look, one model, one camera
  architecture.
- **Seamless at every seam.** Judged by composition, not PSNR.
- **The user's product, unchanged**, in every frame that contains it.
- **A page, not a hero** — unless the user chose film-only. The film hands over to the acts
  with no hard rule and no colour jump, and ends on a footer the user actually picked.
- **Alive on a phone.** Reduced motion falls back to stills; a throttled phone scrubs
  without freezing.

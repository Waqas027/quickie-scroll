# Camera — architectures, grammar and the handoff contract

*Which camera the film has, and the one contract that lets each chapter move expressively
without breaking a seam.*

**Read with:** [`animation/chain.md`](chain.md) · [`video/prompting.md`](../video/prompting.md) ·
[`discovery/interview.md`](../discovery/interview.md) question 4

---

## The three architectures — ask, don't assume

Present these as written; the answer is recorded as `CAMERA` and it decides the chain
architecture in [`chain.md`](chain.md).

- **One continuous walkthrough** — a single forward flight, chapter into chapter, never
  pulling back. → **Architecture A**. The default for anything photoreal.
- **Fly through the world** — dive into each scene, pull up and out, hop to the next.
  → **Architecture B**. Only for miniature/diorama looks: it reverses camera direction at
  every seam, which reads as intentional in a map-like world and as a rewind stutter in a
  realistic one. Say that in one line if they pick B against a photoreal look.
- **Locked isometric glide** — one fixed angle throughout, the world sliding past.
  → Architecture A plus the locked-iso clause in every prompt. Calmest, cheapest to
  re-roll.

## "Forward only" is a *seam* rule, not a *leg* rule

Inside one clip the camera is free: one clip is one continuous render, so orbits,
crane-ups, lateral tracks and push-ins that ease back out are all safe. Reversals are only
fatal *across* seams. So give each chapter an expressive move from its own logic, under a
**motion handoff contract** kept verbatim in every prompt:

> every clip **ends** by settling into a slow steady forward drift (final ~1 s), and every
> clip **begins** by continuing that same drift.

The move library — pick exactly one per clip — is in
[`video/prompting.md`](../video/prompting.md) → *Mid-leg move library*.

Honest cost: expressive moves raise re-roll odds, because a model can end a fancy move in a
state that isn't a clean forward drift. Budget roughly one extra re-roll per expressive leg,
and keep the settle clause word-for-word.

## Scroll is a scrubber

Visitors scroll **up** too, so every move also plays in reverse. That's free, and another
reason seam velocity must be consistent in both directions.

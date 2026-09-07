# Scene planning — chapters, copy and pacing

*How many chapters, what each one contains, and how scroll time is distributed across them.*

**Read with:** [`discovery/interview.md`](../discovery/interview.md) question 5 ·
[`animation/camera.md`](camera.md) ·
[`platforms/web/engine-config.md`](../platforms/web/engine-config.md)

---

## Chapter count

2 (teaser) | 4 (short journey) | 6 (full film, maximum — past six the scroll pacing stops
being comfortable). Record as `N`.

Ask the count **first**, then propose that many chapters drawn from the subject's own logic
and let the user edit. Each chapter needs: what the camera sees, an eyebrow, a headline, one
line of body, 0–3 tag chips, and an `align` (left / right / center).

Asset workload follows directly: **1 still + N clips** (architecture A) or
1 still + (2N−1) clips (architecture B), doubled if a portrait chain ships too.

## Alternate the alignment down the list

Six chapters of bottom-left copy is the single most common reason a good film reads as a
template. The readability scrim follows `align` automatically.

---

## Pacing — the two per-chapter knobs

Pacing lives in `scroll` and `linger`, both set per chapter in the engine config:

- **`scroll`** — viewport-heights of scroll. More distance = longer dwell.
- **`linger`** — 0–0.6. Remaps time so the camera settles mid-chapter exactly where the
  copy peaks, then picks up toward the seam. **Seam frames are untouched**, so linger can
  never break a seam.

Give the opening and finale more of both; keep transit chapters brisk. Prefer expressive
motion in the *clip* and restraint in the *scrub mapping* — they compound.

---

## Copy per chapter (for the engine config)

- `eyebrow` — 2–4 words, a label not a sentence. Often a chapter number + name
  (`01 — THE THRESHOLD`).
- `title` — 3–7 words. Short declaratives land; questions don't. "Built for the distance
  before it begins." / "Precision begins here." — a statement about the *world*, not a
  feature list.
- `body` — one sentence, from the visitor's side.
- `tags` — 0–3 proof chips (`Calabrian bergamot`, `Double-wall steel`, `Dawn-cut`).
- `align` — alternate `left` / `right` / `center` down the chapter list. Six chapters of
  bottom-left copy is the single most common reason a good film reads as a template.

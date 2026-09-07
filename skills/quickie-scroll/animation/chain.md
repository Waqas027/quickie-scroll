# The seamless chain — SKILL Step 5

*This is the part that makes or breaks the build.*

**Read with:** [`core/rules.md`](../core/rules.md) §1–§2 · [`animation/camera.md`](camera.md) ·
[`video/continuity.md`](../video/continuity.md) ·
[`pipeline/scripts.md`](../pipeline/scripts.md) §3–§4

---

## Architecture A — continuous forward take (the default)

One camera that only ever glides **forward**, first chapter through last, as a single take.
Render the legs **sequentially**:

```
leg 1  : start-image = THE start still (the only generated image in the build)
leg n  : start-image = leg n−1's ACTUAL LAST FRAME (extracted with ffmpeg)
         no end-image
```

Extraction happens **only after a clip is accepted**. A rejected take goes to
`assets/rejected/` with a one-line cause and its frames are never pulled — advancing off a
bad handoff frame poisons every leg after it.

No end-image, ever. An end-image of a wide establishing shot forces the camera to pull
back, which is the number-one cause of seam stutter. The legs *are* the journey — there
are no connectors. Wire with `connectors: []` and a small `crossfade` (~0.08).

**Eyeball each leg's last frame before rendering the next.** It should read as a frame
from a calm forward glide — not mid-orbit, not blurred sideways. A bad handoff frame
poisons every leg after it, so the check costs one look and saves the rest of the chain.

## Architecture B — dive + connector (miniature worlds only)

A dive into each scene, plus a connector that pulls up and out and flies to the next.
Connector *i* runs from leg *i*'s **actual last frame** to leg *i+1*'s **actual first
frame** — both extracted from the rendered videos:

```bash
ffmpeg -sseof -0.15 -i raw/01-a.mp4 -frames:v 1 -q:v 2 frames/last-01-a.png
ffmpeg -ss 0        -i raw/02-b.mp4 -frames:v 1 -q:v 2 frames/first-02-b.png
```

Now `leg_i.end == connector.start` and `connector.end == leg_{i+1}.start`. Using the
original still instead of the rendered frame is the classic seam pop: every generation
renders slightly differently, so two renders of "the same scene" never match.

B reverses camera direction at every seam. In a miniature world that reads as "zoom out to
the map, fly to the next island". In anything photoreal it reads as a rewind.

The connector prompt template is in [`video/continuity.md`](../video/continuity.md).

## Camera grammar

Inside a leg the camera is free; reversals are fatal only across seams. The motion handoff
contract that makes that safe is in [`animation/camera.md`](camera.md) — keep it verbatim
in every prompt.

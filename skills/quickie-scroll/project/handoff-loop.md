# The loop you run per clip

*SKILL Step 6 — the per-clip loop on the manual path, and the rejection rules.*

**Read with:** [`project/brief-template.md`](brief-template.md) · [`video/continuity.md`](../video/continuity.md) · [`core/quality.md`](../core/quality.md)

---

This is the workflow both files serve. Say it to the user once, plainly, before generating
anything — see SKILL Step 2.

1. Hand over `prompts/videos/NN-<slug>.md` and its start frame.
2. The user renders it and drops the file into `assets/videos/NN-<slug>.mp4`.
3. **Review it** against the prompt's *Accept when* list.
4. **Accepted** → extract its boundary frames, mark ✅ in `brief.md`, write clip *n+1*'s
   prompt from the real `last-NN.png`, hand it over.

   ```bash
   ffmpeg -y -ss 0        -i assets/videos/NN-<slug>.mp4 -frames:v 1 -q:v 2 assets/frames/first-NN-<slug>.png
   ffmpeg -y -sseof -0.15 -i assets/videos/NN-<slug>.mp4 -frames:v 1 -q:v 2 assets/frames/last-NN-<slug>.png
   ```

   `first-NN.png` is also chapter *n*'s poster and reduced-motion still — no extra image
   generation, and it matches the film exactly.
5. **Rejected** → move it to `assets/rejected/NN-<slug>-take<X>.mp4`, mark ❌ with a one-line
   cause, and say in one sentence what to change in the prompt. **Do not extract its last
   frame and do not advance** — a bad handoff frame poisons every clip after it.

## Rejecting a clip

Reject and re-roll on any of these. They do not get better downstream.

- **Frame 0 differs from the start frame handed in.** The tool ignored the conditioning
  image. This is the one failure nothing later can hide — not a crossfade, not a dissolve.
- **Anything in the HOLD block changed.** With a product reference this is absolute: if the
  product is not recognisably the same product at the last frame, the clip is rejected
  however good the motion was.
- **The last second isn't a calm forward drift.** That frame is the next clip's start image.
- **A cut, a dissolve, a double exposure or a speed ramp** anywhere in the clip.
- **Text, letters, numbers, watermarks** anywhere in frame.
- **Everything moves together.** Foreground must pass faster than background, or it is a pan
  across a matte painting and reads as fake instantly.
- **The look drifted** — different grade, light or lens from the neighbouring clips.

## Re-rolling one chapter later

1. Re-render from `prompts/videos/NN-<slug>.md` with the **same** start frame.
2. Re-extract its `first-`/`last-` frames.
3. Re-render every clip **after** it — they chained off the old last frame.

That cascade is why the chapter list is worth settling before the video pass starts.
</content>

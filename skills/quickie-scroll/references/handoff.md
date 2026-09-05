# The two project documents

Every build writes exactly two markdown documents at the project root, and they do not
overlap:

| File | Answers | Changes |
|---|---|---|
| `README.md` | **What this project is** | Once, at the start. Only when a decision changes. |
| `brief.md` | **Where production currently is** | Every time an asset lands. |

The split exists because they have different readers and different lifespans. `README.md`
is read by someone who has never seen the project; `brief.md` is read by you, next session,
to work out what to do next. Mixing them produces the failure this replaces: a 300-line
README nobody can skim, where the one line that matters ("clip 03 is next") is buried under
rejection history.

**Never put production status in `README.md`.** No accepted/rejected, no take letters, no
prompt-testing history, no "ready for the next scene", no regeneration log. If it changes
when a file lands, it belongs in `brief.md`.

Both files stay short. `README.md` fits on a screen and a half. `brief.md` fits on one
screen, and the user must be able to tell the current state within a few seconds of opening
it — if it stops passing that test, delete history from the bottom, do not add headings.

---

## `README.md` — what this project is

```markdown
# <BRAND> — <one-line pitch>

<Two or three sentences: what the website is, what it is for, who it is for.>

A scroll-driven <web | Flutter | web + app> experience: scroll sets the playhead of a
pre-rendered continuous camera move, so the camera genuinely travels and scroll only
drives time. <N> chapters of copy pin over the film, then <the acts> scroll up over the
last frame.

## The build

| | |
|---|---|
| Look | `<look-name>` — <one line, from looks.md> |
| Camera | <walkthrough (arch A) / fly-through (arch B) / locked isometric> |
| Chapters | <N> |
| Target | <web 16:9 / app 9:16 / both> |
| Palette | `<bg>` background · `<accent>` accent · <the rest> |
| Type | <Display> / <Body> |
| Assets | **1 still + <N> clips** <(× 2 for the portrait chain)> |
| After the film | <the acts, in order> |
| Asset source | <manual — the prompt pack is the deliverable | automatic via `<tool>`> |

## The journey

| # | Chapter | What the camera does | Headline |
|---|---|---|---|
| 01 | <label> | <one line> | "<title>" |
| 02 | … | … | … |

<!-- only when the user supplied references -->
## References

| Reference | Role | What it supplied |
|---|---|---|
| `refs/product/<file>` | **product — locked** | the product itself; shape, colour, materials and markings are held in every shot |
| `refs/style/<file>` | style | <the two things taken from it> |

## How the film is built

One image is generated: the start frame of chapter 1. Every clip after that starts on the
**actual last frame of the clip before it**, extracted from the rendered video — so the
whole film is one continuous take and there is nothing to match by eye.

```
01 → generate the start image → render clip 01 → extract its last frame
02 → render from that frame    → extract its last frame
03 → render from that frame    → …
```

Current status, and what to render next: **`brief.md`**.

## Layout

```
prompts/images/    the one start-frame prompt
prompts/videos/    one .md per clip, numbered in chain order
refs/              user-supplied product and style references
assets/images/     the start still
assets/videos/     the videos you generate — the masters
assets/rejected/   videos that didn't pass, kept for reference
assets/frames/     extracted seam frames (last-NN / first-NN)
public/assets/     encoded, scrub-ready — what the page loads
```

## Running it

```bash
npm run dev            # or: npx serve .
bash build.sh          # encodes assets/videos/ into public/assets/videos/ and prints the config
```
```

---

## `brief.md` — where production currently is

One status table, one next action, and short notes. That is the whole file.

```markdown
# Production — <BRAND>

**Next:** <the single next thing to do, in one line. e.g. "render clip 03 from
`assets/frames/last-02-kettle.png` using `prompts/videos/03-cellar.md`">

## Start image

| Prompt | Output | Status |
|---|---|---|
| `prompts/images/01-<slug>.md` | `assets/images/01-<slug>.png` | ✅ accepted |

## Clips

| # | Prompt | Start frame | Output | Status |
|---|---|---|---|---|
| 01 | `prompts/videos/01-<slug>.md` | `assets/images/01-<slug>.png` | `assets/videos/01-<slug>.mp4` | ✅ accepted |
| 02 | `prompts/videos/02-<slug>.md` | `assets/frames/last-01-<slug>.png` | `assets/videos/02-<slug>.mp4` | 🔄 rendering |
| 03 | `prompts/videos/03-<slug>.md` | `assets/frames/last-02-<slug>.png` | — | ⛔ blocked on 02 |

Status is one of: ⛔ blocked · ⬜ ready to render · 🔄 rendering · ❌ rejected · ✅ accepted.
A clip is **blocked** until the clip before it is accepted and its `last-` frame extracted —
that dependency is the whole point of the table.

## Notes

- <one line per thing worth carrying forward: a rejection and its cause, a drift between a
  FINAL FRAME line and the real frame, a model that keeps refusing a word>
```

Keep `## Notes` to the handful of lines that still affect what to do next. A cause worth
remembering ("this model adds a dissolve whenever the prompt says 'transition'") stays; a
resolved re-roll from three chapters ago goes.

---

## The loop you run per clip

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

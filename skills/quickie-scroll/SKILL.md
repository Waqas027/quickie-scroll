---
name: quickie-scroll
description: >
  Build cinematic scroll-driven product experiences — Next.js websites and Flutter or
  native-Android apps — where the visitor's scroll drives a real camera through a photoreal
  world. Scroll sets the playhead of a pre-rendered continuous camera move, so the camera
  genuinely travels and scroll only drives time; chapters of copy pin over it, and the rest
  of the site scrolls up over the finished film. Never asks which sections come after the
  film — it acts as creative director and designs four or five premium, concept-specific
  sections plus a mandatory context-aware footer from the subject, the look and the
  references, so the film evolves into a complete, domain-native site rather than being
  followed by a generic landing page. Designs the chrome per build too — the brand mark, the
  nav pattern and position, the scroll-progress rail and its side are decided from the
  subject and the look rather than inherited, so two builds never open as the same site with
  different text. Treats the film as the emotional opening, then builds
  the actual product journey: discovery, comparison, itinerary or basket building,
  conversion and operational detail when those belong to the subject. Sources the real
  imagery that those sections need from the web when the user has not supplied it, records
  provenance and license/use status, and never fills a page with invented businesses,
  destinations, products, prices or reviews. When an image genuinely cannot be sourced it
  writes a full asset specification — section, exact position, local path, aspect ratio and
  generation prompt — instead of quietly dropping a gradient where a photograph belongs. Uses the UI/UX Pro Max skill when it is
  available to establish the interaction and accessibility system before implementation.
  Generates exactly one start image —
  every later scene is conditioned on the previous clip's actual last frame — and writes
  each clip prompt in a fixed seven-block form built for image-to-video models rather than
  for cinematic prose. Locks a user-supplied product as the visual anchor, sorts design
  references into style inspiration, and ships a seven-look art-direction library tuned for
  realism, a numbered markdown prompt pack the user can render in any tool, a scrub engine
  with cinematic HUD chrome plus a React wrapper, and dependency-free Flutter and Jetpack
  Compose scaffolds for the 9:16 app target. For an app request it probes the machine for a Flutter or Android SDK first and
  says so plainly if neither is installed, offering the website instead. Renders through a
  connected MCP/CLI when one is available, or hands over the prompt pack when not. Use when
  the user wants a scroll cinematic, an Apple-style scroll-through product page, a "fly
  through the world" hero, an immersive brand site, or a scroll-driven mobile app.
allowed-tools: Bash, Read, Write, Edit, AskUserQuestion, WebSearch, WebFetch, Skill
---

# quickie-scroll

Scroll drives a camera. The page holds a pre-rendered continuous camera move and maps
scroll position to `currentTime`, so the camera genuinely travels through a world while
scroll only drives time. This is the technique behind Apple's scroll-through product
pages — and behind every reference film in `art-direction/looks.md`.

**Two targets, one pipeline.** A **website** (16:9, Next.js) and a **mobile app** (9:16 —
Flutter, or native Android with Compose) share the interview, the look, the prompt pack and
the seamless-chain law. Only the aspect, the clip length and the playback mechanism differ.
For an app, **probe the toolchain first** (Step 0) — never promise an app on a machine
that can't build one.

**What a build produces**

```
<project>/
  README.md                what this project is — decisions, journey, layout
  brief.md                 where production currently is — status board, one screen
  prompts/images/01-*.md   THE ONE image prompt: scene 1's start frame
  prompts/videos/NN-*.md   one markdown prompt per clip, in chain order
  refs/product|style       user-supplied references, sorted
  assets/images|videos|rejected|frames

  # web target — a Next.js project
  app/{layout,page}.tsx · components/{QuickieScroll.tsx,quickie-scroll.js,quickie-scroll.d.ts} · public/assets/

  # app target — whichever toolchain the probe found
  lib/scroll_scrub.dart                            (Flutter)
  app/src/main/java/…/ScrollScrub.kt + assets/frames/   (native Android)
```

**The laws that govern every build are in [`core/rules.md`](core/rules.md). Read it once,
before Step 1.** The two that decide the whole architecture:

- **The seamless chain.** Every clip after the first starts on the **actual last frame of
  the clip before it**, extracted from the rendered video — never a still, never a
  re-render.
- **Its consequence: one image, N clips.** The build generates **exactly one image** — the
  start frame of scene 1. Chapter *n*'s poster comes out of clip *n* with ffmpeg.

---

## The workflow

Ten steps, in order. Each names the module that holds its detail; read that module before
running the step, not after.

| Step | What happens | Read first |
|---|---|---|
| **0** | Bootstrap — ffmpeg, renderer probe, app-toolchain probe | [`core/bootstrap.md`](core/bootstrap.md) |
| **1** | Experience brief — references, target, subject, audience, primary action, real content/assets, look, camera and chapters | [`discovery/interview.md`](discovery/interview.md) → [`discovery/experience-brief.md`](discovery/experience-brief.md) |
| **2** | State the chained workflow to the user, then write the prompt pack | [`core/rules.md`](core/rules.md) → [`video/prompt-pack.md`](video/prompt-pack.md) |
| **3** | The one start frame | [`image/start-frame.md`](image/start-frame.md) |
| **4** | Rendering — who renders, at what cost | [`video/rendering.md`](video/rendering.md) |
| **5** | The seamless chain — architecture A or B | [`animation/chain.md`](animation/chain.md) |
| **6** | The manual handoff — the per-clip loop | [`project/handoff-loop.md`](project/handoff-loop.md) |
| **7** | Encode for scrubbing | [`pipeline/encoding.md`](pipeline/encoding.md) |
| **8** | Source missing section assets, design the post-film product journey, then assemble — Next.js, Flutter or Android | [`assets/sourcing.md`](assets/sourcing.md) → [`platforms/`](platforms/) |
| **9** | QA | [`validation/qa-checklist.md`](validation/qa-checklist.md) |

### Step 0 — Bootstrap

Confirm `ffmpeg`/`ffprobe`, look for a connected renderer (offer it at Step 4, never use it
unasked), and — for any app request — run `bash tools/detect-target.sh` **before** the
target question. No renderer is not a failure mode: the prompt pack is a first-class
deliverable. → [`core/bootstrap.md`](core/bootstrap.md)

### Step 1 — Interview

Ask only what you genuinely can't default. Order matters: user-supplied references come
first when any exist, because a product anchor changes the look, the chapters and every
prompt. → [`discovery/interview.md`](discovery/interview.md), which routes to
[`discovery/references.md`](discovery/references.md),
[`art-direction/looks.md`](art-direction/looks.md),
[`animation/camera.md`](animation/camera.md),
[`animation/scene-planning.md`](animation/scene-planning.md).

Turn the answer into an experience brief before scene planning: visitor, primary action,
decision-critical content, real-world scope, and what the visitor needs to accomplish after
the emotional film. → [`discovery/experience-brief.md`](discovery/experience-brief.md)

**What follows the film is not asked.** No section multi-select, no "film only", no "do you
want a footer?" — the skill designs 4–5 sections plus a mandatory footer from the subject
and the look. → [`sections/post-film.md`](sections/post-film.md)

Close the interview by writing `README.md` and `brief.md` before a single prompt file
exists. → [`project/documents.md`](project/documents.md)

### Step 2 — State the workflow, then write the pack

Say how the chain works **before** writing anything — a user who doesn't know it will go
and generate four images nobody wanted. The script to adapt is in
[`core/rules.md`](core/rules.md) → *"Say it before you build it"*.

Then write the pack: layout, naming and format in
[`video/prompt-pack.md`](video/prompt-pack.md); the seven-block clip prompt in
[`video/prompting.md`](video/prompting.md); clip *n* written from clip *n−1*'s real frame
in [`video/continuity.md`](video/continuity.md).

Write it on **both** asset paths. On the manual path it is the deliverable; on the
automatic path it is the record of what was rendered and the source of truth for re-rolls.

### Step 3 — The one start frame

One image: the opening frame of scene 1. It is clip 1's start frame, chapter 1's poster,
the reduced-motion still, and the style reference every later re-roll is judged against.
Worth two or three re-rolls; it is the cheapest re-roll in the build.
→ [`image/start-frame.md`](image/start-frame.md)

### Step 4 — Rendering

Ask before spending. The only capability requirement is **start-frame conditioning**.
One model for the entire chain. → [`video/rendering.md`](video/rendering.md), backends in
[`pipeline/backends.md`](pipeline/backends.md).

### Step 5 — The seamless chain

The part that makes or breaks the build. Architecture A (continuous forward take, the
default) or B (dive + connector, miniature worlds only), and the camera grammar that lets
each chapter have an expressive move without breaking a seam.
→ [`animation/chain.md`](animation/chain.md) and [`animation/camera.md`](animation/camera.md);
scripts in [`pipeline/scripts.md`](pipeline/scripts.md).

### Step 6 — The manual handoff

When `ASSET_SOURCE` = manual, the prompt pack plus `README.md` and `brief.md` is the
product. Always present the work as a spec table, and run the review → accept → extract →
write-next loop in that order every time. → [`project/handoff-loop.md`](project/handoff-loop.md)

### Step 7 — Encode

Scrubbing sets `currentTime` every frame, so seek cost is the only thing that matters:
native resolution, crf ≤ 20, small GOP (`-g 8`), `+faststart`, no audio. Portrait and
app-target frame sequences differ. → [`pipeline/encoding.md`](pipeline/encoding.md)

### Step 8 — Design the post-film page, then assemble

The film is one half of the deliverable. Before scaffolding, source the real imagery the
approved experience requires if the user did not provide it — never fake a destination,
hotel, product, price or review. → [`assets/sourcing.md`](assets/sourcing.md). Then look at
the film's **real last frame** and confirm the post-film plan drafted at Step 1 against it:
**4–5 designed sections plus a mandatory footer**, each with a reason to exist for this
subject, the first one inheriting the last frame's palette, light and motion direction.
Never the default statement → cards → testimonials → CTA. → [`sections/post-film.md`](sections/post-film.md)

Design the **chrome** in the same pass — the brand mark, the nav pattern and position, the
scroll-progress rail and its side, and chapter 1's alignment. Five decisions, made from the
subject and the look, recorded in `README.md`. The engine's defaults are what made two
unrelated builds read as one product with two skins; shipping them unexamined is the failure
this step exists to prevent. → [`platforms/web/chrome.md`](platforms/web/chrome.md)

Then build:

- **Web** — scaffold a **Next.js App Router project**, not a single HTML file. Engine,
  wrapper, types, Lenis smooth scroll and the two hard rules:
  [`platforms/web/nextjs.md`](platforms/web/nextjs.md). Chrome variants — `brand.mark`,
  `nav`, `navPlace`, `route`, `routeSide`:
  [`platforms/web/chrome.md`](platforms/web/chrome.md). Engine config — chapters, `hud`,
  `align`, post-film sections, `scroll`/`linger` pacing:
  [`platforms/web/engine-config.md`](platforms/web/engine-config.md).
- **App** — per the Step 0 probe: [`platforms/flutter/flutter.md`](platforms/flutter/flutter.md)
  or [`platforms/android/android.md`](platforms/android/android.md). Both scrub a
  pre-extracted JPEG frame sequence, not video, and both are dependency-free.

### Step 9 — QA

Do not skip. Seams, scrubbing, the handover to the post-film page, reduced motion, phone. → [`validation/qa-checklist.md`](validation/qa-checklist.md)

When something is wrong, the symptom → cause index is
[`validation/troubleshooting.md`](validation/troubleshooting.md).

---

## Module map

Where to change what. One domain, one folder, one source of truth.

| I want to change… | Go to |
|---|---|
| A global law, or the priority when rules conflict | `core/rules.md` |
| The bar the output must clear | `core/quality.md` |
| Environment probes, renderer detection | `core/bootstrap.md` |
| The questions asked, and their order | `discovery/interview.md` |
| Turning a subject into a production-worthy visitor journey | `discovery/experience-brief.md` |
| How supplied product / style references are handled | `discovery/references.md` |
| The art-direction library, or a look's palette and type | `art-direction/looks.md` |
| What makes a frame read as film rather than AI | `art-direction/realism.md` |
| Chapter count, chapter copy, alignment, pacing | `animation/scene-planning.md` |
| Seam handling, architecture A/B | `animation/chain.md` |
| Camera moves, the motion handoff contract | `animation/camera.md` |
| The one image prompt | `image/start-frame.md` |
| Where prompt files go and what format they take | `video/prompt-pack.md` |
| The seven-block clip prompt and its rules | `video/prompting.md` |
| Writing clip *n* from clip *n−1*; connector prompts | `video/continuity.md` |
| Renderer choice, cost, spend approval | `video/rendering.md` |
| The page after the film — how it is designed | `sections/post-film.md` |
| The logo, the nav pattern, the progress rail — chrome designed per build | `platforms/web/chrome.md` |
| Finding, licensing, downloading and attributing section imagery | `assets/sourcing.md` |
| What to write when an image can't be sourced, instead of a gradient | `assets/sourcing.md` → *asset prompts* |
| Next.js scaffold, React wrapper, engine config | `platforms/web/` |
| The Flutter or Android app target | `platforms/flutter/`, `platforms/android/` |
| The scrub engine itself | `engine/quickie-scroll.js` |
| ffmpeg scripts, encoding, known backends | `pipeline/` |
| `README.md` / `brief.md` templates, the handoff loop | `project/` |
| The QA checklist or the symptom index | `validation/` |
| The toolchain probe, background knockout | `tools/` |

## Files that are copied into a build

- [`engine/quickie-scroll.js`](engine/quickie-scroll.js) — the scrub engine (chain,
  blob-seek, crossfades, pinned copy, HUD, alignment, post-film sections, route rail, reduced motion,
  phone hardening). Returns a `{ destroy }` handle for
  component frameworks.
- [`platforms/web/QuickieScroll.tsx`](platforms/web/QuickieScroll.tsx) +
  [`quickie-scroll.d.ts`](platforms/web/quickie-scroll.d.ts) — the React wrapper and types.
- [`platforms/web/index-template.html`](platforms/web/index-template.html) — a standalone
  page, for a zero-install preview.
- [`platforms/flutter/scroll_scrub.dart`](platforms/flutter/scroll_scrub.dart) — the Flutter
  scaffold.
- [`platforms/android/ScrollScrub.kt`](platforms/android/ScrollScrub.kt) — the Compose
  scaffold.
- [`tools/detect-target.sh`](tools/detect-target.sh) — the app-toolchain probe (Step 0).
  Prints `TARGET=FLUTTER|ANDROID|BOTH|NONE`.
- [`tools/knockout.py`](tools/knockout.py) — background knockout, for floating diorama
  scenes.

Not copied into a build, but run it after any engine edit:
[`engine/chrome-variants.test.mjs`](engine/chrome-variants.test.mjs) — `node
engine/chrome-variants.test.mjs`, no install, asserts every chrome variant still builds.

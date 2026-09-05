---
name: quickie-scroll
description: >
  Build cinematic scroll-driven product experiences — Next.js websites and Flutter or
  native-Android apps — where the visitor's scroll drives a real camera through a photoreal
  world. Scroll sets the playhead of a pre-rendered continuous camera move, so the camera
  genuinely travels and scroll only drives time; chapters of copy pin over it, and an
  editorial page scrolls up over the finished film. Generates exactly one start image —
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
allowed-tools: Bash, Read, Write, Edit, AskUserQuestion, Skill
---

# quickie-scroll

Scroll drives a camera. The page holds a pre-rendered continuous camera move and maps
scroll position to `currentTime`, so the camera genuinely travels through a world while
scroll only drives time. This is the technique behind Apple's scroll-through product
pages — and behind every reference film in `references/looks.md`.

**Two targets, one pipeline.** A **website** (16:9, Next.js) and a **mobile app** (9:16 —
Flutter, or native Android with Compose) share the interview, the look, the prompt pack and
the seamless-chain law. Only the aspect, the clip length and the playback mechanism differ.
For an app, **probe the toolchain first** (Step 0.2) — never promise an app on a machine
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
  app/{layout,page}.tsx · components/{QuickieScroll.tsx,quickie-scroll.js} · public/assets/

  # app target — whichever toolchain the probe found
  lib/scroll_scrub.dart                            (Flutter)
  app/src/main/java/…/ScrollScrub.kt + assets/frames/   (native Android)
```

**The one law.** Every clip after the first must start on the **actual last frame of the
clip before it**, extracted from the rendered video — never from a still, never from a
re-render. Break it and the film cuts. Read [Step 5](#step-5--the-seamless-chain) before
generating anything.

**Its consequence: one image, N clips.** Because clip *n* is conditioned on clip *n−1*'s
rendered frame, stills 2…N are never used as start frames — and a re-rendered still can
never match a rendered frame anyway. So the build generates **exactly one image**: the
start frame of scene 1. Chapter *n*'s poster and reduced-motion still come out of clip *n*
with ffmpeg, free and frame-exact. Generating a still per chapter is not thoroughness, it
is money spent on assets the chain must then refuse to use.

---

## Step 0 — Bootstrap

1. **ffmpeg / ffprobe** on `$PATH`. Required — everything downstream of rendering is
   ffmpeg (frame extraction, validation, encoding, Flutter frame sequences).
2. **Look for a connected renderer.** Check, in this order, whatever is actually present:
   connected image/video MCP servers; then CLIs (`higgsfield`, `monid`, `codex`, `fal`,
   `replicate`). If you find one, you will offer it at Step 4 — you do **not** use it
   without asking, and you do not spend anything before the user approves an estimate.
3. **No renderer is not a failure mode.** The prompt pack is a first-class deliverable,
   not a fallback. Most builds ship this way.
4. **App target only — probe the toolchain BEFORE promising an app.** Run
   `bash references/detect-target.sh`. It prints `TARGET=FLUTTER|ANDROID|BOTH|NONE`, and
   that result decides Step 1.1. Do not skip it and do not guess from `$PATH`: an Android
   SDK installed by Android Studio very often exports **neither** `$ANDROID_HOME` nor
   `$ANDROID_SDK_ROOT` and keeps `adb` off `$PATH`, so an env-var-only check reports "no
   Android" on a machine with a complete SDK. The script probes the standard install
   locations for exactly that reason.
5. Caveats: macOS ships **bash 3.2** — no associative arrays. **zsh arrays are
   1-indexed** — run every chain script as `bash script.sh`, never pasted into an
   interactive zsh, or the chain grabs the wrong chapter's frames. Video generations take
   3–8 minutes each — always detached, always polled, never a blocking foreground call.

---

## Step 1 — Interview

Ask what you genuinely can't default. The subject is the user's to state — ask it as an
open question in plain prose, never a fabricated multiple-choice list of industries.
Reserve structured choice (`AskUserQuestion` where available; a plain either/or otherwise)
for the genuinely enumerable decisions, and signal that "other" is fine.

**0. References — only when the user supplied any; then it comes before everything.**
Images arrive as attachments, paths, or Pinterest/Dribbble/Behance links. **Look at each
one**, then sort it into exactly one of two roles and say the sort back in a line or two so
the user can correct it. Getting this wrong is expensive in both directions: treating a
product as inspiration redesigns their product; treating a mood board as a product locks
the film to someone else's photo.

| Role | What it means | Where it goes |
|---|---|---|
| **Product** — "build the website around this" | The actual thing being sold. A **locked visual anchor**: the same silhouette, proportions, colours, finish, materials, label and markings, in every frame. | `refs/product/` · lock clause in the image prompt and in **every** clip's HOLD block |
| **Design / style** — Pinterest, Dribbble, a screenshot, a site they like, an animation they want the feel of | Inspiration for palette, type, composition, grade, motion pace, section rhythm. | `refs/style/` · informs `LOOK`, `PALETTE`, `TYPE`, the composition line and the CAMERA move |

Both kinds can arrive together, and usually do — "here's the bottle, and here are three
sites I like". A product reference **overrides the look's default palette and framing**
where they conflict; the look supplies the world around the product, never the product.

Two rules that are not negotiable:

- **The product is never redesigned.** Not simplified, not restyled, not "improved", not
  swapped for a similar one. Camera, light and environment change around it. A clip where
  the product is no longer recognisably the same product is rejected however good the
  motion was — that check is a permanent line in every acceptance list.
- **A style reference is never a conditioning image.** It informs the prompt *text*. Pass
  it as the image input and it clones its own content into the film.

Write the extraction into `README.md` as a short table — which reference supplied what —
and hold each style reference to at most two rows. One reference supplying everything is a
copy, not an art direction. Full guidance: `references/prompts.md` → "Working from
user-supplied references".

**1. Target — ask first; it sets every asset's aspect ratio.**
   - **Website** — 16:9 landscape chain, built as a **Next.js** project (Step 8).
   - **Mobile app** — 9:16 portrait chain, natively composed (never a crop).
   - **Both** — two chains; roughly double the render workload. State that.

   **If the answer involves an app, the Step 0.2 probe result decides how you proceed —
   and it is not negotiable, because you cannot build an app with a toolchain that isn't
   installed.** Report what you found, in plain language, before doing anything else:

   | Probe | What to do |
   |---|---|
   | `TARGET=FLUTTER` | Say Flutter was found (give the version) and build the Flutter target (`references/flutter/`). |
   | `TARGET=ANDROID` | Say Flutter wasn't found but an Android SDK was (give the path), and build the native Compose target (`references/android/`). |
   | `TARGET=BOTH` | Say both were found and **ask which** — recommend Flutter (one codebase, smaller scaffold, and the app can ship to iOS later). |
   | `TARGET=NONE` | **Stop and ask.** Do not scaffold an app. |

   On `NONE`, say it plainly and offer the alternative — never silently downgrade to a
   website, and never scaffold an app that cannot be built. Wording to adapt:

   > I checked this machine for a mobile toolchain and didn't find one — no Flutter SDK,
   > and no Android SDK either. Without one of those I can write the app but you won't be
   > able to build or run it here.
   >
   > Two ways forward:
   > - **Build the website version instead.** Same journey, same look, same prompt pack —
   >   it just runs in a browser. Nothing is wasted if you add a mobile toolchain later:
   >   the assets and the chapter script carry straight over, only re-rendered at 9:16.
   > - **Install a toolchain first**, then come back — `flutter.dev/docs/get-started`
   >   for Flutter, or Android Studio for the native path. I'll wait.
   >
   > Want me to go ahead with the website?

   Ask it as a real question (`AskUserQuestion` where available) with "Build the website
   instead" as the recommended option, and wait for the answer. If they choose the
   website, continue from Step 1.2 unchanged with `TARGET` = web — nothing else about the
   build changes.

**2. Subject** *(open question)* — "What should this be about? Your business, a client's,
   or any idea — a word or a sentence is fine." Capture the product/industry, a one-line
   pitch, and a brand name if they have one.

**3. Look** — the art direction, from `references/looks.md`. Present three or four by
   name and feel, not by their preamble text:
   - `product-noir` — one object, near-black, one light source. *(A product with a story.)*
   - `technical-white` — exploded parts on a bone-white field, converging. *(Hardware.)*
   - `digital-twin` — the real thing dissolving into schematic data. *(Software, logistics, AI.)*
   - `atmospheric-descent` — arrival through weather, altitude to ground. *(Travel, property.)*
   - `warm-craft` — golden practical light, hands and materials. *(Food, drink, fragrance.)*
   - `monolith-ambient` — one sculptural form, looping, no scrub. *(Studios, agencies.)*
   - `clay-diorama` — the miniature world. *(Playful/consumer; the only look for architecture B.)*

   The chosen look fixes `PREAMBLE`, `PALETTE`, `TYPE` and the `HUD` wording. **One look
   per build.** If the user wants their own brand palette, keep the look's preamble and
   swap only the hexes.

**4. Camera — always ask; it is the film's personality.** Record as `CAMERA`:
   - **One continuous walkthrough** — a single forward flight, chapter into chapter, never
     pulling back. → **Architecture A**. The default for anything photoreal.
   - **Fly through the world** — dive into each scene, pull up and out, hop to the next.
     → **Architecture B**. Only for miniature/diorama looks: it reverses camera direction
     at every seam, which reads as intentional in a map-like world and as a rewind stutter
     in a realistic one. Say that in one line if they pick B against a photoreal look.
   - **Locked isometric glide** — one fixed angle throughout, the world sliding past.
     → Architecture A plus the locked-iso clause in every prompt. Calmest, cheapest to
     re-roll.

**5. Chapters — ask the count first.** 2 (teaser) | 4 (short journey) | 6 (full film,
   maximum — past six the scroll pacing stops being comfortable). Record as `N`. Then
   propose that many chapters drawn from the subject's own logic and let the user edit.
   Each chapter needs: what the camera sees, an eyebrow, a headline, one line of body,
   0–3 tag chips, and an `align` (left / right / center).

   **Alternate the alignment down the list.** Six chapters of bottom-left copy is the
   single most common reason a good film reads as a template.

**6. The page after the film — always ask, and let them pick several.** A scroll cinematic
   on its own is a hero, not a product site. Every reference build that reads as a
   *website* continues past the film into editorial panels that scroll up over the last
   frame. Ask as a **multi-select** (`AskUserQuestion` with `multiSelect: true` where
   available) and collect the copy for each one chosen:

   | Option | Engine `kind` | What it is |
   |---|---|---|
   | Statement | `statement` | The one idea the film was about, set large on paper. |
   | Proof cards | `cards` | Two or three proof points. |
   | Reviews | `cards` (tone `light`) | Star/score cards — short, many, scannable. |
   | Testimonials | `html` | One to three quotes with attribution, set large. |
   | CTA | `cta` | The ask, with an email capture. |
   | Another animated section | `html` | A second, smaller motion beat below the film — see below. |
   | Extra motion / interaction | — | Scroll reveals, counters, hovers layered onto the acts above. |
   | Custom section | `html` | Anything they describe. |
   | Nothing — end at the film | — | A pure hero. |

   `footer` is appended whenever anything follows the film — a page that ends mid-panel
   reads as broken — unless they picked "nothing".

   Order them so the page descends from image to argument to ask: statement → reviews or
   testimonials → cards → animated section → cta → footer. Say the order back; it's easier
   to correct now than after the copy is written.

   **Keep the handover visually continuous.** The acts inherit the film's palette, type and
   accent; the first act sits directly on the film's last frame with no hard rule or
   colour jump, and the film dims and its chrome fades as they arrive (the engine does
   this). An "additional animated section" is CSS/Framer Motion **below** the film — never
   a second scrubbed video, and never a second scroll driver over the film's range
   (Step 8).

   "Film only" is a legitimate answer — but it must be the user's answer, not your default.

**7. Mobile** — desktop only, or a native 9:16 portrait chain as well (roughly doubles the
   video workload — state that). Forced on when the target is the app. The engine's phone
   hardening (seek coalescing, iOS priming, safe-area) is always on regardless; that isn't
   a "mobile version", it's the page not breaking when a phone visits.

**8. Asset source** — automatic (a connected renderer, if Step 0 found one) or manual (the
   prompt pack is the deliverable). Record as `ASSET_SOURCE`. On the automatic path, state
   the estimated spend and get a go **before anything renders**. On the manual path, state
   the workload — **`1 image + N clips`** (arch A) or `1 image + (2N−1) clips` (arch B),
   doubled for a portrait chain, plus ~15% re-roll headroom — and confirm their video tool
   accepts a **start frame**. If it can't, it can't hold a seam: steer them to a tool that
   can, don't ship an unseamed build.

Write `README.md` (what this project is) and `brief.md` (where production is) from
`references/handoff.md` before generating a single prompt file. Two documents, no overlap:
production status never goes in the README, and the README's decisions never get restated
in the brief. Both stay short enough to skim.

---

## Step 2 — State the workflow, then write the prompt pack

### 2a. Say how the build works, before writing anything

The chained workflow is not obvious, and a user who doesn't know it will go and generate
four images nobody wanted. Say it once, plainly, in roughly this shape — adapt the wording,
keep the structure:

> Only **one image** gets generated in this whole build: the opening frame of scene 1.
> After that, each scene starts from the *last frame of the video you just made*, so the
> camera never jumps and the film is one continuous take.
>
> **Scene 1** → generate the start image → render scene 1 from it → send me the video →
> I pull its final frame
> **Scene 2** → render from scene 1's final frame → send me the video → I pull its final frame
> **Scene 3** → render from scene 2's final frame → …
>
> So it's one image up front, then a loop: I hand you a prompt and a frame, you render it
> and drop the file in `assets/videos/`, I check it and write the next prompt from what
> actually came back. Scenes 2 onward need no images from you at all.

Then hold to it. The per-clip loop — hand over, render, review, extract, write the next
prompt — is in `references/handoff.md`, and `brief.md` is where its state lives.

### 2b. The pack

**Write it before any rendering, on both asset paths.** On the manual path it's the
deliverable; on the automatic path it's the record of what was rendered and the source of
truth for re-rolls.

Layout, format and templates: `references/prompts.md`. The rules that matter:

- **One image prompt.** `prompts/images/01-<slug>.md`, and nothing else in that folder
  (except an optional product plate when a supplied product photo needs cleaning up).
- **Write clip prompts one at a time.** Clip 1 up front; every later clip written *from the
  real `last-` frame that came back*, not from what the chapter plan predicted. Models
  drift, and a prompt written against an imagined frame is written against the wrong frame.
- **Markdown, not text.** These files are read by a human in an editor: heading, the
  metadata (aspect, duration, conditioning frame, output filename), a fenced `text` block
  holding the prompt itself, and an acceptance checklist. A `.txt` file gets pasted into a
  prompt box wholesale, front-matter and all.
- **`NN-slug` filenames.** Sorting the folder must reproduce the chain order, because clip
  *n* depends on clip *n−1*'s output.
- **Self-contained.** The look preamble, the aspect ratio, the size and the no-text clause
  live *in the prompt text*, never in a tool setting you can't guarantee. Each prompt must
  work as the only thing on someone's screen, in a tool nobody has chosen yet.

The look's `PREAMBLE` is pasted **byte-for-byte identical** into every prompt. Paraphrasing
it between chapters is the single biggest cause of a film that looks like six stock clips.

### 2c. Every clip prompt is seven labelled blocks

A video model reads instructionally, not cinematically. It does not fail because the prose
wasn't evocative enough — it fails because the prompt left a decision to the model. So
every clip prompt is the **same seven blocks, in the same order, always labelled**, and the
order is load-bearing: the reference frame and the locks come first, so the model knows
what it may not change before it reads a single motion instruction.

| Block | Answers |
|---|---|
| `START` | What is visible at the beginning — name what's actually in the reference frame |
| `HOLD` | What must **not** change: the product, the grade, the light, the lens, the background |
| `CAMERA` | **One** move, at a named speed, no cuts |
| `SUBJECT` | What moves on its own — or explicitly, that nothing does |
| `THROUGH` | The single beat in the middle, and what is already visible ahead |
| `END` | The velocity of the final second — a slow steady forward drift |
| `FINAL FRAME` | The composition of the last frame, which becomes the next clip's start |

Plus a `NEVER` line (no cut, dissolve, cross-fade, double exposure, speed ramp, shake, new
objects, text) and the style tail. Full template, the nine rules that make it work, and the
move library: `references/prompts.md` → "The video prompt — the seven blocks".

The rules that cut the rejection rate most, in order of how often they're the cause:

1. **One camera move per clip.** Two moves in a prompt is the single most common re-roll.
2. **Motion budget of two:** the camera plus one subject. A third breaks the physics.
3. **Name the speed, not the mood.** "At a walking pace" executes; "dramatically" invites a
   speed ramp.
4. **Every noun in `THROUGH` is already in `START`,** or is declared as visible ahead. A
   destination the model must invent mid-shot arrives as a cut.
5. **`END` and `FINAL FRAME` are both required** — one is velocity, one is composition, and
   the chain needs both.

When the blocks conflict, the priority is **reference accuracy → motion control →
continuity → cinematic quality**. Drop the adjective before you drop a lock.

**Realism is prompt work, not post work.** Every photoreal prompt names a real lens and
aperture, exactly one light source, a specific imperfection (grain, dust, wear), and
explicit depth separation ("foreground passing faster than background"). The realism
checklist at the end of `references/looks.md` is the full list — apply all seven clauses.

---

## Step 3 — The one start frame

One image: the opening frame of scene 1. It is the start frame of clip 1, chapter 1's
poster, the reduced-motion still, and the style reference every later re-roll is judged
against — the whole film inherits its grade, its light and its lens from this one file. It
is worth two or three re-rolls; it is the cheapest re-roll in the build.

**Chapters 2…N get no image prompt.** Their posters are `first-NN.png`, extracted from
their own accepted clips — free, and frame-exact against the film. If you find yourself
writing `prompts/images/02-*.md`, the chain has been broken somewhere upstream.

**Compose for the centre** in landscape (the page renders every clip `object-fit: cover`);
compose for the **upper-middle third** in portrait, where the lower third belongs to the
app's copy and the system gesture bar. Either way, **the direction the camera will travel
must be visible in the frame** — the doorway, the opening, the horizon it heads for. A
start frame with no exit forces clip 1 to invent one, and it usually invents a cut.

With a product reference, this image carries the product lock clause and, where the model
accepts an image input, the product photo itself as reference. If the supplied photo is
noisy — busy background, phone lighting, a watermark — render a clean product plate first
(`prompts/images/00-product-plate.md`) and use that as the reference instead. One extra
generation, and it removes the most common cause of product drift.

Validate before continuing (`references/pipeline.md` §2): correct aspect within a few
percent, ≥1536 px wide landscape / ≥1080 px portrait, no text in frame, exit visible, and —
with a product — shape, proportions, colour, materials and markings all matching.

---

## Step 4 — Rendering: who, and at what cost

Ask before spending. If Step 0 found a connected renderer, offer it plainly — *"I found
`<tool>` connected. Want me to generate the images and clips with it?"* — with the
estimated workload and, where the tool exposes pricing, the estimated cost. Get an explicit
go.

The **only** capability requirement is **start-frame conditioning**: the model must accept
a first/start image, and for architecture B connectors also an end image. A model whose
image input is *reference-only* can condition a generation but cannot continue a shot, so
it physically cannot hold a seam — decline it with a one-line why and use one that can.
Never ship a non-seamless build to satisfy a model preference.

**One model for the entire chain.** Every renderer has its own grain, motion and colour
character. Swapping mid-chain preserves position continuity — the frames still hand off —
but the character shift reads as a subtle pop. The one sanctioned exception is a single
clip a content filter keeps refusing.

Backend specifics (Higgsfield / Monid / Codex CLI flag sets, model capability tables, cost
tables) live in `references/pipeline.md` §7. **Run every generation detached and poll it.**

**Previz cheaply.** Run the whole chain at the lowest tier first, approve the journey and
the pacing, then re-render the final legs at full quality. The chain is seamless at every
tier, so previz translates directly. Suggest it unprompted when the budget reads tight.

---

## Step 5 — The seamless chain

This is the part that makes or breaks the build.

### Architecture A — continuous forward take (the default)

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

### Architecture B — dive + connector (miniature worlds only)

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

### Camera grammar — "forward only" is a *seam* rule, not a *leg* rule

Inside one clip the camera is free: one clip is one continuous render, so orbits,
crane-ups, lateral tracks and push-ins that ease back out are all safe. Reversals are only
fatal *across* seams. So give each chapter an expressive move from its own logic, under a
**motion handoff contract** kept verbatim in every prompt:

> every clip **ends** by settling into a slow steady forward drift (final ~1 s), and every
> clip **begins** by continuing that same drift.

The move library is in `references/prompts.md`. Honest cost: expressive moves raise
re-roll odds, because a model can end a fancy move in a state that isn't a clean forward
drift. Budget roughly one extra re-roll per expressive leg, and keep the settle clause
word-for-word.

Scroll is a scrubber — visitors scroll **up** too, so every move also plays in reverse.
That's free, and another reason seam velocity must be consistent in both directions.

---

## Step 6 — The manual handoff

When `ASSET_SOURCE` = manual, the prompt pack plus `README.md` and `brief.md` (templates in
`references/handoff.md`) is the product. **Always present the work as a spec table**, never
a prose list. The table lives in `brief.md` and you keep it current as files arrive:

| # | Prompt file | Start frame | Save as | Status |
|---|---|---|---|---|
| 01 | `prompts/videos/01-threshold.md` | `assets/images/01-threshold.png` | `assets/videos/01-threshold.mp4` | ⬜ ready |
| 02 | `prompts/videos/02-clouds.md` | `assets/frames/last-01-threshold.png` | `assets/videos/02-clouds.mp4` | ⛔ blocked on 01 |

The table is the contract for what you're still waiting on, and it makes the dependency
explicit: clip 2 cannot start until clip 1 lands, passes review, and its last frame is
extracted. **One video folder** — the user drops renders straight into `assets/videos/`;
there is no `raw/` staging step.

The loop per clip, run in this order every time:

1. **Review the drop** (`references/pipeline.md` §5): plays, right aspect, duration in
   spec, no burnt-in text, nothing in `HOLD` changed — and frame 0 matches the start frame
   handed over. A clip whose tool ignored the start image cannot hold its seam.
2. **Accepted** → extract `first-NN.png` and `last-NN.png`, mark ✅ in `brief.md`, write
   clip *n+1*'s prompt **from the real `last-NN.png`**, hand it over with the frame.
3. **Rejected** → `mv` it to `assets/rejected/NN-<slug>-take<X>.mp4`, mark ❌ with a
   one-line cause, and say in one sentence what changes in the prompt. Do not extract its
   frames. Do not advance.

Do not crossfade over a bad start frame, and do not "fix it in the next clip" — the next
clip inherits the error and every clip after it does too.

---

## Step 7 — Encode

Scrubbing sets `currentTime` every frame, so **seek cost** is the only thing that matters.

```bash
ffmpeg -i src.mp4 -an -vf "unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart out.mp4
```

- **Native resolution, crf ≤ 20, light unsharp.** Video is inherently softer than the
  stills; downscaling to "help scrubbing" only makes it worse.
- **Small GOP (`-g 8`), not all-intra.** All-intra bloats an 8s clip to ~25 MB for no gain,
  because the engine loads each clip as a **Blob** — always fully seekable — rather than
  depending on the host serving HTTP byte ranges. `-g 8` is ~8 MB and scrubs identically.
- **Portrait chain:** 720-wide, `-g 4`, crf 23 (`pipeline.md` §6b). Twice the keyframes
  roughly halves a phone decoder's seek work.
- **App target:** extract 12 fps JPEG sequences instead (`pipeline.md` §6c) — the Flutter
  scaffold scrubs frames, not video, and `flutter/flutter.md` explains why.

---

## Step 8 — Assemble

### Web — a Next.js project by default

**Scaffold a Next.js App Router project, not a single HTML file** — full guide in
`references/web/nextjs.md`. Copy in `references/quickie-scroll.js` (the engine, unchanged),
`references/web/QuickieScroll.tsx` (the React wrapper) and
`references/web/quickie-scroll.d.ts` (its types); assets go in `public/`, so config paths
are absolute (`/assets/videos/01-threshold.mp4`).

Why a project rather than a file: the film itself is pre-rendered, so no library improves
it — but everything *around* the film benefits from a real environment. **Lenis smooth
scroll** is the one change to make on every build: native wheel scroll arrives in coarse
steps, so a scrubbed film moves in visible jumps, and Lenis interpolates scroll position
every frame. Because it drives the real scroll position rather than a transform, the engine
needs no changes. Beyond that: Framer Motion for the acts, component reuse across chapters,
`next/font`, route-level deep links into chapters.

Two hard rules (both in `nextjs.md`): never put a CSS transform on an ancestor of the film
container — it creates a containing block and breaks the engine's `position: fixed` layers
— and never run a second scroll driver (GSAP ScrollTrigger `scrub`) over the film's scroll
range, because both map scroll to a playhead. Use GSAP below the film, in the acts.

`mountQuickieScroll` returns a `{ destroy }` handle; the React wrapper calls it in the
`useEffect` cleanup. This is not optional — React StrictMode mounts effects twice in dev,
and without teardown you get two engines, two rAF loops and a scrub fighting itself.

`references/index-template.html` is still shipped as a **zero-install preview**: use it to
eyeball a chain before committing to a project. The engine is self-contained vanilla JS, so
it also drops into Vue (`onMounted`) or any server-rendered page unchanged.

Beyond the chain and the copy, three things carry the cinematic feel:

- **`hud`** — the corner instrumentation: system label, live `FRAME nnn` counter,
  registration brackets, scroll verb. Every reference film wears some version of it; it is
  what makes a full-bleed clip read as a *film* rather than a background video. Wording
  comes from the look.
- **`align` per chapter** — which side of the frame each chapter speaks from. The
  readability scrim follows it automatically. Alternate it.
- **`acts`** — the editorial page that scrolls up over the finished film. The film's chrome
  fades out as they arrive. Four built-in kinds (`statement`, `cards`, `cta`, `footer`)
  plus `{ kind:'html', tone, html }`, which is where reviews, testimonials, a second
  animated section and any custom section land — no engine change needed. Give every act
  the film's palette, type and accent, and let the first one sit directly on the last
  frame: a hard rule or a colour jump at that boundary is what makes a site feel like two
  sites glued together. Extra motion in the acts is Framer Motion or CSS below the film —
  never a second scrubbed video, and never a scroll driver over the film's range.

Pacing lives in two per-chapter knobs: `scroll` (viewport-heights of scroll — more distance
= longer dwell) and `linger` (0–0.6; remaps time so the camera settles mid-chapter exactly
where the copy peaks, then picks up toward the seam; seam frames are untouched). Give the
opening and finale more of both; keep transit chapters brisk. Prefer expressive motion in
the *clip* and restraint in the *scrub mapping* — they compound.

Theme with the CSS variables in `index-template.html`; the visual identity comes from the
film, so the chrome stays quiet.

### App — Flutter or native Android, per the Step 0.2 probe

Both scaffolds scrub a **pre-extracted JPEG frame sequence**, not video, and both have zero
third-party dependencies. The reason is the same on either platform: the player is
ExoPlayer underneath, a `seekTo` costs a decode from the nearest keyframe (~60–120 ms on a
mid-range device), and a fling issues seeks far faster than that — they queue and the frame
freezes. Image frames have no keyframe dependency. Extraction: `pipeline.md` §6c.

- **Flutter** (preferred when available) — copy `references/flutter/scroll_scrub.dart` into
  `lib/`, declare each frame directory in `pubspec.yaml` (Flutter does not recurse, and
  fails silently on a missing directory), configure `ScrollScrubPage`. Requires Flutter
  3.27+. Full wiring, size figures and on-device QA: `references/flutter/flutter.md`.
- **Native Android** (when Flutter is absent but an Android SDK is present) — copy
  `references/android/ScrollScrub.kt` into the app's package, put frames under
  `app/src/main/assets/frames/`, configure `ScrollScrubScreen`. Compose + `AssetManager` +
  `BitmapFactory` only. Details: `references/android/android.md`.

---

## Step 9 — QA

Do not skip. In a browser (headless is fine):

- **Seams.** Screenshot just before and just after each seam; the two frames must be
  near-identical. Judge by **composition, not PSNR** — a correctly frame-locked seam reads
  ~18–25 dB from codec shimmer alone. A real mismatch shows as different content, not
  softness. If they pop, the connector used a still instead of a rendered frame (Step 5).
- **Scrubbing works at all.** Console clean, `video.seekable.end(0) > 0` (the blob path is
  working), `currentTime` tracks scroll across each clip's band. A video frozen at frame 0
  means `seekable = [0,0]` — the blob load failed and it's falling back to a host that
  doesn't serve byte ranges.
- **The handover to the acts.** Scroll past the last seam: the copy, route rail, HUD and
  hint must fade, the film must dim, and the editorial panels must scroll cleanly over it.
- **Reduced motion.** `prefers-reduced-motion` must fall back to the stills — no video
  loads at all, no particles.
- **Phone**, throttled 4–6× CPU, scrolled fast: the clip tracks without freezing, the first
  chapter shows its poster immediately and the video takes over on first scroll (the iOS
  priming path — test Safari specifically, it's the one that goes blank). Slowly scroll so
  the URL bar collapses: the page must not jump. If the portrait chain shipped, confirm
  `videoWidth < videoHeight` in the Network panel — a downscaled 16:9 file is not the
  mobile version.
- **App:** the on-device checklist in `flutter/flutter.md`.

---

## Gotchas

- **Seam pop** → a connector endpoint was the still, not the neighbouring clip's actual
  rendered frame. Every generation renders differently; extract real frames (Step 5).
- **Seam stutter / camera jumps backward** → camera *velocity* reversed across a seam even
  though the frames matched. Inherent to architecture B. Use A for anything photoreal.
- **The film looks like six stock clips** → the preamble drifted between prompts. It must
  be byte-identical. Diff the prompt files.
- **Everything is in focus and evenly lit** → the prompts didn't name a lens, an aperture
  and a single light source. This is the strongest "AI video" tell; fix it in the prompt,
  not the grade.
- **The clouds/background don't separate in depth** → the model rendered a pan across a
  matte painting. Demand explicit parallax ("near clouds passing faster than far clouds")
  and reject clips without it.
- **Frozen video / stuck at frame 0** → `seekable = [0,0]`; the host isn't serving byte
  ranges. Use blob URLs (the engine does).
- **Huge files** → all-intra encode. Use `-g 8` + blob.
- **Soft / low quality** → downscaled or over-compressed. Native resolution, crf ≤ 20,
  light `unsharp`.
- **Text rendered into a frame** → re-roll, don't crop. Every prompt ends with the no-text
  clause for this reason.
- **Content filter refuses an innocuous clip** (bedrooms, pools, spas, and words like
  "bed", "pool", "waterfall", "wine", "swim") → in order: re-roll (often non-deterministic
  and passes on the 2nd–3rd try); strip trigger words and add "empty, unoccupied, no
  people, architectural"; re-render that one clip on a different model with the same
  frames, accepting a slight character shift; or, for architecture B only, set that
  connector slot to `null` — the engine crossfades the seam directly and the page still
  completes.
- **Manual clip pops at its seam** → the tool ignored the start frame, or the user rendered
  from the still instead of the handoff frame. Diff frame 0 against the handed-over PNG
  before accepting. No crossfade fixes a wrong start.
- **Copy sits in the same corner for the whole film** → `align` was never set. Alternate it.
- **The page ends abruptly at the last frame** → no `acts`. Ask; don't default to film-only.
- **The model ignored half the prompt** → the prompt was prose, not blocks. Rewrite it as
  the seven labelled blocks (Step 2c). Unlabelled instructions are the ones dropped first.
- **The clip does a different move than the one asked for** → two moves in the CAMERA
  block. One move per clip; the second one becomes a chapter of its own.
- **The clip speeds up or ramps** → the prompt named a mood ("dramatic", "epic") instead of
  a pace. Say "at a walking pace" / "at a slow drift".
- **A cut or dissolve appeared mid-clip** → the destination wasn't visible in the start
  frame, so the model teleported to it. Declare it as "already visible ahead", and cross
  thresholds *inside* a clip rather than between clips.
- **The product changed shape / lost its label / got restyled** → the lock clause wasn't in
  that clip's HOLD block, or a style reference was passed as the conditioning image. Both
  are rejections, not fixes (Step 1.0).
- **Four images were generated for a four-scene build** → the chained workflow was never
  stated. One image, then frames (Step 2a). Stills 2…N cannot be used as start frames and
  will not match if they are.
- **The README has grown a rejection log** → status went in the wrong file. `README.md` is
  what the project is; `brief.md` is where production is (`references/handoff.md`).
- **Blank / black scene on iOS, fine on desktop** → a muted video that was never played
  won't paint a seeked frame. The engine keeps the still as a poster until the clip paints
  and primes each video on first touch — don't strip `playsinline`/`muted` or hide the
  still on `loadedmetadata` when porting into a framework.
- **Page jumps while scrolling on mobile** → something re-runs layout on the URL-bar
  `resize`. Gate resize handlers on a **width** change; keep `orientationchange`.
- **Flutter: white flash between frames** → `gaplessPlayback: true` was removed from the
  `Image`. Put it back.
- **Flutter: nothing renders** → a missing asset directory in `pubspec.yaml`. Flutter fails
  silently on those, and it does not recurse — one line per chapter directory.
- **Flutter: `const_with_non_const` on `MaterialApp`** → `ScrubTheme.dark` and the
  `ActSpec.*` builders are factory constructors (an `ActSpec` holds a closure), so they
  can't sit in a const tree. Drop `const` from `MaterialApp`; `chapters` can stay const.
- **Android: a chapter stalls at its end** → `frameCount` doesn't match what's on disk.
  Re-read the count the extraction script printed; it is `fps × clip seconds`, so an 8 s
  clip at 12 fps is 96 frames, not the 60 a 5 s chapter gives.
- **Android: cold start shows the background, not the first frame** → a wrong
  `Chapter.frameDir`. `AssetManager` throws and the scaffold swallows it via `runCatching`
  by design (a missing frame mid-scroll must never crash the film), so a bad path fails
  silently. Check the path against `app/src/main/assets/`.
- **Promised an app, then found no toolchain** → the Step 0.2 probe was skipped. Run it
  before the target question, and on `TARGET=NONE` say so plainly and offer the website
  (Step 1.1) rather than scaffolding something the user can't build.
- **Next: two films, doubled listeners, a scrub that fights itself** → the `useEffect`
  cleanup isn't calling `destroy()`. React StrictMode mounts effects twice in dev.
- **Next: the film collapses / scenes detach from the viewport** → a CSS transform on an
  ancestor of the film container. A transform creates a containing block, which breaks
  `position: fixed`. Animate anything else, never the film's ancestors.
- **Next: clips 404 on a nested route** → asset paths are relative. In `public/`, paths
  must be absolute from the web root (`/assets/videos/…`).
- **bash 3.2** on macOS → no associative arrays. **zsh** arrays are 1-indexed → run chain
  scripts as `bash script.sh`, never inline in an interactive zsh.

## References

- `references/looks.md` — the seven-look art-direction library and the realism checklist.
- `references/prompts.md` — the prompt-pack layout, the one image prompt, the **seven-block
  video prompt** and the nine rules behind it, working from user-supplied product and style
  references, the move library, the intake checklist, and the portrait rules.
- `references/pipeline.md` — renderer-agnostic scripts: pack scaffolding, validation, the
  chain, rejection, encoding, portrait, Flutter frame sequences, known backends.
- `references/handoff.md` — the `README.md` and `brief.md` templates, the per-clip loop,
  and the rejection criteria.
- `references/detect-target.sh` — the app-toolchain probe (Step 0.2). Prints
  `TARGET=FLUTTER|ANDROID|BOTH|NONE`.
- `references/quickie-scroll.js` — the scrub engine (chain, blob-seek, crossfades, pinned
  copy, HUD, alignment, acts, route rail, reduced motion, phone hardening). Returns a
  `{ destroy }` handle for component frameworks.
- `references/web/nextjs.md` — the Next.js scaffold: layout, Lenis smooth scroll, config
  page, where the extra animation capability goes, and what not to do.
- `references/web/QuickieScroll.tsx` + `quickie-scroll.d.ts` — the React wrapper and types.
- `references/index-template.html` — a standalone page, for a zero-install preview.
- `references/flutter/scroll_scrub.dart` + `flutter.md` — the Flutter app target.
- `references/android/ScrollScrub.kt` + `android.md` — the native Android (Compose) target.
- `references/knockout.py` — background knockout, for floating diorama scenes.

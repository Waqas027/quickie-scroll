# quickie-scroll

A Claude Code skill for building **cinematic scroll-driven product experiences** — Next.js
websites and Flutter or native-Android apps — where the visitor's scroll drives a real
camera through a photoreal world.

Scroll sets the playhead of a pre-rendered continuous camera move, so the camera genuinely
travels and scroll only drives time. Chapters of copy pin over the film; an editorial page
scrolls up over the last frame. It's the technique behind Apple's scroll-through product
pages, made repeatable.

## Install

```
/plugin marketplace add Waqas027/quickie-scroll
/plugin install quickie-scroll@quickie-scroll
```

Then just ask: *"build me a scroll-driven site for a mountain water bottle"* or *"create a
scroll-driven perfume brand Flutter app"*.

Or skip the plugin system — clone it and drop the skill in place:

```bash
git clone https://github.com/Waqas027/quickie-scroll.git
cp -r quickie-scroll/skills/quickie-scroll ~/.claude/skills/   # available everywhere
# or into .claude/skills/ inside a project, to ship it with that repo
```

## What you get

```
<project>/
  README.md                  what this project is — decisions, journey, layout
  brief.md                   where production is — status board, fits one screen
  prompts/
    images/  01-<slug>.md    THE ONE image prompt: scene 1's start frame
    videos/  NN-<slug>.md    one markdown prompt per clip, numbered in chain order
  refs/      product/ style/ user-supplied references, sorted
  assets/
    images/ videos/ rejected/ frames/
  # web target — a Next.js project
  app/{layout,page}.tsx
  components/QuickieScroll.tsx + quickie-scroll.js
  public/assets/

  # app target — whichever toolchain was found
  lib/scroll_scrub.dart                              (Flutter)
  app/src/main/java/…/ScrollScrub.kt + assets/frames (native Android)
```

Every prompt file is self-contained markdown: the look preamble, the aspect ratio, the
duration, which frame it must start on, the exact output filename, and an acceptance
checklist. Render them in any tool — Midjourney, Kling, Runway, Veo, Seedance, Higgsfield,
Luma — or let a connected MCP/CLI render them for you.

## The two targets

| | Website | Mobile app |
|---|---|---|
| Stack | **Next.js** App Router + Lenis (standalone HTML for a quick preview) | **Flutter**, or **native Android** (Jetpack Compose) |
| Aspect | 16:9, composed for centre | 9:16, natively composed for the upper-middle third |
| Clip length | 8 s legs / 5 s connectors | 5–6 s per chapter |
| Playback | `video.currentTime` scrubbed from a Blob | pre-extracted 12 fps JPEG sequence |
| Third-party deps | Lenis only — the engine itself has none | none, on either stack |

**Ask for an app and it checks first.** The skill probes for a Flutter SDK and an Android
SDK (by install path, not just `$ANDROID_HOME` — Android Studio usually leaves that unset)
and then: uses Flutter if present, falls back to native Compose if only the Android SDK is
there, asks which if both, and if **neither** is installed it says so in plain language and
offers to build the website instead. It will not scaffold an app you can't compile.

Why Next.js rather than a single HTML file: the film is pre-rendered, so no library
improves it — but Lenis smooth scroll transforms how the scrub *feels* (native wheel scroll
arrives in coarse steps), and the acts after the film benefit from Framer Motion, component
reuse and `next/font`. The engine stays vanilla JS and returns a `{ destroy }` handle, so
the React wrapper is about fifteen lines.

The app scrubs frames rather than video on purpose: a `seekTo` on ExoPlayer costs a decode
from the nearest keyframe, so a fling queues seeks it can never service and the frame
freezes. Image frames have no keyframe dependency and precache cleanly.

## The art direction

Seven named looks, each reverse-engineered from a shipped reference film, each fixing a
style preamble, a lens/light grammar, a palette, a type pairing and the HUD wording:

`product-noir` · `technical-white` · `digital-twin` · `atmospheric-descent` ·
`warm-craft` · `monolith-ambient` · `clay-diorama`

Plus a seven-clause realism checklist — name a real lens and aperture, one light source,
a specific imperfection, explicit depth separation — that is most of the distance between
"AI video" and something that reads as a film.

## The one law, and what it buys you

Every clip after the first starts on the **actual last frame of the clip before it**,
extracted from the rendered video. Not the still. Not a re-render. Every generation renders
slightly differently, so two renders of "the same scene" never match, and the seam pops.

Which means the build needs **one generated image**, not one per scene:

```
scene 1 → generate the start image → render → its last frame is
scene 2 →                            render → its last frame is
scene 3 →                            render → …
```

Chapter *n*'s poster and reduced-motion still fall out of clip *n* with ffmpeg — free, and
frame-exact against the film. A four-scene build is **1 image + 4 clips**.

That dependency is why the prompt files are numbered, why the folders sort into chain
order, and why the status table marks clip 2 as *blocked on 01*.

## The video prompts

The part that decides whether you re-roll twice or six times. Every clip prompt is the same
seven labelled blocks, in the same order — `START`, `HOLD`, `CAMERA`, `SUBJECT`, `THROUGH`,
`END`, `FINAL FRAME`, plus a `NEVER` line. Locks first, motion after, so the model knows
what it may not change before it reads an instruction. One camera move per clip, a motion
budget of two moving things, speeds named rather than moods, and a `FINAL FRAME` line
written so the next clip has something real to start from.

Each clip's prompt is written *after* the previous clip comes back, from its actual last
frame — not from what the chapter plan predicted it would be.

## Working from your own references

Drop in a product photo and it becomes a **locked anchor**: same silhouette, proportions,
colours, materials, label and markings in every frame, held by a lock clause in every
clip's `HOLD` block. The camera, the light and the world change around it; the product does
not. Drop in Pinterest boards, Dribbble shots or screenshots and they're read as **style**
— palette, type, composition, grade, motion pace — extracted into the prompts and then set
aside, never used as a conditioning image.

## Relationship to `lets-scroll`

Built on the pipeline and scrub engine from [`lets-scroll`](https://github.com/cywang/lets-scroll),
which proved the seamless-chain technique. This skill adds:

- a realism-first art-direction library in place of the diorama default
- one generated image per build instead of one per scene — the chain supplies the rest
- the seven-block video prompt, written for image-to-video model behaviour rather than as
  cinematic prose, plus product-reference locking and style-reference extraction
- a markdown prompt pack in numbered folders, tool-agnostic by construction
- HUD chrome, per-chapter copy alignment, and an editorial page after the film — statement,
  cards, reviews, testimonials, CTA, footer or anything custom
- a sixteen-variant animated footer library — the variant the user picks drives the layout
  *and* the motion (reveal, stagger, word-split headlines, parallax, marquee, magnetic
  hover, depth planes), with no motion dependency added
- the Flutter and native-Android app targets, with a toolchain probe that refuses to
  scaffold an app the machine cannot build
- a Next.js scaffold and React wrapper in place of a lone HTML file, and a `destroy()`
  handle on the engine so it unmounts cleanly
- a renderer-agnostic pipeline — a connected MCP is an option, not a requirement

## License

MIT.

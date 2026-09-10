# The interview — SKILL Step 1

*The questions, in order, and what each one sets. Nothing here is optional except where it
says so.*

**Read with:** [`discovery/references.md`](references.md) ·
[`art-direction/looks.md`](../art-direction/looks.md) ·
[`animation/camera.md`](../animation/camera.md) ·
[`animation/scene-planning.md`](../animation/scene-planning.md) ·
[`sections/post-film.md`](../sections/post-film.md)

---

Ask what you genuinely can't default. The subject is the user's to state — ask it as an
open question in plain prose, never a fabricated multiple-choice list of industries.
Reserve structured choice (`AskUserQuestion` where available; a plain either/or otherwise)
for the genuinely enumerable decisions, and signal that "other" is fine.

## 0. References — only when the user supplied any; then it comes before everything

Images arrive as attachments, paths, or Pinterest/Dribbble/Behance links. Look at each one,
sort it into **product** or **design/style**, and say the sort back so the user can correct
it. A product anchor changes the look, the chapters and every prompt, which is why this is
asked first.

**Read [`discovery/references.md`](references.md) before sorting anything.** Getting it
wrong is expensive in both directions.

## 1. Target — ask first; it sets every asset's aspect ratio

- **Website** — 16:9 landscape chain, built as a **Next.js** project
  ([`platforms/web/nextjs.md`](../platforms/web/nextjs.md)).
- **Mobile app** — 9:16 portrait chain, natively composed (never a crop).
- **Both** — two chains; roughly double the render workload. State that.

**If the answer involves an app, the Step 0 probe result decides how you proceed — and it
is not negotiable, because you cannot build an app with a toolchain that isn't installed.**
Report what you found, in plain language, before doing anything else:

| Probe | What to do |
|---|---|
| `TARGET=FLUTTER` | Say Flutter was found (give the version) and build the Flutter target ([`platforms/flutter/`](../platforms/flutter/)). |
| `TARGET=ANDROID` | Say Flutter wasn't found but an Android SDK was (give the path), and build the native Compose target ([`platforms/android/`](../platforms/android/)). |
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
instead" as the recommended option, and wait for the answer. If they choose the website,
continue from question 2 unchanged with `TARGET` = web — nothing else about the build
changes.

## 2. Subject *(open question)*

"What should this be about? Your business, a client's, or any idea — a word or a sentence
is fine." Capture the product/industry, a one-line pitch, and a brand name if they have one.

## 3. Look — the art direction

Present three or four by name and feel, not by their preamble text:

- `product-noir` — one object, near-black, one light source. *(A product with a story.)*
- `technical-white` — exploded parts on a bone-white field, converging. *(Hardware.)*
- `digital-twin` — the real thing dissolving into schematic data. *(Software, logistics, AI.)*
- `atmospheric-descent` — arrival through weather, altitude to ground. *(Travel, property.)*
- `warm-craft` — golden practical light, hands and materials. *(Food, drink, fragrance.)*
- `monolith-ambient` — one sculptural form, looping, no scrub. *(Studios, agencies.)*
- `clay-diorama` — the miniature world. *(Playful/consumer; the only look for architecture B.)*

The chosen look fixes `PREAMBLE`, `PALETTE`, `TYPE` and the `HUD` wording. **One look per
build.** If the user wants their own brand palette, keep the look's preamble and swap only
the hexes. Full library: [`art-direction/looks.md`](../art-direction/looks.md).

## 4. Camera — always ask; it is the film's personality

**Read [`animation/camera.md`](../animation/camera.md) before asking.** Offer the three
architectures it defines — one continuous walkthrough (A, the default for anything
photoreal), fly through the world (B, miniature/diorama looks only), locked isometric glide
(A plus a clause) — in the user-facing wording that file gives, and record the answer as
`CAMERA`.

## 5. Chapters — ask the count first

2 (teaser) | 4 (short journey) | 6 (full film, maximum — past six the scroll pacing stops
being comfortable). Record as `N`. Then propose that many chapters drawn from the subject's
own logic and let the user edit.

What each chapter needs, and the copy rules that keep a film from reading as a template:
[`animation/scene-planning.md`](../animation/scene-planning.md).

## 6. Mobile

Desktop only, or a native 9:16 portrait chain as well (roughly doubles the video workload —
state that). Forced on when the target is the app. The engine's phone hardening (seek
coalescing, iOS priming, safe-area) is always on regardless; that isn't a "mobile version",
it's the page not breaking when a phone visits.

## 7. Asset source

Automatic (a connected renderer, if Step 0 found one) or manual (the prompt pack is the
deliverable). Record as `ASSET_SOURCE`.

- **Automatic** — state the estimated spend and get a go **before anything renders**
  ([`video/rendering.md`](../video/rendering.md)).
- **Manual** — state the workload: **`1 image + N clips`** (architecture A) or
  `1 image + (2N−1) clips` (architecture B), doubled for a portrait chain, plus ~15%
  re-roll headroom. Confirm their video tool accepts a **start frame**. If it can't, it
  can't hold a seam: steer them to a tool that can, don't ship an unseamed build.

## What is never asked

**Which sections follow the film.** That decision is the skill's, not the user's — there is
no multi-select, no "film only" option, no "do you want a footer?". Run Steps A–G of
[`sections/post-film.md`](../sections/post-film.md), draft the 4–5 section plan plus the
mandatory footer, and put it in `README.md` as a stated decision the user can push back on.
Asking hands back the one genuinely creative decision they came here to delegate.

## Closing the interview

Write `README.md` (what this project is) and `brief.md` (where production is) from
[`project/documents.md`](../project/documents.md) **before generating a single prompt
file**. Two documents, no overlap. Both stay short enough to skim.

`README.md` carries the post-film plan under **After the film** — drafted now from the
subject and the look, confirmed against the film's real last frame at Step 8.

---

## Intake checklist — what the interview must have captured

- `REFS` — supplied images, sorted into `PRODUCT` (locked anchor) and `STYLE`
  (inspiration). Asked **first** when any reference is present, because a product anchor
  changes the look, the chapters and every prompt.
- `TARGET` — **web** (Next.js site, 16:9) | **app** (9:16) | **both**. Decides every
  asset's aspect ratio. For an app, `bash tools/detect-target.sh` runs before the question and
  its result (`FLUTTER` / `ANDROID` / `BOTH` / `NONE`) picks the scaffold — or, on `NONE`,
  sends the user back to the web target (question 1 above).
- `APP_STACK` — (app targets only) **flutter** | **android**. Set by the probe.
- `SUBJECT` — the business/product + a one-line pitch, in the user's own words.
- `BRAND_NAME`, `TONE`.
- `LOOK` — one of the seven in `art-direction/looks.md`. Fixes `PREAMBLE`, `PALETTE`, `TYPE`, `HUD`.
- `PALETTE` — 4–6 named hexes (the look's default, the user's brand, or pulled from a style
  reference). One is the page background, one is the accent.
- `N` — chapter count: 2 (teaser) | 4 (short journey) | 6 (full film, maximum).
  Assets = **1 still + N clips** (arch A) or 1 still + (2N−1) clips (arch B).
- `CAMERA` — walkthrough (arch A) | fly-through (arch B) | locked-iso (arch A + clause).
- `CHAPTERS[]` — for each: `id`, `label`, `subject`, `eyebrow`, `title`, `body`, `tags[]`,
  `align` (left/right/centre — alternate them), `accent`.
- `POST_FILM[]` — the page after the film: 4–5 designed sections plus a mandatory footer.
  **Never asked — derived** by Steps A–G of [`sections/post-film.md`](../sections/post-film.md)
  from `SUBJECT`, `REFS`, `LOOK`, `PALETTE` and `CHAPTERS[]`. Each entry carries `id`,
  `name`, `purpose`, `why`, `visual`, `content`, `interaction`, `motion`, `assets`,
  `transitionIn`, `transitionOut`. Lands in the engine's `acts` array at Step 8.
- `MOBILE` — desktop only | + native 9:16 chain. (Forced to 9:16 when `TARGET` = app.)
- `ASSET_SOURCE` — automatic (a connected tool renders) | manual (the pack is the
  deliverable).

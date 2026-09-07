# Troubleshooting — symptom → cause → where the fix lives

*Grouped by where the fault actually is, not by where it shows up.*

**Read with:** [`validation/qa-checklist.md`](qa-checklist.md) ·
[`core/rules.md`](../core/rules.md)

---

## The chain and its seams → [`animation/chain.md`](../animation/chain.md)

- **Seam pop** → a connector endpoint was the still, not the neighbouring clip's actual
  rendered frame. Every generation renders differently; extract real frames.
- **Seam stutter / camera jumps backward** → camera *velocity* reversed across a seam even
  though the frames matched. Inherent to architecture B. Use A for anything photoreal.
- **Manual clip pops at its seam** → the tool ignored the start frame, or the user rendered
  from the still instead of the handoff frame. Diff frame 0 against the handed-over PNG
  before accepting. No crossfade fixes a wrong start.
- **Four images were generated for a four-scene build** → the chained workflow was never
  stated ([`core/rules.md`](../core/rules.md) §3). One image, then frames. Stills 2…N
  cannot be used as start frames and will not match if they are.

## The prompts → [`video/prompting.md`](../video/prompting.md)

- **The film looks like six stock clips** → the preamble drifted between prompts. It must
  be byte-identical. Diff the prompt files.
- **The model ignored half the prompt** → the prompt was prose, not blocks. Rewrite it as
  the seven labelled blocks. Unlabelled instructions are the ones dropped first.
- **The clip does a different move than the one asked for** → two moves in the CAMERA
  block. One move per clip; the second one becomes a chapter of its own.
- **The clip speeds up or ramps** → the prompt named a mood ("dramatic", "epic") instead of
  a pace. Say "at a walking pace" / "at a slow drift".
- **A cut or dissolve appeared mid-clip** → the destination wasn't visible in the start
  frame, so the model teleported to it. Declare it as "already visible ahead", and cross
  thresholds *inside* a clip rather than between clips.
- **Text rendered into a frame** → re-roll, don't crop. Every prompt ends with the no-text
  clause for this reason.

## Realism → [`art-direction/realism.md`](../art-direction/realism.md)

- **Everything is in focus and evenly lit** → the prompts didn't name a lens, an aperture
  and a single light source. This is the strongest "AI video" tell; fix it in the prompt,
  not the grade.
- **The clouds/background don't separate in depth** → the model rendered a pan across a
  matte painting. Demand explicit parallax ("near clouds passing faster than far clouds")
  and reject clips without it.

## The product → [`discovery/references.md`](../discovery/references.md)

- **The product changed shape / lost its label / got restyled** → the lock clause wasn't in
  that clip's HOLD block, or a style reference was passed as the conditioning image. Both
  are rejections, not fixes.

## Rendering → [`video/rendering.md`](../video/rendering.md)

- **Content filter refuses an innocuous clip** (bedrooms, pools, spas, and words like
  "bed", "pool", "waterfall", "wine", "swim") → in order: re-roll (often non-deterministic
  and passes on the 2nd–3rd try); strip trigger words and add "empty, unoccupied, no
  people, architectural"; re-render that one clip on a different model with the same
  frames, accepting a slight character shift; or, for architecture B only, set that
  connector slot to `null` — the engine crossfades the seam directly and the page still
  completes.

## Encoding and playback → [`pipeline/encoding.md`](../pipeline/encoding.md)

- **Frozen video / stuck at frame 0** → `seekable = [0,0]`; the host isn't serving byte
  ranges. Use blob URLs (the engine does).
- **Huge files** → all-intra encode. Use `-g 8` + blob.
- **Soft / low quality** → downscaled or over-compressed. Native resolution, crf ≤ 20,
  light `unsharp`.

## The page → [`platforms/web/engine-config.md`](../platforms/web/engine-config.md)

- **Copy sits in the same corner for the whole film** → `align` was never set. Alternate it.
- **The page ends abruptly at the last frame** → no `acts`. Ask; don't default to film-only
  ([`sections/acts.md`](../sections/acts.md)).
- **The footer is a plain row of links** → no `variant` on the footer act, so it fell back
  to `minimal`. The footer question is a real question with a real answer
  ([`footer/workflow.md`](../footer/workflow.md)); the sixteen variants are in
  [`footer/variants.md`](../footer/variants.md).
- **A footer block escapes its padding box, or the page scrolls sideways on a phone** → a
  tile without `box-sizing: border-box`, a marquee without `width:100%` + clip, or a grid
  track defined with `minmax(auto, …)` instead of `minmax(0, 1fr)`. All three let wide
  content expand the track.

## Product sections → [`sections/product-sections/`](../sections/product-sections/workflow.md)

- **The same five sections were suggested as on the last build** → the eleven signals were
  never read. The list is reasoned from the product, not recalled
  ([`selection-rules.md`](../sections/product-sections/selection-rules.md)).
- **A section repeats a scene the film already showed** → the anti-duplication pass was
  skipped. Check each candidate against `CHAPTERS[]` by beat, not by title.
- **The page feels like one long section** → every product section used the same
  reveal-and-stagger. Vary the pattern across the set
  ([`animation-patterns.md`](../sections/product-sections/animation-patterns.md)).
- **The film's scrub stutters once the sections exist** → a section pinned or scrubbed
  inside the film's scroll range. Product sections live strictly below it
  ([`core/rules.md`](../core/rules.md) §9).
- **A section asked for four new images** → section imagery comes out of the rendered clips
  with ffmpeg first; a new generation is declared and approved, never assumed
  ([`workflow.md`](../sections/product-sections/workflow.md) → *assets*).

## Phone and iOS → [`validation/qa-checklist.md`](qa-checklist.md)

- **Blank / black scene on iOS, fine on desktop** → a muted video that was never played
  won't paint a seeked frame. The engine keeps the still as a poster until the clip paints
  and primes each video on first touch — don't strip `playsinline`/`muted` or hide the
  still on `loadedmetadata` when porting into a framework.
- **Page jumps while scrolling on mobile** → something re-runs layout on the URL-bar
  `resize`. Gate resize handlers on a **width** change; keep `orientationchange`.

## Next.js → [`platforms/web/nextjs.md`](../platforms/web/nextjs.md)

- **Two films, doubled listeners, a scrub that fights itself** → the `useEffect` cleanup
  isn't calling `destroy()`. React StrictMode mounts effects twice in dev.
- **The film collapses / scenes detach from the viewport** → a CSS transform on an ancestor
  of the film container. A transform creates a containing block, which breaks
  `position: fixed`. Animate anything else, never the film's ancestors.
- **Clips 404 on a nested route** → asset paths are relative. In `public/`, paths must be
  absolute from the web root (`/assets/videos/…`).

## Flutter → [`platforms/flutter/flutter.md`](../platforms/flutter/flutter.md)

- **White flash between frames** → `gaplessPlayback: true` was removed from the `Image`.
  Put it back.
- **Nothing renders** → a missing asset directory in `pubspec.yaml`. Flutter fails silently
  on those, and it does not recurse — one line per chapter directory.
- **`const_with_non_const` on `MaterialApp`** → `ScrubTheme.dark` and the `ActSpec.*`
  builders are factory constructors (an `ActSpec` holds a closure), so they can't sit in a
  const tree. Drop `const` from `MaterialApp`; `chapters` can stay const.

## Android → [`platforms/android/android.md`](../platforms/android/android.md)

- **A chapter stalls at its end** → `frameCount` doesn't match what's on disk. Re-read the
  count the extraction script printed; it is `fps × clip seconds`, so an 8 s clip at 12 fps
  is 96 frames, not the 60 a 5 s chapter gives.
- **Cold start shows the background, not the first frame** → a wrong `Chapter.frameDir`.
  `AssetManager` throws and the scaffold swallows it via `runCatching` by design (a missing
  frame mid-scroll must never crash the film), so a bad path fails silently. Check the path
  against `app/src/main/assets/`.
- **Promised an app, then found no toolchain** → the Step 0 probe was skipped. Run it
  before the target question, and on `TARGET=NONE` say so plainly and offer the website
  ([`discovery/interview.md`](../discovery/interview.md)) rather than scaffolding something
  the user can't build.

## Project documents → [`project/documents.md`](../project/documents.md)

- **The README has grown a rejection log** → status went in the wrong file. `README.md` is
  what the project is; `brief.md` is where production is.

## Shell

- **bash 3.2** on macOS → no associative arrays. **zsh** arrays are 1-indexed → run chain
  scripts as `bash script.sh`, never inline in an interactive zsh.

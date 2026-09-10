# Global rules — the single source of truth

*Every law the build must not break. Modules hold the procedure; this file holds the rule.
When a module and this file disagree, this file wins.*

**Read with:** [`core/quality.md`](quality.md) · [`animation/chain.md`](../animation/chain.md) ·
[`discovery/references.md`](../discovery/references.md)

---

## 1. The seamless chain

Every clip after the first must start on the **actual last frame of the clip before it**,
extracted from the rendered video — never from a still, never from a re-render. Break it
and the film cuts.

Every generation renders slightly differently, so two renders of "the same scene" never
match. This is why a still can never stand in for a rendered frame.

Procedure: [`animation/chain.md`](../animation/chain.md). Scripts:
[`pipeline/scripts.md`](../pipeline/scripts.md) §3–§4.

## 2. One image, N clips

Because clip *n* is conditioned on clip *n−1*'s rendered frame, stills 2…N are never used
as start frames. So the build generates **exactly one image**: the start frame of scene 1.
Chapter *n*'s poster and reduced-motion still come out of clip *n* with ffmpeg, free and
frame-exact.

Generating a still per chapter is not thoroughness, it is money spent on assets the chain
must then refuse to use. If you find yourself writing `prompts/images/02-*.md`, the chain
has been broken somewhere upstream.

## 3. Say it before you build it

The chained workflow is not obvious, and a user who doesn't know it will go and generate
four images nobody wanted. Say it once, plainly, at Step 2 — adapt the wording, keep the
structure:

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

Then hold to it. The per-clip loop is [`project/handoff-loop.md`](../project/handoff-loop.md),
and `brief.md` is where its state lives.

## 4. The product is never redesigned

Not simplified, not restyled, not "improved", not swapped for a similar one. Camera, light
and environment change around it. A clip where the product is no longer recognisably the
same product is rejected however good the motion was — that check is a permanent line in
every acceptance list.

Procedure: [`discovery/references.md`](../discovery/references.md).

## 5. A style reference is never a conditioning image

It informs the prompt *text*. Pass it as the image input and it clones its own content into
the film. Only the chain's own frames condition generations.

## 6. The preamble is byte-identical

The look's `PREAMBLE` is pasted **byte-for-byte identical** into every prompt of a build.
That identical text is what makes separately-generated clips read as one film. Never
paraphrase it between scenes — paraphrasing is the single biggest cause of a film that
looks like six stock clips.

Library: [`art-direction/looks.md`](../art-direction/looks.md).

## 7. One look, one camera architecture, one model per build

- **One look.** If the user wants their own brand palette, keep the look's preamble and
  swap only the hexes.
- **One camera architecture.** A (continuous forward take) or B (dive + connector), never
  both in one film.
- **One model for the entire chain.** Every renderer has its own grain, motion and colour
  character; swapping mid-chain preserves position continuity but the character shift reads
  as a subtle pop. The one sanctioned exception is a single clip a content filter keeps
  refusing.

## 8. One camera move per clip, motion budget of two

One move, at a named speed, no cuts. The motion budget is the camera plus **one** subject;
a third breaks the physics. Two moves in a prompt is the single most common re-roll.

Full rules: [`video/prompting.md`](../video/prompting.md).

## 9. Never a second scroll driver over the film

The engine maps scroll to a playhead. A second driver over the same range (GSAP
ScrollTrigger `scrub`, a second scrubbed video) fights it. Extra motion goes **below** the
film, in the post-film sections, as CSS or Framer Motion.

And never put a CSS transform on an ancestor of the film container: a transform creates a
containing block and breaks the engine's `position: fixed` layers.

Details: [`platforms/web/nextjs.md`](../platforms/web/nextjs.md).

## 10. Never promise an app you can't build

For any app request the Step 0 probe (`bash tools/detect-target.sh`) runs **before** the
target question, and its result is not negotiable. On `TARGET=NONE`, stop and ask — never
silently downgrade to a website, and never scaffold an app that cannot be built.

Procedure: [`core/bootstrap.md`](bootstrap.md), wording in
[`discovery/interview.md`](../discovery/interview.md).

## 11. When rules conflict

Priority order, highest first:

**reference accuracy → motion control → continuity → cinematic quality**

Drop the adjective before you drop a lock.

## 12. The page after the film is designed, never asked

The user is **never** asked which sections follow the film, whether they want a footer, or
whether to stop at the film. They gave a subject and a look; the continuation follows from
those, and asking hands back the one genuinely creative decision they came here to delegate.

Every build ships **4 or 5 designed sections plus a mandatory footer** — the footer is the
closing frame, not one of the slots. Derive them with Steps A–G, and never emit the default
shape (statement → cards → testimonials → CTA); if a plan comes out looking like that, it
was not designed. The first section inherits the film's palette, type, grain and light so
the page reads as one experience, not a video with a landing page bolted underneath.

Procedure and the idea library: [`sections/post-film.md`](../sections/post-film.md).

## 13. Real-world entities stay real

When a section needs real-world information, prefer real places, businesses, products and
verified data. Do not fabricate real-world entities, do not present fictional data as
factual, and never present static data as live. Demo or sample content is labelled as such
in the page and in `README.md`.

If a section can only exist by inventing facts, it was the wrong section — pick another.

## 14. Two documents, no overlap

`README.md` is what the project is; `brief.md` is where production is. Production status
never goes in the README, and the README's decisions never get restated in the brief.
Templates: [`project/documents.md`](../project/documents.md).

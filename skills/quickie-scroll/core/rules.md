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

## 15. Build the real visitor journey, not an attractive content shell

The hero film earns attention; the rest of the page must help a visitor make the decision
the subject exists for. Before choosing post-film sections, write an experience brief with
the visitor, primary action, decision-critical information and appropriate interaction.
A travel brand may need destination filters, an itinerary builder and a booking handoff; a
store may need collection discovery, product comparison/variants and a basket path. Do not
replace those jobs with decorative cards, generic metrics or a final button.

Follow [`discovery/experience-brief.md`](../discovery/experience-brief.md). The section
count remains 4–5, but a section may contain a complete, purposeful interactive module.

## 16. Source required imagery before designing around it

User assets remain first choice. If an approved section needs imagery the user did not
supply, search for it proactively, select assets whose license and permitted use are clear,
download/copy only when permitted, and record source URL, creator, license/use status and
local filename in `assets/SOURCES.md`. Search results are not proof of a license. Never
hotlink arbitrary search results, scrape an image behind a paywall, or imply an editorial
image is owned by the brand. If no suitable asset can be legally used, redesign the section
around available assets rather than substituting a fabricated visual.

Procedure: [`assets/sourcing.md`](../assets/sourcing.md).

## 17. Motion is choreographed against scroll, not merely animated

Every film chapter has a duration, a scroll allocation, a readable-copy hold and an
explicit motion-intensity curve. Use slow, controlled movement for orientation, product
inspection and reading; use shorter, higher-energy movement only for transitions or reveals.
Do not ask a video model for an unexplained speed ramp. When a pace change is necessary,
express it as separate beats/clips and map the scroll distance accordingly. The final second
of every clip still resolves into the stable handoff required by rule 1.

Procedure: [`video/prompting.md`](../video/prompting.md) and
[`animation/scene-planning.md`](../animation/scene-planning.md).


## 18. A gradient is never a substitute for a required photograph

If a section was designed around real imagery, it ships with real imagery or with a labelled,
correctly-proportioned stand-in plus a written asset specification in
`assets/asset-prompts/`. A gradient, solid fill, CSS illustration or empty box quietly put
where a photograph belongs is a broken section.

The spec records the section, the exact position within it, the local path the page already
references, the aspect ratio and a complete generation prompt — so the image can be generated
later and dropped in without touching the layout. Every pending spec is listed in `README.md`
and named to the user at handover.

Procedure: [`assets/sourcing.md`](../assets/sourcing.md) → *When no image can be sourced*.

## 19. The chrome is designed per build, never inherited

The brand mark, the top nav, its position, the scroll-progress rail and the rail's side are
five decisions the build makes from the subject and the look — not five defaults it accepts.
Shipping the engine's defaults is what made a peach drink and an arctic travel brand read as
one product with two skins.

Choose and record all five in `README.md`, plus chapter 1's `align`. The engine's generic
accent-pill mark is a fallback, not a logo: design an inline SVG lockup, use the user's real
logo, or ship a wordmark alone. And `hud.system` never repeats the brand name — it is
instrumentation, not branding.

Procedure and the variants: [`platforms/web/chrome.md`](../platforms/web/chrome.md).

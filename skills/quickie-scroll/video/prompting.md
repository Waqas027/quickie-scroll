# The video prompt — the seven blocks

*The single highest-leverage part of the skill: the fixed seven-block clip prompt.*

**Read with:** [`core/rules.md`](../core/rules.md) §6–§8 · [`animation/camera.md`](../animation/camera.md) · [`art-direction/realism.md`](../art-direction/realism.md) · [`video/continuity.md`](continuity.md)

---

A video model does not read cinematically, it reads instructionally. The failure mode is
never "the prompt was not beautiful enough", it is "the prompt left a decision to the
model". So every clip prompt is the **same seven blocks, in the same order, always
labelled**. Fixed order is not decoration: it front-loads the reference frame and the
locks, so by the time the model reads a motion instruction it already knows what it is not
allowed to change.

Priority when the blocks pull against each other:
**reference accuracy → motion control → continuity → cinematic quality.** Drop the pretty
adjective before you drop a lock.

### Template — `prompts/videos/NN-<slug>.md`

````markdown
# NN · <Chapter label> — clip

- **Render in:** any video model that accepts a **start frame** (Kling, Runway, Seedance,
  Veo, Higgsfield, Luma). A model whose image input is *reference only* cannot hold a
  seam — do not use one.
- **Start frame:** `assets/frames/last-<NN−1>-<prev-slug>.png`
  <!-- clip 01 only: assets/images/01-<slug>.png -->
  <!-- the ACTUAL last frame of the previous clip, extracted with ffmpeg — never a still,
       never a re-render -->
- **End frame:** — none — (architecture A never uses one; an end frame pulls the camera
  back, the number-one cause of seam stutter)
- **Aspect:** 16:9 · **Duration:** <6–10 s, selected from the chapter's pace role> ·
  **No audio** · highest quality the tool offers
- **Save as:** `assets/videos/NN-<slug>.mp4`

## Prompt

```text
<PREAMBLE — verbatim from art-direction/looks.md>

START: The shot opens exactly on the reference frame — <name the three or four things
actually visible in it, where they sit>. Do not re-stage, re-light or re-frame this; the
first frame of the video is this image.

HOLD: <the product / hero object> keeps its exact shape, proportions, colour, materials and
markings for the whole shot. The grade, the single light source, the lens and the
background stay as they are in the reference frame. Nothing is added to the scene and
nothing is removed.

CAMERA: One continuous camera move, no cuts. <ONE move — from the library below> at <a
walking pace / a slow drift>. The camera never stops, never pauses and never pulls back.

TIMING: 0–<n−2>s: <the stable travel/reveal beat>. <n−2>–<n−1>s: <the copy-readable
composition / reveal completion>. Final 1s: a calm forward handoff. The pace is
<slow controlled drift / measured walk / brisk transit>; no unrequested acceleration.

SUBJECT: <the one thing that moves on its own, and only that — "the paddle turns slowly in
the vat", "the parts drift apart, rotate, and lock into position". If nothing does: "Nothing
in the scene moves on its own; the motion is the camera's alone.">

THROUGH: <the single beat the shot is about>. <the destination> is already visible ahead
before the camera reaches it. The light changes gradually and continuously as the camera
travels — it never jumps.

END: In the final second the camera settles into a slow, steady forward drift toward <the
direction of the next scene> and holds that speed to the last frame.

FINAL FRAME: <one sentence — exactly what the last frame shows>. This frame is the start
frame of the next shot.

NEVER: no cut, no dissolve, no cross-fade, no double exposure, no speed ramp, no camera
shake, no whip pan, no zoom snap. No new objects entering frame. No text, letters, numbers,
logos, watermarks or captions. <No faces.>

<STYLE TAIL — the look's preamble condensed to one sentence> Palette: <hexes>.
Foreground passes faster than background. Under-crank everything — slow moves read as
expensive, fast moves expose artefacts.
```

## Accept when
- [ ] Frame 0 is visually identical to the start frame handed in — **the one failure
      nothing downstream can hide.** No crossfade fixes a wrong start; re-render it.
- [ ] One continuous move — no cut, no jump, no speed ramp
- [ ] Everything in HOLD is unchanged at the last frame
- [ ] The last second is a calm forward drift, not mid-move and not motion-blurred
      sideways (**this frame becomes the next clip's start image**)
- [ ] Foreground passes faster than background — if everything moves together it is a pan
      across a matte painting; reject it
- [ ] 16:9, exact requested duration (±0.5 s), no audio, no text burned in
- [ ] The timing contract is visible: a readable composition precedes the final handoff,
      with no accidental speed ramp
````

### The rules that make the blocks work

These are what actually cut the rejection rate. Follow them literally.

1. **START names what is in the frame, it does not re-describe the world.** The model can
   already see the reference. Listing three or four concrete anchors ("the standing milk
   cans, the window light on the left, the doorway at the far end") tells it *which* things
   are load-bearing. Re-describing the whole scene invites it to re-render one.
2. **One camera move per clip.** "Orbits, then pushes in, then cranes up" is three moves;
   the model will pick one and blend the rest into mush. Two moves in a prompt is the most
   common cause of a re-roll. Pick one from the library below.
3. **Motion budget: two moving things, maximum** — the camera plus one subject. A third
   (weather, a crowd, a second machine) is where physics falls apart.
4. **Every noun in THROUGH is already in START, or is explicitly declared as visible
   ahead.** A destination the model has to invent mid-shot arrives as a cut.
5. **Name the speed and timing, not the mood.** "At a walking pace", "at a slow drift"
   and the short TIMING contract are executable. "Dramatically", "epically", "with
   energy" are not, and each one raises the odds of a speed ramp. The clip duration must
   support the move: 6–7 s for brisk transit, 8 s for a standard reveal, 9–10 s for
   orientation, inspection or final resolve.
6. **END and FINAL FRAME are two different blocks, and both are required.** END is the
   *velocity* at the end; FINAL FRAME is the *composition* at the end. The chain needs
   both: velocity so the next clip does not reverse, composition so you know before
   rendering what the next prompt is conditioning on.
7. **HOLD is not optional.** The blocks that a video model most readily discards are the
   ones nobody wrote down. If a product is the anchor, its lock clause goes here verbatim.
8. **Keep it achievable.** A move a real camera operator could not perform in one take is
   a move the model will fake with a cut. When a beat needs two moves, it needs two
   chapters. A genuine fast-to-slow shift is two beats: make the cut at a threshold and
   let the next clip begin from the real extracted frame; never ask a generator to
   improvise a speed ramp.
9. **The transition between rooms belongs inside a clip, not between clips.** Cross the
   threshold *within* the shot — through a doorway, into a dark opening, out into
   daylight — so the seam falls in open space where nothing has to match but position.

### Mid-leg move library — pick exactly one

| Concept | Move (drops straight into CAMERA) |
|---|---|
| Product / luxury | "sweeping in a slow half-orbit around <the object>, keeping it centred, then continuing past it" |
| Hardware / components | "pushing in steadily while the parts drift apart, rotate, and lock into position ahead of it" |
| Software / abstraction | "tracking low and level alongside <the subject>, then passing through the surface into the schematic space beyond it" |
| Travel / arrival | "descending steadily through layered cloud, near cloud passing faster than far cloud, the ground resolving below" |
| Craft / provenance | "pushing in close to <the craft moment> until it nearly fills the frame, then easing gently back out to where it started" |
| Architecture / interiors | "gliding forward through the doorway at a walking pace, the frame passing close on the left" |
| Scale / reveal | "rising smoothly as the full scale of <the space> opens up below" |
| Plain glide (zero-risk) | "gliding straight forward at a slow, steady pace" |
| Miniature (arch B) | dives + aerial hops — the connector *is* the grammar |

Expressive moves raise re-roll odds — the model can end a fancy move in a state that is not
a clean forward drift. Budget one extra re-roll per expressive leg, and never edit the END
block to accommodate one. Where the scene itself is the show, take the plain glide.

**Locked-iso clause** — when `CAMERA` = locked isometric glide, this replaces the move in
the CAMERA block of **every** clip, verbatim:

```
The camera keeps exactly the same angle throughout — no rotation, no orbit, no tilt. It
only travels straight and level, the world sliding past beneath the same view.
```


---

# Portrait (9:16) — the app target and the mobile chain

Portrait is **not a crop**. It is a separately-composed chain, and the composition rules
invert:

- The subject sits in the **upper-middle third**, not the centre — the lower third is where
  the app's copy and the system gesture bar live.
- Camera moves become **vertical**: descend, rise, push in. Lateral tracks read as a subject
  sliding out of frame on a phone.
- Every prompt says `Render a 9:16 vertical portrait image, at least 1080 px wide` /
  `9:16 vertical, 1080×1920`. Do not rely on a tool-side aspect setting.
- Duration drops to **5–6 s** per clip: a phone scrub covers less distance, and a shorter
  clip decodes far faster on a mid-range Android device.
- Same preamble, same seven blocks, same product lock. A portrait build with a different
  preamble is a different film.

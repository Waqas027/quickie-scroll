# Prompt templates, intake & the prompt-pack layout

Three things live here: **where prompt files go**, **what goes in them**, and the
**seven-block video prompt** that is the single highest-leverage part of the whole skill.

The style preamble comes from `looks.md` and is pasted **byte-for-byte identical** into
every prompt of a build. That identical text is what makes separately-generated clips
read as one film. Never paraphrase it between scenes.

---

## The prompt pack — layout and format

**One still, N clips.** The chain only ever needs one generated image: the start frame of
scene 1. Every scene after it starts on the *previous clip's actual last frame*, so
generating stills 2…N is wasted money and actively harmful — a re-rendered still never
matches a rendered frame, and using one breaks the seam.

```
<project>/
  README.md                     ← what this project is (see handoff.md)
  brief.md                      ← where production currently is (see handoff.md)
  prompts/
    images/
      01-<slug>.md              ← THE ONLY IMAGE PROMPT — scene 1's start frame
      00-product-plate.md       ← optional, only when a product reference needs cleaning up
    videos/
      01-<slug>.md              ← one file per clip, in chain order
      02-<slug>.md
      …
      conn-01.md                ← architecture B only
  refs/
    product/                    ← user-supplied product images — the locked anchor
    style/                      ← user-supplied design/style references
  assets/
    images/    01-<slug>.png    the one start still
    videos/    NN-<slug>.mp4    the videos you generate — the masters
    rejected/  NN-<slug>-takeA.mp4 + a one-line why
    frames/    last-NN.png / first-NN.png — extracted seam frames
```

`first-NN.png`, extracted from each accepted clip, **is** chapter *n*'s poster and its
reduced-motion still. That is why chapters 2…N need no image prompt: their stills fall out
of ffmpeg for free, and they match the film exactly.

Rules, all of them deliberate:

- **`.md`, not `.txt`.** These files are read by humans in an editor — they need headings,
  a copy-paste fenced block, and a checklist. A `.txt` file gets pasted wholesale into a
  prompt box, front-matter and all.
- **Numbered `NN-slug` filenames.** The number is the chain order. Sorting the folder must
  produce the generation order, because clip *n* depends on clip *n−1*'s last frame.
- **One prompt per file.** The unit of work is one generation.
- **Every file is self-contained**: the full preamble, the aspect ratio, the duration, the
  conditioning frame it needs, and the exact output filename. A prompt file must work when
  it's the only thing on screen, weeks later, in a tool nobody chose yet.

---

## The one image prompt — `prompts/images/01-<slug>.md`

````markdown
# 01 · <Chapter label> — the start frame

This is the **only** image the build needs. Every later scene starts on the previous
clip's rendered last frame, not on a new still.

- **Render in:** any image model (Midjourney / Nano Banana / Imagen / Flux / DALL·E)
  <!-- with a product reference: a model that accepts an image input, e.g. Nano Banana, Flux Kontext -->
- **Aspect:** 3:2 landscape · **min width:** 1536 px   <!-- 9:16, ≥1080 px for the app -->
- **Reference image:** `refs/product/<file>` — <or "— none —"> 
- **Save as:** `assets/images/01-<slug>.png`
- **Used for:** the start frame of clip 01, chapter 1's poster, and the reduced-motion still

## Prompt

```text
<PREAMBLE — verbatim from looks.md>
Render a wide 3:2 landscape image, at least 1536 px wide.
<PRODUCT LOCK — verbatim, only when a product reference was supplied>
Subject: <what is in THIS frame — the space, the object, the light, 2–3 concrete props>.
Composition: the focal subject horizontally centred with a little headroom; nothing
essential at the far left or right edges. <the exit — the doorway, opening or direction
the camera will travel toward — visible in frame>.
Absolutely no text, no letters, no numbers, no logos, no watermarks.
```

## Accept when
- [ ] 3:2, ≥ 1536 px wide
- [ ] No text anywhere in the frame
- [ ] Subject centred; **the direction the camera will travel is visible in frame**
- [ ] With a product reference: shape, proportion, colour, material and markings all match
- [ ] It is a frame you would be happy to look at for eight seconds — the whole film
      inherits its grade, its light and its lens
````

Get this one right before anything else renders. It is the only asset the entire chain
inherits from, so a re-roll here costs one generation and a re-roll later costs the tail
of the film.

---

## The video prompt — the seven blocks

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
- **Aspect:** 16:9 · **Duration:** 8 s · **No audio** · highest quality the tool offers
- **Save as:** `assets/videos/NN-<slug>.mp4`

## Prompt

```text
<PREAMBLE — verbatim from looks.md>

START: The shot opens exactly on the reference frame — <name the three or four things
actually visible in it, where they sit>. Do not re-stage, re-light or re-frame this; the
first frame of the video is this image.

HOLD: <the product / hero object> keeps its exact shape, proportions, colour, materials and
markings for the whole shot. The grade, the single light source, the lens and the
background stay as they are in the reference frame. Nothing is added to the scene and
nothing is removed.

CAMERA: One continuous camera move, no cuts. <ONE move — from the library below> at <a
walking pace / a slow drift>. The camera never stops, never pauses and never pulls back.

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
- [ ] 16:9, ~8 s, no audio, no text burned in
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
5. **Name the speed, not the mood.** "At a walking pace", "at a slow drift" are executable.
   "Dramatically", "epically", "with energy" are not, and each one raises the odds of a
   speed ramp.
6. **END and FINAL FRAME are two different blocks, and both are required.** END is the
   *velocity* at the end; FINAL FRAME is the *composition* at the end. The chain needs
   both: velocity so the next clip does not reverse, composition so you know before
   rendering what the next prompt is conditioning on.
7. **HOLD is not optional.** The blocks that a video model most readily discards are the
   ones nobody wrote down. If a product is the anchor, its lock clause goes here verbatim.
8. **Keep it achievable.** A move a real camera operator could not perform in one take is
   a move the model will fake with a cut. When a beat needs two moves, it needs two
   chapters.
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

### Writing clip *n* from clip *n−1*

Never write the whole video pack up front on the manual path. Write clip 1, get the
rendered video back, **look at its actual last frame**, then write clip 2 *from what that
frame shows* — not from what the chapter plan said it would show. Models drift, and a
prompt written against an imagined frame is a prompt written against the wrong frame.

Concretely, for each new clip:

1. Extract `last-NN.png` and open it.
2. Fill START from that image — the three or four things actually in it.
3. Carry HOLD forward unchanged, plus anything new the frame introduced.
4. Check the previous clip's FINAL FRAME line against the real frame. If they disagree, the
   real frame wins, and the disagreement is worth one line in `brief.md` — it usually
   predicts the same drift in the next clip.

---

## Working from user-supplied references

Two kinds arrive, and they are treated in opposite ways. Sort them **before** writing a
single prompt, and confirm the sort with the user in one line.

### Product reference → a locked anchor

The user's product is the source of truth for the whole film. It is not inspiration and it
is not a starting point for a redesign. Save to `refs/product/`, and paste this clause
verbatim into the image prompt and into the **HOLD block of every clip**:

```
The <PRODUCT> is exactly the product in the reference image: the same silhouette and
proportions, the same colours and finish, the same materials, the same label, typography
and markings, in the same places. Do not restyle it, do not simplify it, do not change its
shape, its number of parts or its branding. Lighting, camera and environment change around
it; the product itself does not.
```

Then design around it, never over it: the camera moves, the light travels, the environment
changes state — the product holds. Acceptance gets one extra, non-negotiable line: *the
product is still recognisably the same product at the last frame.* If it is not, the clip
is rejected regardless of how good the motion was.

If the supplied photo is noisy (busy background, phone lighting, a watermark), write the
optional `prompts/images/00-product-plate.md` first: a clean plate of the same product on
the look's background, with the lock clause above. That plate then becomes the reference
for scene 1. One extra generation, and it removes the most common cause of product drift.

### Design / style references → inspiration, extracted then discarded

Screenshots, Pinterest boards, Dribbble shots, a site the user likes. Save to `refs/style/`
and read them for **what to name in the prompts and the page**, not to copy:

| From the reference, take | Where it lands |
|---|---|
| Palette | `PALETTE` — 4–6 hexes, one background, one accent |
| Type feel | `TYPE` — a display/body pairing |
| Composition, negative space, scale | the image prompt's composition line; `align` per chapter |
| Grade, light direction, lens feel | the `PREAMBLE` and the STYLE TAIL |
| Motion feel (from a video reference) | the CAMERA block's move and pace |
| Layout, section rhythm | the `acts` after the film |

Write the extraction down in `README.md` as a short table — *"from ref 2: the type pairing
and the ink-on-paper contrast; from ref 3: the half-orbit pace"* — so the build is
combining references rather than cloning the loudest one. Say in one line which reference
supplied what, and do not let any single reference supply more than two rows: that is the
difference between an art direction and a copy.

**Never pass a style reference image as the conditioning image for a clip.** It clones the
reference's content into the film. Style references inform the *text*; only the chain's own
frames condition the *generations*.

---

## Intake checklist (SKILL Step 1)

- `REFS` — supplied images, sorted into `PRODUCT` (locked anchor) and `STYLE`
  (inspiration). Asked **first** when any reference is present, because a product anchor
  changes the look, the chapters and every prompt.
- `TARGET` — **web** (Next.js site, 16:9) | **app** (9:16) | **both**. Decides every
  asset's aspect ratio. For an app, `bash detect-target.sh` runs before the question and
  its result (`FLUTTER` / `ANDROID` / `BOTH` / `NONE`) picks the scaffold — or, on `NONE`,
  sends the user back to the web target (SKILL Step 1.1).
- `APP_STACK` — (app targets only) **flutter** | **android**. Set by the probe.
- `SUBJECT` — the business/product + a one-line pitch, in the user's own words.
- `BRAND_NAME`, `TONE`.
- `LOOK` — one of the seven in `looks.md`. Fixes `PREAMBLE`, `PALETTE`, `TYPE`, `HUD`.
- `PALETTE` — 4–6 named hexes (the look's default, the user's brand, or pulled from a style
  reference). One is the page background, one is the accent.
- `N` — chapter count: 2 (teaser) | 4 (short journey) | 6 (full film, maximum).
  Assets = **1 still + N clips** (arch A) or 1 still + (2N−1) clips (arch B).
- `CAMERA` — walkthrough (arch A) | fly-through (arch B) | locked-iso (arch A + clause).
- `CHAPTERS[]` — for each: `id`, `label`, `subject`, `eyebrow`, `title`, `body`, `tags[]`,
  `align` (left/right/centre — alternate them), `accent`.
- `ACTS` — the page after the film: any of statement / cards / cta / footer / reviews /
  testimonials / animated / custom / none. **Multi-select, always asked.**
- `MOBILE` — desktop only | + native 9:16 chain. (Forced to 9:16 when `TARGET` = app.)
- `ASSET_SOURCE` — automatic (a connected tool renders) | manual (the pack is the
  deliverable).

---

## Connector prompt (architecture B only)

Start frame = the previous clip's **actual last frame**; end frame = the next clip's
**actual first frame**. Both extracted from the rendered videos, never re-rendered. Same
seven blocks, with CAMERA and THROUGH carrying the arc:

```text
CAMERA: One continuous camera move, no cuts. The camera pulls up and back out of <SCENE i>,
rises, glides across the connected world and arrives above <SCENE i+1>, beginning to
descend toward it.
THROUGH: One seamless flowing aerial transition — the world stays one continuous place, and
<SCENE i+1> is already visible ahead as the camera rises.
```

Duration 5 s. For the last connector into a hero-product finale: "…glides forward and the
world dissolves toward a single <PRODUCT> alone in soft <BG> space, arriving in front of it."

---

## Portrait (9:16) — the app target and the mobile chain

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

---

## Copy per chapter (for the engine config)

- `eyebrow` — 2–4 words, a label not a sentence. Often a chapter number + name
  (`01 — THE THRESHOLD`).
- `title` — 3–7 words. Short declaratives land; questions don't. "Built for the distance
  before it begins." / "Precision begins here." — a statement about the *world*, not a
  feature list.
- `body` — one sentence, from the visitor's side.
- `tags` — 0–3 proof chips (`Calabrian bergamot`, `Double-wall steel`, `Dawn-cut`).
- `align` — alternate `left` / `right` / `center` down the chapter list. Six chapters of
  bottom-left copy is the single most common reason a good film reads as a template.
</content>
</invoke>

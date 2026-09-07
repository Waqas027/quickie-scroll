# Looks — the art-direction library

*Seven art directions. One look per build; it fixes PREAMBLE, PALETTE, TYPE and the HUD wording.*

**Read with:** [`art-direction/realism.md`](realism.md) · [`discovery/interview.md`](../discovery/interview.md) question 3 · [`video/prompting.md`](../video/prompting.md)

---

Seven named looks, each reverse-engineered from a shipped reference film. A look is not
a mood board: it fixes the **style preamble** (reused byte-identical in every prompt of a
build — this is what makes a set of separately-generated clips read as one film), the
**lens/lighting grammar**, the **palette**, the **type pairing**, the **HUD wording**, and
the **failure mode** to watch for.

Offer these by name at the interview (SKILL Step 1.3). One look per build, never mixed.

---

## How to read a look

| Field | What it does |
|---|---|
| `PREAMBLE` | Pasted verbatim at the top of **every** image prompt and into the style tail of every video prompt. Never paraphrase it between scenes — drift here is the #1 cause of a film that looks like six stock clips. |
| `LENS` | The camera language that goes in the video prompts. |
| `PALETTE` | 4–6 hexes. One is the page `--sw-bg`, one is `--sw-accent`. |
| `TYPE` | Display + body pairing (Google Fonts names, so the template can just link them). |
| `HUD` | `system` label / `verb` — the corner instrumentation wording. |
| `WATCH` | The specific way this look goes wrong. |

---

## 1. `product-noir` — cinematic product in the wild
*Reference: ARQ-01 "Carry the horizon" (bottle → backpack → alpine ridge).*

The default for a single hero object with a story around it. Near-black frames, one
practical light source, the product held in shallow focus while the world moves behind it.

```
PREAMBLE
Ultra-photorealistic cinematic product photography, shot on a full-frame camera with a
50mm prime at f/2.0. A single practical light source and deep falloff into near-black
shadow; matte surfaces, fine real-world micro-texture, visible grain. Muted desaturated
colour with one restrained accent. Editorial, unstyled, no props that read as staging.
Absolutely no text, no letters, no numbers, no logos, no watermarks. No people unless
named in the subject.
```

- **LENS** — slow dolly-in and half-orbits around the object; the environment slides in
  parallax behind it. The object stays in the same third of the frame the whole film.
- **PALETTE** — `ink #0B0C0E, slate #2A2E33, ash #7C838C, bone #E8E6E1, signal #16BFC6`
- **TYPE** — display `Instrument Serif` or `Archivo` (light, tight) / body `Inter`
- **HUD** — `system: "FIELD VESSEL / 01"`, `verb: "scroll to traverse"`
- **WATCH** — models drift the product's shape between scenes. Lock it: describe the
  object in the **same 12–15 words in every prompt**, and pass an approved still as a
  style/subject reference on every re-roll.

---

## 2. `technical-white` — exploded assembly on a lab-white field
*Reference: KUKA "Precision begins here" (floating parts → assembled robot arm).*

For machinery, components, tools, hardware. Bone-white infinite background, parts
suspended in space, then converging. The one look where the *background is the brand*.

```
PREAMBLE
Ultra-photorealistic studio product render on a seamless bone-white infinite background
(#F4F2EE), no horizon and no visible floor line. Precision-engineered hardware with
crisp machined edges, anodised and brushed-metal finishes, soft large-source studio
lighting with clean specular highlights and faint contact shadows. Technical, clinical,
high dynamic range, tack sharp. Absolutely no text, no letters, no numbers, no logos.
```

- **LENS** — parts drift and rotate slowly in place, then translate together and lock;
  the camera pushes in on the assembly. Movement is mechanical, never handheld.
- **PALETTE** — `bone #F4F2EE, graphite #1C1C1E, steel #9AA0A6, safety #FF5B22, ink #000`
- **TYPE** — display `Archivo` / body `IBM Plex Mono` for the HUD, `Inter` for body
- **HUD** — `system: "ASSEMBLY / 016"`, `verb: "scroll to assemble"`, brackets **on**
  (this look wants the registration marks — they're half its identity)
- **WATCH** — the white background picks up a gradient or a horizon and the float breaks.
  The "no horizon, no floor line" clause is load-bearing; keep it in every prompt.

---

## 3. `digital-twin` — the real thing becomes data
*Reference: NOLITH "Freight in motion" (truck → wireframe → light-network tunnel).*

A three-act transformation: photoreal → schematic overlay → pure abstraction. The best
look for software, logistics, AI, infrastructure — anything whose product is invisible.

```
PREAMBLE
Cinematic photoreal footage transitioning into a luminous technical overlay: fine cyan
wireframe topology, scan lines and floating measurement points tracing over the real
subject against a deep desaturated environment. Dark teal-to-charcoal grade, volumetric
haze, thin emissive light lines. Precise, calm, engineered — not a glitchy sci-fi HUD.
Absolutely no text, no letters, no numbers, no logos.
```

- **LENS** — a long lateral track alongside the subject, then the camera enters the
  abstraction and flies *through* it down a receding corridor of light.
- **PALETTE** — `void #07100F, deep #10201F, mint #7FE6C4, glass #C9D6D2, amber #E8A34A`
- **TYPE** — display `Inter` (tight, medium) / body `Inter`
- **HUD** — `system: "SYSTEM 01 / <DOMAIN> COGNITION"`, `verb: "scroll to resolve"`,
  `frames: true` (the frame counter belongs to this look more than any other)
- **WATCH** — the wireframe act reads as a cheap filter unless the underlying subject is
  still legible through it. Prompt the real geometry first, the overlay second.

---

## 4. `atmospheric-descent` — arrival, through weather
*Reference: VELUNE "Paris begins before you land" (window → clouds → city → arrival).*

Travel, hospitality, real estate, anything about *getting somewhere*. Built on altitude:
the film starts above the world and lands in it. Pairs with a light editorial act set
(SKILL Step 8) better than any other look.

```
PREAMBLE
Ultra-photorealistic cinematic aerial cinematography, blue hour. Vast layered cloud
banks with real volumetric depth and god rays, deep atmospheric haze, a cool desaturated
blue-grey grade with warm pinpoint lights far below. Shot on a full-frame camera with a
35mm lens, natural motion, slight lens breathing. Quiet, immense, unhurried. Absolutely
no text, no letters, no numbers, no logos.
```

- **LENS** — one continuous descent. The camera only ever goes **down and forward**;
  never climbs back up between chapters (that reversal is the seam stutter, SKILL Step 5).
- **PALETTE** — `midnight #0A1220, storm #1E2C40, mist #8FA2B8, paper #EDEAE3, lamp #E9C77E`
- **TYPE** — display `Instrument Serif` or `Cormorant Garamond` / body `Inter`
- **HUD** — `system: "01 — THE THRESHOLD"` (renumbered per chapter), `verb: "scroll to descend"`
- **WATCH** — cloud footage is where models cheat with a static matte painting. Demand
  "parallax between cloud layers, near clouds passing faster than far clouds" in every
  prompt, and reject a clip whose clouds don't separate in depth.

---

## 5. `warm-craft` — the making of the thing
*Reference: VESPERINE "Cut at first light" (grove → copper stills → perfumer's bench → bottle).*

Provenance stories: food, drink, fragrance, textiles, anything with a maker. Golden
practical light, hands and materials, dust in the air. The finale is always the finished
object on a plain surface.

```
PREAMBLE
Ultra-photorealistic documentary-style cinematography, warm low-key practical lighting —
a single window or a hanging bulb — with visible dust motes and soft haze. Natural
materials: aged wood, hammered copper, linen, stone. Rich amber and deep olive-brown
grade, gentle film grain, shallow depth of field on a 40mm lens. Unstyled and lived-in.
Absolutely no text, no letters, no numbers, no logos. No faces.
```

- **LENS** — push in close to the craft moment until it nearly fills the frame, ease
  back out, carry on. One move per chapter.
- **PALETTE** — `bark #17120C, olive #3B3E2C, brass #C08A3E, cream #EDE4D3, ember #8C4A24`
- **TYPE** — display `Fraunces` or `Cormorant Garamond` / body `Inter`
- **HUD** — `system: "01 / 04 — WHERE IT BEGINS"`, `verb: "scroll to follow the trail"`
- **WATCH** — "no faces" is deliberate. Hands are fine and add enormously; faces trip
  content filters and break continuity between clips (the same person won't render twice).

---

## 6. `monolith-ambient` — a looping hero, not a scrub
*Reference: Aurei "We shape identities that move" (a form rising out of black water).*

The exception in this library: **the clip loops, it does not scrub**. One abstract
sculptural object, one slow ambient motion, a static layout on top. Use it for studios,
agencies, brands with no product to show — or as the *opening* chapter of another look.

```
PREAMBLE
Ultra-photorealistic abstract sculptural form in a black void, half-submerged in still
dark water with a mirror reflection. A single soft rim light rakes across it; deep
volumetric fog; monochrome charcoal-to-white grade. Slow, weightless, meditative motion.
Absolutely no text, no letters, no numbers, no logos.
```

- **LENS** — a 6–10s move that **starts and ends on the same frame** so it loops
  invisibly (render it, then trim to the nearest matching frame pair with ffmpeg).
- **PALETTE** — `black #08080A, iron #1A1A1E, fog #6E7076, white #F6F6F4, iris #8B7BE8`
- **TYPE** — display `Instrument Serif` (italic accent word) / body `Inter`
- **HUD** — usually off. `verb` only.
- **WATCH** — this is the one look where a seam doesn't matter and a *loop point* does.
  Wire it as a single section with `loop: true` rather than a scrub chain.

---

## 7. `clay-diorama` — the miniature world (inherited)
*The original `lets-scroll` default, kept because it's still the right answer for
playful/consumer brands and it's the only look that suits architecture B.*

```
PREAMBLE
Isometric low-poly 3D diorama floating as a small rounded island on a plain solid
[BG_HEX] background with a soft contact shadow beneath it. Soft matte clay 3D render,
rounded toy-model shapes, gentle warm studio lighting, soft long shadows, tilt-shift
miniature look. Cohesive colour palette of [PALETTE]. Highly detailed, centered
composition, absolutely no text, no letters, no numbers, no logos.
```

- **LENS** — dive into each scene, pull up and out, hop to the next (architecture B).
- **TYPE** — display `Outfit` / body `Inter`
- **HUD** — usually off; the route rail is enough.
- **WATCH** — see `SKILL.md` Step 5: B reverses camera direction at every seam. Charming
  in miniature, a stutter in anything photoreal.


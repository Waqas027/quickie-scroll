# Section library — seeds, not a menu

*Each entry is three lines: what it is, what it is for, how it moves. They are design
references, not implementations. **Never read this list to the user** — it is the raw
material you reason over in [`selection-rules.md`](selection-rules.md).*

**Read with:** [`selection-rules.md`](selection-rules.md) ·
[`animation-patterns.md`](animation-patterns.md)

---

Entries are grouped by the rung they usually occupy
([`workflow.md`](workflow.md) → *the placement ladder*). Rename any of them to the
product's own language — "Bottle Anatomy", "Chassis & Frame", "Inside the Weave" — because
a section titled *Product Anatomy* on a real site reads as a template.

## Reveal & continuation

| Section | Purpose | Motion |
|---|---|---|
| **Product Hero Extension** | Hold the film's last frame one beat longer and name the thing. | Last frame settles → headline splits in word by word → the frame drifts a few percent. |
| **Cinematic Image Reveal** | One image, given the weight of a poster. | Clip-path wipe opens from the centre line → scale eases from 1.06 to 1.0 → caption fades under it. |
| **360° Product Reveal** | Let the visitor turn the product. | Scroll or drag scrubs a frame sequence through one rotation → releases to the nearest rest angle. |
| **Final Product Showcase** | The closing image, whole and lit. | Depth planes converge → product settles → headline and CTA rise on a stagger. |

## Detail & anatomy

| Section | Purpose | Motion |
|---|---|---|
| **Product Detail Reveal** | Show the details that justify the price. | Camera zooms → the detail separates from the body → expands → text reveals → returns. |
| **Product Anatomy / Structure** | Name the parts. | Product holds centre → labelled leaders draw out on a stagger → hover lifts one part and dims the rest. |
| **Layered Product Breakdown** | Show what it is made of, in order. | Layers drift apart along one axis as you scroll → each names itself as it lands → re-stack on exit. |
| **Detail / Macro Showcase** | The texture, the finish, the grain. | Slow scale-through across two or three macro plates, clip-path wiping between them. |
| **Technical Specification Reveal** | The numbers, without a spec table. | Figures count up as they enter → the rule under each draws left to right → units settle last. |

## Material, craft & origin

| Section | Purpose | Motion |
|---|---|---|
| **Material / Craftsmanship Showcase** | Why this material, made this way. | Material plate parallaxes behind the copy → a macro inset opens on a mask → hairline rules draw in. |
| **Ingredient / Material Story** | Where the substance comes from. | Horizontal rail of source plates → copy reveals per panel → the last panel hands off to the product. |
| **Craft / Manufacturing Journey** | The making, as a sequence. | Pinned scene, steps cross-fading in place as you scroll through → progress rail fills alongside. |

## Feature & capability

| Section | Purpose | Motion |
|---|---|---|
| **Feature Expansion** | Three or four capabilities, unfolded. | Collapsed rows expand one at a time on entry → the open one grows its image, the others recede. |
| **Interactive Benefits** | Benefits the visitor chooses between. | Tabs or a segmented control cross-fade the plate and morph the accent → content staggers in behind. |
| **Interactive Hotspots** | Everything the product does, on one image. | Dots pulse in on a stagger → hover or tap opens a card anchored to the point → the image dims behind it. |
| **Interactive Comparison** | This versus the alternative. | Draggable split handle wipes between two plates → labels swap at the midpoint. |
| **Before / After Transformation** | The change the product makes. | Mask reveal driven by scroll rather than a handle → one caption per side, revealing at the edges. |

## Context & life

| Section | Purpose | Motion |
|---|---|---|
| **Use-Case Showcase** | Who uses it, and for what. | Horizontal rail of scenarios pinned in place → each panel's copy rises as it centres. |
| **Lifestyle Showcase** | The product in its world. | Full-bleed plates with layered parallax → copy anchored to the plate edge, revealing on entry. |
| **Product + Environment Transformation** | The world changing around the fixed product. | Product holds absolutely still → the background cross-fades through states behind it. |
| **Product Ecosystem** | What it connects to. | Satellites orbit in on a stagger → connecting lines draw → hover pulls one satellite forward. |

## Story, composition & exploration

| Section | Purpose | Motion |
|---|---|---|
| **Product Story** | The idea the brand is actually selling. | Long-form type revealing line by line over a slow-drifting plate → one pull-quote scaling up. |
| **Floating Product Composition** | The product as sculpture. | Knocked-out product floats on a slow sine → satellite elements parallax at different depths. |
| **Scroll-Based Product Transformation** | One product, two states. | Pinned scene: state A morphs to state B across the section's scroll band → labels swap at the crossover. |
| **Interactive Product Explorer** | Let them drive it. | A pinned canvas with variant / colour / angle controls → each change cross-fades the plate, no reload. |
| **Product Gallery** | Several views, browsable. | Staggered grid revealing on entry → click opens a lightbox with a shared-element scale. |

---

## Writing a new entry

The list is a seed bank, not a boundary. A product with something none of these covers gets
a new section written in the same three-line form:

```
Section:  Scent Experience
Purpose:  Show how the fragrance moves from top note to base.
Motion:   Pinned scene → three note-plates cross-fade in place as you scroll
          → the active note's copy rises, the other two dim.
```

Name the motion in verbs and directions, never in moods. "Dramatic reveal" is not a motion;
"clip-path wipe from the centre line, 700 ms, cubic-bezier ease-out" is. Every new entry
must still map onto a pattern in [`animation-patterns.md`](animation-patterns.md) — if it
maps onto none of them, it is a rendering job, not a section.

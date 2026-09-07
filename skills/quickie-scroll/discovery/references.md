# User-supplied references — sorting and handling

*Only relevant when the user supplied images. When they did, this runs before every other
question.*

**Read with:** [`core/rules.md`](../core/rules.md) §4–§5 ·
[`discovery/interview.md`](interview.md) · [`image/start-frame.md`](../image/start-frame.md)

---

## The sort

Images arrive as attachments, paths, or Pinterest/Dribbble/Behance links. **Look at each
one**, then sort it into exactly one of two roles — **before writing a single prompt** —
and say the sort back in a line or two so the user can correct it. Getting this wrong is expensive in both directions: treating a
product as inspiration redesigns their product; treating a mood board as a product locks
the film to someone else's photo.

| Role | What it means | Where it goes |
|---|---|---|
| **Product** — "build the website around this" | The actual thing being sold. A **locked visual anchor**: the same silhouette, proportions, colours, finish, materials, label and markings, in every frame. | `refs/product/` · lock clause in the image prompt and in **every** clip's HOLD block |
| **Design / style** — Pinterest, Dribbble, a screenshot, a site they like, an animation they want the feel of | Inspiration for palette, type, composition, grade, motion pace, section rhythm. | `refs/style/` · informs `LOOK`, `PALETTE`, `TYPE`, the composition line and the CAMERA move |

Both kinds can arrive together, and usually do — "here's the bottle, and here are three
sites I like". A product reference **overrides the look's default palette and framing**
where they conflict; the look supplies the world around the product, never the product.

Two rules that are not negotiable ([`core/rules.md`](../core/rules.md) §4 and §5):

- **The product is never redesigned.** Not simplified, not restyled, not "improved", not
  swapped for a similar one. Camera, light and environment change around it. A clip where
  the product is no longer recognisably the same product is rejected however good the
  motion was — that check is a permanent line in every acceptance list.
- **A style reference is never a conditioning image.** It informs the prompt *text*. Pass
  it as the image input and it clones its own content into the film.

Write the extraction into `README.md` as a short table — which reference supplied what —
and hold each style reference to at most two rows. One reference supplying everything is a
copy, not an art direction.

---

## Handling each kind

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


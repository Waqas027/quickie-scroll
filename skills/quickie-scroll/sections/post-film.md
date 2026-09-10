# The page after the film — designed, not asked

*What follows the last frame. The skill decides this; the user is never asked to pick
sections. Planned at the close of the interview, implemented at SKILL Step 8, rendered by
the engine's `acts` array.*

**Read with:** [`platforms/web/engine-config.md`](../platforms/web/engine-config.md) ·
[`platforms/web/nextjs.md`](../platforms/web/nextjs.md) ·
[`core/quality.md`](../core/quality.md)

---

## The law

**4 or 5 post-film sections, then a footer. Always. No question is asked.**

The user hired a creative director, not an order-taker. They stated a subject and a look;
what the page needs after the film follows from those, and asking them to tick *statement /
cards / testimonials / CTA* hands the one genuinely creative decision back to the person
who came here to avoid making it.

- **Minimum 4, maximum 5** creative sections. Fewer reads as an unfinished hero; more reads
  as a template.
- **The footer is mandatory** and is *not* one of the 4–5 slots. It is the closing frame.
- **"Film only" is no longer an outcome.** If the user volunteers that they want the film
  and nothing else, that is their call — build it, note it in `README.md`, and still ship
  the footer.
- **Never the default four.** Statement → cards → testimonials → CTA is the shape this
  module exists to prevent. If a plan comes out looking like that, it was not designed.

The engine array is still called `acts` — that is the wire format, not the concept. Don't
rename it; the config key, the CSS classes and the `.d.ts` all depend on it.

---

## Step A–G — how the plan is derived

Run this before writing a single section. It is internal reasoning; the user sees the
result, not the working.

| | | |
|---|---|---|
| **A** | Understand the subject | What is this website actually about — the product, the service, the industry, the audience, the brand's position? Pull from `SUBJECT`, `REFS`, `LOOK`, `PALETTE`, `CHAPTERS[]`. |
| **B** | Identify the primary action | What should the visitor ultimately *do*? buy · book · explore · discover · configure · subscribe · contact · learn · experience. One verb. Everything downstream serves it. |
| **C** | Strongest **content** opportunities | What information becomes valuable only *after* the film has done its emotional work? The film sold the feeling; what does the visitor now need to know? |
| **D** | Strongest **visual** opportunities | What in this subject can become an impressive interactive composition? Not "what section fits" — *what would be worth building*. |
| **E** | Select 4–5 | The strongest combination, not the most complete one. Each must beat the alternatives on its own merits. |
| **F** | Footer | Always. Context-aware — see below. |
| **G** | Validate continuity | Ask: *does every section feel like the same website as the film?* If any one doesn't, redesign it — do not ship it and hope. |

**Every section must justify its existence.** If the honest answer to "why is this here?"
is "sites usually have one", cut it and pick something better.

---

## The plan format — concept-first

For each section, write these ten before implementing anything. This is a scene breakdown,
not a sitemap:

```text
POST-FILM SECTION 01
PRODUCT CONSTELLATION

Purpose        Introduce the complete product range immediately after the hero film.
Why here       The film established the hero product emotionally. This converts that
               emotion into product discovery — the first thing the visitor now wants.
Visual         Large floating product compositions against the same cinematic
               environment; the film's grain and vignette carried through.
Content        6 products, name + one-line + price; images from refs/product/.
Interaction    Products drift into position on scroll; hover expands one and reveals
               its supporting detail.
Motion         Framer Motion spring reveals, image scale, depth offset per layer.
Static?        No — motion is the point here.
Assets         User-supplied product refs. No external sourcing needed.
Transition in  The final film frame stays visible; the first product enters from the
               same direction the camera was last travelling.
Transition out Products settle and darken as the materials section rises beneath them.
```

The quality of this thinking matters more than the section count. Put the finished plan in
`README.md` under **After the film** — it is a design decision, not production status
([`project/documents.md`](../project/documents.md)).

---

## The idea library — a menu, never a template

Draw from these. Invent better ones whenever the subject deserves it. **Nothing here is a
default, and no industry maps to a fixed set.**

```text
Product Showcase        Collection / Range       Interactive Comparison
Feature Explorer        Material Story           Craftsmanship
Ingredient Story        Process Journey          Use Cases
Before / After          Performance Metrics      Specification Explorer
Interactive Configurator  Exploded View          Variant Selector
Experience Explorer     Destination Discovery    Interactive Map
Gallery                 Editorial Story          Journal
Reviews                 Testimonials             Customer Stories
Social Proof            Timeline                 Journey Builder
Location Explorer       Availability             Booking
Purchase                Demo                     Pricing
Contact                 Newsletter               Final Statement
Final CTA
```

**Shape by domain — illustrative only.** These are worked examples of the *level* of
thinking, not lookup tables. Two perfume brands should not get the same five sections.

| Domain | Sections that often earn their place |
|---|---|
| Product | showcase · materials / craft · variants or range · comparison · proof · purchase |
| Food | signature lineup · ingredient & flavour story · combinations · close-up gallery · locations · order |
| Travel | destination discovery · experiences · stays · journey builder · gallery · book |
| Fashion | collection · lookbook · fabric story · editorial campaign · outfit combinations · purchase |
| Automotive | vehicle showcase · model lineup · performance metrics · interior/exterior · configurator · test drive |
| Real estate | property showcase · architecture detail · floor plans · amenities · location · enquiry |
| SaaS / AI | interface showcase · interactive workflow · before/after · use cases · integrations · metrics · demo |
| Fragrance | collection · scent notes · source story · bottle detail · olfactory journey · purchase |

Nothing forces a domain to appear in this table. Sports, entertainment, agencies,
portfolios, services, electronics, hospitality — reason about them the same way.

---

## The narrative arc

A mental model for ordering, **not a mandatory sequence**:

```text
FILM → EMOTION → DISCOVERY → DEPTH → INTERACTION → PROOF / VALUE → ACTION → FOOTER
```

The film already did EMOTION. The 4–5 sections pick up somewhere in DISCOVERY and land on
ACTION. The actual sequence changes with the website — a portfolio may go straight from
discovery to contact; a configurator-led product may put INTERACTION first.

Say the order back to the user once, in a sentence or two, before you build it. Correcting
a plan is cheap; correcting a built page is not.

---

## Continuity — the part that most often breaks

**The first post-film section must visually inherit the film.** There must be no moment of
*"the animation ended and a different website started."*

Inherited, without exception: palette · typography · lighting · gradients · grain · visual
density · imagery style · spacing · accent colours · atmosphere · motion language.

- The **final frame of the film informs the opening composition** of the first section —
  its light direction, its dominant mass, the direction the camera was last moving.
- No hard rule, no colour jump, no full-width white band at the boundary. The engine
  already dims the film and fades its chrome as the sections arrive; don't fight it.
- Carry the film's grain and vignette into at least the first section, then let them
  release gradually.
- At Step 8 you have the real last frame — look at it, and adjust the opening composition
  to it. The plan was drafted before it existed.

---

## Motion rules

The film owns its scroll range ([`core/rules.md`](../core/rules.md) §9). Post-film sections
are ordinary document flow **below** it — never a second scrubbed video, never a second
scroll driver over the film.

Use: Framer Motion / Motion (preferred for the major interactive sections) · CSS animation
· IntersectionObserver · spring physics · scroll-linked transforms below the film · hover
transforms · image parallax · masked reveals · staggered entrances · counters.

**Not every section must move.** A deliberately still section creates rhythm and makes the
moving ones land harder. But **static must be intentional, not lazy** — the plan's
`Static?` line has to say *why*. The majority of the post-film experience carries meaningful
motion when the subject benefits from it.

---

## The quality bar

Sections must belong to the same premium experience as the film. They must **not** read as:

generic landing-page sections · Bootstrap cards · ordinary Tailwind grids · pricing tables
· feature lists · stock testimonials · repetitive image cards · plain FAQ blocks · centred
heading + paragraph + three cards · standard ecommerce grids · unrelated UI components.

The default failure mode is this, and it is never acceptable as a section design:

```text
Heading
Paragraph
3 cards
```

Build instead with: large visual compositions · layered imagery · depth · typography
choreography · scroll reveals · horizontal movement where it fits · masked image reveals ·
scale transitions · parallax · magnetic interaction · spring animation · floating elements
· hover transformation · progressive disclosure · animated counters · interactive
comparison · immersive galleries · contextual transitions · cinematic spacing.

---

## CTA — earned, not automatic

A CTA is added when the site's purpose benefits from one. It may be one of the 4–5
sections, folded into another section, or the final pre-footer moment. **Do not
reflexively append `CTA → Footer` to every build.**

Match it to the primary action from Step B: ecommerce → purchase or order · travel →
booking or exploration · SaaS → demo or signup · portfolio → contact or enquiry ·
editorial → subscribe. A site whose purpose is to be *seen* may need none at all.

## Reviews and testimonials — contextual

Optional. Only when they make sense for this website. When used, never this:

```text
★★★★★  "Great product!"  — John
```

Build a real visual experience: large typography, animated quote transitions, rating
visualisation, product association, horizontal movement, layered depth, subtle motion.

**Never fabricate customer testimonials.** If demo copy is unavoidable, label it as
sample content in the page and note it in `README.md`.

---

## Assets and real-world data

**Prefer the user's supplied assets always.** `refs/product/` is the locked anchor — never
substitute a visually similar unrelated product for an identifiable one
([`core/rules.md`](../core/rules.md) §4).

When a section genuinely needs imagery or data the user didn't supply, sourcing real
material from the internet is allowed where legally and technically appropriate. Then:

- Prefer **real** places, businesses, products and verified information.
- **Do not fabricate real-world entities.** No invented hotels, no invented restaurants, no
  invented specifications, no invented awards.
- **Do not present fictional data as factual**, and never present static data as live.
- Label demo or sample data plainly, in the page and in `README.md`.

If a section can only exist by inventing facts, that section was the wrong choice. Go back
to Step E and pick a better one.

---

## The footer — always, and context-aware

Mandatory, final, never asked about. It should read as the last frame of the experience,
in the film's own visual language.

Decide from the subject what it actually needs: layout · navigation · brand treatment ·
social links · newsletter · legal · contact. **Don't force a newsletter into a project that
has no reason for one, and don't add social links that don't exist.** A footer that lists
empty affordances reads as a template.

Give it a subtle reveal unless a static treatment is genuinely stronger.

---

## Where the sections land in the engine

No engine change is needed for any of this. Four built-in kinds plus one open kind:

| Plan section | Engine |
|---|---|
| A statement-shaped moment | `{ kind:'statement', tone, eyebrow, title, body }` |
| A proof/metric row | `{ kind:'cards', tone, title, cards:[…] }` |
| An email capture | `{ kind:'cta', tone, title, body, placeholder, action }` |
| The footer | `{ kind:'footer', tone, brand, links:[…], note }` |
| **Everything else — most sections** | `{ kind:'html', tone, html }` |

`html` is the workhorse, not the escape hatch: a showcase, a configurator, a map, a
gallery, a comparison and a journey builder all land there, as markup rendered by a React
component in the Next build. Config shapes:
[`platforms/web/engine-config.md`](../platforms/web/engine-config.md).

If a plan produces only `statement` / `cards` / `cta`, that is a signal the plan was
generic — go back to Step D.

# `README.md` — what this project is

*Written once, at the end of the interview. Never carries production status.*

**Read with:** [`project/documents.md`](documents.md) · [`project/brief-template.md`](brief-template.md)

---

```markdown
# <BRAND> — <one-line pitch>

<Two or three sentences: what the website is, what it is for, who it is for.>

A scroll-driven <web | Flutter | web + app> experience: scroll sets the playhead of a
pre-rendered continuous camera move, so the camera genuinely travels and scroll only
drives time. <N> chapters of copy pin over the film, then <the post-film sections> scroll
up over the last frame.

## The build

| | |
|---|---|
| Look | `<look-name>` — <one line, from art-direction/looks.md> |
| Camera | <walkthrough (arch A) / fly-through (arch B) / locked isometric> |
| Chapters | <N> |
| Target | <web 16:9 / app 9:16 / both> |
| Palette | `<bg>` background · `<accent>` accent · <the rest> |
| Type | <Display> / <Body> |
| Assets | **1 still + <N> clips** <(× 2 for the portrait chain)> |
| After the film | <the 4–5 section names, in order, + footer> |
| Asset source | <manual — the prompt pack is the deliverable | automatic via `<tool>`> |

## The journey

| # | Chapter | What the camera does | Headline |
|---|---|---|---|
| 01 | <label> | <one line> | "<title>" |
| 02 | … | … | … |

## After the film

<One line naming the primary visitor action this page is built to reach — buy / book /
explore / configure / contact / …>

| # | Section | Why it's here | Interaction & motion |
|---|---|---|---|
| 01 | <NAME> | <what it does for *this* subject, not "sites usually have one"> | <e.g. scroll-driven reveal, Framer Motion spring; hover expands a product> |
| 02 | … | … | … |
| 03 | … | … | … |
| 04 | … | … | <or: **static — deliberately**, because …> |
| — | Footer | <what it carries and why: links, brand, newsletter only if it earns it> | <subtle reveal / static> |

**Continuity from the last frame:** <how section 01 inherits the film's light, palette and
motion direction.>

<!-- only when a section uses material the user didn't supply -->
**Sourced material:** <what was sourced, from where, and anything labelled as sample data.>

<!-- only when the user supplied references -->
## References

| Reference | Role | What it supplied |
|---|---|---|
| `refs/product/<file>` | **product — locked** | the product itself; shape, colour, materials and markings are held in every shot |
| `refs/style/<file>` | style | <the two things taken from it> |

## How the film is built

One image is generated: the start frame of chapter 1. Every clip after that starts on the
**actual last frame of the clip before it**, extracted from the rendered video — so the
whole film is one continuous take and there is nothing to match by eye.

```
01 → generate the start image → render clip 01 → extract its last frame
02 → render from that frame    → extract its last frame
03 → render from that frame    → …
```

Current status, and what to render next: **`brief.md`**.

## Layout

```
prompts/images/    the one start-frame prompt
prompts/videos/    one .md per clip, numbered in chain order
refs/              user-supplied product and style references
assets/images/     the start still
assets/videos/     the videos you generate — the masters
assets/rejected/   videos that didn't pass, kept for reference
assets/frames/     extracted seam frames (last-NN / first-NN)
public/assets/     encoded, scrub-ready — what the page loads
```

## Running it

```bash
npm run dev            # or: npx serve .
bash build.sh          # encodes assets/videos/ into public/assets/videos/ and prints the config
```
```

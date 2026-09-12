# Chrome — the logo, the nav and the progress rail are designed per build

*The header, the brand mark and the scroll-progress indicator that sit over the film.
Decided at Step 8, alongside the post-film plan, and configured through the engine knobs
below. Never left at their defaults.*

**Read with:** [`engine-config.md`](engine-config.md) · [`sections/post-film.md`](../../sections/post-film.md) ·
[`art-direction/looks.md`](../../art-direction/looks.md) · [`core/rules.md`](../../core/rules.md) §19

---

## Why this file exists

Two builds — a peach drink and an arctic travel brand — shipped with the same accent-gradient
pill mark, the same chip-row nav in the same corner, the same right-side dot rail, the same
`FRAME 000`. The films were completely different; the pages read as one product with two
skins. **The chrome is the first thing a visitor sees and the last thing that should be
shared between builds.**

The engine now has variants for every one of those pieces. Leaving them at their defaults is
a decision, and on most builds it is the wrong one.

---

## The law

**Every build designs its own chrome.** Before configuring the engine, choose — and record
in `README.md` — a value for each of the five:

| | Choose from | Default if you don't |
|---|---|---|
| **Brand mark** | an inline SVG lockup designed for this brand · wordmark only (`mark:false`) | the generic accent pill — the shape that made two builds look alike |
| **Nav** | `'pills'` · `'plain'` · `'numbers'` · `false` | `'pills'` |
| **Nav position** | `navPlace:'right'` · `'center'` | `'right'` |
| **Progress rail** | `route:'dots'` · `'bars'` · `'numbers'` · `'labels'` · `false` | `'dots'` |
| **Rail side** | `routeSide:'right'` · `'left'` | `'right'` |

**No two consecutive builds may ship the same combination.** If the combination you land on
is `pill mark + pills + right + dots + right`, that is the default shape — reason again.

---

## The brand mark

`brand.mark` takes a raw SVG/HTML string and renders it as-is, with no pill behind it.

Design it from the brand name and the subject, in the film's own visual language — the same
palette, the same weight, the same era. It is drawn once, by hand, as inline SVG:

```js
brand: {
  name: 'Cloudbase',
  mark: '<svg viewBox="0 0 28 28" fill="none" aria-hidden="true">' +
        '<path d="M4 18h20M7 13h14M11 8h6" stroke="currentColor" stroke-width="1.5"/></svg>',
}
```

The mark inherits `currentColor` from the brand link, so it picks up the look's ink
automatically. Keep it to roughly a 28px box; the CSS sizes it to the topbar.

**Wordmark-only is a real answer.** For an editorial, fashion or fragrance look a typeset
wordmark with no mark at all is usually stronger than any glyph — `mark: false`.

**What not to do:** don't reuse a previous build's mark, don't emit an emoji, don't ship a
generic circle/triangle/hexagon that says nothing about the subject, and don't ship the
default pill because the interview didn't mention a logo.

If the user supplied a real logo, use it (`refs/product/`, `<img>` or inline SVG) and design
nothing — [`core/rules.md`](../../core/rules.md) §4 applies to the logo too.

---

## The HUD system label must not repeat the brand name

`hud.system` renders directly under the brand lockup. Setting it to the brand name plus a
descriptor prints the name twice, 44px apart, and reads as a bug:

```text
CLOUDBASE                  ← brand
CLOUDBASE / 64°N DESCENT   ← hud.system — wrong
```

Make it instrumentation, not branding: a scene/system/coordinate readout the film could
plausibly carry — `64°N · DESCENT`, `REEL 01 / ORCHARD`, `FIELD VESSEL / 01`. Or omit
`hud.system` entirely and keep the frame counter.

---

## Picking the nav

| Variant | Reads as | Fits |
|---|---|---|
| `'pills'` | a product site's chapter switcher | consumer product, food, retail, app |
| `'plain'` | editorial masthead navigation | fashion, editorial, architecture, fragrance |
| `'numbers'` | a reel index; expands the active title only | long chapter titles, travel, documentary, automotive |
| `false` | nothing but the brand — the film carries it | single-chapter films, art direction where any chrome intrudes |

`navPlace:'center'` puts the nav on the centre line with the brand left and the top CTA
right — a different silhouette from the same parts, and the cheapest genuine variation
available.

---

## Picking the progress rail

This is the "journey indicator" a visitor uses to know where they are in the film. It must
track the active chapter and jump to it on click — all five variants already do.

| Variant | Reads as | Fits |
|---|---|---|
| `'dots'` | a scroll journey | product walkthroughs, short films |
| `'bars'` | a footage/timecode ladder | cinematic, technical, automotive, documentary |
| `'numbers'` | a chapter index | editorial, long-form, travel |
| `'labels'` | an open chapter list, no hover required | text-led films, accessibility-first builds, few chapters |
| `false` | no indicator | 1–2 chapters, or a look where any rail intrudes |

`routeSide:'left'` is available whenever the chapter copy sits right (`align:'right'`) —
put the rail opposite the copy, not on top of it.

**Never leave a rail that a visitor can't read.** The label chip draws from the look's
`--sw-bg`/`--sw-ink`, so it contrasts on any palette; if you override those variables, check
the active chapter's label against the brightest frame of the film.

---

## Chapter-one composition

`align` is a chrome decision too. The first chapter sets the site's silhouette, and
`align:'left'` on chapter 1 of every build is why films with nothing in common open
identically.

Choose chapter 1's alignment from the start frame: put the copy where the frame has mass to
carry it and the subject has none. A centred opening over a symmetric frame, a right-aligned
opening over a left-weighted landscape, a left opening over a right-weighted product — all
three are correct for different films, and picking one per build is free.

Then alternate down the list as
[`animation/scene-planning.md`](../../animation/scene-planning.md) already requires.

---

## Record it

In `README.md`, under the design decisions, one short block:

```markdown
### Chrome
Mark        Inline SVG — three horizon rules, thinning upward (descent through cloud).
Nav         'numbers', centre — chapter titles are long, and centring balances the mark.
Rail        'bars', left — reads as a footage counter; left keeps it off the right-aligned
            copy in chapters 2 and 4.
HUD         system '64°N · DESCENT', frames on, brackets off.
Chapter 1   align 'right' — the start frame's sun sits left.
```

A build with no chrome block in its README was not designed; it inherited.

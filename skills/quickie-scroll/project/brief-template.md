# `brief.md` — where production currently is

*Rewritten every time an asset lands. One screen, always.*

**Read with:** [`project/documents.md`](documents.md) · [`project/handoff-loop.md`](handoff-loop.md)

---

One status table, one next action, and short notes. That is the whole file.

```markdown
# Production — <BRAND>

**Next:** <the single next thing to do, in one line. e.g. "render clip 03 from
`assets/frames/last-02-kettle.png` using `prompts/videos/03-cellar.md`">

## Start image

| Prompt | Output | Status |
|---|---|---|
| `prompts/images/01-<slug>.md` | `assets/images/01-<slug>.png` | ✅ accepted |

## Clips

| # | Prompt | Start frame | Output | Status |
|---|---|---|---|---|
| 01 | `prompts/videos/01-<slug>.md` | `assets/images/01-<slug>.png` | `assets/videos/01-<slug>.mp4` | ✅ accepted |
| 02 | `prompts/videos/02-<slug>.md` | `assets/frames/last-01-<slug>.png` | `assets/videos/02-<slug>.mp4` | 🔄 rendering |
| 03 | `prompts/videos/03-<slug>.md` | `assets/frames/last-02-<slug>.png` | — | ⛔ blocked on 02 |

Status is one of: ⛔ blocked · ⬜ ready to render · 🔄 rendering · ❌ rejected · ✅ accepted.
A clip is **blocked** until the clip before it is accepted and its `last-` frame extracted —
that dependency is the whole point of the table.

## After the film

The plan itself is in `README.md`; this tracks whether it is built. Add the rows once the
plan exists — one per section plus the footer.

| # | Section | Status |
|---|---|---|
| 01 | <NAME> | ⬜ not built |
| … | … | … |
| — | Footer | ⬜ not built |

Section 01 stays ⛔ blocked until the last clip is accepted — its opening composition is
matched to the film's real final frame.

## Notes

- <one line per thing worth carrying forward: a rejection and its cause, a drift between a
  FINAL FRAME line and the real frame, a model that keeps refusing a word>
```

Keep `## Notes` to the handful of lines that still affect what to do next. A cause worth
remembering ("this model adds a dissolve whenever the prompt says 'transition'") stays; a
resolved re-roll from three chapters ago goes.


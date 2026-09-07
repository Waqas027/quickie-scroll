# The two project documents

*Two markdown documents at the project root, and they do not overlap.*

**Read with:** [`project/readme-template.md`](readme-template.md) · [`project/brief-template.md`](brief-template.md) · [`project/handoff-loop.md`](handoff-loop.md)

---

Every build writes exactly two markdown documents at the project root, and they do not
overlap:

| File | Answers | Changes |
|---|---|---|
| `README.md` | **What this project is** | Once, at the start. Only when a decision changes. |
| `brief.md` | **Where production currently is** | Every time an asset lands. |

The split exists because they have different readers and different lifespans. `README.md`
is read by someone who has never seen the project; `brief.md` is read by you, next session,
to work out what to do next. Mixing them produces the failure this replaces: a 300-line
README nobody can skim, where the one line that matters ("clip 03 is next") is buried under
rejection history.

**Never put production status in `README.md`.** No accepted/rejected, no take letters, no
prompt-testing history, no "ready for the next scene", no regeneration log. If it changes
when a file lands, it belongs in `brief.md`.

Both files stay short. `README.md` fits on a screen and a half. `brief.md` fits on one
screen, and the user must be able to tell the current state within a few seconds of opening
it — if it stops passing that test, delete history from the bottom, do not add headings.


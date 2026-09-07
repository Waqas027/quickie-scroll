# §7 — Known automatic backends

*Which tool renders the pixels, and what each one costs.*

**Read with:** [`video/rendering.md`](../video/rendering.md) · [`pipeline/scripts.md`](scripts.md)

---

The pipeline above doesn't care what renders the pixels. Three paths are worth knowing:

- **A connected MCP / CLI** (Higgsfield, Monid, Codex `image_gen`, Replicate, fal, …) —
  detect it at Step 2 of the SKILL, confirm with the user before spending anything, and
  call it in place of the `--- render here ---` comments. The one hard requirement is
  **start-frame conditioning** (plus end-frame for architecture B connectors); a
  reference-only image input cannot hold a seam and disqualifies the model.
- **Higgsfield + Monid specifically** — the `lets-scroll` skill carries the fully
  worked CLI flag sets, the model capability table (`seedance_2_0` / `kling3_0` /
  `seedance_2_0_mini`), the Monid `sfs` upload dance for passing frames by URL, and the
  per-clip cost table. If those tools are the chosen backend, follow that reference for
  the flags rather than reinventing them here.
- **Manual** — the prompt pack *is* the deliverable. Hand over the spec table (SKILL
  Step 6), validate each drop with §5, continue unchanged.

Two rules hold on every backend:

1. **One model for the whole chain.** Each renderer has its own grain, motion and colour
   character; a model swap mid-chain keeps position continuity but the character shift
   reads as a pop. The one sanctioned exception is a single clip a content filter keeps
   refusing.
2. **Always run generations detached and poll.** Video generations take 3–8 minutes; a
   foreground blocking call for eleven clips is an hour of a dead terminal.

## Notes

- **Previz cheaply.** Run the whole chain at the lowest tier / resolution first, approve
  the journey and the pacing, then re-render the final legs at full quality. The chain is
  seamless at every tier, so the previz translates directly.
- **Never overwrite `$VID`.** Encodes go to `$SERVE` and are reproducible; a render costs
  money and minutes.
- **Keep the rejects.** `assets/rejected/` is why the next prompt is better than the last.
- **Keep the frames.** `first-NN.png` is chapter *n*'s poster and reduced-motion still;
  `last-NN.png` is the next clip's start image and the style reference for its re-roll.
- **bash 3.2** (macOS default) has no associative arrays — none are used here.
- **zsh arrays are 1-indexed.** Run every array-driven step as `bash script.sh`, never
  pasted into an interactive zsh, or the chain grabs the wrong chapter's frames.

# Rendering — who renders, and at what cost (SKILL Step 4)

*Only reached after the prompt pack exists. Nothing renders before the user approves an
estimate.*

**Read with:** [`core/bootstrap.md`](../core/bootstrap.md) ·
[`pipeline/backends.md`](../pipeline/backends.md) · [`core/quality.md`](../core/quality.md)

---

## Ask before spending

If Step 0 found a connected renderer, offer it plainly — *"I found `<tool>` connected. Want
me to generate the images and clips with it?"* — with the estimated workload and, where the
tool exposes pricing, the estimated cost. Get an explicit go.

## The one capability requirement: start-frame conditioning

The model must accept a first/start image, and for architecture B connectors also an end
image. A model whose image input is *reference-only* can condition a generation but cannot
continue a shot, so it physically cannot hold a seam — decline it with a one-line why and
use one that can. **Never ship a non-seamless build to satisfy a model preference.**

## One model for the entire chain

Every renderer has its own grain, motion and colour character. Swapping mid-chain preserves
position continuity — the frames still hand off — but the character shift reads as a subtle
pop. The one sanctioned exception is a single clip a content filter keeps refusing.

## Run detached, always

Video generations take 3–8 minutes each. Run every generation detached and poll it; a
foreground blocking call for eleven clips is an hour of a dead terminal.

## Previz cheaply

Run the whole chain at the lowest tier first, approve the journey and the pacing, then
re-render the final legs at full quality. The chain is seamless at every tier, so previz
translates directly. Suggest it unprompted when the budget reads tight.

Backend specifics — Higgsfield / Monid / Codex CLI flag sets, model capability tables, cost
tables: [`pipeline/backends.md`](../pipeline/backends.md).

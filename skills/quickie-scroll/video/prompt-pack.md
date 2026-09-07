# The prompt pack — layout and format

*Where prompt files go and what format they take. Written before any rendering, on both asset paths.*

**Read with:** [`video/prompting.md`](prompting.md) · [`image/start-frame.md`](../image/start-frame.md) · [`project/documents.md`](../project/documents.md)

---

**One still, N clips.** The chain only ever needs one generated image: the start frame of
scene 1. Every scene after it starts on the *previous clip's actual last frame*, so
generating stills 2…N is wasted money and actively harmful — a re-rendered still never
matches a rendered frame, and using one breaks the seam.

```
<project>/
  README.md                     ← what this project is (see project/documents.md)
  brief.md                      ← where production currently is (see project/documents.md)
  prompts/
    images/
      01-<slug>.md              ← THE ONLY IMAGE PROMPT — scene 1's start frame
      00-product-plate.md       ← optional, only when a product reference needs cleaning up
    videos/
      01-<slug>.md              ← one file per clip, in chain order
      02-<slug>.md
      …
      conn-01.md                ← architecture B only
  refs/
    product/                    ← user-supplied product images — the locked anchor
    style/                      ← user-supplied design/style references
  assets/
    images/    01-<slug>.png    the one start still
    videos/    NN-<slug>.mp4    the videos you generate — the masters
    rejected/  NN-<slug>-takeA.mp4 + a one-line why
    frames/    last-NN.png / first-NN.png — extracted seam frames
```

`first-NN.png`, extracted from each accepted clip, **is** chapter *n*'s poster and its
reduced-motion still. That is why chapters 2…N need no image prompt: their stills fall out
of ffmpeg for free, and they match the film exactly.

Rules, all of them deliberate:

- **`.md`, not `.txt`.** These files are read by humans in an editor — they need headings,
  a copy-paste fenced block, and a checklist. A `.txt` file gets pasted wholesale into a
  prompt box, front-matter and all.
- **Numbered `NN-slug` filenames.** The number is the chain order. Sorting the folder must
  produce the generation order, because clip *n* depends on clip *n−1*'s last frame.
- **One prompt per file.** The unit of work is one generation.
- **Every file is self-contained**: the full preamble, the aspect ratio, the duration, the
  conditioning frame it needs, and the exact output filename. A prompt file must work when
  it's the only thing on screen, weeks later, in a tool nobody chose yet.

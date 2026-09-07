# Pipeline — copy-paste scripts (bash 3.2 safe)

*Renderer-agnostic ffmpeg and file plumbing: §0 setup, §1 pack, §2 the start still, §3 clips, §4 connectors, §5 validation.*

**Read with:** [`pipeline/encoding.md`](encoding.md) · [`pipeline/backends.md`](backends.md) · [`animation/chain.md`](../animation/chain.md)

---

The project **is** the work folder. There is no `/tmp` scratch dir and no `raw/` staging
folder: the prompt pack, the videos, the encodes and the extracted frames all live under
the project in the layout `video/prompt-pack.md` defines, so a build can be handed off, paused,
resumed or re-rolled weeks later without reconstructing where anything was.

**One video folder.** `assets/videos/` holds the masters exactly as the tool returned
them; `assets/rejected/` holds the takes that failed review; `public/assets/videos/` holds
the encodes the page loads. Nothing is encoded in place, so the masters stay untouched.

Everything here except §7 is **renderer-agnostic** — it is ffmpeg and file plumbing, and
it runs identically whether the clips came from a connected MCP, a CLI, or the user
pasting prompts into a web UI by hand.

## 0. Setup

```bash
PROJ=./velune-paris              # the project root
PROMPTS="$PROJ/prompts"          # prompts/images/01-*.md (one) + prompts/videos/*.md
ASSETS="$PROJ/assets"            # images/ videos/ rejected/ frames/
VID="$ASSETS/videos"             # ONE video folder: the masters, as the tool returned them
SERVE="$PROJ/public/assets/videos"   # encoded, scrub-ready — what the page loads
mkdir -p "$PROMPTS/images" "$PROMPTS/videos" "$PROJ/refs/product" "$PROJ/refs/style" \
         "$ASSETS/images" "$VID" "$ASSETS/rejected" "$ASSETS/frames" "$SERVE"

# Ordered chapter slugs. The index IS the chain order — clip NN starts on clip NN-1's
# actual last frame — so this list is the spine of the build. Last one is the finale.
NAMES="threshold clouds city house kitchen"

# NN-slug naming. Sorting any folder must reproduce the chain order.
idx() { i=0; for n in $NAMES; do i=$((i+1)); if [ "$n" = "$1" ]; then printf '%02d' $i; return; fi; done; }
f()   { printf '%s-%s' "$(idx "$1")" "$1"; }          # -> 03-city

# Pull the prompt out of a .md prompt file: the contents of the ```text fence.
# This is why prompt files can be markdown and still be machine-readable.
pf()  { awk '/^```text$/{i=1;next} /^```$/{i=0} i' "$1"; }

ASPECT=16:9 ; LEG_DUR=8 ; CONN_DUR=5      # web target
# ASPECT=9:16 ; LEG_DUR=6 ; CONN_DUR=4    # app target / native mobile chain
```

Verify the extractor before trusting it — a silently-empty prompt renders a silently
wrong clip:

```bash
pf "$PROMPTS/videos/01-threshold.md" | head -3    # must print the prompt, not nothing
```

## 1. Write the prompt pack

**One image prompt, N video prompts.** Chapters 2…N take their start frame from the
previous clip's rendered last frame, so they need no still. Templates in `image/start-frame.md` and `video/prompting.md`;
`README.md` and `brief.md` come from `project/documents.md`.

Do not write all N video prompts up front on the manual path — write clip 1, and write
each later clip from the *real* `last-` frame that came back (`video/continuity.md` → "Writing clip
*n* from clip *n−1*").

```bash
first=$(set -- $NAMES; echo "$1")
: > "$PROMPTS/images/$(f "$first").md"     # the ONLY image prompt
: > "$PROMPTS/videos/$(f "$first").md"
ls "$PROMPTS/videos"                       # sorted == chain order. If not, fix NAMES.
```

## 2. The one start still

One image: chapter 1's start frame, carrying the look preamble and — when a product
reference exists — the product lock clause. It lands as `$ASSETS/images/01-slug.png`.

Validate it **before** any video renders. Everything downstream inherits its grade, its
light and its lens, so a wrong-aspect or off-look still poisons the entire film:

```bash
p="$ASSETS/images/$(f "$first").png"
[ -f "$p" ] || echo "MISSING $p"
ffprobe -v error -select_streams v -show_entries stream=width,height -of csv=p=0 "$p" \
  | awk -F, '{r=$1/$2; printf "%sx%s  ratio %.3f %s\n", $1,$2,r,
      (r>1.4&&r<1.6 ? "ok 3:2" : (r>0.5&&r<0.6 ? "ok 9:16" : "*** WRONG ASPECT ***"))}'
```

Also check by eye: no text in frame, subject centred, **the direction the camera will
travel visible in frame**, and — with a product reference — shape, colour, materials and
markings matching the reference. Re-roll here rather than anywhere later; it is the
cheapest re-roll in the build.

Chapters 2…N get their posters from §3 for free.

Optional webp posters (smaller; the page uses these as the video posters):

```bash
for p in "$ASSETS/images"/*.png "$ASSETS/frames"/first-*.png; do
  [ -f "$p" ] && cwebp -quiet -q 84 -resize 1800 0 "$p" -o "${p%.png}.webp"
done
```

## 3. Clips — architecture A (continuous forward take)

Strictly **sequential**: leg 1 starts from chapter 1's still; every later leg starts from
the **previous leg's actual last frame**. This is the whole seamlessness mechanism.

```bash
prev=""
for n in $NAMES; do
  if [ -z "$prev" ]; then start="$ASSETS/images/$(f "$n").png"
  else                    start="$ASSETS/frames/last-$(f "$prev").png"; fi
  echo "render $(f "$n"): prompt=$PROMPTS/videos/$(f "$n").md  start=$start"
  # --- render here (§7), or the user renders manually and drops the file into
  #     $VID/$(f "$n").mp4 — one video folder, no raw/ staging ---

  # REVIEW IT FIRST (§5). Only after it is accepted, extract its boundary frames:
  # the last frame is the next leg's start image, so the chain cannot advance without it.
  ffmpeg -v error -y -ss 0        -i "$VID/$(f "$n").mp4" -frames:v 1 -q:v 2 "$ASSETS/frames/first-$(f "$n").png"
  ffmpeg -v error -y -sseof -0.15 -i "$VID/$(f "$n").mp4" -frames:v 1 -q:v 2 "$ASSETS/frames/last-$(f "$n").png"
  prev="$n"
done
```

`first-NN.png` is chapter *n*'s poster and reduced-motion still — that is the whole reason
the build needs only one generated image.

**Eyeball `last-NN-slug.png` before rendering the next leg.** It should read as a frame
from a calm forward glide — not mid-orbit, not motion-blurred sideways. A bad handoff
frame poisons every leg after it, so re-roll here, not three legs later.

Rejecting a clip is a `mv`, not a delete — keep it, it is evidence for the next prompt:

```bash
rej() { # rej 02-kettle takeB "added a dissolve at 4s"
  mv "$VID/$1.mp4" "$ASSETS/rejected/$1-$2.mp4"
  echo "- $1-$2: $3" >> "$PROJ/brief.md"
}
```

Never extract frames from a rejected clip, and never advance the chain past one.

## 4. Connectors — architecture B only

Skip entirely for architecture A. Connector *i* runs from leg *i*'s last frame to leg
*i+1*'s first frame, both extracted from the **rendered videos**, never from the stills.

```bash
set -- $NAMES ; i=0 ; prev=""
for n in "$@"; do
  if [ -n "$prev" ]; then
    i=$((i+1))
    echo "conn-$(printf '%02d' $i): start=$ASSETS/frames/last-$(f "$prev").png  end=$ASSETS/frames/first-$(f "$n").png"
    # --- render -> $VID/conn-$(printf '%02d' $i).mp4 ---
  fi
  prev="$n"
done
```

Acceptance: the **start** frame must be obeyed exactly; the **end** frame only has to land
on the same composition (the engine's crossfade covers a near-miss). A start frame that
drifted means the tool ignored the conditioning image — re-render it; no crossfade fixes
a wrong start.

## 5. Validate every clip before encoding

The three failures that survive to production if you skip this: wrong aspect, an ignored
start frame, and a burnt-in watermark.

```bash
for v in "$VID"/*.mp4; do
  b=$(basename "$v" .mp4)
  ffprobe -v error -select_streams v -show_entries stream=width,height,nb_frames \
          -show_entries format=duration -of csv=p=0 "$v" | tr '\n' ' '
  echo "  <- $b"
done

# frame 0 vs the start frame it was given (arch A: the previous leg's last frame).
# Compare by composition, not by a PSNR threshold: a correctly frame-locked seam still
# reads ~18-25 dB from codec shimmer alone. A real mismatch shows as different content.
seamcheck() { # rendered.mp4  expected-start.png
  ffmpeg -v error -y -ss 0 -i "$1" -frames:v 1 "/tmp/f0.png"
  # -v error would suppress the psnr summary line — it logs at info level
  ffmpeg -hide_banner -i "/tmp/f0.png" -i "$2" -lavfi psnr -f null - 2>&1 | grep -o "average:[0-9.]*"
}
```

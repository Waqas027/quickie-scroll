# §6 — Encoding for scrubbing (SKILL Step 7)

*Seek cost is the only thing that matters. §6 web, §6b portrait, §6c app frame sequences.*

**Read with:** [`pipeline/scripts.md`](scripts.md) · [`platforms/flutter/flutter.md`](../platforms/flutter/flutter.md)

---

Scrubbing sets `currentTime` every frame, so **seek cost** is the only thing that
matters. Two knobs: a small GOP (cheap seeks) and native resolution (don't downscale a
1080p render — the softness is already the limiting factor).

```bash
enc() { ffmpeg -v error -y -i "$1" -an -vf "unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "$2"
  echo "enc $(basename "$2") $(du -h "$2" | cut -f1)"; }

for n in $NAMES; do enc "$VID/$(f "$n").mp4" "$SERVE/$(f "$n").mp4"; done
for c in "$VID"/conn-*.mp4; do [ -f "$c" ] && enc "$c" "$SERVE/$(basename "$c")"; done
```

Do **not** use all-intra: it bloats an 8s clip to ~25 MB for no gain, because the engine
loads each clip as a Blob (always fully seekable) rather than depending on the host
serving HTTP byte ranges. `-g 8` is ~8 MB and scrubs identically.

Now the engine config reads `sections[k].clip = '/assets/videos/NN-slug.mp4'` and
`connectors = ['/assets/videos/conn-01.mp4', …]` (length N−1, in order) — paths into
`public/`, absolute from the web root. For the standalone `index-template.html` preview,
point `$SERVE` at a sibling folder and drop the leading slash.

### 6b. Native 9:16 portrait encodes

The mobile version is a **separately-composed portrait chain**, not a crop. Render it
from portrait stills with portrait prompts (`video/prompting.md` → Portrait), then:

```bash
encm() { ffmpeg -v error -y -i "$1" -an -vf "scale=720:-2,unsharp=5:5:0.6:5:5:0.0" \
  -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
  -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$2"; }
for n in $NAMES; do encm "$VID/$(f "$n")-p.mp4" "$SERVE/$(f "$n")-m.mp4"; done
```

`-g 4` (twice the keyframes) roughly halves a phone decoder's seek work; 720-wide roughly
halves the bytes on cellular. Wire as `clipMobile` / `connectorsMobile`, and extract each
portrait clip's first frame as its `stillMobile` poster so the page never flashes from a
landscape poster to a portrait video.

If credits or budget can't cover a portrait chain, the fallback is a centre-crop
(`crop=ih*9/16:ih`) of the landscape master — but that shows phones the middle ~26% of
every frame, so it must be **called out to the user and approved**, never shipped
silently as "the mobile version".

## 6c. Flutter frame sequences (app target)

The app scrubs an image sequence, not video — see `platforms/flutter/flutter.md` for why.

```bash
for n in $NAMES; do
  d="$PROJ/app/assets/frames/$(f "$n")"; mkdir -p "$d"
  ffmpeg -v error -y -i "$VID/$(f "$n")-p.mp4" -vf "fps=12,scale=720:-2" -q:v 4 "$d/%03d.jpg"
  echo "$(f "$n") frameCount=$(ls "$d" | wc -l | tr -d ' ')"
done
```

The printed `frameCount` goes verbatim into each `Chapter(...)`; a mismatch shows on
device as a stall at the end of that chapter.

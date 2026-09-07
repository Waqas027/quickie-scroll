# The app target — scroll-driven Flutter / Android

*SKILL Step 8, app target — chosen when the Step 0 probe reports FLUTTER or BOTH.*

**Read with:** [`pipeline/encoding.md`](../../pipeline/encoding.md) §6c · [`platforms/android/android.md`](../android/android.md) · [`core/bootstrap.md`](../../core/bootstrap.md)

---

Everything upstream is shared with the web target: the same interview, the same look, the
same prompt pack, the same seamless-chain law. Only three things change.

| | Web | App |
|---|---|---|
| Aspect | 16:9 landscape | **9:16 portrait, natively composed** |
| Clip length | 8 s legs / 5 s connectors | **5–6 s** per chapter |
| Playback | `video.currentTime` scrub via blob | **pre-extracted JPEG frame sequence** |

## Why frames instead of `video_player`

`video_player` wraps ExoPlayer (Android) and AVPlayer (iOS). A `seekTo` costs a decode
from the nearest keyframe — 60–120 ms on a mid-range Android even with a tight GOP. A
scroll fling issues seeks far faster than that, they queue, and the frame visibly
freezes. It is the same failure the web engine solves with blob loading and seek
coalescing, except on device there is no equivalent escape hatch.

An image sequence has no keyframe dependency: every frame is independent, precacheable,
and paints in one raster pass. It also removes every pub dependency — the scaffold is
pure Flutter.

The cost is disk. At 720×1280, q=4 JPEG, a frame is ~55–75 KB:

| fps | 5 s chapter | 6 chapters |
|---|---|---|
| 8 | 40 frames ≈ 2.6 MB | ≈ 16 MB |
| 12 (default) | 60 frames ≈ 4 MB | ≈ 25 MB |
| 16 | 80 frames ≈ 5.3 MB | ≈ 32 MB |

12 fps is the default because scroll-scrubbed motion is driven by the *hand*, not by a
clock — the eye reads it as smooth well below video frame rates. Drop to 8 before you
reach for video.

## Producing the frames

From the same 9:16 clips the mobile web chain uses:

```bash
for f in assets/videos/*.mp4; do
  name=$(basename "$f" .mp4)
  mkdir -p "assets/frames/$name"
  ffmpeg -v error -i "$f" -vf "fps=12,scale=720:-2" -q:v 4 "assets/frames/$name/%03d.jpg"
  echo "$name: $(ls "assets/frames/$name" | wc -l) frames"
done
```

The printed count is the `frameCount` for that chapter — pass it verbatim; a mismatch
shows as a stall at the end of the chapter.

## Wiring

`pubspec.yaml`:

```yaml
flutter:
  assets:
    - assets/frames/01-threshold/
    - assets/frames/02-clouds/
    # …one line per chapter directory. Flutter does not recurse.
```

`lib/main.dart`:

Note the absence of `const` on `MaterialApp`: `ScrubTheme.dark` and the `ActSpec.*`
builders are factory constructors (an `ActSpec` holds a closure), so they cannot appear
inside a const tree. `chapters` is `const` because `Chapter` is a plain const class.

```dart
import 'package:flutter/material.dart';
import 'scroll_scrub.dart';

void main() => runApp(MaterialApp(
      debugShowCheckedModeBanner: false,
      home: ScrollScrubPage(
        brand: 'VELUNE',
        theme: ScrubTheme.dark(accent: const Color(0xFFE9C77E)),
        hud: const HudSpec(system: '01 — THE THRESHOLD', verb: 'scroll to descend'),
        chapters: const [
          Chapter(
            frameDir: 'assets/frames/01-threshold',
            frameCount: 60,
            scroll: 1.5,
            eyebrow: '01 — THE THRESHOLD',
            title: 'Paris begins before you land.',
            body: 'Private arrivals, after-dark tables, the city revealed at your pace.',
            tags: ['Private arrival', 'Concierge'],
            align: Alignment.bottomLeft,
          ),
          // …one per chapter; alternate `align`
        ],
        acts: [
          ActSpec.statement(
            eyebrow: 'A city, edited for you',
            title: 'The moments between the landmarks matter most.',
          ),
          ActSpec.cta(title: 'Tell us how you want the city to feel.', label: 'Begin'),
        ],
      ),
    ));
```

Copy `scroll_scrub.dart` into `lib/`. No `pubspec` dependencies to add.

**Requires Flutter 3.27+ / Dart 3.0+.** The scaffold uses `Color.withValues(alpha:)`
(Flutter 3.27, replacing the deprecated `withOpacity`) and record types for the card
tuples. On an older SDK, swap `withValues(alpha: x)` → `withOpacity(x)` and
`List<(String, String)>` → a small class; nothing else changes.

## App size

The frames are the smallest part of the download. Measured on a 2-chapter probe build
(96 frames each at 720×1280 q=4, 2.4 MB of assets total): the **debug** APK came out at
152 MB, because a debug build bundles unstripped native libraries for every ABI. Ship
release, split per ABI:

```bash
flutter build apk --release --split-per-abi
```

That is the number to quote to a client — not the debug figure. Budget the frames on top
of it using the fps table above.

## QA on device

- **Fling the whole film.** Frames must track the finger with no white flash.
  `gaplessPlayback: true` on the `Image` is what prevents the flash — do not remove it.
- **Check the first paint.** The opening frame is precached in `didChangeDependencies`;
  if you see a flash on cold start, the asset path in `pubspec.yaml` is wrong (Flutter
  fails silently on a missing asset directory).
- **Watch memory** in DevTools while scrolling the full film. Flutter's image cache is
  100 MB / 1000 objects by default; a 6-chapter film at 12 fps fits. If a larger build
  evicts and re-decodes visibly, raise it once at startup:
  `PaintingBinding.instance.imageCache.maximumSizeBytes = 200 << 20;`
- **Scroll past the film into the acts.** The pinned copy and HUD must disappear and the
  film must dim — that handover is the `past` flag in the scaffold.
- **Rotate.** The film is composed 9:16; lock portrait unless the build deliberately
  ships a landscape chain too:
  `SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);`

## What does not change

The seamless-chain law (SKILL Step 5) is identical. Each chapter's first frame must be
the previous chapter's actual last frame, or the film cuts. Frame extraction makes this
easier to verify, not harder — compare `NN/001.jpg` against the previous chapter's last
numbered frame directly, with no decoding involved.

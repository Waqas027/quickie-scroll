# The app target — native Android (Jetpack Compose)

*SKILL Step 8, app target — chosen when the Step 0 probe reports ANDROID.*

**Read with:** [`pipeline/encoding.md`](../../pipeline/encoding.md) §6c · [`platforms/flutter/flutter.md`](../flutter/flutter.md) · [`core/bootstrap.md`](../../core/bootstrap.md)

---

Used when the user wants a mobile app and **Flutter is not installed but an Android SDK
is**. If Flutter is available, prefer it (`platforms/flutter/flutter.md`) — one codebase, and the
scaffold there is smaller. This path exists so "or Android" is a real option rather than a
claim.

Everything upstream is shared: same interview, same look, same prompt pack, same
seamless-chain law, same 9:16 portrait assets, same frame-sequence mechanism and the same
reason for it (`platforms/flutter/flutter.md` → *Why frames instead of video_player* — on Android the
player is ExoPlayer either way, and a `seekTo` costs a decode from the nearest keyframe).

## Scaffold

Android Studio → **New Project → Empty Activity** (Compose), or:

```bash
# If Android Studio isn't being used, the SDK's own tooling is enough to build,
# but generating a project from the CLI is not supported — create it in Studio,
# or copy an existing Compose template.
```

`app/build.gradle.kts` — nothing beyond the Compose defaults:

```kotlin
android {
    compileSdk = 35
    defaultConfig { minSdk = 24; targetSdk = 35 }
    buildFeatures { compose = true }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2025.01.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.activity:activity-compose:1.9.3")
    // No Coil, no Glide, no ExoPlayer. The scaffold uses AssetManager +
    // BitmapFactory only.
}
```

## Frames go in `assets/`, not `res/`

```
app/src/main/assets/frames/
  01-threshold/001.jpg … 060.jpg
  02-clouds/001.jpg    … 060.jpg
```

`assets/` because `res/drawable` requires a legal resource id per file — hundreds of
generated `ch01_001` identifiers, recompiled on every re-roll. `AssetManager` reads by
path, so a re-roll is a file copy.

Produce them from the same 9:16 clips the web build uses (`pipeline/encoding.md` §6c, retargeted):

```bash
for f in assets/videos/*-p.mp4; do
  name=$(basename "$f" -p.mp4)
  d="app/src/main/assets/frames/$name"; mkdir -p "$d"
  ffmpeg -v error -y -i "$f" -vf "fps=12,scale=720:-2" -q:v 4 "$d/%03d.jpg"
  echo "$name frameCount=$(ls "$d" | wc -l | tr -d ' ')"
done
```

The printed `frameCount` goes verbatim into each `Chapter(...)`. A mismatch shows on
device as a stall at the end of that chapter.

## Wiring

Copy `ScrollScrub.kt` into `app/src/main/java/<your package>/` and fix the `package` line
to match. Then:

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // The film is composed 9:16 — lock portrait unless a landscape chain
        // was also commissioned.
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        enableEdgeToEdge()
        setContent {
            ScrollScrubScreen(
                brand = "MERIDIAN",
                theme = ScrubTheme(accent = Color(0xFFE9C77E)),
                hud = HudSpec(system = "01 — THE THRESHOLD", verb = "scroll to descend"),
                chapters = listOf(
                    Chapter(
                        frameDir = "frames/01-threshold",
                        frameCount = 60,
                        scroll = 1.5f,
                        eyebrow = "01 — THE THRESHOLD",
                        title = "Home starts before you land.",
                        body = "A night flight, the cabin dimmed, the cloud tops glowing below.",
                        tags = listOf("Night arrivals", "Lie-flat"),
                        align = CopyAlign.Left,
                    ),
                    // …one per chapter; alternate `align`
                ),
                acts = listOf(
                    Act.Statement(
                        eyebrow = "A CITY, EDITED FOR YOU",
                        title = "The distance was never the point.",
                    ),
                    Act.Cta(title = "Tell us where home is.", label = "Begin"),
                    Act.Footer(brand = "MERIDIAN", note = "© 2026"),
                ),
            )
        }
    }
}
```

`enableEdgeToEdge()` matters: the film is full-bleed, and the scaffold already applies
`systemBarsPadding()` to the copy and HUD so nothing lands under the status bar or the
gesture pill.

## QA on device

- **Fling the whole film.** Frames must track the finger. A white flash means the
  last-frame hold (`shown`) was bypassed — the scaffold keeps the previous bitmap on a
  cache miss precisely to avoid it.
- **Watch memory** in Studio's profiler while scrolling the full film. `FrameStore` is
  capped at 24 MB, which holds roughly a chapter and a half at 12 fps. If you see visible
  re-decoding on scroll-back, raise `maxBytes` — but check the device's heap first, since
  a 720×1280 bitmap costs ~3.7 MB in memory regardless of its ~60 KB on disk.
- **Cold start.** The first chapter's opening frame should paint immediately. If it flashes
  the background, the asset path in `Chapter.frameDir` is wrong — `AssetManager` throws and
  the scaffold swallows it via `runCatching`, so a wrong path fails silently by design
  (a missing frame mid-scroll must not crash the film).
- **Scroll past the film into the post-film sections.** The pinned copy and HUD must disappear and the
  film must dim — that handover is the `past` flag.
- **Low-end device.** If scrubbing is choppy on a budget phone, drop the extraction to
  8 fps before touching anything in the code.

## Status

`ScrollScrub.kt` is written and reviewed but has **not been compiled** — it was authored on
a machine with an Android SDK but no Gradle or Kotlin compiler available. Expect to fix
import or API-level details on first build; the structure, the frame-store strategy and the
scroll math are the parts worth keeping.

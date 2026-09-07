// ============================================================================
// ScrollScrub.kt — scroll-driven cinematic scaffold for native Android (Compose)
// ----------------------------------------------------------------------------
// The Android counterpart to quickie-scroll.js and scroll_scrub.dart. Same idea:
// scroll drives a camera. Same mechanism as the Flutter target and for the same
// reason — it scrubs a pre-extracted image sequence, not video.
//
// WHY FRAMES, NOT ExoPlayer
//   A seekTo costs a decode from the nearest keyframe: ~60-120ms on a mid-range
//   device even with a tight GOP. A fling issues seeks far faster than that, they
//   queue, and the frame visibly freezes. JPEG frames have no keyframe
//   dependency — each one decodes independently in ~5-10ms and caches.
//
// PRODUCING THE FRAMES (from the same 9:16 clips the web build uses):
//   ffmpeg -i 01-threshold.mp4 -vf "fps=12,scale=720:-2" -q:v 4 \
//          app/src/main/assets/frames/01-threshold/%03d.jpg
//
// ZERO third-party dependencies: Compose + AssetManager + BitmapFactory only.
// No Coil, no Glide, no ExoPlayer.
// ============================================================================

package com.example.quickiescroll

import android.content.res.AssetManager
import android.graphics.BitmapFactory
import android.util.LruCache
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

// ------------------------------------------------------------------ data model

/** Where a chapter's copy sits. Alternate it — identical placement reads as a template. */
enum class CopyAlign { Left, Right, Center }

data class Chapter(
    /** Asset directory holding the frames, e.g. "frames/01-threshold". */
    val frameDir: String,
    /** How many frames are in [frameDir], named 001.jpg .. NNN.jpg. */
    val frameCount: Int,
    /** Screen-heights of scroll this chapter occupies. Higher = longer dwell. */
    val scroll: Float = 1.4f,
    val eyebrow: String = "",
    val title: String = "",
    val body: String = "",
    val tags: List<String> = emptyList(),
    val align: CopyAlign = CopyAlign.Left,
    val accent: Color? = null,
) {
    fun frameAt(i: Int): String =
        "$frameDir/${(i.coerceIn(0, frameCount - 1) + 1).toString().padStart(3, '0')}.jpg"
}

data class HudSpec(val system: String = "", val verb: String = "", val frames: Boolean = true)

data class ScrubTheme(
    val bg: Color = Color(0xFF0B0C0E),
    val ink: Color = Color(0xFFF2EAD9),
    val inkSoft: Color = Color(0xFFB9AE9C),
    val accent: Color = Color(0xFFD4AF6A),
)

/** A panel that scrolls up over the finished film. Mirrors `acts` on the web. */
sealed interface Act {
    data class Statement(val eyebrow: String = "", val title: String, val body: String = "") : Act
    data class Cards(val title: String = "", val cards: List<Pair<String, String>>) : Act
    data class Cta(val title: String, val body: String = "", val label: String) : Act
    data class Footer(val brand: String, val note: String = "") : Act
}

// ------------------------------------------------------------------ frame store

/**
 * Decodes frames off the main thread and holds them in an LRU cache.
 *
 * Sized in bytes rather than entries because that is what actually runs out: a
 * 720x1280 ARGB_8888 bitmap is ~3.7 MB in memory regardless of its 60 KB on disk.
 * 24 MB holds roughly one and a half chapters at 12fps, which is what the
 * look-ahead needs.
 */
class FrameStore(private val assets: AssetManager, maxBytes: Int = 24 * 1024 * 1024) {
    private val cache = object : LruCache<String, ImageBitmap>(maxBytes) {
        override fun sizeOf(key: String, value: ImageBitmap) = value.width * value.height * 4
    }

    fun peek(path: String): ImageBitmap? = cache.get(path)

    suspend fun load(path: String): ImageBitmap? {
        cache.get(path)?.let { return it }
        return withContext(Dispatchers.IO) {
            runCatching {
                assets.open(path).use { BitmapFactory.decodeStream(it) }?.asImageBitmap()
            }.getOrNull()?.also { cache.put(path, it) }
        }
    }
}

// ------------------------------------------------------------------ the screen

@Composable
fun ScrollScrubScreen(
    chapters: List<Chapter>,
    brand: String = "",
    acts: List<Act> = emptyList(),
    hud: HudSpec = HudSpec(),
    theme: ScrubTheme = ScrubTheme(),
) {
    require(chapters.isNotEmpty()) { "ScrollScrubScreen needs at least one chapter" }

    val context = LocalContext.current
    val store = remember { FrameStore(context.assets) }
    val scroll = rememberScrollState()
    val density = LocalDensity.current

    var viewportPx by remember { mutableIntStateOf(0) }
    val filmExtent = remember(chapters) { chapters.sumOf { it.scroll.toDouble() }.toFloat() }
    val filmPx = (viewportPx * filmExtent).toInt()

    // Which chapter the scroll is in, and how far through it (0..1).
    val y = scroll.value.toFloat()
    var chapterIndex = 0
    var progress = 0f
    if (viewportPx > 0) {
        var offset = 0f
        for ((i, c) in chapters.withIndex()) {
            val w = c.scroll * viewportPx
            if (y < offset + w || i == chapters.lastIndex) {
                chapterIndex = i
                progress = ((y - offset) / w).coerceIn(0f, 1f)
                break
            }
            offset += w
        }
    }

    val chapter = chapters[chapterIndex]
    val accent = chapter.accent ?: theme.accent
    val frame = (progress * (chapter.frameCount - 1)).toInt()
    val path = chapter.frameAt(frame)

    // The film is done once the last chapter is scrubbed; from there the acts own
    // the screen and the pinned chrome gets out of the way.
    val past = viewportPx > 0 && y > filmPx - viewportPx * 0.35f

    // Hold the last decoded frame so a cache miss shows the previous frame rather
    // than a white flash — the Compose equivalent of gaplessPlayback.
    var shown by remember { mutableStateOf<ImageBitmap?>(null) }
    LaunchedEffect(path) {
        store.peek(path)?.let { shown = it } ?: store.load(path)?.let { shown = it }
    }

    // Warm the next chapter while this one is still playing.
    LaunchedEffect(chapterIndex, progress > 0.6f) {
        if (progress > 0.6f && chapterIndex + 1 <= chapters.lastIndex) {
            val next = chapters[chapterIndex + 1]
            var i = 0
            while (i < next.frameCount) { store.load(next.frameAt(i)); i += 3 }
        }
    }

    Box(
        Modifier
            .fillMaxSize()
            .background(theme.bg)
            .onSizeChanged { viewportPx = it.height }
    ) {
        // --- the pinned film -------------------------------------------------
        shown?.let {
            Image(
                bitmap = it,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                alpha = if (past) 0.35f else 1f,
                modifier = Modifier.fillMaxSize(),
            )
        }

        // --- readability scrim, on the side the copy speaks from --------------
        Box(
            Modifier
                .fillMaxSize()
                .background(
                    androidx.compose.ui.graphics.Brush.verticalGradient(
                        0f to theme.bg.copy(alpha = 0.05f),
                        0.55f to theme.bg.copy(alpha = 0.55f),
                        1f to theme.bg.copy(alpha = 0.94f),
                    )
                )
        )

        // --- the scroll surface -----------------------------------------------
        Column(Modifier.fillMaxSize().verticalScroll(scroll)) {
            Spacer(Modifier.height(with(density) { filmPx.toDp() }))
            acts.forEach { RenderAct(it, theme) }
            FooterBar(brand, theme)
        }

        // --- pinned copy + HUD -------------------------------------------------
        if (!past) {
            ChapterCopy(
                chapter = chapter,
                accent = accent,
                theme = theme,
                alpha = copyAlpha(chapterIndex, chapters.lastIndex, progress),
            )
            Hud(
                hud = hud,
                brand = brand,
                theme = theme,
                frameNo = if (filmPx > 0) ((y / filmPx).coerceIn(0f, 1f) * filmExtent * 24).toInt() else 0,
            )
        }
    }
}

/** First chapter greets on landing, last one holds, middles peak at their centre. */
private fun copyAlpha(index: Int, last: Int, p: Float): Float = when (index) {
    0 -> (1f - p / 0.62f).coerceIn(0f, 1f)
    last -> (p / 0.4f).coerceIn(0f, 1f)
    else -> (1f - kotlin.math.abs(p - 0.5f) / 0.5f).coerceIn(0f, 1f)
}

// ------------------------------------------------------------------ fragments

@Composable
private fun BoxScope.ChapterCopy(
    chapter: Chapter,
    accent: Color,
    theme: ScrubTheme,
    alpha: Float,
) {
    val alignment = when (chapter.align) {
        CopyAlign.Left -> Alignment.BottomStart
        CopyAlign.Right -> Alignment.BottomEnd
        CopyAlign.Center -> Alignment.BottomCenter
    }
    val textAlign = when (chapter.align) {
        CopyAlign.Left -> TextAlign.Start
        CopyAlign.Right -> TextAlign.End
        CopyAlign.Center -> TextAlign.Center
    }

    Column(
        modifier = Modifier
            .align(alignment)
            .systemBarsPadding()
            .padding(horizontal = 24.dp, vertical = 78.dp)
            .widthIn(max = 460.dp)
            .alpha(alpha),
        horizontalAlignment = when (chapter.align) {
            CopyAlign.Left -> Alignment.Start
            CopyAlign.Right -> Alignment.End
            CopyAlign.Center -> Alignment.CenterHorizontally
        },
    ) {
        if (chapter.eyebrow.isNotEmpty()) {
            Mono(chapter.eyebrow, accent)
            Spacer(Modifier.height(14.dp))
        }
        Text(
            chapter.title,
            color = theme.ink,
            fontSize = 34.sp,
            lineHeight = 36.sp,
            fontWeight = FontWeight.W500,
            textAlign = textAlign,
        )
        if (chapter.body.isNotEmpty()) {
            Spacer(Modifier.height(14.dp))
            Text(
                chapter.body,
                color = theme.inkSoft,
                fontSize = 15.sp,
                lineHeight = 23.sp,
                textAlign = textAlign,
            )
        }
        if (chapter.tags.isNotEmpty()) {
            Spacer(Modifier.height(18.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                chapter.tags.forEach { tag ->
                    Box(
                        Modifier
                            .background(accent.copy(alpha = 0.14f), RoundedCornerShape(999.dp))
                            .padding(horizontal = 14.dp, vertical = 7.dp)
                    ) { Text(tag, color = theme.ink, fontSize = 12.5.sp) }
                }
            }
        }
    }
}

@Composable
private fun BoxScope.Hud(hud: HudSpec, brand: String, theme: ScrubTheme, frameNo: Int) {
    val soft = theme.ink.copy(alpha = 0.6f)
    Box(Modifier.fillMaxSize().systemBarsPadding().padding(horizontal = 24.dp, vertical = 20.dp)) {
        if (brand.isNotEmpty()) {
            Text(
                brand,
                color = theme.ink,
                fontSize = 15.sp,
                fontWeight = FontWeight.W600,
                letterSpacing = 1.6.sp,
                modifier = Modifier.align(Alignment.TopStart),
            )
        }
        if (hud.frames) {
            Box(Modifier.align(Alignment.TopEnd)) {
                Mono("FRAME ${frameNo.toString().padStart(3, '0')}", soft)
            }
        }
        if (hud.system.isNotEmpty()) {
            Box(Modifier.align(Alignment.TopCenter).padding(top = 30.dp)) {
                Mono(hud.system, soft)
            }
        }
        if (hud.verb.isNotEmpty()) {
            Box(Modifier.align(Alignment.BottomEnd)) { Mono(hud.verb, soft) }
        }
    }
}

@Composable
private fun Mono(text: String, color: Color) = Text(
    text.uppercase(),
    color = color,
    fontFamily = FontFamily.Monospace,
    fontSize = 10.5.sp,
    letterSpacing = 2.sp,
)

@Composable
private fun RenderAct(act: Act, theme: ScrubTheme) {
    val paper = Color(0xFFF2EFE9)
    val ink = Color(0xFF171419)
    when (act) {
        is Act.Statement -> ActShell(paper) {
            if (act.eyebrow.isNotEmpty()) {
                Mono(act.eyebrow, ink.copy(alpha = 0.6f))
                Spacer(Modifier.height(20.dp))
            }
            Text(act.title, color = ink, fontSize = 32.sp, lineHeight = 36.sp, fontWeight = FontWeight.W500)
            if (act.body.isNotEmpty()) {
                Spacer(Modifier.height(18.dp))
                Text(act.body, color = ink.copy(alpha = 0.78f), fontSize = 16.sp, lineHeight = 26.sp)
            }
        }

        is Act.Cards -> ActShell(paper) {
            if (act.title.isNotEmpty()) {
                Text(act.title, color = ink, fontSize = 28.sp, fontWeight = FontWeight.W500)
                Spacer(Modifier.height(24.dp))
            }
            act.cards.forEach { (title, body) ->
                Column(
                    Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF141117), RoundedCornerShape(20.dp))
                        .padding(26.dp)
                ) {
                    Text(title, color = Color(0xFFF2EAD9), fontSize = 22.sp, fontWeight = FontWeight.W500)
                    Spacer(Modifier.height(12.dp))
                    Text(body, color = Color(0xFFF2EAD9).copy(alpha = 0.72f), fontSize = 14.5.sp, lineHeight = 22.sp)
                }
                Spacer(Modifier.height(14.dp))
            }
        }

        is Act.Cta -> ActShell(Color(0xFFEFF2F4)) {
            Column(
                Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(act.title, color = ink, fontSize = 28.sp, lineHeight = 32.sp,
                    fontWeight = FontWeight.W500, textAlign = TextAlign.Center)
                if (act.body.isNotEmpty()) {
                    Spacer(Modifier.height(14.dp))
                    Text(act.body, color = ink.copy(alpha = 0.75f), fontSize = 15.sp, textAlign = TextAlign.Center)
                }
                Spacer(Modifier.height(26.dp))
                Button(
                    onClick = {},
                    shape = RoundedCornerShape(999.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = ink),
                    contentPadding = PaddingValues(horizontal = 32.dp, vertical = 16.dp),
                ) { Text(act.label, color = Color.White) }
            }
        }

        is Act.Footer -> ActShell(theme.bg) {
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(act.brand, color = theme.ink, fontWeight = FontWeight.W600, letterSpacing = 1.4.sp)
                Mono(act.note, theme.inkSoft)
            }
        }
    }
}

@Composable
private fun ActShell(bg: Color, content: @Composable ColumnScope.() -> Unit) = Column(
    Modifier
        .fillMaxWidth()
        .background(bg)
        .padding(horizontal = 26.dp, vertical = 68.dp),
    content = content,
)

@Composable
private fun FooterBar(brand: String, theme: ScrubTheme) = Box(
    Modifier
        .fillMaxWidth()
        .background(theme.bg)
        .navigationBarsPadding()
        .padding(horizontal = 26.dp, vertical = 40.dp)
) {
    Text(brand, color = theme.inkSoft, fontSize = 12.sp, letterSpacing = 1.4.sp)
}

# Bootstrap — SKILL Step 0

*What must be true about the machine before the interview starts.*

**Read with:** [`core/rules.md`](rules.md) · [`discovery/interview.md`](../discovery/interview.md) ·
[`video/rendering.md`](../video/rendering.md)

---

1. **ffmpeg / ffprobe** on `$PATH`. Required — everything downstream of rendering is
   ffmpeg (frame extraction, validation, encoding, Flutter frame sequences).

2. **Look for a connected renderer.** Check, in this order, whatever is actually present:
   connected image/video MCP servers; then CLIs (`higgsfield`, `monid`, `codex`, `fal`,
   `replicate`). If you find one, you will offer it at Step 4 — you do **not** use it
   without asking, and you do not spend anything before the user approves an estimate.

3. **No renderer is not a failure mode.** The prompt pack is a first-class deliverable,
   not a fallback. Most builds ship this way.

4. **App target only — probe the toolchain BEFORE promising an app.** Run
   `bash tools/detect-target.sh`. It prints `TARGET=FLUTTER|ANDROID|BOTH|NONE`, and that
   result decides the target question in [`discovery/interview.md`](../discovery/interview.md).
   Do not skip it and do not guess from `$PATH`: an Android SDK installed by Android Studio
   very often exports **neither** `$ANDROID_HOME` nor `$ANDROID_SDK_ROOT` and keeps `adb`
   off `$PATH`, so an env-var-only check reports "no Android" on a machine with a complete
   SDK. The script probes the standard install locations for exactly that reason.

5. **Shell caveats.** macOS ships **bash 3.2** — no associative arrays. **zsh arrays are
   1-indexed** — run every chain script as `bash script.sh`, never pasted into an
   interactive zsh, or the chain grabs the wrong chapter's frames. Video generations take
   3–8 minutes each — always detached, always polled, never a blocking foreground call.

#!/bin/bash
# Toolchain probe for the app target (SKILL Step 0.2).
#
# Run this BEFORE promising a mobile app. Prints one of:
#   FLUTTER   — Flutter SDK usable            -> platforms/flutter/
#   ANDROID   — Android SDK, no Flutter       -> platforms/android/
#   BOTH      — both are available            -> ask the user which
#   NONE      — neither                       -> tell the user, offer the website
#
# Why the paths and not just `which`: an Android SDK installed by Android Studio
# very often has NEITHER $ANDROID_HOME nor $ANDROID_SDK_ROOT exported, and adb is
# not on $PATH. Probing only the env vars reports "no Android" on machines that
# have a complete, working SDK. (Verified: a machine with platforms 34-37 and adb
# present reported both env vars unset.)

has_flutter=0
has_android=0
flutter_ver=""
android_sdk=""

# ---- Flutter -----------------------------------------------------------------
if command -v flutter >/dev/null 2>&1; then
  flutter_ver=$(flutter --version 2>/dev/null | head -1)
  [ -n "$flutter_ver" ] && has_flutter=1
fi

# ---- Android SDK: env vars first, then the standard install locations --------
for cand in \
  "$ANDROID_HOME" \
  "$ANDROID_SDK_ROOT" \
  "$LOCALAPPDATA/Android/Sdk" \
  "$HOME/AppData/Local/Android/Sdk" \
  "$HOME/Library/Android/sdk" \
  "$HOME/Android/Sdk" \
  "/usr/local/lib/android/sdk"
do
  [ -n "$cand" ] || continue
  if [ -d "$cand/platforms" ] || [ -d "$cand/platform-tools" ]; then
    android_sdk="$cand"; has_android=1; break
  fi
done

# adb on PATH is a sufficient signal on its own.
if [ "$has_android" -eq 0 ] && command -v adb >/dev/null 2>&1; then
  has_android=1; android_sdk="(adb on PATH)"
fi

# ---- report ------------------------------------------------------------------
echo "flutter: $([ $has_flutter -eq 1 ] && echo "yes — $flutter_ver" || echo no)"
if [ $has_android -eq 1 ]; then
  plats=$(ls "$android_sdk/platforms" 2>/dev/null | tr '\n' ' ')
  echo "android: yes — $android_sdk${plats:+ (platforms: $plats)}"
else
  echo "android: no"
fi

# A Flutter install still needs a working Android toolchain to build an APK.
# Report it, don't block on it — `flutter doctor` is the user's to fix.
if [ $has_flutter -eq 1 ] && [ $has_android -eq 0 ]; then
  echo "note: Flutter found but no Android SDK — it can build the project, but not an APK until 'flutter doctor' is clean."
fi

if   [ $has_flutter -eq 1 ] && [ $has_android -eq 1 ]; then echo "TARGET=BOTH"
elif [ $has_flutter -eq 1 ];                          then echo "TARGET=FLUTTER"
elif [ $has_android -eq 1 ];                          then echo "TARGET=ANDROID"
else                                                       echo "TARGET=NONE"
fi

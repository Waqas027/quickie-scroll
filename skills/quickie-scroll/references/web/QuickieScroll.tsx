'use client';

// ============================================================================
// QuickieScroll — React/Next wrapper around the vanilla scrub engine.
// ----------------------------------------------------------------------------
// The engine builds its own DOM into a container and injects its own CSS, which
// is exactly the ref + useEffect shape. So this wrapper is deliberately thin:
// it is a mount point and a teardown, not a reimplementation. Keeping the scrub
// logic outside React matters — scrubbing writes `video.currentTime` every
// frame, and routing 60 writes/second through React state would be pure waste.
//
// 'use client' is required: the engine reads window/document at mount.
//
// WHY destroy() IS NOT OPTIONAL
//   React StrictMode mounts effects twice in dev. Without the cleanup you get
//   two engines, two rAF loops, doubled listeners, and a scrub that fights
//   itself. The engine returns a handle for exactly this.
// ============================================================================

import { useEffect, useRef } from 'react';
import { mountQuickieScroll, type QSConfig } from './quickie-scroll';

export default function QuickieScroll({
  config,
  className,
}: {
  config: QSConfig;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  // The config is read once at mount. Changing it does not re-mount the film —
  // that would re-fetch every clip. Remount deliberately with a `key` if you
  // genuinely need to swap films.
  const configRef = useRef(config);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const handle = mountQuickieScroll(host, configRef.current);
    return () => handle.destroy();
  }, []);

  return <div ref={hostRef} className={className} />;
}

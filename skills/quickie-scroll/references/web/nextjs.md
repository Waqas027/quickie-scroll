# The web target — Next.js (default) or React + Vite

The web build is a **Next.js App Router project** by default, not a single HTML file. The
scrub engine is unchanged — it is the same vanilla file the static build uses — but the
project around it gives you a real animation environment: Lenis smooth scroll, Framer
Motion or GSAP for the acts, component reuse across chapters, MDX for copy, and image
optimisation for the posters.

A standalone `index-template.html` is still shipped for a zero-install preview. Use it to
eyeball a chain before committing to a project; ship the Next build.

## Scaffold

```bash
npx create-next-app@latest meridian --ts --app --tailwind --eslint --no-src-dir --use-npm
cd meridian
npm i lenis
```

Then place four files:

```
meridian/
  app/
    layout.tsx              theme tokens + fonts (next/font)
    page.tsx                the config — this is the build's content
    SmoothScroll.tsx        Lenis provider (client)
  components/
    QuickieScroll.tsx       the wrapper — copy from references/web/
    quickie-scroll.js       the engine — copy from references/
    quickie-scroll.d.ts     its types — copy from references/web/
  public/
    assets/images/…         posters — 01 is the generated still; 02+ are each clip's
                            extracted first frame (assets/frames/first-NN.png)
    assets/videos/…         encoded clips
```

**Assets live in `public/`**, so every path in the config is absolute from the web root:
`/assets/videos/01-threshold.mp4`. This is the single most common wiring mistake — a
relative `assets/…` path resolves against the route and 404s on any nested page.

## `app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import { Instrument_Serif, Inter } from 'next/font/google';
import SmoothScroll from './SmoothScroll';
import './globals.css';

const display = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const body    = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'MERIDIAN — the journey home',
  description: 'Scroll to descend from a night cabin window to your own kitchen table.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
```

`app/globals.css` carries the look's tokens. They must be **unlayered** so they beat the
engine's `@layer sw` defaults regardless of load order:

```css
:root, .sw-root {
  --sw-bg: #0A1220;
  --sw-ink: #EDEAE3;
  --sw-ink-soft: #8FA2B8;
  --sw-accent: #E9C77E;
  --sw-font-display: var(--font-display), Georgia, serif;
  --sw-font-body: var(--font-body), system-ui, sans-serif;
}
html, body { margin: 0; background: var(--sw-bg); }
```

## `app/SmoothScroll.tsx` — the reason to use Next at all

Native wheel scroll arrives in coarse steps, so a scrubbed film moves in visible jumps.
Lenis interpolates scroll position every frame, and because it drives the **real** scroll
position (not a transform), the engine needs no changes — it reads `window.scrollY` as
always. This is the single biggest perceived-quality win on the web target.

```tsx
'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Skip entirely for reduced-motion and for touch: mobile browsers have their
    // own momentum, and hijacking it fights the OS and breaks the URL-bar behaviour
    // the engine already accounts for.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    const lenis = new Lenis({ duration: 1.1, wheelMultiplier: 0.9 });
    let id = requestAnimationFrame(function raf(t) {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    });
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  return <>{children}</>;
}
```

## `app/page.tsx`

```tsx
import QuickieScroll from '@/components/QuickieScroll';
import type { QSConfig } from '@/components/quickie-scroll';

const config: QSConfig = {
  brand: { name: 'MERIDIAN', href: '#top' },
  hint: 'scroll to descend',
  diveScroll: 1.4,
  crossfade: 0.08,
  connectors: [],
  hud: { system: 'MERIDIAN / NIGHT ARRIVAL', verb: 'scroll to descend', frames: true },
  sections: [
    {
      id: 'threshold', label: 'The Threshold',
      still: '/assets/images/01-threshold.png',
      clip:  '/assets/videos/01-threshold.mp4',
      accent: '#8FA2B8', align: 'left', scroll: 1.5, linger: 0.3,
      eyebrow: '01 — THE THRESHOLD',
      title: 'Home starts before you land.',
      body: 'A night flight, the cabin dimmed, the cloud tops already glowing below you.',
      tags: ['Night arrivals', 'Lie-flat'],
    },
    // …alternate align: 'right', 'center', 'left'…
  ],
  acts: [
    { kind: 'statement', tone: 'light', eyebrow: 'WHAT WE ACTUALLY SELL',
      title: 'The distance was never the point.' },
    { kind: 'cta', tone: 'tint', title: 'Tell us where home is.', action: { label: 'Begin' } },
    { kind: 'footer', tone: 'dark', brand: 'MERIDIAN', note: '© 2026 Meridian Air' },
  ],
};

export default function Page() {
  return (
    <>
      <div id="top" />
      <QuickieScroll config={config} />
    </>
  );
}
```

The page is a **server component** holding a plain object; only the wrapper is a client
component. Nothing about the film needs to hydrate.

## React + Vite instead

Identical, minus the Next specifics: `npm create vite@latest -- --template react-ts`,
assets in `public/`, the same `QuickieScroll.tsx`, and mount `<SmoothScroll>` in
`main.tsx`. No `'use client'` needed (it is ignored, so the file is portable as-is).

## Where the extra animation capability actually goes

The film itself is pre-rendered — that is the whole technique, and no library improves it.
What a React project buys you is everything *around* the film:

| Want | Use | Note |
|---|---|---|
| Smooth scroll feel | **Lenis** | The one change you should always make |
| Acts animating in | Framer Motion `whileInView` | Acts are ordinary DOM; animate freely |
| Pinned//timeline effects in the acts | GSAP ScrollTrigger | Keep it **out** of the film's scroll range — two systems driving one scroll fight |
| Per-chapter routes / deep links | Next router + the engine's `jumpTo` | Wire a `?chapter=` param to a scroll offset |
| Optimised posters | `next/image` on the acts | Do **not** use it for `still` — the engine sets `img.src` itself |

Two hard rules:

1. **Never animate the film's container with a transform.** A CSS transform on an ancestor
   creates a containing block and breaks the engine's `position: fixed` layers — the
   scenes detach from the viewport and the film collapses.
2. **Do not add a second scroll driver over the film's range.** GSAP ScrollTrigger's
   `scrub` and this engine both map scroll to time; running both means two sources of
   truth for one playhead. Use GSAP below the film, in the acts.

## QA additions for the Next build

Everything in SKILL Step 9 applies, plus:

- **StrictMode double-mount.** In dev, confirm exactly one `.sw-root` and one set of
  `<video>` elements after mount. Two means the cleanup isn't running.
- **Production build.** `npm run build && npm start` — a `window` reference leaking into a
  server component fails here, not in dev.
- **Lenis off on touch.** On a phone, momentum should be the OS's, not Lenis's.
- **Reduced motion.** Lenis skipped *and* the engine falling back to stills.

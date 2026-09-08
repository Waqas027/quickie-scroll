// Types for the vanilla engine, so the React wrapper and your config are checked.
// The engine itself stays plain JS on purpose: it is the same file the static
// HTML build loads, and it has no build step.

export interface QSChapter {
  id: string;
  label?: string;
  /** Poster + reduced-motion fallback. In Next this is a /public path. */
  still?: string;
  stillMobile?: string;
  clip: string;
  clipMobile?: string;
  accent?: string;
  /** Which side of the frame this chapter speaks from. Alternate it. */
  align?: 'left' | 'right' | 'center';
  /** Viewport-heights of scroll this chapter occupies. More = longer dwell. */
  scroll?: number;
  /** 0–0.6. Remaps time so the camera settles mid-chapter where the copy peaks. */
  linger?: number;
  eyebrow?: string;
  title?: string;
  body?: string;
  tags?: string[];
  cta?: {
    primary?: { label: string; href?: string };
    secondary?: { label: string; href?: string };
  };
}

export type QSAct =
  | { kind: 'statement'; tone?: QSTone; id?: string; eyebrow?: string; title: string; body?: string }
  | { kind: 'cards'; tone?: QSTone; id?: string; title?: string; cards: Array<{ title: string; body?: string; tone?: 'dark' | 'light' }> }
  | { kind: 'cta'; tone?: QSTone; id?: string; title: string; body?: string; placeholder?: string; action?: { label: string; href?: string } }
  | QSFooter
  | { kind: 'html'; tone?: QSTone; id?: string; html: string };

export type QSTone = 'dark' | 'light' | 'tint';

export type QSLink = { label: string; href?: string };

/**
 * A closing band: wordmark, a link row, a note. Every key is optional — one you
 * omit renders no element, and a footer with none of them renders nothing.
 */
export interface QSFooter {
  kind: 'footer';
  tone?: QSTone;
  id?: string;
  brand?: string;
  links?: QSLink[];
  note?: string;
}

export interface QSConfig {
  brand?: { name: string; href?: string };
  cta?: { label: string; href?: string };
  hint?: string;
  nav?: boolean;
  atmosphere?: boolean;
  /** Viewport-heights per chapter clip (per-chapter `scroll` overrides it). */
  diveScroll?: number;
  /** Viewport-heights per connector clip (architecture B). */
  connScroll?: number;
  /** Seam dissolve width in vh. ~0.08 for architecture A. */
  crossfade?: number;
  hud?: { system?: string; verb?: string; frames?: boolean; brackets?: boolean };
  sections: QSChapter[];
  /** Architecture B only. Length === sections.length - 1. Nulls allowed. */
  connectors?: Array<string | null>;
  connectorsMobile?: Array<string | null>;
  acts?: QSAct[];
}

/** Returned handle. Call destroy() on unmount — see the React wrapper. */
export interface QSHandle {
  destroy(): void;
}

export function mountQuickieScroll(container: HTMLElement, config: QSConfig): QSHandle;

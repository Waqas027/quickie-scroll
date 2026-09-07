# Footer content keys

*What the user can pick, and the config key each answer becomes. An unpicked key renders no element at all.*

**Read with:** [`footer/workflow.md`](workflow.md) · [`footer/variants.md`](variants.md)

---

Ask which of these the user wants (multi-select). Only what they pick is
rendered — an unpicked block emits **no DOM at all**, so it can never leave a
gap in the layout.

| Ask them | Key | Shape |
|---|---|---|
| Logo / wordmark | `brand`, `logo` | `brand: 'KALLA'` — or `logo: '/logo.svg'` for an image |
| Tagline | `tagline` | one line under the mark |
| Big closing line | `headline` | the footer's own headline; word-animated in the split variants below |
| Navigation | `links` | `[{ label, href }]` — a flat row |
| Product / grouped links | `columns` | `[{ title, links: [{ label, href }] }]` |
| Social links | `social` | `[{ label, href }]` — external `href`s open in a new tab |
| Contact | `contact` | `[{ label, href }]` — `mailto:` / `tel:` / plain address lines |
| Newsletter | `newsletter` | `{ title, placeholder, action: { label } }` |
| CTA button | `cta` | `{ label, href }` or `{ primary: {…}, secondary: {…} }` |
| Legal links | `legal` | `[{ label, href }]` — rendered small and dim |
| Copyright | `note` | `'© 2026 KALLA'` |
| Image / product shot | `media`, `mediaAlt` | a path; masked-reveals on entry |
| Marquee text | `marquee` | one phrase; repeated and scrolled |
| Custom content | `html` | verbatim markup |

Blocks always render in this source order — `brand, headline, marquee, media,
columns, links, social, contact, newsletter, cta, custom, legal, note` — and
each carries its index as `--sw-i`, which is what drives the stagger. The
variant's CSS re-places them; it never needs them re-ordered in the DOM.

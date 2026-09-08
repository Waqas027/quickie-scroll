/* ============================================================================
   quickie-scroll — cinematic scroll-scrub engine (v2)
   ----------------------------------------------------------------------------
   Framework-agnostic. Vanilla JS, zero dependencies. It builds its own DOM and
   injects its own (namespaced) CSS into a container you give it, so it drops into
   plain HTML, Next.js (call from a ref/useEffect), Vue (onMounted), a server-
   rendered page, anything.

   USAGE
     mountQuickieScroll(document.getElementById('world'), {
       brand: { name: 'Pearl & Co.', href: '#top' },
       diveScroll: 1.3,   // viewport-heights of scroll per dive clip
       connScroll: 0.9,   // ...per connector clip
       hint: 'scroll to fly in',
       nav: true,         // show the top section nav
       atmosphere: true,  // subtle gradient + drifting particles behind the clips
       hud: {             // cinematic corner HUD (see HUD below). Omit to disable.
         system: 'FIELD VESSEL / 01',   // top-left system label
         verb:   'scroll to traverse',  // bottom-right scroll verb
         frames: true,                  // top-right live FRAME nnn counter
         brackets: true,                // corner registration marks
       },
       sections: [
         { id, label, still, stillMobile, clip, clipMobile, accent,
           align: 'left',  // 'left' (default) | 'right' | 'center' — where this
                           // chapter's copy sits. Alternate it to keep a long
                           // film from reading as one static caption.
           scroll: 1.6,   // optional per-section override of diveScroll — more scroll
                          // distance = a slower, longer dwell in this scene
           linger: 0.5,   // optional 0..1 — remaps time so the camera settles mid-scene
                          // (exactly where the copy peaks) and moves quicker at the
                          // edges. 0 = linear (default). Keep ≤ 0.6; 1 = full pause.
           eyebrow, title, body, tags:[…],
           cta:{ primary:{label,href}, secondary:{label,href} } }, // last section only
         …
       ],
       connectors: [clipUrl, …],          // length = sections.length - 1 (nulls allowed)
       connectorsMobile: [clipUrl, …],    // optional lighter connectors for phones (same length)
       acts: [ … ],       // editorial page that scrolls up over the finished film
                          // (see ACTS below). Omit for a film-only page.

   ACTS — the page after the film
     A scroll cinematic alone is a hero, not a product site. `acts` are ordinary
     document-flow panels appended AFTER the pinned film; they scroll up over the
     last frame, and the film's chrome (route rail, hint, copy, particles) fades
     out as they arrive. Four data-driven kinds, each themeable via `tone`
     ('dark' inherits the film palette, 'light' flips to paper, 'tint' uses the
     accent at low saturation):
       { kind:'statement', tone:'light', eyebrow, title, body }
       { kind:'cards',     tone:'light', title, cards:[{title, body, tone}] }
       { kind:'cta',       tone:'tint',  title, body, placeholder, action:{label,href} }
       { kind:'footer',    tone:'dark',  brand, note, links:[{label,href}] }
     `{ kind:'html', tone, html:'…' }` drops in anything else verbatim.

   MOBILE (the clipMobile/connectorsMobile variants are the opt-in mobile version;
   the rest of the phone handling below is always on)
     The engine is phone-aware out of the box: on a coarse-pointer / ≤860px viewport it
       - loads `clipMobile` / `connectorsMobile` when provided (encode these smaller +
         tighter-GOP — seek cost on a phone decoder is dominated by frames-from-keyframe,
         so a 720p, -g 4 file scrubs far smoother than the 1080p desktop master; see
         pipeline/encoding.md). Falls back to the desktop `clip` if no mobile variant is given.
       - uses `stillMobile` as the scene poster when provided (pair it with native 9:16
         clipMobile renders so the poster matches the portrait video's first frame instead
         of flashing from a landscape crop). Chosen once at mount; a desktop resize into
         phone width keeps the desktop poster (clips still switch via isMobile()).
       - coalesces seeks (never issues a new currentTime while the decoder is still
         `seeking`) so fast flicks can't pile up and freeze the video.
       - keeps the still as a live poster until the clip actually paints its first frame,
         and primes each video (muted play→pause) on first touch — this is what stops iOS
         from showing a blank scene before the first seek.
       - drops the drifting particles and ignores URL-bar-only resizes (no scroll jump).
     Nothing here is required — a config with only `clip`/`connectors` still works on
     phones; the mobile variants just make it lighter and smoother.

   THEME (CSS custom properties; set on the container or :root to override)
     --sw-bg         page background (match your scene bg for seamless posters)
     --sw-ink        primary text
     --sw-ink-soft   secondary text
     --sw-accent     default accent (each section overrides via its `accent`)
     --sw-font-display / --sw-font-body

   REQUIREMENTS ON YOUR ASSETS
     - clips encoded native-res, crf~20, -g 8, +faststart, no audio (see pipeline/encoding.md)
     - connectors' endpoints are the neighbouring dives' ACTUAL frames (see SKILL Step 5)
     - (optional) mobile variants at ~720p, -g 4 for smoother phone scrubbing
   The engine loads each clip as a Blob (always seekable) and scrubs currentTime; it does
   NOT depend on HTTP byte-range support.
   ========================================================================== */

function mountQuickieScroll(container, config) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Phone detection. `coarse` is captured once (input type doesn't change mid-session);
  // the ≤860px query is read live via isMobile() so a desktop resize/DevTools toggle
  // switches sources and seek behaviour without a reload.
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const smallMQ = window.matchMedia('(max-width: 860px)');
  const isMobile = () => coarse || smallMQ.matches;
  const SECTIONS = config.sections || [];
  const CONNECTORS = config.connectors || [];
  const CONNECTORS_M = config.connectorsMobile || [];
  const DIVE_W = config.diveScroll || 1.3;
  const CONN_W = config.connScroll || 0.9;
  const CROSSFADE = (config.crossfade != null) ? config.crossfade : 0.12;  // seam dissolve width (vh)
  const N = SECTIONS.length;
  // Always hand back the same shape, so a caller's `.destroy()` in an unmount
  // path never throws on an empty config.
  if (!N) return { destroy() {} };

  injectCSS();
  container.classList.add('sw-root');

  // ---- build the interleaved segment chain: dive0, conn0, dive1, … diveN-1 ----
  const SEGMENTS = [];
  SECTIONS.forEach((s, i) => {
    const dive = { kind: 'dive', si: i, clip: s.clip, clipM: s.clipMobile, still: s.still, stillM: s.stillMobile,
                   accent: s.accent, w: s.scroll || DIVE_W, linger: s.linger || 0 };
    SEGMENTS.push(dive);
    s._seg = dive;
    // A connector is optional: if connectors[i] is falsy, the two dives simply
    // crossfade directly (no fly-over). Lets a page complete even when a
    // connector can't be generated (e.g. a content-filter false-positive).
    if (i < N - 1 && CONNECTORS[i]) {
      SEGMENTS.push({ kind: 'conn', si: i, clip: CONNECTORS[i], clipM: CONNECTORS_M[i],
                      still: SECTIONS[i + 1].still, stillM: SECTIONS[i + 1].stillMobile,
                      accent: SECTIONS[i + 1].accent, w: CONN_W });
    }
  });
  const NSEG = SEGMENTS.length;

  // ---- DOM ----
  const sky = el('div', 'sw-sky');
  if (config.atmosphere !== false) {
    sky.appendChild(el('div', 'sw-sky__grad'));
    sky.appendChild(el('div', 'sw-sky__glow'));
  }
  const particles = el('div', 'sw-particles'); sky.appendChild(particles);

  const scrollbar = el('div', 'sw-scrollbar');
  const scrollbarFill = el('span'); scrollbar.appendChild(scrollbarFill);

  const topbar = el('div', 'sw-topbar');
  if (config.brand) {
    const brand = el('a', 'sw-brand'); brand.href = (config.brand.href || '#');
    brand.appendChild(el('span', 'sw-brand__mark'));
    const nm = el('span', 'sw-brand__name'); nm.textContent = config.brand.name || ''; brand.appendChild(nm);
    topbar.appendChild(brand);
  }
  const nav = el('nav', 'sw-nav'); if (config.nav !== false) topbar.appendChild(nav);
  if (config.cta && config.cta.label) {
    const c = el('a', 'sw-topcta'); c.href = config.cta.href || '#'; c.textContent = config.cta.label;
    topbar.appendChild(c);
  }

  const stage = el('div', 'sw-stage');
  const copylayer = el('div', 'sw-copylayer');
  const route = el('div', 'sw-route');
  const hint = el('div', 'sw-hint');
  const hintText = el('span'); hintText.textContent = config.hint || 'scroll'; hint.appendChild(hintText);
  hint.appendChild(el('i'));
  const track = el('div', 'sw-track');

  // ---- cinematic HUD: the corner instrumentation the reference films all wear ----
  // Pure chrome, no layout cost: a system label, a live frame counter, registration
  // brackets and the scroll verb. It is what makes a full-bleed clip read as a
  // *film* rather than a background video.
  const HUD = config.hud || null;
  let hudFrames = null;
  const hud = el('div', 'sw-hud');
  if (HUD) {
    if (HUD.system) { const a = el('span', 'sw-hud__sys'); a.textContent = HUD.system; hud.appendChild(a); }
    if (HUD.frames !== false) { hudFrames = el('span', 'sw-hud__frame'); hud.appendChild(hudFrames); }
    if (HUD.verb) { const v = el('span', 'sw-hud__verb'); v.textContent = HUD.verb; hud.appendChild(v); }
    if (HUD.brackets !== false) ['tl', 'tr', 'bl', 'br'].forEach(k => hud.appendChild(el('i', 'sw-hud__mk sw-hud__mk--' + k)));
  }

  // ---- acts: the editorial page that scrolls up over the finished film ----
  const after = el('div', 'sw-after');
  (config.acts || []).forEach(a => { const n = renderAct(a); if (n) after.appendChild(n); });

  [sky, scrollbar, topbar, stage, copylayer, route, hint, hud, track, after].forEach(n => container.appendChild(n));

  // segment scenes
  SEGMENTS.forEach(s => {
    const scene = el('div', 'sw-scene'); scene.style.setProperty('--sw-accent', s.accent || '');
    const img = el('img', 'sw-scene__still'); img.alt = ''; img.decoding = 'async'; img.loading = 'lazy';
    const poster = (isMobile() && s.stillM) ? s.stillM : s.still;
    if (poster) img.src = poster;
    scene.appendChild(img); stage.appendChild(scene);
    s.el = scene; s.img = img; s.video = null; s.hasClip = false;
    s.loading = false; s.ready = false; s.cur = 0; s.target = 0; s.visible = false;
  });

  // per-section copy / route / nav
  const copies = [], dots = [];
  SECTIONS.forEach((s, i) => {
    const c = el('article', 'sw-copy sw-copy--' + (s.align || 'left'));
    c.style.setProperty('--sw-accent', s.accent || '');
    c.innerHTML =
      `<span class="sw-copy__num">${pad(i + 1)} / ${pad(N)}</span>` +
      (s.eyebrow ? `<span class="sw-copy__eyebrow">${esc(s.eyebrow)}</span>` : '') +
      (s.title ? `<h2 class="sw-copy__title">${esc(s.title)}</h2>` : '') +
      (s.body ? `<p class="sw-copy__body">${esc(s.body)}</p>` : '') +
      (s.tags && s.tags.length ? `<ul class="sw-copy__tags">${s.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '') +
      (s.cta ? `<div class="sw-copy__cta">${ctaBtns(s.cta)}</div>` : '');
    copylayer.appendChild(c); copies.push(c);

    const dot = el('button', 'sw-route__dot'); dot.style.setProperty('--sw-accent', s.accent || '');
    dot.innerHTML = `<span class="sw-route__label">${esc(s.label || '')}</span><i></i>`;
    dot.addEventListener('click', () => jumpTo(i)); route.appendChild(dot); dots.push(dot);

    if (config.nav !== false) {
      const b = el('button', 'sw-nav__item'); b.textContent = s.label || '';
      b.addEventListener('click', () => jumpTo(i)); nav.appendChild(b);
    }
  });

  // ---- math ----
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  // Per-section dwell: monotone remap of scroll→time so the camera settles mid-scene
  // (where the copy peaks) and moves quicker near the seams. L=0 linear, L=1 full
  // mid-scene pause. f(0)=0, f(1)=1 always, so seam frames are untouched.
  const lingerEase = (x, L) => { L = clamp(L); const c = x - 0.5; return (1 - L) * x + L * (4 * c * c * c + 0.5); };
  let vh = window.innerHeight, stageX = 0, totalW = 0, activeIndex = -1, ticking = false;
  let isPast = false;
  // Teardown state. `dead` stops the rAF loop and aborts in-flight clip loads;
  // blobUrls are revoked so an unmount doesn't leak the decoded clips. React in
  // StrictMode mounts effects twice in dev, so a mount without a matching
  // teardown means two engines, two rAF loops and doubled listeners.
  let dead = false;
  const blobUrls = [];
  // Cosmetic: the HUD counts the film in frames at 24fps, so the readout maps to
  // something a viewer could believe rather than an arbitrary percentage.
  const TOTAL_FRAMES = Math.max(1, Math.round(SEGMENTS.reduce((a, s) => a + s.w, 0) * 24));
  let laidOutW = window.innerWidth;   // width the current layout was computed at (see onResize)

  function layout() {
    vh = window.innerHeight;
    laidOutW = window.innerWidth;
    stageX = window.innerWidth > 860 ? 4 : 0;
    let off = 0;
    SEGMENTS.forEach(s => { s.start = off * vh; off += s.w; s.end = off * vh; });
    totalW = off;
    track.style.height = (totalW * vh + vh) + 'px';   // +1vh so the last flight completes
    read();
  }

  function jumpTo(i) {
    const seg = SECTIONS[i]._seg;
    window.scrollTo({ top: seg.start + (seg.end - seg.start) * 0.5, behavior: reduce ? 'auto' : 'smooth' });
  }

  function loadClip(s) {
    // Under prefers-reduced-motion we never load the clips at all — the stills stay up
    // and simply cross-dissolve as you scroll. No scrubbed video motion, no decode cost.
    if (reduce || s.loading || !s.clip) return;
    s.loading = true;
    // Serve the lighter mobile encode on phones when one was provided.
    const url = (isMobile() && s.clipM) ? s.clipM : s.clip;
    fetch(url).then(r => r.ok ? r.blob() : Promise.reject(new Error('404')))
      .then(blob => {
        const v = document.createElement('video');
        v.className = 'sw-scene__video';
        v.muted = true; v.playsInline = true; v.preload = 'auto';
        v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
        if (dead) return;                      // unmounted while this fetch was in flight
        const objUrl = URL.createObjectURL(blob);
        blobUrls.push(objUrl);                 // revoked in destroy() — otherwise these leak
        v.src = objUrl;
        v.addEventListener('loadedmetadata', () => { s.ready = true; read(); });
        // Reveal the video (hide the still poster) only once a real frame has
        // painted — on iOS a seeked-but-never-played muted video stays blank, so
        // hiding the still on metadata alone would flash an empty scene.
        v.addEventListener('seeked', () => { s.el.classList.add('has-clip'); }, { once: true });
        v.addEventListener('loadeddata', () => { try { v.pause(); } catch (e) {} if (userReady) primeVideo(v); });
        s.el.appendChild(v); s.video = v; s.hasClip = true;
      }).catch(() => { /* stays "loading" on purpose: read() runs every frame, so
                          re-arming here would refetch a 404 clip at scroll speed.
                          The still remains as the scene. */ });
  }

  function read() {
    const y = window.scrollY || window.pageYOffset;
    // Floored: crossfade:0 would make every in-range scene 0/0 = NaN opacity — a blank film.
    const fade = Math.max(1, CROSSFADE * vh);
    let ci = 0;
    for (let i = 0; i < NSEG; i++) if (y >= SEGMENTS[i].start) ci = i;

    for (let i = 0; i < NSEG; i++) {
      const s = SEGMENTS[i];
      if (y > s.start - 1.6 * vh && y < s.end + 1.6 * vh) loadClip(s);
      const local = clamp((y - s.start) / (s.end - s.start), 0, 1);
      s.target = s.linger ? lingerEase(local, s.linger) : local;
      // The last segment never fades out past its end: the film holds on its
      // final frame while the acts scroll up over it. Without the hold the fixed
      // stage empties one crossfade past the last seam, while the track's
      // trailing +1vh (and any acts shorter than a viewport) still has to be
      // scrolled through — which reads as a blank band of bare .sw-sky between
      // the film and the first act.
      let outside = 0;
      if (y < s.start) outside = s.start - y;
      else if (y > s.end && i < NSEG - 1) outside = y - s.end;
      const op = smooth(1 - outside / fade);
      s.el.style.opacity = op; s.visible = op > 0.001;
      s.el.style.zIndex = (i === ci) ? '120' : String(100 + Math.round(op * 10));
      if (!s.hasClip || !s.ready) {
        const sc = reduce ? 1 : 1.03 + local * 0.14;
        s.img.style.transform = `translateX(${stageX - 2}vw) scale(${sc.toFixed(3)})`;
      }
    }

    for (let i = 0; i < N; i++) {
      const seg = SECTIONS[i]._seg;
      const pr = clamp((y - seg.start) / (seg.end - seg.start), 0, 1);
      const before = y < seg.start, past = y > seg.end;   // not `after` — that is the acts container
      let cop;
      if (i === 0) cop = past ? 0 : smooth(1 - pr / 0.62);            // greets on landing
      else if (i === N - 1) cop = before ? 0 : smooth(pr / 0.4);       // holds CTA at the end
      else cop = (before || past) ? 0 : smooth(1 - Math.abs(pr - 0.5) / 0.5);
      const c = copies[i];
      c.style.opacity = cop;
      // -50% keeps the block optically centred (the CSS rule is overridden by this
      // inline transform, so the centering has to be re-stated here); the second
      // term is the gentle parallax drift as the chapter passes.
      c.style.transform = reduce ? 'translateY(-50%)' : `translateY(calc(-50% + ${(0.5 - pr) * 4}vh))`;
      c.style.pointerEvents = cop > 0.5 ? 'auto' : 'none';
    }

    const cur = SEGMENTS[ci];
    const near = clamp(cur.kind === 'dive' ? cur.si
      : (((y - cur.start) / (cur.end - cur.start)) > 0.5 ? cur.si + 1 : cur.si), 0, N - 1);
    if (near !== activeIndex) {
      activeIndex = near;
      dots.forEach((d, k) => d.classList.toggle('is-active', k === near));
      nav.querySelectorAll('.sw-nav__item').forEach((n, k) => n.classList.toggle('is-active', k === near));
      container.style.setProperty('--sw-accent', SECTIONS[near].accent || '');
      // The readability scrim follows the active chapter's alignment, so a
      // right-aligned or centred chapter isn't darkened on the wrong side.
      copylayer.dataset.align = SECTIONS[near].align || 'left';
    }
    scrollbarFill.style.transform = `scaleX(${clamp(y / (totalW * vh))})`;
    hint.style.opacity = clamp(1 - y / (0.5 * vh));

    // HUD frame counter — a readout of where the flight actually is, in frames.
    if (hudFrames) hudFrames.textContent = 'FRAME ' + pad3(Math.round(clamp(y / (totalW * vh)) * TOTAL_FRAMES));
    // Past the last seam the film is done: hand the page over to the acts by
    // fading the film chrome out. Without this the fixed layers sit on top of
    // the editorial panels scrolling up over the last frame.
    const past = after.childElementCount > 0 && y > totalW * vh - vh * 0.35;
    if (past !== isPast) { isPast = past; container.classList.toggle('is-past', past); }
    if (particles) particles.style.transform = `translate3d(0, ${-y * 0.05}px, 0)`;
    ticking = false;
  }

  function raf() {
    const eps = isMobile() ? 0.02 : 0.008;   // coarser seek step on phones = fewer decodes
    for (let i = 0; i < NSEG; i++) {
      const s = SEGMENTS[i];
      if (!s.hasClip || !s.ready || !s.video) continue;
      // Never queue a seek while the decoder is still resolving the last one.
      // On phones a fast flick would otherwise pile up seeks and freeze the clip;
      // cur keeps lerping, so we snap to the latest target the moment it's free.
      if (s.video.seeking) continue;
      if (!s.visible && Math.abs(s.cur - s.target) < 0.002) continue;
      s.cur += (s.target - s.cur) * (reduce ? 1 : 0.18);
      const dur = s.video.duration || 1;
      const t = clamp(s.cur, 0, 0.999) * dur;
      if (Math.abs(s.video.currentTime - t) > eps) { try { s.video.currentTime = t; } catch (e) {} }
    }
    if (!dead) requestAnimationFrame(raf);
  }

  // iOS needs a user gesture before a muted video will decode/paint reliably. On the
  // first touch we prime every loaded clip (muted play→pause) so the first seek is
  // instant instead of showing a blank frame. `userReady` also makes freshly-loaded
  // clips prime themselves (see loadClip).
  let userReady = false;
  function primeVideo(v) {
    if (!isMobile() || !v) return;
    try { const p = v.play(); if (p && p.then) p.then(() => { try { v.pause(); } catch (e) {} }).catch(() => {}); }
    catch (e) {}
  }
  function onFirstGesture() {
    if (userReady) return;
    userReady = true;
    SEGMENTS.forEach(s => primeVideo(s.video));
  }
  // Named so destroy() can remove them. (`once` listeners self-remove after firing,
  // but an unmount before the first touch would otherwise leave them attached.)
  window.addEventListener('pointerdown', onFirstGesture, { once: true, passive: true });
  window.addEventListener('touchstart', onFirstGesture, { once: true, passive: true });

  // Particles are a per-frame cost we can't afford alongside video scrubbing on a phone.
  seedParticles(particles, reduce || coarse);
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(read); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  // Mobile browsers fire `resize` every time the URL bar slides in/out. Re-running
  // layout() there rebuilds the track height and yanks the scroll position, so on
  // touch we ignore height-only changes and only relayout when the width actually
  // changes (rotation still comes through orientationchange). layout() records the
  // width it laid out at.
  function onResize() {
    if (coarse && window.innerWidth === laidOutW) return;
    layout();
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', layout);
  window.addEventListener('load', layout);
  layout();
  requestAnimationFrame(raf);

  // ---- teardown ----
  // Returned so component frameworks can unmount cleanly: React's useEffect
  // cleanup, Vue's onUnmounted, Svelte's onDestroy. Idempotent — calling it
  // twice is safe, which matters because a hot reload may race it.
  function destroy() {
    if (dead) return;
    dead = true;                                  // stops the rAF loop and pending loads
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', layout);
    window.removeEventListener('load', layout);
    window.removeEventListener('pointerdown', onFirstGesture);
    window.removeEventListener('touchstart', onFirstGesture);
    SEGMENTS.forEach(s => {
      if (!s.video) return;
      try { s.video.pause(); } catch (e) {}
      s.video.removeAttribute('src');
      try { s.video.load(); } catch (e) {}       // release the decoder
      s.video = null;
    });
    blobUrls.forEach(u => { try { URL.revokeObjectURL(u); } catch (e) {} });
    blobUrls.length = 0;
    container.classList.remove('sw-root', 'is-past');
    container.replaceChildren();
  }

  return { destroy };

  // ---- helpers ----
  function el(tag, cls) { const n = document.createElement(tag); if (cls) n.className = cls; return n; }
  function pad(n) { return String(n).padStart(2, '0'); }
  function pad3(n) { return String(n).padStart(3, '0'); }

  // Acts are plain document-flow panels — no scrubbing, no fixed positioning. Kept
  // data-driven (not raw HTML) so every build's editorial page comes out with the
  // same rhythm and the same theme tokens as the film it follows.
  function renderAct(a) {
    if (!a || !a.kind) return null;
    if (a.kind === 'footer') return renderFooter(a);
    const s = el('section', 'sw-act sw-act--' + a.kind + ' sw-act--' + (a.tone || 'light'));
    if (a.id) s.id = a.id;
    if (a.kind === 'statement') {
      s.innerHTML =
        (a.eyebrow ? `<span class="sw-act__eyebrow">${esc(a.eyebrow)}</span>` : '') +
        `<h2 class="sw-act__title">${esc(a.title || '')}</h2>` +
        (a.body ? `<p class="sw-act__body">${esc(a.body)}</p>` : '');
    } else if (a.kind === 'cards') {
      s.innerHTML =
        (a.title ? `<h2 class="sw-act__title">${esc(a.title)}</h2>` : '') +
        `<div class="sw-act__grid">${(a.cards || []).map(c =>
          `<article class="sw-card sw-card--${esc(c.tone || 'light')}">` +
          `<h3>${esc(c.title || '')}</h3>` +
          (c.body ? `<p>${esc(c.body)}</p>` : '') +
          `<i class="sw-card__mark"></i></article>`).join('')}</div>`;
    } else if (a.kind === 'cta') {
      s.innerHTML =
        `<h2 class="sw-act__title">${esc(a.title || '')}</h2>` +
        (a.body ? `<p class="sw-act__body">${esc(a.body)}</p>` : '') +
        `<form class="sw-act__form" onsubmit="return false">` +
        `<input type="email" placeholder="${esc(a.placeholder || 'your@email.com')}" aria-label="${esc(a.placeholder || 'Email address')}" />` +
        `<button type="submit">${esc((a.action && a.action.label) || 'Send')}</button></form>`;
    } else if (a.kind === 'html') {
      s.innerHTML = a.html || '';
    } else return null;
    return s;
  }
  // ---- the footer: brand, an optional note, and a link row -----------------
  // A key the user didn't give emits no element at all, and a footer with
  // nothing in it is dropped rather than rendered as an empty band.
  function renderFooter(a) {
    const f = el('footer', 'sw-act sw-act--footer sw-act--' + esc(a.tone || 'dark'));
    if (a.id) f.id = a.id;
    // An off-site link opens in a new tab; an in-page one must not, or the
    // anchor jump lands in a blank window.
    const links = (a.links && a.links.length)
      ? `<nav class="sw-act__links">${a.links.map(l =>
          `<a href="${esc(l.href || '#')}"${/^(https?:)?\/\//.test(l.href || '') ? ' target="_blank" rel="noopener"' : ''}>` +
          `<span>${esc(l.label || '')}</span></a>`).join('')}</nav>` : '';
    f.innerHTML =
      (a.brand ? `<span class="sw-act__brand">${esc(a.brand)}</span>` : '') +
      links +
      (a.note ? `<span class="sw-act__note">${esc(a.note)}</span>` : '');
    if (!f.childElementCount) return null;
    return f;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function ctaBtns(cta) {
    let h = '';
    if (cta.primary) h += `<a class="sw-btn sw-btn--primary" href="${esc(cta.primary.href || '#')}">${esc(cta.primary.label)}</a>`;
    if (cta.secondary) h += `<a class="sw-btn sw-btn--ghost" href="${esc(cta.secondary.href || '#')}">${esc(cta.secondary.label)}</a>`;
    return h;
  }
}

function seedParticles(host, reduce) {
  if (!host || reduce) return;
  const kinds = ['dot', 'dot', 'ring'];
  const seeds = [7, 23, 41, 58, 71, 88, 12, 34, 52, 66, 83, 95, 18, 29, 47, 63, 77, 91, 5, 38, 55, 69, 82, 97];
  for (let k = 0; k < 20; k++) {
    const s = document.createElement('span');
    s.className = 'sw-pt sw-pt--' + kinds[k % kinds.length];
    s.style.left = seeds[k % seeds.length] + 'vw';
    s.style.top = ((seeds[(k * 3) % seeds.length] * 1.3) % 100) + 'vh';
    s.style.setProperty('--sw-sc', (0.5 + ((seeds[(k * 5) % seeds.length] % 60) / 60) * 1.1).toFixed(2));
    const dur = 14 + (seeds[(k * 7) % seeds.length] % 22);
    s.style.animationDuration = dur + 's';
    s.style.animationDelay = (-(seeds[(k * 2) % seeds.length] % dur)) + 's';
    host.appendChild(s);
  }
}

function injectCSS() {
  if (document.getElementById('sw-css')) return;
  const css = `
  .sw-root{--sw-bg:#F5EDE0;--sw-ink:#241d2b;--sw-ink-soft:#6a6072;--sw-accent:#8a7bb5;
    --sw-font-display:ui-rounded,"SF Pro Rounded","Segoe UI",system-ui,sans-serif;
    --sw-font-body:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,system-ui,sans-serif;
    color:var(--sw-ink);font-family:var(--sw-font-body);}
  html,body{margin:0;background:var(--sw-bg,#F5EDE0);overflow-x:hidden;}
  .sw-sky{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;background:var(--sw-bg);}
  .sw-sky__grad{position:absolute;inset:-10%;background:linear-gradient(178deg,color-mix(in srgb,var(--sw-accent) 12%,var(--sw-bg)) 0%,var(--sw-bg) 55%,color-mix(in srgb,var(--sw-accent) 6%,var(--sw-bg)) 100%);}
  .sw-sky__glow{position:absolute;inset:0;background:radial-gradient(60% 42% at 74% 16%,color-mix(in srgb,var(--sw-accent) 22%,transparent),transparent 70%),radial-gradient(46% 34% at 50% 50%,color-mix(in srgb,#fff 45%,transparent),transparent 70%);}
  .sw-particles{position:absolute;inset:-6% -2%;will-change:transform;}
  .sw-pt{position:absolute;width:13px;height:13px;transform:scale(var(--sw-sc,1));opacity:0;animation:sw-drift linear infinite;}
  .sw-pt::before{content:"";position:absolute;inset:0;border-radius:50%;}
  .sw-pt--dot::before{background:radial-gradient(circle at 34% 30%,color-mix(in srgb,var(--sw-accent) 60%,#000),#000 82%);}
  .sw-pt--ring::before{background:transparent;border:2px solid color-mix(in srgb,var(--sw-accent) 55%,transparent);}
  @keyframes sw-drift{0%{opacity:0;transform:scale(var(--sw-sc)) translate(0,12vh) rotate(0)}12%{opacity:.5}88%{opacity:.45}100%{opacity:0;transform:scale(var(--sw-sc)) translate(4vw,-22vh) rotate(210deg)}}
  .sw-scrollbar{position:fixed;top:0;left:0;right:0;height:3px;z-index:60;background:color-mix(in srgb,var(--sw-accent) 14%,transparent);}
  .sw-scrollbar span{display:block;height:100%;width:100%;transform-origin:0 50%;transform:scaleX(0);background:var(--sw-accent);}
  .sw-topbar{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:clamp(14px,2.4vw,26px) clamp(18px,5vw,64px);}
  .sw-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--sw-ink);}
  .sw-brand__mark{width:24px;height:28px;border-radius:7px 7px 10px 10px;background:linear-gradient(160deg,var(--sw-accent),color-mix(in srgb,var(--sw-accent) 60%,#000));box-shadow:0 6px 14px color-mix(in srgb,var(--sw-accent) 40%,transparent);}
  .sw-brand__name{font-family:var(--sw-font-display);font-weight:700;font-size:1.1rem;}
  .sw-nav{display:flex;gap:4px;padding:5px;background:color-mix(in srgb,#fff 55%,transparent);backdrop-filter:blur(10px);border:1px solid color-mix(in srgb,var(--sw-accent) 16%,transparent);border-radius:999px;}
  .sw-nav__item{font:inherit;font-size:.82rem;color:var(--sw-ink-soft);border:0;background:transparent;cursor:pointer;padding:7px 14px;border-radius:999px;transition:color .25s,background .25s;}
  .sw-nav__item:hover{color:var(--sw-ink);} .sw-nav__item.is-active{color:#fff;background:var(--sw-accent);}
  .sw-topcta{text-decoration:none;font-weight:600;font-size:.9rem;color:#fff;background:var(--sw-ink);padding:10px 20px;border-radius:999px;white-space:nowrap;}
  .sw-stage{position:fixed;inset:0;z-index:10;pointer-events:none;}
  .sw-scene{position:absolute;inset:0;opacity:0;overflow:hidden;will-change:opacity;}
  .sw-scene__video,.sw-scene__still{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 42%;}
  .sw-scene__still{will-change:transform;} .sw-scene.has-clip .sw-scene__still{opacity:0;} .sw-scene__video{z-index:1;}
  .sw-copylayer{position:fixed;inset:0;z-index:20;pointer-events:none;}
  .sw-copylayer::before{content:"";position:absolute;inset:0;width:min(58vw,780px);background:linear-gradient(90deg,var(--sw-bg) 0%,color-mix(in srgb,var(--sw-bg) 82%,transparent) 34%,color-mix(in srgb,var(--sw-bg) 40%,transparent) 62%,transparent 100%);}
  .sw-copy{position:absolute;left:clamp(18px,5vw,64px);top:50%;transform:translateY(-50%);width:min(42vw,460px);opacity:0;will-change:opacity,transform;}
  .sw-copy__num{font-family:ui-monospace,Menlo,monospace;font-size:.74rem;letter-spacing:.12em;color:var(--sw-ink-soft);}
  .sw-copy__eyebrow{display:block;margin-top:18px;font-family:var(--sw-font-display);font-weight:700;font-size:.8rem;letter-spacing:.16em;text-transform:uppercase;color:var(--sw-accent);}
  .sw-copy__title{font-family:var(--sw-font-display);font-weight:700;color:var(--sw-ink);font-size:clamp(2rem,4.4vw,3.5rem);line-height:1.03;margin:12px 0 0;letter-spacing:-.01em;text-shadow:0 2px 20px color-mix(in srgb,var(--sw-bg) 70%,transparent);}
  .sw-copy__body{margin-top:18px;font-size:clamp(1rem,1.25vw,1.14rem);line-height:1.55;color:color-mix(in srgb,var(--sw-ink) 78%,var(--sw-ink-soft));max-width:40ch;text-shadow:0 1px 12px color-mix(in srgb,var(--sw-bg) 90%,transparent);}
  .sw-copy__tags{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin:24px 0 0;padding:0;}
  .sw-copy__tags li{font-size:.82rem;font-weight:600;color:color-mix(in srgb,var(--sw-accent) 70%,#000);padding:7px 14px;border-radius:999px;background:color-mix(in srgb,var(--sw-accent) 14%,#fff);border:1px solid color-mix(in srgb,var(--sw-accent) 30%,transparent);}
  .sw-copy__cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px;pointer-events:auto;}
  .sw-btn{text-decoration:none;font-weight:600;font-size:.95rem;padding:13px 24px;border-radius:999px;transition:transform .2s;}
  .sw-btn--primary{color:#fff;background:var(--sw-ink);} .sw-btn--primary:hover{transform:translateY(-2px);}
  .sw-btn--ghost{color:var(--sw-ink);border:1.5px solid color-mix(in srgb,var(--sw-ink) 25%,transparent);} .sw-btn--ghost:hover{transform:translateY(-2px);}
  .sw-route{position:fixed;right:clamp(14px,2.4vw,30px);top:50%;z-index:40;transform:translateY(-50%);display:flex;flex-direction:column;gap:22px;padding:18px 10px;}
  .sw-route::before{content:"";position:absolute;left:50%;top:22px;bottom:22px;width:2px;transform:translateX(-50%);background:var(--sw-accent);opacity:.28;}
  .sw-route__dot{position:relative;border:0;background:transparent;cursor:pointer;width:14px;height:14px;display:grid;place-items:center;}
  .sw-route__dot i{width:9px;height:9px;border-radius:50%;background:color-mix(in srgb,var(--sw-accent) 40%,transparent);transition:transform .3s,background .3s,box-shadow .3s;}
  .sw-route__dot:hover i{transform:scale(1.25);background:var(--sw-accent);}
  .sw-route__dot.is-active i{background:var(--sw-accent);transform:scale(1.4);box-shadow:0 0 0 5px color-mix(in srgb,var(--sw-accent) 22%,transparent);}
  .sw-route__label{position:absolute;right:24px;top:50%;transform:translateY(-50%) translateX(6px);white-space:nowrap;font-size:.78rem;font-weight:600;color:var(--sw-ink);background:color-mix(in srgb,#fff 85%,transparent);backdrop-filter:blur(6px);padding:5px 11px;border-radius:999px;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;border:1px solid color-mix(in srgb,var(--sw-accent) 14%,transparent);}
  .sw-route__dot:hover .sw-route__label,.sw-route__dot.is-active .sw-route__label{opacity:1;transform:translateY(-50%) translateX(0);}
  .sw-hint{position:fixed;left:50%;bottom:26px;z-index:30;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;color:var(--sw-ink-soft);transition:opacity .3s;}
  .sw-hint i{width:22px;height:34px;border-radius:12px;border:2px solid color-mix(in srgb,var(--sw-ink) 28%,transparent);position:relative;}
  .sw-hint i::after{content:"";position:absolute;left:50%;top:7px;width:4px;height:7px;border-radius:2px;background:var(--sw-accent);transform:translateX(-50%);animation:sw-wheel 1.7s ease-in-out infinite;}
  @keyframes sw-wheel{0%{opacity:0;top:6px}40%{opacity:1}100%{opacity:0;top:17px}}
  .sw-track{position:relative;z-index:1;width:100%;pointer-events:none;}
  @media (max-width:860px){
    .sw-nav{display:none;}
    .sw-copylayer::before{width:100%;height:60%;top:auto;bottom:0;background:linear-gradient(0deg,var(--sw-bg) 8%,color-mix(in srgb,var(--sw-bg) 70%,transparent) 46%,transparent 100%);}
    /* Anchor copy to the bottom, clear of the home indicator / collapsing URL bar.
       dvh + env() are progressive: browsers that lack them keep the vh fallback line. */
    .sw-copy{left:clamp(18px,5vw,64px);right:clamp(18px,5vw,64px);top:auto;bottom:clamp(64px,14vh,120px);transform:none;width:auto;max-width:560px;}
    .sw-copy{bottom:calc(clamp(56px,12dvh,110px) + env(safe-area-inset-bottom));}
    .sw-copy__title{font-size:clamp(1.9rem,7.5vw,2.7rem);}
    .sw-copy__body{max-width:none;font-size:clamp(.98rem,3.6vw,1.1rem);} .sw-scene__video,.sw-scene__still{object-position:center 46%;}
    .sw-hint{bottom:calc(20px + env(safe-area-inset-bottom));}
    .sw-route{gap:16px;right:6px;} .sw-route__label{display:none;}
  }
  /* Portrait phones crop a 16:9 clip hard; keep the framing centred so the focal
     subject (which the camera dives toward) stays in view. */
  @media (max-width:860px) and (orientation:portrait){
    .sw-scene__video,.sw-scene__still{object-position:center 44%;}
  }
  /* Touch: give the route dots a finger-sized hit area without growing the visible dot. */
  @media (hover:none) and (pointer:coarse){
    .sw-route{padding:14px 6px;}
    .sw-route__dot{width:28px;height:28px;}
    .sw-btn{padding:15px 26px;}
  }
  @media (prefers-reduced-motion:reduce){ .sw-hint i::after{animation:none;} .sw-pt{display:none;} }

  /* ---- copy alignment: which side of the frame this chapter speaks from ---- */
  .sw-copy--right{left:auto;right:clamp(18px,5vw,64px);text-align:right;}
  .sw-copy--right .sw-copy__tags,.sw-copy--right .sw-copy__cta{justify-content:flex-end;}
  .sw-copy--right .sw-copy__body{margin-left:auto;}
  .sw-copy--center{left:0;right:0;margin-inline:auto;width:min(62vw,760px);text-align:center;}
  .sw-copy--center .sw-copy__tags,.sw-copy--center .sw-copy__cta{justify-content:center;}
  .sw-copy--center .sw-copy__body{margin-inline:auto;}
  /* the readability scrim follows the active chapter's side */
  .sw-copylayer[data-align="right"]::before{left:auto;right:0;background:linear-gradient(270deg,var(--sw-bg) 0%,color-mix(in srgb,var(--sw-bg) 82%,transparent) 34%,color-mix(in srgb,var(--sw-bg) 40%,transparent) 62%,transparent 100%);}
  .sw-copylayer[data-align="center"]::before{width:100%;background:radial-gradient(70% 60% at 50% 50%,color-mix(in srgb,var(--sw-bg) 72%,transparent),transparent 78%);}

  /* ---- HUD: corner instrumentation ---- */
  .sw-hud{position:fixed;inset:0;z-index:35;pointer-events:none;font-family:ui-monospace,Menlo,"Cascadia Mono",monospace;
    font-size:.66rem;letter-spacing:.18em;text-transform:uppercase;color:color-mix(in srgb,var(--sw-ink) 62%,transparent);transition:opacity .4s;}
  .sw-hud__sys{position:absolute;left:clamp(18px,5vw,64px);top:calc(clamp(14px,2.4vw,26px) + 44px);}
  .sw-hud__frame{position:absolute;right:clamp(18px,5vw,64px);top:calc(clamp(14px,2.4vw,26px) + 44px);font-variant-numeric:tabular-nums;}
  .sw-hud__verb{position:absolute;right:clamp(18px,5vw,64px);bottom:calc(26px + env(safe-area-inset-bottom));}
  .sw-hud__mk{position:absolute;width:14px;height:14px;border:1px solid color-mix(in srgb,var(--sw-accent) 45%,transparent);}
  .sw-hud__mk--tl{left:clamp(12px,3vw,34px);top:clamp(56px,8vh,90px);border-right:0;border-bottom:0;}
  .sw-hud__mk--tr{right:clamp(12px,3vw,34px);top:clamp(56px,8vh,90px);border-left:0;border-bottom:0;}
  .sw-hud__mk--bl{left:clamp(12px,3vw,34px);bottom:clamp(56px,8vh,90px);border-right:0;border-top:0;}
  .sw-hud__mk--br{right:clamp(12px,3vw,34px);bottom:clamp(56px,8vh,90px);border-left:0;border-top:0;}
  @media (max-width:860px){ .sw-hud__mk,.sw-hud__sys{display:none;} .sw-hud__frame{top:calc(clamp(14px,2.4vw,26px) + 34px);} }

  /* ---- the film hands over to the acts ---- */
  .sw-root.is-past .sw-copylayer,.sw-root.is-past .sw-route,.sw-root.is-past .sw-hud,
  .sw-root.is-past .sw-particles,.sw-root.is-past .sw-hint{opacity:0;pointer-events:none;}
  .sw-root.is-past .sw-stage{filter:brightness(.55) saturate(.85);}
  .sw-copylayer,.sw-route{transition:opacity .4s;}

  /* ---- acts: the editorial page after the film ---- */
  .sw-after{position:relative;z-index:25;}
  .sw-act{position:relative;padding:clamp(72px,14vh,160px) clamp(20px,7vw,110px);}
  .sw-act--light{background:#F2EFE9;color:#171419;}
  .sw-act--dark{background:var(--sw-bg);color:var(--sw-ink);}
  .sw-act--tint{background:color-mix(in srgb,var(--sw-accent) 16%,#EFF2F4);color:#171419;}
  .sw-act__eyebrow{display:block;font-family:ui-monospace,Menlo,monospace;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;opacity:.6;margin-bottom:22px;}
  .sw-act__title{font-family:var(--sw-font-display);font-weight:500;font-size:clamp(2rem,5vw,4rem);line-height:1.04;letter-spacing:-.015em;margin:0;max-width:18ch;}
  .sw-act__body{margin-top:22px;font-size:clamp(1rem,1.2vw,1.12rem);line-height:1.6;max-width:52ch;opacity:.78;}
  .sw-act--statement{display:grid;justify-items:start;}
  .sw-act__grid{display:grid;gap:clamp(14px,2vw,26px);grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));margin-top:clamp(30px,5vh,56px);}
  .sw-card{position:relative;border-radius:20px;padding:clamp(26px,3.4vw,44px);min-height:clamp(220px,30vh,320px);display:flex;flex-direction:column;justify-content:flex-end;}
  .sw-card--dark{background:#141117;color:#F2EAD9;}
  .sw-card--light{background:#E4E7E4;color:#171419;}
  .sw-card h3{font-family:var(--sw-font-display);font-weight:500;font-size:clamp(1.4rem,2.4vw,2rem);line-height:1.1;margin:0;}
  .sw-card p{margin:14px 0 0;font-size:.98rem;line-height:1.55;opacity:.72;max-width:38ch;}
  .sw-card__mark{position:absolute;top:clamp(20px,2.4vw,30px);right:clamp(20px,2.4vw,30px);width:34px;height:34px;border-radius:50%;border:1px solid currentColor;opacity:.5;}
  .sw-card__mark::after{content:"↗";position:absolute;inset:0;display:grid;place-items:center;font-size:.9rem;}
  .sw-act--cta{text-align:center;display:grid;justify-items:center;}
  .sw-act--cta .sw-act__title,.sw-act--cta .sw-act__body{max-width:22ch;}
  .sw-act--cta .sw-act__body{max-width:46ch;}
  .sw-act__form{display:flex;align-items:center;gap:6px;margin-top:34px;padding:6px 6px 6px 22px;border-radius:999px;background:#fff;box-shadow:0 10px 30px rgba(0,0,0,.08);max-width:100%;}
  .sw-act__form input{border:0;outline:0;background:transparent;font:inherit;font-size:.98rem;padding:12px 0;min-width:min(46vw,240px);color:inherit;}
  .sw-act__form button{border:0;cursor:pointer;font:inherit;font-weight:600;font-size:.94rem;padding:13px 26px;border-radius:999px;background:#171419;color:#fff;}
  .sw-act--footer{padding-block:clamp(40px,7vh,72px);font-size:.86rem;display:flex;flex-wrap:wrap;
    align-items:center;justify-content:space-between;gap:clamp(18px,3vw,40px);}
  .sw-act__brand{font-family:var(--sw-font-display);font-weight:600;letter-spacing:.04em;}
  .sw-act__links{display:flex;flex-wrap:wrap;gap:clamp(14px,2vw,30px);}
  .sw-act__links a{color:inherit;text-decoration:none;opacity:.7;transition:opacity .25s;}
  .sw-act__links a:hover{opacity:1;}
  .sw-act__note{opacity:.5;}

  /* The footer stacks on a phone; on desktop it is one row.
     .sw-act--footer carries the layout, the blocks are plain spans. */
  @media (max-width:860px){
    .sw-act--footer{flex-direction:column;align-items:flex-start;gap:clamp(16px,4vh,28px);}
  }
  `;
  // Wrap in a cascade layer so the page's own theme tokens (unlayered
  // :root / .sw-root { --sw-bg / --sw-ink / --sw-accent … }) always win over
  // these defaults, regardless of injection order. Enables clean dark themes.
  const style = document.createElement('style'); style.id = 'sw-css';
  style.textContent = '@layer sw {\n' + css + '\n}';
  document.head.appendChild(style);
}

// Expose for module + global use.
if (typeof module !== 'undefined' && module.exports) module.exports = { mountQuickieScroll };
if (typeof window !== 'undefined') window.mountQuickieScroll = mountQuickieScroll;

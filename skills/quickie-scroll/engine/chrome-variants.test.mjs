// Run: node engine/chrome-variants.test.mjs — no framework, no install.
// Guards the chrome variants (rules.md §19): a build that can't vary its header and
// progress rail is a build that ships the same-looking site every time.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const SRC = new URL('./quickie-scroll.js', import.meta.url);
const src = fs.readFileSync(SRC, 'utf8');

// minimal DOM — enough for the engine's construction path
class N {
  constructor(tag){ this.tagName=tag.toUpperCase(); this.children=[]; this.style={setProperty(){},}; this._cls=new Set(); this.dataset={}; this._html=''; }
  get classList(){ const s=this._cls; return { add:(...c)=>c.forEach(x=>s.add(x)), remove:(...c)=>c.forEach(x=>s.delete(x)),
    toggle:(c,on)=>{ on?s.add(c):s.delete(c); }, contains:c=>s.has(c) }; }
  get className(){ return [...this._cls].join(' '); }
  set className(v){ this._cls=new Set(String(v).split(/\s+/).filter(Boolean)); }
  appendChild(n){ this.children.push(n); n.parentNode=this; return n; }
  setAttribute(k,v){ this[k]=v; } getAttribute(k){ return this[k]; }
  addEventListener(){} removeEventListener(){}
  set innerHTML(v){ this._html=v; } get innerHTML(){ return this._html; }
  set textContent(v){ this._text=v; } get textContent(){ return this._text||''; }
  querySelectorAll(){ return []; } getBoundingClientRect(){ return {top:0,bottom:0,height:0,width:0}; }
  get firstChild(){ return this.children[0]||null; }
  remove(){}
}
const all = (n, out=[]) => { out.push(n); n.children.forEach(c=>all(c,out)); return out; };
const doc = {
  createElement: t => new N(t),
  head: new N('head'), body: new N('body'),
  documentElement: new N('html'),
  getElementById: () => null,
  querySelector: () => null, querySelectorAll: () => [],
  addEventListener(){}, removeEventListener(){},
};
const win = {
  document: doc, innerWidth: 1440, innerHeight: 900, devicePixelRatio: 1,
  matchMedia: () => ({ matches:false, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} }),
  requestAnimationFrame: () => 0, cancelAnimationFrame(){},
  addEventListener(){}, removeEventListener(){}, getComputedStyle: () => ({ getPropertyValue: () => '' }),
  IntersectionObserver: class { observe(){} disconnect(){} unobserve(){} },
  scrollY: 0, URL: { createObjectURL: () => 'blob:x', revokeObjectURL(){} }, fetch: async () => ({ blob: async () => ({}) }),
};
win.window = win; win.globalThis = win; win.self = win;
const ctx = vm.createContext(win);
vm.runInContext(src + '\n;globalThis.__mount = mountQuickieScroll;', ctx);
const mount = ctx.__mount;

const chapters = n => Array.from({length:n}, (_,i) => ({ id:'c'+i, label:'Chapter '+i, clip:'/c'+i+'.mp4', still:'/c'+i+'.png' }));

function build(cfg) {
  const root = new N('div');
  const h = mount(root, { sections: chapters(4), ...cfg });
  return { root, nodes: all(root), handle: h };
}

// 1. defaults still produce a pill nav + dot rail + the generic mark
{
  const { nodes } = build({ brand:{ name:'X' } });
  assert.ok(nodes.some(n => n.classList.contains('sw-nav--pills')), 'default nav is pills');
  assert.ok(nodes.some(n => n.classList.contains('sw-route--dots')), 'default rail is dots');
  const mark = nodes.find(n => n.classList.contains('sw-brand__mark'));
  assert.ok(mark && !mark.classList.contains('sw-brand__mark--custom'), 'default mark is the generic pill');
}
// 2. custom mark renders as-is, with no pill class
{
  const { nodes } = build({ brand:{ name:'X', mark:'<svg id="m"/>' } });
  const mark = nodes.find(n => n.classList.contains('sw-brand__mark'));
  assert.ok(mark.classList.contains('sw-brand__mark--custom'), 'custom mark flagged');
  assert.equal(mark.innerHTML, '<svg id="m"/>', 'custom mark markup kept');
}
// 3. mark:false ships a wordmark only
{
  const { nodes } = build({ brand:{ name:'X', mark:false } });
  assert.ok(!nodes.some(n => n.classList.contains('sw-brand__mark')), 'no mark element');
  assert.ok(nodes.some(n => n.classList.contains('sw-brand__name')), 'wordmark still there');
}
// 4. every nav + rail variant applies its class; false removes the element
for (const nav of ['pills','plain','numbers']) {
  const { nodes } = build({ nav });
  assert.ok(nodes.some(n => n.classList.contains('sw-nav--' + nav)), 'nav variant ' + nav);
}
for (const route of ['dots','bars','numbers','labels']) {
  const { nodes } = build({ route });
  assert.ok(nodes.some(n => n.classList.contains('sw-route--' + route)), 'rail variant ' + route);
}
{
  const { nodes } = build({ nav:false, route:false });
  assert.ok(!nodes.some(n => n.classList.contains('sw-nav')), 'nav:false removes the nav');
  assert.ok(!nodes.some(n => n.classList.contains('sw-route')), 'route:false removes the rail');
}
// 5. sides and placement
{
  const { nodes } = build({ routeSide:'left', navPlace:'center' });
  assert.ok(nodes.some(n => n.classList.contains('sw-route--left')), 'rail on the left');
  assert.ok(nodes.some(n => n.classList.contains('sw-topbar--navcenter')), 'nav centred');
}
// 6. rail markers stay clickable/labelled whatever the variant
{
  const { nodes } = build({ route:'numbers' });
  const dots = nodes.filter(n => n.classList.contains('sw-route__dot'));
  assert.equal(dots.length, 4, 'one marker per chapter');
  assert.ok(dots.every(d => d.getAttribute('aria-label')), 'markers are labelled for screen readers');
  assert.ok(dots[0].innerHTML.includes('sw-route__n'), 'index rendered for the numbers variant');
}
console.log('chrome variants: all checks passed');

/* =====================================================================
   Mohamed Elsaid, v4. One script for the home page.

     Navigation   active section, theme follows the ground, phone menu
     Introduction the name rises letter by letter, about 1.2 seconds
     Research     the live migration diagram, the page's one authored
                  moment: loops by itself while it is in view, about 5
                  seconds a round including its rest and reset, with a
                  pause button
     Elsewhere    a few quiet arrivals, played once, and nothing else

   Every movement runs on its own clock. Nothing is pinned and nothing
   is scrubbed to the scroll position, so the page never holds or lags
   behind the reader (Islam, 17 October). Native scrolling, no smooth-
   scroll library. With reduced motion nothing moves at all.
   ===================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* Clears the hero start state. A timer in the page head does the same
   after four seconds, even if this module never loads. */
const reveal = () => root.classList.remove('js-motion');

const css = getComputedStyle(root);
const ms = n => (parseFloat(css.getPropertyValue(n)) || 0) / 1000;
const px = n => parseFloat(css.getPropertyValue(n)) || 0;

const D_MID = ms('--d-mid') || 0.7;
const D_REVEAL = ms('--d-reveal') || 1.2;
const T_FINE = px('--m-travel-fine') || 20;
const T_BODY = px('--m-travel-body') || 28;
const T_LEAD = px('--m-travel-lead') || 44;

/* --ease from tokens.css, reproduced exactly. */
const EASE = CustomEase.create('token', 'M0,0 C0.16,1 0.3,1 1,1');
gsap.defaults({ ease: EASE, duration: D_MID });

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =====================================================================
   NAVIGATION
   ===================================================================== */
const nav = $('[data-nav]');
const toggle = $('[data-nav-toggle]');

function closeMenu() {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); }
});

/* In-page links: the browser scrolls (scroll-padding-top keeps the
   target below the fixed navigation), and keyboard focus moves with the
   jump so the next Tab continues from the section. */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = id === '#top' ? $('.hero') : $(id);
    if (!target) return;
    closeMenu();
    e.preventDefault();
    if (id === '#top') scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

/* The current section: underlined in the navigation, and the
   navigation turns dark over the dark sections. */
function setLayer(layer) {
  const name = layer.dataset.layer;
  $$('[data-link]').forEach(el => {
    const on = el.dataset.link === name;
    el.classList.toggle('is-on', on);
    if (on) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
  });
  root.classList.toggle('on-dark', layer.dataset.theme === 'dark');
}
/* The section under the navigation's bottom edge is current. At the
   very bottom of the page the last section is current even when it is
   too short to reach that edge (contact, on tall screens). */
const layers = $$('[data-layer]');
let current = null;
function trackLayer() {
  const line = px('--nav-h') + 1;
  const atEnd = innerHeight + scrollY >= root.scrollHeight - 2;
  const layer = atEnd ? layers[layers.length - 1]
    : layers.findLast(l => l.getBoundingClientRect().top <= line) ?? layers[0];
  if (layer !== current) { current = layer; setLayer(layer); }
}
let queued = false;
addEventListener('scroll', () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; trackLayer(); });
}, { passive: true });
addEventListener('resize', trackLayer);
trackLayer();

/* Opening a role's details changes the page height; triggers below it
   are recalculated (gsap-scrolltrigger: "call ScrollTrigger.refresh()
   after DOM/layout changes"). */
$$('.more-role').forEach(d => d.addEventListener('toggle', () => {
  setTimeout(() => ScrollTrigger.refresh(), ms('--d-base') * 1000 + 50);
}));

/* Certification and Service are open on wide screens and folded on a
   phone, where the doctorate and degrees lead (both v5 reviews). */
const phone = matchMedia('(max-width: 860px)');
/* On wide screens they are plain headings: out of the tab order, and
   reopened at once if anything closes them (Sol 6.1 found Enter could
   collapse a column with no way back). */
const foldCols = () => $$('[data-col-fold]').forEach(d => {
  d.open = !phone.matches;
  const s = $('summary', d);
  if (phone.matches) s.removeAttribute('tabindex'); else s.setAttribute('tabindex', '-1');
});
foldCols();
phone.addEventListener('change', foldCols);
$$('[data-col-fold]').forEach(d => d.addEventListener('toggle', () => {
  if (!phone.matches && !d.open) d.open = true;
}));

/* Phone only (the button is hidden on wide screens): an earlier role
   shows its title and dates; this opens and closes its whole text. */
$$('[data-fold]').forEach(btn => btn.addEventListener('click', () => {
  const role = btn.closest('.role');
  const open = role.classList.toggle('is-open');
  btn.setAttribute('aria-expanded', String(open));
  btn.textContent = open ? 'Hide role details' : 'Read role details';
  const more = $('.more-role', role);
  if (more) more.open = open;
  ScrollTrigger.refresh();
}));

/* =====================================================================
   RESEARCH: THE LIVE MIGRATION DIAGRAM
   Two servers. The virtual machine's memory pages are copied from A to
   B while it runs; pages it changes meanwhile turn white and are copied
   again; then a short pause, the last pages, and the machine runs on B.
   Built here so the markup stays short. With reduced motion it is drawn
   in its finished state.
   ===================================================================== */
const SVG = 'http://www.w3.org/2000/svg';
function node(tag, attrs, parent) {
  const el = document.createElementNS(SVG, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  parent.appendChild(el);
  return el;
}
function text(str, attrs, parent) {
  const el = node('text', attrs, parent);
  el.textContent = str;
  return el;
}

function buildMigration() {
  const fig = $('[data-migr]');
  if (!fig) return null;
  const svg = $('svg', fig);
  const thesis = fig.closest('.thesis');
  const steps = $$('[data-steps] li');
  const pause = $('[data-pause]', fig);
  const pauseLb = $('[data-pause-lb]', pause);

  const COLS = 6, ROWS = 4, SIZE = 26, GAP = 8;
  const gridW = COLS * SIZE + (COLS - 1) * GAP;

  function server(x, name) {
    const g = node('g', {}, svg);
    text(name, { x, y: 22, class: 'lb-strong' }, g);
    node('rect', { x, y: 36, width: 264, height: 240, class: 'host' }, g);
    const vm = node('g', {}, g);
    const box = node('rect', { x: x + 20, y: 62, width: 224, height: 196, class: 'vm' }, vm);
    text('Virtual machine', { x: x + 34, y: 90, class: 'lb vm-lb' }, vm);
    const state = text('', { x: x + 230, y: 90, 'text-anchor': 'end', class: 'state' }, vm);
    const x0 = x + 20 + (224 - gridW) / 2;
    const cells = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      cells.push({ x: x0 + c * (SIZE + GAP), y: 106 + r * (SIZE + GAP) });
    }
    return { vm, box, state, cells };
  }

  const A = server(8, 'Server A');
  const B = server(368, 'Server B');
  B.box.classList.add('is-target');

  node('line', { x1: 272, y1: 156, x2: 368, y2: 156, class: 'wire' }, svg);
  text('Network', { x: 320, y: 146, 'text-anchor': 'middle', class: 'lb' }, svg);
  const pkts = [0, 1, 2].map(() => node('rect', { x: 272, y: 152, width: 8, height: 8, class: 'pkt', opacity: 0 }, svg));

  const pages = A.cells.map(p => node('rect', { ...p, width: SIZE, height: SIZE, class: 'pg' }, A.vm));
  const dirty = A.cells.map(p => node('rect', { ...p, width: SIZE, height: SIZE, class: 'dirty', opacity: 0 }, A.vm));
  B.cells.forEach(p => node('rect', { x: p.x + .5, y: p.y + .5, width: SIZE - 1, height: SIZE - 1, class: 'slot' }, B.vm));
  const copied = B.cells.map(p => node('rect', { ...p, width: SIZE, height: SIZE, class: 'copied', opacity: 0 }, B.vm));

  /* Pages the machine writes during round one, then during round two. */
  const D1 = [2, 7, 9, 13, 16, 20, 22];
  const D2 = [9, 20];

  /* The current step, lit in the list and written into the caption
     inside the panel, so a phone reader sees both at once. */
  const cap = $('[data-cap]', fig);
  const setStep = i => {
    steps.forEach((li, n) => li.classList.toggle('is-on', n === i));
    if (cap && steps[i]) cap.innerHTML = `<span class="cap-n">${i + 1} of 3</span> ${steps[i].innerHTML}`;
  };
  const start = () => {
    thesis.classList.add('migr-live');
    setStep(0);
    A.state.textContent = 'running';
    B.state.textContent = '';
    B.box.classList.add('is-target');
  };
  /* The machine runs on B. Step 3 stays lit through the rest, so the
     story ends on its resolution instead of going blank. */
  const finish = () => {
    A.state.textContent = '';
    B.state.textContent = 'running';
    B.box.classList.remove('is-target');
  };
  const resetting = () => {
    B.state.textContent = '';
    B.box.classList.add('is-target');
  };

  /* Loops on its own (Islam, 18 October), in three acts (motion-design,
     Setup, Action, Resolution): the copy, a rest on the finished state,
     then a visible reset where B empties and A brightens back. The next
     round starts as the reset ends, so there is no dead pause and no
     jump (Islam: "a weird lag when it finishes and starts again"). */
  const tl = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'none' } });
  tl.call(start, null, 0)
    .set(A.vm, { opacity: 1 }, 0)
    .set(dirty, { opacity: 0 }, 0)
    .set(copied, { opacity: 0 }, 0)

    /* Round one: every page crosses while the machine keeps running. */
    .to(pkts, { opacity: 1, duration: .1, stagger: .12 }, 0)
    .fromTo(pkts, { x: 0 }, { x: 88, duration: .4, stagger: { each: .12, repeat: 2 }, immediateRender: false }, 0)
    .to(pkts, { opacity: 0, duration: .1 }, 1.25)
    .to(copied, { opacity: 1, duration: .2, stagger: .035 }, .05)

    /* Round two and the final copy send fewer packets, because fewer
       pages are left to move. */
    .to(pkts.slice(0, 2), { opacity: 1, duration: .1, stagger: .12 }, 1.5)
    .fromTo(pkts.slice(0, 2), { x: 0 }, { x: 88, duration: .4, stagger: { each: .12, repeat: 1 }, immediateRender: false }, 1.5)
    .to(pkts.slice(0, 2), { opacity: 0, duration: .1 }, 2.35)
    .to(pkts[0], { opacity: 1, duration: .1 }, 2.7)
    .fromTo(pkts[0], { x: 0 }, { x: 88, duration: .4, immediateRender: false }, 2.7)
    .to(pkts[0], { opacity: 0, duration: .1 }, 3.05);
  D1.forEach((i, n) => {
    const t = .35 + n * .1;
    tl.to(dirty[i], { opacity: 1, duration: .15 }, t).to(copied[i], { opacity: .25, duration: .15 }, t);
  });

  /* Round two: the changed pages are copied again; two more change. */
  tl.call(() => setStep(1), null, 1.4);
  D1.forEach((i, n) => {
    const t = 1.5 + n * .09;
    tl.to(dirty[i], { opacity: 0, duration: .15 }, t).to(copied[i], { opacity: 1, duration: .15 }, t);
  });
  D2.forEach((i, n) => {
    const t = 1.85 + n * .2;
    tl.to(dirty[i], { opacity: 1, duration: .15 }, t).to(copied[i], { opacity: .25, duration: .15 }, t);
  });

  /* Pause and switch: the last pages, then the machine runs on B. */
  tl.call(() => { setStep(2); A.state.textContent = 'paused'; }, null, 2.5)
    .to(D2.map(i => dirty[i]), { opacity: 0, duration: .15 }, 2.7)
    .to(D2.map(i => copied[i]), { opacity: 1, duration: .15 }, 2.7)
    .to(A.vm, { opacity: .3, duration: .5, ease: EASE }, 3.0)
    .call(finish, null, 3.3)

    /* Rest on the result, then the reset, in view. */
    .call(resetting, null, 4.6)
    .to(copied, { opacity: 0, duration: .45, stagger: { each: .006, from: 'end' }, ease: EASE }, 4.6)
    .to(A.vm, { opacity: 1, duration: .6, ease: EASE }, 4.6);

  /* Anything that moves on its own for more than five seconds needs a
     way to stop it (WCAG 2.2.2, level A). The reader's choice holds:
     a paused diagram stays paused when it scrolls back into view. */
  let held = false;
  let inView = false;
  const sync = () => (inView && !held ? tl.play() : tl.pause());
  pause.addEventListener('click', () => {
    held = !held;
    pause.classList.toggle('is-paused', held);
    pauseLb.textContent = held ? 'Play' : 'Pause';
    sync();
  });
  const seen = on => { inView = on; sync(); };

  if (reduced) {
    /* Drawn finished and still: all three steps at full ink. */
    tl.pause(3.4);
    finish();
    thesis.classList.remove('migr-live');
    steps.forEach(li => li.classList.remove('is-on'));
    if (cap) cap.hidden = true;
  } else {
    pause.hidden = false;
    setStep(0);
  }
  return { fig, tl, seen };
}
const migration = buildMigration();

/* =====================================================================
   AI INFRASTRUCTURE: THE ZOOM (v7)
   One request followed down six levels of scale, one level on screen
   at a time: data centre, rack, server, processor, core, AMX unit.
   Each level is drawn in its own 640 by 400 frame; the next level is
   drawn into a target box inside it, and the camera zooms into that
   box while the two levels cross-fade, so the zoom reads as continuous
   (Islam chose this over Sol 6.1's serving timeline, 27 October).
   At the bottom the AMX unit loads two tiles and multiplies them; then
   the camera rises back up while the answer streams out word by word.

   Science (Sol 6.1's corrections): AMX is eight tile registers plus the
   TMUL engine, not a grid of processors; the first pass over the prompt
   (prefill) yields the first word, and every next word repeats the work
   and reads the weights again, so memory bandwidth often sets the pace.
   Illustrative: no figure in the drawing is a measurement.

   Every label a reader needs is HTML beside the drawing, so it stays
   16px on a phone; the few labels inside the drawing give way there.
   ===================================================================== */
function buildZoom() {
  const fig = $('[data-zoom]');
  if (!fig) return null;
  const svg = $('.zoom-svg', fig);
  const title = $('title', svg);
  const crumbs = $$('[data-zoom-go]');
  const capN = $('[data-zoom-n]');
  const capH = $('[data-zoom-h]');
  const capT = $('[data-zoom-t]');
  const opEl = $('[data-zoom-op]');
  const answerEl = $('[data-zoom-answer]');
  const pause = $('[data-zoom-pause]');
  const pauseLb = $('[data-zoom-pause-lb]', pause);
  const levels = $$('[data-zoom-level]').map(li => ({ h: $('b', li).textContent, t: $('span', li).textContent, p: li.dataset.parts }));
  const partsEl = $('[data-zoom-parts]');
  const backLi = $('[data-zoom-back]');
  const back = { h: $('b', backLi).textContent, t: $('span', backLi).textContent, p: '' };

  const W = 640, H = 400, CX = W / 2, CY = H / 2;
  const ANSWER = 'Moving a running virtual machine to another server without switching it off.'.split(' ');

  /* Drawing helpers on top of node() and text() from the migration. */
  const R = (g, x, y, w, h, cls, extra = {}) => node('rect', { x, y, width: w, height: h, class: cls, ...extra }, g);
  const L = (g, x1, y1, x2, y2, cls = 'z-line') => node('line', { x1, y1, x2, y2, class: cls }, g);
  const T = (g, str, x, y, cls = 'z-lb', extra = {}) => text(str, { x, y, class: cls, ...extra }, g);
  const pulse = (g, x, y) => node('circle', { cx: x, cy: y, r: 6, class: 'z-pulse', opacity: 0 }, g);

  const G = [];
  const targets = [];
  const level = () => { const g = node('g', { class: 'z-level', opacity: 0 }, svg); G.push(g); return g; };

  /* --- 1. Data centre hall, from above ------------------------------- */
  const g1 = level();
  R(g1, 8, 8, W - 16, H - 16, 'z-frame', { rx: 6 });
  T(g1, 'Data centre hall', 28, 40, 'z-lbs');
  const racks = [], hallLeds = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 12; c++) {
    racks.push(R(g1, 74 + c * 44, 64 + r * 64, 34, 22, r === 2 && c === 7 ? 'z-acc' : 'z-fill'));
    for (let k = 0; k < 3; k++) hallLeds.push(R(g1, 78 + c * 44 + k * 6, 64 + r * 64 + 16, 3, 3, r === 2 && c === 7 ? 'z-led-on' : 'z-led'));
  }
  const aisleY = 64 + 2 * 64 + 22 + 21;
  L(g1, 20, aisleY, 74 + 7 * 44 + 17, aisleY, 'z-wire');
  L(g1, 74 + 7 * 44 + 17, aisleY, 74 + 7 * 44 + 17, 64 + 2 * 64 + 22, 'z-wire');
  T(g1, 'Network', 28, aisleY + 24);
  const p1 = pulse(g1, 20, aisleY);
  targets.push({ x: 74 + 7 * 44 + 17 - 20, y: 64 + 2 * 64 + 11 - 12.5, w: 40, h: 25 });

  /* --- 2. One rack, from the front ----------------------------------- */
  const g2 = level();
  R(g2, 8, 8, W - 16, H - 16, 'z-frame', { rx: 6 });
  T(g2, 'Rack', 28, 40, 'z-lbs');
  R(g2, 236, 24, 168, 360, 'z-box', { rx: 4 });
  R(g2, 246, 34, 148, 18, 'z-fill2');
  T(g2, 'Top-of-rack switch', 420, 48);
  const units = [], leds = [];
  for (let i = 0; i < 14; i++) {
    const y = 62 + i * 22;
    units.push(R(g2, 246, y, 148, 18, i === 5 ? 'z-acc' : 'z-fill'));
    leds.push(R(g2, 252, y + 7, 4, 4, 'z-led'));
  }
  T(g2, 'Server', 420, 62 + 5 * 22 + 14);
  L(g2, 394, 43, 410, 43, 'z-wire'); L(g2, 410, 43, 410, 62 + 5 * 22 + 9, 'z-wire'); L(g2, 410, 62 + 5 * 22 + 9, 394, 62 + 5 * 22 + 9, 'z-wire');
  const p2 = pulse(g2, 394, 43);
  targets.push({ x: 320 - 48, y: 62 + 5 * 22 + 9 - 30, w: 96, h: 60 });

  /* --- 3. The server board, from above ------------------------------- */
  const g3 = level();
  R(g3, 8, 8, W - 16, H - 16, 'z-frame', { rx: 6 });
  T(g3, 'Server board', 28, 40, 'z-lbs');
  R(g3, 24, 172, 40, 56, 'z-fill2', { rx: 3 });
  T(g3, 'Network card', 28, 252);
  const sock = [[170, 'Processor 0'], [430, 'Processor 1']].map(([x, name], i) => {
    R(g3, x, 140, 120, 120, i === 0 ? 'z-acc' : 'z-fill2', { rx: 4 });
    for (let k = 0; k < 9; k++) L(g3, x + 12 + k * 12, 150, x + 12 + k * 12, 250, i === 0 ? 'z-fin-on' : 'z-fin');
    T(g3, name, x, 132);
    const dimms = [];
    for (let k = 0; k < 4; k++) {
      dimms.push(R(g3, x - 10, 64 + k * 14, 140, 8, 'z-fill', { rx: 2 }));
      dimms.push(R(g3, x - 10, 286 + k * 14, 140, 8, 'z-fill', { rx: 2 }));
    }
    return dimms;
  });
  T(g3, 'Memory: the model’s weights', 160, 356);
  L(g3, 64, 200, 170, 200, 'z-wire');
  const p3 = pulse(g3, 64, 200);
  const chan = [0, 1, 2].map(k => node('rect', { x: 184 + k * 36, y: 120, width: 8, height: 8, class: 'z-pkt', opacity: 0 }, g3));
  targets.push({ x: 230 - 64, y: 200 - 40, w: 128, h: 80 });

  /* --- 4. The processor die ------------------------------------------ */
  const g4 = level();
  R(g4, 8, 8, W - 16, H - 16, 'z-frame', { rx: 6 });
  T(g4, 'Processor: cores on a mesh', 28, 40, 'z-lbs');
  R(g4, 40, 100, 14, 180, 'z-fill2'); R(g4, 586, 100, 14, 180, 'z-fill2');
  T(g4, 'Memory controllers, left and right', 28, 368);
  T(g4, 'AMX in each core', 412, 40);
  R(g4, 392, 30, 14, 10, 'z-amx');
  const cores = [];
  const cw = 56, ch = 44, gx = 64, gy = 54, ox = 68, oy = 66;
  for (let r = 0; r < 5; r++) {
    L(g4, ox, oy + r * gy + ch / 2, ox + 7 * gx + cw, oy + r * gy + ch / 2, 'z-mesh');
  }
  for (let c = 0; c < 8; c++) L(g4, ox + c * gx + cw / 2, oy, ox + c * gx + cw / 2, oy + 4 * gy + ch, 'z-mesh');
  for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) {
    const on = r === 2 && c === 5;
    cores.push(R(g4, ox + c * gx, oy + r * gy, cw, ch, on ? 'z-acc' : 'z-fill2', { rx: 2 }));
    R(g4, ox + c * gx + cw - 20, oy + r * gy + ch - 16, 14, 10, on ? 'z-amx-on' : 'z-amx');
  }
  const tcx = ox + 5 * gx + cw / 2, tcy = oy + 2 * gy + ch / 2;
  const meshPk = [0, 1, 2].map(() => node('rect', { x: 50, y: tcy - 4, width: 8, height: 8, class: 'z-pkt', opacity: 0 }, g4));
  targets.push({ x: tcx - 32, y: tcy - 20, w: 64, h: 40 });

  /* --- 5. One core ---------------------------------------------------- */
  const g5 = level();
  R(g5, 8, 8, W - 16, H - 16, 'z-frame', { rx: 6 });
  T(g5, 'One core', 28, 40, 'z-lbs');
  [[40, 60, 270, 64, 'Front end: fetch and decode'], [326, 60, 274, 64, 'Out-of-order engine'],
   [40, 144, 130, 96, 'Integer units'], [186, 144, 214, 96, 'AVX-512 vector units'],
   [40, 256, 360, 40, 'L1 cache'], [40, 312, 560, 44, 'L2 cache']].forEach(([x, y, w, h, n]) => {
    R(g5, x, y, w, h, 'z-fill2', { rx: 4 });
    T(g5, n, x + 12, y + 24);
  });
  R(g5, 416, 144, 184, 152, 'z-acc', { rx: 4 });
  T(g5, 'AMX', 432, 172, 'z-lbs z-on-acc');
  const corePk = [0, 1, 2].map(k => node('rect', { x: 448 + k * 48, y: 312, width: 8, height: 8, class: 'z-pkt', opacity: 0 }, g5));
  targets.push({ x: 508 - 88, y: 220 - 55, w: 176, h: 110 });

  /* --- 6. The AMX unit ------------------------------------------------ */
  const g6 = level();
  R(g6, 8, 8, W - 16, H - 16, 'z-frame', { rx: 6 });
  T(g6, 'AMX unit', 28, 40, 'z-lbs');
  T(g6, 'Tile registers', 28, 66);
  const regs = [];
  for (let i = 0; i < 8; i++) {
    regs.push(R(g6, 28, 78 + i * 24, 96, 18, 'z-reg', { rx: 3 }));
    T(g6, `tmm${i}`, 36, 92 + i * 24);
  }
  const cell = (g, x0, y0, rows, cols, s) => {
    const out = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out.push(R(g, x0 + c * s, y0 + r * s, s - 2, s - 2, 'z-cell'));
    return out;
  };
  T(g6, 'A: activations', 150, 66);
  const A = cell(g6, 150, 78, 16, 8, 12);
  T(g6, '×', 263, 182, 'z-big', { 'text-anchor': 'middle' });
  T(g6, 'B: weights', 280, 114);
  const B = cell(g6, 280, 126, 8, 16, 10);
  T(g6, '→', 457, 182, 'z-big', { 'text-anchor': 'middle' });
  T(g6, 'C: result', 474, 66);
  const C = cell(g6, 474, 78, 16, 16, 9);
  R(g6, 150, 300, 474, 64, 'z-box', { rx: 4 });
  const tmulFill = R(g6, 150, 300, 474, 64, 'z-acc', { rx: 4, opacity: 0 });
  T(g6, 'TMUL engine: C += A × B', 166, 338, 'z-lbs');
  const hiA = R(g6, 150, 78, 96, 10, 'z-hot', { opacity: 0 });
  const hiB = R(g6, 280, 126, 8, 80, 'z-hot', { opacity: 0 });

  /* --- Camera ---------------------------------------------------------
     cam.p runs from 0 (the hall) to 5 (the AMX unit). Between two
     whole numbers the camera zooms into the current level's target box
     on an exponential scale, which is how a continuous zoom looks
     right, while the next level grows out of that box. */
  const cam = { p: 0 };
  function draw() {
    const p = Math.max(0, Math.min(5, cam.p));
    const k = Math.min(4, Math.floor(p));
    const t = p - k;
    const tg = targets[k];
    const s = W / tg.w;
    const z = Math.pow(s, t);
    const f = s === 1 ? t : (1 - 1 / z) / (1 - 1 / s);
    const cx = CX + (tg.x + tg.w / 2 - CX) * f;
    const cy = CY + (tg.y + tg.h / 2 - CY) * f;
    const camT = `translate(${CX} ${CY}) scale(${z}) translate(${-cx} ${-cy})`;
    const clamp = v => Math.max(0, Math.min(1, v));
    G.forEach((g, i) => {
      let o = 0, tr = 'translate(0 0)';
      if (i === k) { o = 1 - clamp((t - .45) / .4); tr = camT; }
      else if (i === k + 1) { o = clamp((t - .25) / .5); tr = `${camT} translate(${tg.x} ${tg.y}) scale(${tg.w / W})`; }
      g.setAttribute('transform', tr);
      g.setAttribute('opacity', o);
      g.style.visibility = o > 0 ? 'visible' : 'hidden';
    });
  }

  /* --- Timeline ------------------------------------------------------- */
  const tl = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'none' } });
  const marks = [];    /* [time, caption index] ; 6 means the answer */
  const ops = [];      /* [time, instruction text] */
  const words = [];    /* time each answer word appears */
  const ZOOM = ms('--zoom-move') || 1.15;
  const BACK = ms('--zoom-back') || .62;
  const HOLD = [1, .875, 1.125, 1, .875].map(f => f * (ms('--zoom-hold') || 2.4));
  let at = 0;
  tl.set(cam, { p: 0, onUpdate: draw }, 0)
    .set([...racks, ...units, ...cores], { opacity: 1 }, 0)
    .set([p1, p2, p3], { opacity: 0 }, 0)
    .set([...A, ...B, ...C], { attr: { class: 'z-cell' } }, 0)
    .set(regs, { attr: { class: 'z-reg' } }, 0)
    .set(tmulFill, { opacity: 0 }, 0);

  /* Level by level: the activity, then the zoom into the next. */
  const acts = [
    t0 => {  /* the request crosses the hall to its rack */
      tl.to(p1, { opacity: 1, duration: .15 }, t0 + .2)
        .to(p1, { attr: { cx: 74 + 7 * 44 + 17 }, duration: .9, ease: 'power1.inOut' }, t0 + .2)
        .to(p1, { attr: { cy: 64 + 2 * 64 + 22 }, duration: .35, ease: 'power2.out' }, t0 + 1.1)
        .to(p1, { opacity: 0, duration: .2 }, t0 + 1.5)
        .set(p1, { attr: { cx: 20, cy: aisleY } }, t0 + 1.8);
      tl.to(hallLeds.filter((_, i) => i % 7 === 2), { opacity: .15, duration: .1, stagger: { each: .04, from: 'random', yoyo: true, repeat: 3 } }, t0 + .1);
    },
    t0 => {  /* the switch hands it to one server */
      tl.to(p2, { opacity: 1, duration: .15 }, t0 + .2)
        .to(p2, { attr: { cx: 410 }, duration: .25 }, t0 + .2)
        .to(p2, { attr: { cy: 62 + 5 * 22 + 9 }, duration: .6, ease: 'power1.inOut' }, t0 + .45)
        .to(p2, { attr: { cx: 394 }, duration: .25 }, t0 + 1.05)
        .to(p2, { opacity: 0, duration: .2 }, t0 + 1.4)
        .set(p2, { attr: { cx: 394, cy: 43 } }, t0 + 1.7);
      tl.to(leds, { opacity: .2, duration: .12, stagger: { each: .05, from: 'random', yoyo: true, repeat: 1 } }, t0 + .1);
    },
    t0 => {  /* in through the network card; weights stream from memory */
      tl.to(p3, { opacity: 1, duration: .15 }, t0 + .2)
        .to(p3, { attr: { cx: 170 }, duration: .6, ease: 'power1.inOut' }, t0 + .2)
        .to(p3, { opacity: 0, duration: .2 }, t0 + .8)
        .set(p3, { attr: { cx: 64 } }, t0 + 1.2);
      tl.to(sock[0], { attr: { class: 'z-acc' }, duration: .01, stagger: .1 }, t0 + .9)
        .to(sock[0], { attr: { class: 'z-fill' }, duration: .01, stagger: .1 }, t0 + 1.5);
      for (let n = 0; n < 3; n++) chan.forEach((c, j) => {
        const s0 = t0 + .9 + n * .5 + j * .08;
        tl.fromTo(c, { attr: { y: 112 }, opacity: 1 }, { attr: { y: 136 }, duration: .3, immediateRender: false }, s0).set(c, { opacity: 0 }, s0 + .3);
      });
    },
    t0 => {  /* packets cross the mesh; the cores share the work */
      for (let n = 0; n < 3; n++) meshPk.forEach((pk, j) => {
        const s0 = t0 + .2 + n * .45 + j * .12;
        tl.fromTo(pk, { attr: { x: 56 }, opacity: 1 }, { attr: { x: tcx - 4 }, duration: .55, immediateRender: false }, s0).set(pk, { opacity: 0 }, s0 + .55);
      });
      tl.to(cores.filter((_, i) => i % 5 === 1 || i % 7 === 3), { opacity: .45, duration: .2, stagger: { each: .04, yoyo: true, repeat: 1 } }, t0 + .3);
    },
    t0 => {  /* data rises from the L2 cache into AMX */
      for (let n = 0; n < 3; n++) corePk.forEach((pk, j) => {
        const s0 = t0 + .2 + n * .45 + j * .1;
        tl.fromTo(pk, { attr: { y: 312 }, opacity: 1 }, { attr: { y: 296 }, duration: .3, immediateRender: false }, s0).set(pk, { opacity: 0 }, s0 + .3);
      });
    }
  ];

  for (let k = 0; k < 5; k++) {
    tl.addLabel(`L${k}`, at);
    marks.push([at, k]);
    acts[k](at);
    at += HOLD[k];
    tl.to(cam, { p: k + 1, duration: ZOOM, ease: 'power2.inOut', onUpdate: draw }, at);
    at += ZOOM;
  }

  /* The AMX unit: load A, load B, multiply, store. */
  tl.addLabel('L5', at);
  marks.push([at, 5]);
  const a0 = at;
  ops.push([a0 + .2, 'TILELOADD tmm1 ← activations, BF16']);
  tl.set(regs[1], { attr: { class: 'z-reg z-reg-on' } }, a0 + .2)
    .to(A, { attr: { class: 'z-cell z-cell-in' }, duration: .01, stagger: .004 }, a0 + .2);
  ops.push([a0 + .9, 'TILELOADD tmm2 ← weights, BF16']);
  tl.set(regs[2], { attr: { class: 'z-reg z-reg-on' } }, a0 + .9)
    .to(B, { attr: { class: 'z-cell z-cell-in' }, duration: .01, stagger: .004 }, a0 + .9);
  ops.push([a0 + 1.6, 'TDPBF16PS tmm0 += tmm1 · tmm2, FP32']);
  tl.set(regs[0], { attr: { class: 'z-reg z-reg-on' } }, a0 + 1.6)
    .to(tmulFill, { opacity: .18, duration: .3 }, a0 + 1.6);
  /* The first few values one by one, so the row-times-column rule is
     visible; then the rest of the tile in a wave. */
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1]].forEach(([r, c], i) => {
    const s0 = a0 + 1.7 + i * .32;
    tl.set(hiA, { attr: { y: 78 + r * 12 }, opacity: .5 }, s0)
      .set(hiB, { attr: { x: 280 + c * 10 }, opacity: .5 }, s0)
      .set(C[r * 16 + c], { attr: { class: 'z-cell z-cell-hot' } }, s0)
      .set(C[r * 16 + c], { attr: { class: 'z-cell z-cell-on' } }, s0 + .3);
  });
  tl.set([hiA, hiB], { opacity: 0 }, a0 + 3.3);
  const rest = C.filter((_, i) => ![0, 1, 2, 16, 17].includes(i));
  rest.forEach((el, i) => {
    const r = Math.floor(C.indexOf(el) / 16), c = C.indexOf(el) % 16;
    tl.set(el, { attr: { class: 'z-cell z-cell-on' } }, a0 + 3.3 + (r + c) * .03);
  });
  ops.push([a0 + 4.4, 'TILESTORED tmm0 → cache']);
  tl.to(tmulFill, { opacity: 0, duration: .3 }, a0 + 4.4);
  at = a0 + 5.4;

  /* Back up, the answer streaming out. */
  tl.addLabel('back', at);
  marks.push([at, 6]);
  ops.push([at, '']);
  for (let k = 5; k > 0; k--) {
    tl.to(cam, { p: k - 1, duration: BACK, ease: 'power2.inOut', onUpdate: draw }, at);
    at += BACK + .08;
  }
  ANSWER.forEach((_, i) => words.push(at - 3.4 + i * .42));
  at = Math.max(at, words[words.length - 1]) + 2.6;
  tl.to({}, { duration: .01 }, at);

  /* Caption, instruction line and answer follow the playhead, so they
     are right after a jump as well as during play. */
  const last = (list, time) => list.filter(m => m[0] <= time + 1e-6).pop();
  let shown = -1;
  function sync() {
    const time = tl.time();
    const m = last(marks, time);
    const i = m ? m[1] : 0;
    if (i !== shown) {
      shown = i;
      const d = i < 6 ? levels[i] : back;
      capN.textContent = i < 6 ? `${i + 1} of 6` : 'Back to the user';
      capH.textContent = d.h;
      capT.textContent = d.t;
      partsEl.textContent = d.p;
      crumbs.forEach((b, n) => b.setAttribute('aria-current', n === i ? 'step' : 'false'));
    }
    const op = last(ops, time);
    opEl.textContent = op && op[1] ? op[1] : '\u00a0';
    opEl.classList.toggle('is-empty', !(op && op[1]));
    const n = words.filter(w => w <= time).length;
    answerEl.textContent = n ? ANSWER.slice(0, n).join(' ') : '…';
  }
  tl.eventCallback('onUpdate', sync);

  /* Press a level to play from it. */
  let held = false, inView = false;
  const run = () => (inView && !held ? tl.play() : tl.pause());
  crumbs.forEach((b, i) => b.addEventListener('click', () => {
    tl.seek(`L${i}`, false);
    cam.p = i;
    draw();
    sync();
    if (!reduced) { if (held) { held = false; pause.classList.remove('is-paused'); pauseLb.textContent = 'Pause'; } tl.play(); }
  }));
  pause.addEventListener('click', () => {
    held = !held;
    pause.classList.toggle('is-paused', held);
    pauseLb.textContent = held ? 'Play' : 'Pause';
    run();
  });

  if (reduced) {
    /* Still: the AMX unit with its finished tile, and the answer. */
    tl.pause(a0 + 4.6);
    cam.p = 5; draw();
    answerEl.textContent = ANSWER.join(' ');
  } else {
    pause.hidden = false;
    tl.pause(0);
    draw();
    sync();
  }
  return { fig, seen: on => { inView = on; run(); } };
}
const zoom = buildZoom();

/* =====================================================================
   CONTACT: BOOKING
   Cal.com's inline calendar, loaded only when Contact comes near, so
   the rest of the page never waits for it. The visitor picks a time in
   their own time zone; Mohamed approves each request (his Cal.com event,
   "Requires confirmation"). Until his link is set in the markup, the
   email card stands in. The card is only replaced once the calendar has
   really loaded; if it fails, the card stays and a direct link appears.
   ?cal=user/event previews a link, on preview addresses only, never on
   the live site (Sol 6.1: a shared link could show someone else's
   calendar under Mohamed's name).
   ===================================================================== */
function booking() {
  const box = $('[data-book]');
  if (!box) return;
  const host = location.hostname;
  const preview = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.mohamed-elsaid.pages.dev');
  const link = (preview && new URLSearchParams(location.search).get('cal')) || box.dataset.calLink;
  if (!link) return;
  const cal = $('[data-cal]', box);
  const state = $('[data-cal-state]', box);
  const fallback = $('[data-book-fallback]', box);
  const direct = $('[data-book-direct]', box);
  $('[data-book-link]', box).href = `https://cal.com/${link}`;

  let done = false;
  const retry = $('[data-cal-retry]', box);
  /* A link is set, so booking is open: the opens-soon card is for an
     unconfigured site only. States: loading, ready, failed. */
  fallback.hidden = true;
  const ready = () => {
    if (done) return;
    done = true;
    state.remove();
    direct.hidden = false;
  };
  const failed = () => {
    if (done) return;
    done = true;
    state.textContent = 'The calendar did not load.';
    retry.hidden = false;
    direct.hidden = false;
  };
  $('[data-cal-retry-btn]', box).addEventListener('click', () => {
    history.replaceState(null, '', '#book');
    location.reload();
  });

  const load = () => {
    /* Cal.com's own loader, unchanged: it queues calls until embed.js
       arrives. */
    (function (C, A, L) { const p = (a, ar) => { a.q.push(ar); }; const d = C.document; C.Cal = C.Cal || function () { const c = C.Cal; const ar = arguments; if (!c.loaded) { c.ns = {}; c.q = c.q || []; d.head.appendChild(d.createElement('script')).src = A; c.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const ns = ar[1]; api.q = api.q || []; if (typeof ns === 'string') { c.ns[ns] = c.ns[ns] || api; p(c.ns[ns], ar); p(c, ['initNamespace', ns]); } else p(c, ar); return; } p(c, ar); }; })(window, 'https://app.cal.com/embed/embed.js', 'init');

    /* The calendar wears the site's own colours, read from tokens.css. */
    const v = n => css.getPropertyValue(n).trim();
    const dark = {
      'cal-brand': v('--accent-light'), 'cal-brand-emphasis': v('--ink-inv'), 'cal-brand-text': v('--ground-6'),
      'cal-bg': v('--ground-6'), 'cal-bg-muted': v('--ground-6'), 'cal-bg-subtle': v('--ground-5'), 'cal-bg-emphasis': v('--ground-5'),
      'cal-border': v('--rule-inv-strong'), 'cal-border-subtle': v('--rule-inv'), 'cal-border-booker': v('--rule-inv'),
      'cal-text': v('--ink-inv'), 'cal-text-emphasis': v('--ink-inv'), 'cal-text-subtle': v('--ink-inv-secondary'), 'cal-text-muted': v('--ink-inv-secondary')
    };
    Cal('init', 'book', { origin: 'https://app.cal.com' });
    Cal.ns.book('inline', { elementOrSelector: cal, calLink: link, config: { layout: 'month_view', theme: 'dark' } });
    Cal.ns.book('ui', { theme: 'dark', layout: 'month_view', hideEventTypeDetails: false, cssVarsPerTheme: { dark } });
    Cal.ns.book('on', { action: 'linkReady', callback: ready });
    Cal.ns.book('on', { action: 'linkFailed', callback: failed });
    cal.hidden = false;
    /* No answer in 15 seconds: keep the email card and offer the page. */
    setTimeout(() => { if (!done) { state.textContent = 'The calendar is slow to load.'; retry.hidden = false; direct.hidden = false; } }, 15000);
  };
  const io = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) { io.disconnect(); load(); }
  }, { rootMargin: '600px 0px' });
  io.observe(box);
}
booking();


/* =====================================================================
   MOTION
   ===================================================================== */
if (reduced) {
  reveal();
} else {
  try { motion(); } catch (err) { reveal(); throw err; }
}

/* Plays a timeline once, the first time its trigger comes into view.
   The timeline runs on time, not on scroll. Triggers are created in
   page order, top to bottom. */
function once(trigger, build, start = 'top 82%') {
  if (!trigger) return;
  const tl = gsap.timeline({ paused: true });
  build(tl);
  ScrollTrigger.create({ trigger, start, once: true, onEnter: () => tl.play() });
}

function motion() {
  /* --- INTRODUCTION: about 1.2 seconds in all. The buttons are never
     hidden, so they work from the first frame. ---------------------- */
  const name = $('[data-hero-name]');
  const split = SplitText.create(name, { type: 'words,chars', mask: 'chars' });
  gsap.set(name, { opacity: 1 });

  gsap.timeline({ delay: 0.1, onComplete: reveal })
    .from(split.chars, { yPercent: 110, duration: 0.9, stagger: 0.025 })
    .fromTo('.hero-portrait', { opacity: 0, y: T_LEAD }, { opacity: 1, y: 0, duration: 0.9 }, 0.15)
    .fromTo('[data-rise]', { opacity: 0, y: T_BODY }, { opacity: 1, y: 0, stagger: 0.08 }, 0.35);

  /* --- PRACTICE: the lead settles, the two counts run once ---------- */
  const lead = $('.practice-lead');
  once(lead, tl => tl.from(lead, { opacity: 0, y: T_BODY }));
  const facts = $('[data-figures]');
  once(facts, tl => {
    $$('[data-count]', facts).forEach((el, i) => {
      const end = +el.dataset.count;
      const n = { v: 0 };
      tl.to(n, { v: end, duration: D_REVEAL, onUpdate: () => { el.textContent = Math.round(n.v); } }, i * 0.15);
    });
  }, 'top 90%');

  /* --- FOCUS: the whitepaper arrives, 700ms ------------------------- */
  const paper = $('[data-paper]');
  once(paper, tl => tl.from(paper, { opacity: 0, y: T_LEAD, duration: D_MID }));

  /* --- CAREER: each employer's mark and name settle, 700ms. The role
     text is there from the start. ------------------------------------ */
  $$('[data-job]').forEach(job => {
    const mark = $('.job-mark', job);
    once(job, tl => tl.from(mark.children, { opacity: 0, y: T_FINE, duration: D_MID, stagger: 0.1 }));
  });

  /* --- RESEARCH: the diagram loops while it is in view, and waits
     where it is while the reader is elsewhere on the page ------------ */
  if (migration) {
    ScrollTrigger.create({
      trigger: migration.fig, start: 'top 70%', end: 'bottom 10%',
      onToggle: self => migration.seen(self.isActive)
    });
  }

  /* --- AI INFRASTRUCTURE: the zoom plays while in view -------------- */
  if (zoom) {
    ScrollTrigger.create({
      trigger: zoom.fig, start: 'top 75%', end: 'bottom 10%',
      onToggle: self => zoom.seen(self.isActive)
    });
  }

  /* --- CONTACT: the invitation, 340ms -------------------------------- */
  const contact = $('[data-contact]');
  once(contact, tl => tl.from(contact, { opacity: 0, y: T_FINE, duration: ms('--d-base') || 0.34 }), 'top 90%');

  /* Fonts change line heights; recalculate every trigger once they land. */
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

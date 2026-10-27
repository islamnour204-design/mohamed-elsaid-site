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
   AI INFRASTRUCTURE: ONE REQUEST THROUGH THE STACK
   Three bands, top to bottom: the user (prompt and answer), the cluster
   (scheduler and four servers), and the chosen server opened up (memory
   on the left, AMX tiles on the right). The loop follows motion-design's
   three acts: Setup (the request is tokenised and placed), Action
   (prefill, then decode token by token) and Resolution (the answer is
   whole, the cache is freed), then a rest and a visible reset.
   Illustrative: no figure in the drawing is a measurement.

   Built after the font loads, because the token chips are sized from
   their measured text. Rebuilt at the phone breakpoint, where the row
   labels give way and the text is set larger.
   ===================================================================== */
function buildInfra() {
  const fig = $('[data-ai]');
  if (!fig) return null;
  const svg = $('svg', fig);
  const section = fig.closest('.infra');
  const steps = $$('[data-ai-steps] li');
  const cap = $('[data-ai-cap]', fig);
  const pause = $('[data-ai-pause]', fig);
  const pauseLb = $('[data-ai-pause-lb]', pause);
  const title = $('title', svg);

  const PROMPT = ['Summar', 'ise', ' this', ' quarter', '’s', ' report'];
  const ANSWER = ['Revenue', ' grew', ' on', ' cloud', ' demand', '.'];
  const LOADS = [.72, .58, .28, .64];   /* server 3 has the most room */
  const PICK = 2;

  let tl = null;
  let held = false;
  let inView = false;
  const sync = () => tl && (inView && !held ? tl.play() : tl.pause());

  const setStep = i => {
    steps.forEach((li, n) => li.classList.toggle('is-on', n === i));
    if (cap && steps[i]) cap.innerHTML = `<span class="cap-n">${i + 1} of 5</span> ${$('button', steps[i]).innerHTML}`;
  };

  function build() {
    tl?.kill();
    [...svg.childNodes].forEach(n => n !== title && n.remove());
    const compact = phone.matches;
    const X0 = compact ? 0 : 84;          /* left edge of the drawing, after the row labels */
    const W = 600;
    const CW = W - X0;
    const lbSize = parseFloat(getComputedStyle(svg).getPropertyValue(compact ? '--ai-lb-s' : '--ai-lb')) || 15;
    const off = compact ? lbSize * .35 : 5;   /* baseline lift inside a row */

    /* Row labels, desktop only. */
    const rowLb = (str, y) => text(str, { x: 0, y, class: 'lb lb-row' }, svg);
    rowLb('Prompt', 47);
    rowLb('Answer', 107);
    rowLb('Scheduler', 163);
    rowLb('Servers', 212);
    node('line', { x1: 0, y1: 134, x2: W, y2: 134, class: 'rule' }, svg);

    /* --- Band 1: chips -------------------------------------------------- */
    const PAD = compact ? 9 : 7;
    const GAP = compact ? 6 : 6;
    function chips(words, y, extra) {
      const g = node('g', { class: extra || '' }, svg);
      const items = words.map(w => {
        const c = node('g', {}, g);
        const r = node('rect', { y: y - 15 - (compact ? 4 : 0), height: compact ? 38 : 30, rx: 4, class: 'chip-r' }, c);
        const t = text(w.trim(), { x: 0, y: y + off, class: 'chip-t' }, c);
        return { c, r, t, w: t.getComputedTextLength(), space: w.startsWith(' ') };
      });
      const sp = (compact ? 24 : 16) * .26;
      let jx = X0 + PAD, sx = X0 + PAD;
      items.forEach(it => {
        if (it.space) jx += sp;
        it.jx = jx; jx += it.w;
        it.sx = sx; sx += it.w + PAD * 2 + GAP;
        it.r.setAttribute('x', -PAD);
        it.r.setAttribute('width', it.w + PAD * 2);
      });
      return { g, items };
    }
    const prompt = chips(PROMPT, 42);
    const answer = chips(ANSWER, 102, 'out');
    prompt.items.forEach(it => gsap.set(it.c, { x: it.sx }));
    answer.items.forEach(it => gsap.set(it.c, { x: it.sx }));

    /* --- Band 2: scheduler and servers --------------------------------- */
    const SG = 16;
    const SW = (CW - SG * 3) / 4;
    const SY = 182, SH = compact ? 64 : 58;
    const busY = 158;
    node('line', { x1: X0, y1: busY, x2: W, y2: busY, class: 'wire' }, svg);
    const servers = LOADS.map((load, i) => {
      const x = X0 + i * (SW + SG);
      const g = node('g', {}, svg);
      node('line', { x1: x + SW / 2, y1: busY, x2: x + SW / 2, y2: SY, class: 'wire' }, g);
      const box = node('rect', { x, y: SY, width: SW, height: SH, rx: 4, class: 'srv' }, g);
      text(`Server ${i + 1}`, { x: x + 10, y: SY + (compact ? 26 : 22), class: 'lb' }, g);
      const tw = SW - 20;
      node('rect', { x: x + 10, y: SY + SH - 16, width: tw, height: 6, class: 'track' }, g);
      const bar = node('rect', { x: x + 10, y: SY + SH - 16, width: tw * load, height: 6, class: 'load' }, g);
      return { x, g, box, bar, tw, load, cx: x + SW / 2 };
    });
    const pick = servers[PICK];
    node('line', { x1: 0, y1: 260, x2: W, y2: 260, class: 'rule' }, svg);

    /* --- Band 3: the chosen server, opened up -------------------------- */
    const FY = 286, FH = compact ? 424 : 384;
    svg.setAttribute('viewBox', `0 0 ${W} ${FY + FH + 2}`);
    const LB = compact ? 8 : 0;   /* extra room under the larger phone labels */
    const zl = node('line', { x1: pick.x, y1: SY + SH, x2: pick.x, y2: SY + SH, class: 'zoom' }, svg);
    const zr = node('line', { x1: pick.x + SW, y1: SY + SH, x2: pick.x + SW, y2: SY + SH, class: 'zoom' }, svg);
    const inside = node('g', {}, svg);
    node('rect', { x: X0, y: FY, width: CW, height: FH, rx: 4, class: 'frame' }, inside);
    text(`Server ${PICK + 1}, inside`, { x: X0 + 16, y: FY + 28, class: 'lb-strong' }, inside);

    const BUS = 64;
    const BW = (CW - 32 - BUS) / 2;
    const MX = X0 + 16, CX = MX + BW + BUS;
    const BY = FY + 46, BH = FH - 54;
    node('rect', { x: MX, y: BY, width: BW, height: BH, rx: 4, class: 'box' }, inside);
    node('rect', { x: CX, y: BY, width: BW, height: BH, rx: 4, class: 'box' }, inside);
    text('Memory', { x: MX + 12, y: BY + 26 + LB / 2, class: 'lb-strong' }, inside);
    text('AMX tiles', { x: CX + 12, y: BY + 26 + LB / 2, class: 'lb-strong' }, inside);

    /* Weights: 6 by 5 blocks. */
    text('Model weights', { x: MX + 12, y: BY + 56 + LB * 1.5, class: 'lb' }, inside);
    const WS = 24, WG = 8, WC = 6, WR = 5;
    const wx0 = MX + (BW - (WC * WS + (WC - 1) * WG)) / 2;
    const wy0 = BY + 70 + LB * 2;
    const weights = [];
    for (let r = 0; r < WR; r++) for (let c = 0; c < WC; c++) {
      weights.push(node('rect', { x: wx0 + c * (WS + WG), y: wy0 + r * (WS + WG), width: WS, height: WS, class: 'w' }, inside));
    }

    /* KV cache: two rows of six, one slot per token, prompt then answer. */
    const ky = wy0 + WR * (WS + WG) + 20;
    text('KV cache', { x: MX + 12, y: ky + 4 + LB, class: 'lb' }, inside);
    const kv = [];
    for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) {
      const x = wx0 + c * (WS + WG), y = ky + 16 + LB * 2 + r * (WS + WG);
      node('rect', { x: x + .5, y: y + .5, width: WS - 1, height: WS - 1, class: 'slot' }, inside);
      kv.push(node('rect', { x, y, width: WS, height: WS, class: 'kv', opacity: 0 }, inside));
    }

    /* AMX tiles: an 8 by 8 grid of multiply units. */
    const TS = 20, TG = 4, TN = 8;
    const tx0 = CX + (BW - (TN * TS + (TN - 1) * TG)) / 2;
    const ty0 = wy0;
    const hot = [];
    for (let r = 0; r < TN; r++) for (let c = 0; c < TN; c++) {
      const x = tx0 + c * (TS + TG), y = ty0 + r * (TS + TG);
      node('rect', { x: x + .5, y: y + .5, width: TS - 1, height: TS - 1, class: 'tile' }, inside);
      hot.push(node('rect', { x, y, width: TS, height: TS, class: 'hot', opacity: 0 }, inside));
    }
    const gridCx = tx0 + (TN * TS + (TN - 1) * TG) / 2;
    const gridBottom = ty0 + TN * (TS + TG);
    text('Prompt tokens', { x: CX + 12, y: gridBottom + 30 + LB, class: 'lb' }, inside);
    const tokRow = PROMPT.map((_, i) => node('rect', { x: tx0 + i * (TS + TG), y: gridBottom + 44 + LB * 2, width: TS, height: 8, class: 'req', opacity: 0 }, inside));

    /* Memory to compute: three lanes, a packet each. */
    const lanes = [wy0 + 30, wy0 + 76, wy0 + 122];
    lanes.forEach(y => node('line', { x1: MX + BW, y1: y, x2: CX, y2: y, class: 'wire' }, inside));
    const pkts = lanes.map(y => node('rect', { x: MX + BW, y: y - 4, width: 8, height: 8, class: 'pkt', opacity: 0 }, inside));

    /* The request in flight: six small squares, one per token. */
    const req = node('g', { opacity: 0 }, svg);
    PROMPT.forEach((_, i) => node('rect', { x: i * 8, y: -3, width: 6, height: 6, class: 'req' }, req));
    const reqStart = { x: X0 + PAD, y: 66 };

    /* --- The loop ------------------------------------------------------ */
    const t = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'none' } });
    const S = [0, 1.4, 3.3, 5.1, 9.0];   /* when each step begins */
    S.forEach((at, i) => t.addLabel(`s${i}`, at).call(() => setStep(i), null, at));

    /* Start state, every round. */
    t.call(() => section.classList.add('ai-live'), null, 0)
      .set(prompt.items.map(it => it.c), { opacity: 0 }, 0)
      .set(prompt.items.map(it => it.r), { opacity: 0 }, 0)
      .set(answer.items.map(it => it.c), { opacity: 0 }, 0)
      .set(inside, { opacity: .35 }, 0)
      .set([zl, zr], { opacity: 0 }, 0)
      .set(kv, { opacity: 0 }, 0)
      .set(tokRow, { opacity: 0 }, 0)
      .set(req, { opacity: 0, x: reqStart.x, y: reqStart.y }, 0);
    prompt.items.forEach(it => t.set(it.c, { x: it.jx }, 0));
    servers.forEach(s => t.set(s.bar, { attr: { width: s.tw * s.load } }, 0));
    t.set(pick.box, { attr: { class: 'srv' } }, 0);

    /* 1. Request: the sentence arrives whole, then breaks into tokens. */
    t.to(prompt.items.map(it => it.c), { opacity: 1, duration: .4, ease: EASE }, .1);
    prompt.items.forEach((it, i) => {
      t.to(it.c, { x: it.sx, duration: .6, ease: EASE }, .7 + i * .04);
      t.to(it.r, { opacity: 1, duration: .3 }, .8 + i * .04);
    });

    /* 2. Placement: the request drops to the scheduler, runs along the
       bus to the server with the most room, and that server opens. */
    t.to(req, { opacity: 1, duration: .2 }, 1.5)
      .to(req, { y: busY, duration: .4, ease: 'power2.in' }, 1.5)
      .to(req, { x: pick.cx - 22, duration: .6, ease: 'power1.inOut' }, 1.9)
      .to(req, { y: SY + SH / 2, duration: .3, ease: 'power2.out' }, 2.5)
      .set(pick.box, { attr: { class: 'srv is-pick' } }, 2.8)
      .to(pick.bar, { attr: { width: pick.tw * .7 }, duration: .5, ease: EASE }, 2.8)
      .to([zl, zr], { opacity: 1, duration: .1 }, 2.8)
      .to(zl, { attr: { x2: X0, y2: FY }, duration: .5, ease: EASE }, 2.8)
      .to(zr, { attr: { x2: W, y2: FY }, duration: .5, ease: EASE }, 2.8)
      .to(inside, { opacity: 1, duration: .5, ease: EASE }, 2.95)
      .to(req, { x: gridCx - 22, y: gridBottom + 48 + LB * 2, duration: .5, ease: 'power2.inOut' }, 3.0)
      .to(req, { opacity: 0, duration: .15 }, 3.45)
      .to(tokRow, { opacity: 1, duration: .15, stagger: .03 }, 3.45);
    /* Ambient: the other servers keep working. */
    [0, 1, 3].forEach((n, k) => {
      const s = servers[n];
      t.to(s.bar, { attr: { width: s.tw * (s.load - .12 + k * .06) }, duration: 1.6, ease: 'sine.inOut' }, 1 + k * .5)
        .to(s.bar, { attr: { width: s.tw * s.load }, duration: 1.6, ease: 'sine.inOut' }, 5 + k * .7);
    });

    /* Packets crossing from memory to the tiles, n trips from `at`. */
    const flow = (at, n, gap) => {
      for (let k = 0; k < n; k++) {
        pkts.forEach((p, j) => {
          const s = at + k * gap + j * .06;
          t.fromTo(p, { x: 0, opacity: 1 }, { x: BUS - 8, duration: .3, immediateRender: false }, s)
            .set(p, { opacity: 0 }, s + .3);
        });
      }
    };

    /* 3. Prefill: every weight block is read, the tiles work on all the
       prompt tokens at once in two waves, and the cache fills. */
    t.to(weights, { opacity: 1, duration: .15, stagger: { each: .03, yoyo: true, repeat: 1 } }, 3.4);
    flow(3.4, 4, .35);
    /* A diagonal wavefront, top left to bottom right, as data moves
       through a systolic array of multiply units. */
    [3.6, 4.2].forEach(at => hot.forEach((h, k) => {
      t.to(h, { opacity: .9, duration: .16, yoyo: true, repeat: 1 }, at + ((k / TN | 0) + k % TN) * .035);
    }));
    t.to(kv.slice(0, 6), { opacity: 1, duration: .2, stagger: .12 }, 4.1)
      .to(tokRow, { opacity: .25, duration: .3 }, 4.8);

    /* 4. Decode: one token per pass. Each pass reads every weight again
       (a fast sweep), lights one row of tiles, adds one cache entry,
       and sends the token up to the answer. */
    const P = .62;
    ANSWER.forEach((_, i) => {
      const at = S[3] + .1 + i * P;
      t.to(weights, { opacity: 1, duration: .08, stagger: { each: .008, yoyo: true, repeat: 1 } }, at);
      flow(at, 1, 0);
      t.to(hot.slice((i % TN) * TN, (i % TN + 1) * TN), { opacity: .9, duration: .12, stagger: { each: .02, yoyo: true, repeat: 1 } }, at + .1);
      t.to(kv[6 + i], { opacity: 1, duration: .15 }, at + .3);
      const it = answer.items[i];
      t.fromTo(it.c, { x: gridCx, y: ty0 - 102, opacity: 0 }, { x: it.sx, y: 0, opacity: 1, duration: .45, ease: EASE, immediateRender: false }, at + .3);
    });

    /* 5. Done: the cache is freed, the server's load falls back. */
    t.set(pick.box, { attr: { class: 'srv' } }, S[4] + .3)
      .to(kv, { opacity: 0, duration: .4, stagger: { each: .03, from: 'end' } }, S[4] + .3)
      .to(pick.bar, { attr: { width: pick.tw * pick.load }, duration: .6, ease: EASE }, S[4] + .3)
      .to(tokRow, { opacity: 0, duration: .3 }, S[4] + .3)

    /* Rest on the finished answer, then the reset, in view. */
      .to([...prompt.items.map(it => it.c), ...answer.items.map(it => it.c)], { opacity: 0, duration: .45, ease: EASE }, 10.9)
      .to(inside, { opacity: .35, duration: .45, ease: EASE }, 10.9)
      .to([zl, zr], { opacity: 0, duration: .3 }, 10.9)
      .set(zl, { attr: { x2: pick.x, y2: SY + SH } }, 11.3)
      .set(zr, { attr: { x2: pick.x + SW, y2: SY + SH } }, 11.3)
      .to({}, { duration: .1 }, 11.35);

    tl = t;
    if (reduced) {
      /* Drawn finished and still: the answer whole, all steps at full ink. */
      t.pause(S[4] + .1);
      section.classList.remove('ai-live');
      steps.forEach(li => li.classList.remove('is-on'));
      if (cap) cap.hidden = true;
    } else {
      pause.hidden = false;
      setStep(0);
      sync();
    }
  }

  /* Pressing a step plays the drawing from there. */
  steps.forEach((li, i) => $('button', li).addEventListener('click', () => {
    if (!tl) return;
    tl.seek(`s${i}`, false);
    setStep(i);
    if (reduced) return;
    section.classList.add('ai-live');
    if (held) { held = false; pause.classList.remove('is-paused'); pauseLb.textContent = 'Pause'; }
    tl.play();
  }));

  /* WCAG 2.2.2: it moves for more than five seconds, so it can stop. */
  pause.addEventListener('click', () => {
    held = !held;
    pause.classList.toggle('is-paused', held);
    pauseLb.textContent = held ? 'Play' : 'Pause';
    sync();
  });

  const ready = document.fonts?.ready ?? Promise.resolve();
  ready.then(build);
  phone.addEventListener('change', () => ready.then(build));
  return { fig, seen: on => { inView = on; sync(); } };
}
const infra = buildInfra();


/* =====================================================================
   CONTACT: BOOKING
   Cal.com's inline calendar, loaded only when Contact comes near, so
   the rest of the page never waits for it. The visitor picks a time in
   their own time zone; Mohamed approves each request (set on his Cal.com
   event, "Requires confirmation"). Until his link is set in the markup,
   the email button stands in. ?cal=user/event previews any public link.
   ===================================================================== */
function booking() {
  const box = $('[data-book]');
  if (!box) return;
  const link = new URLSearchParams(location.search).get('cal') || box.dataset.calLink;
  if (!link) return;
  const cal = $('[data-cal]', box);
  const fallback = $('[data-book-fallback]', box);

  const load = () => {
    /* Cal.com's own loader, unchanged: it queues calls until embed.js
       arrives. */
    (function (C, A, L) { const p = (a, ar) => { a.q.push(ar); }; const d = C.document; C.Cal = C.Cal || function () { const c = C.Cal; const ar = arguments; if (!c.loaded) { c.ns = {}; c.q = c.q || []; d.head.appendChild(d.createElement('script')).src = A; c.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const ns = ar[1]; api.q = api.q || []; if (typeof ns === 'string') { c.ns[ns] = c.ns[ns] || api; p(c.ns[ns], ar); p(c, ['initNamespace', ns]); } else p(c, ar); return; } p(c, ar); }; })(window, 'https://app.cal.com/embed/embed.js', 'init');

    /* The calendar wears the site's own colours, read from tokens.css. */
    const v = n => css.getPropertyValue(n).trim();
    const brand = v('--accent-light');
    const dark = {
      'cal-brand': brand, 'cal-brand-emphasis': v('--ink-inv'), 'cal-brand-text': v('--ground-6'),
      'cal-bg': v('--ground-6'), 'cal-bg-muted': v('--ground-6'), 'cal-bg-subtle': v('--ground-5'), 'cal-bg-emphasis': v('--ground-5'),
      'cal-border': v('--rule-inv-strong'), 'cal-border-subtle': v('--rule-inv'), 'cal-border-booker': v('--rule-inv'),
      'cal-text': v('--ink-inv'), 'cal-text-emphasis': v('--ink-inv'), 'cal-text-subtle': v('--ink-inv-secondary'), 'cal-text-muted': v('--ink-inv-secondary')
    };
    Cal('init', 'book', { origin: 'https://app.cal.com' });
    Cal.ns.book('inline', { elementOrSelector: cal, calLink: link, config: { layout: 'month_view', theme: 'dark' } });
    Cal.ns.book('ui', { theme: 'dark', layout: 'month_view', hideEventTypeDetails: false, cssVarsPerTheme: { dark } });
    cal.hidden = false;
    fallback.hidden = true;
    $('[data-book-note]', box).textContent = 'Pick a time in your own time zone. Mohamed confirms each request by email.';
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

  /* --- AI INFRASTRUCTURE: plays while in view, like the migration ---- */
  if (infra) {
    ScrollTrigger.create({
      trigger: infra.fig, start: 'top 75%', end: 'bottom 10%',
      onToggle: self => infra.seen(self.isActive)
    });
  }

  /* --- CONTACT: the invitation, 340ms -------------------------------- */
  const contact = $('[data-contact]');
  once(contact, tl => tl.from(contact, { opacity: 0, y: T_FINE, duration: ms('--d-base') || 0.34 }), 'top 90%');

  /* Fonts change line heights; recalculate every trigger once they land. */
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

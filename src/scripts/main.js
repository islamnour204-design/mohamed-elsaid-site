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
const foldCols = () => $$('[data-col-fold]').forEach(d => { d.open = !phone.matches; });
foldCols();
phone.addEventListener('change', foldCols);

/* Phone only (the button is hidden on wide screens): an earlier role
   shows its title and dates; this opens its whole text at once. */
$$('[data-fold]').forEach(btn => btn.addEventListener('click', () => {
  const role = btn.closest('.role');
  role.classList.add('is-open');
  btn.setAttribute('aria-expanded', 'true');
  const more = $('.more-role', role);
  if (more) more.open = true;
  const first = $('.prose', role);
  if (first) { first.setAttribute('tabindex', '-1'); first.focus({ preventScroll: true }); }
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

  /* --- CONTACT: the invitation, 340ms -------------------------------- */
  const contact = $('[data-contact]');
  once(contact, tl => tl.from(contact, { opacity: 0, y: T_FINE, duration: ms('--d-base') || 0.34 }), 'top 90%');

  /* Fonts change line heights; recalculate every trigger once they land. */
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

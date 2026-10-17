/* =====================================================================
   Mohamed Elsaid, v2. One script for the home page.

     Navigation   active layer, theme follows the ground, phone menu
     Hero         the name rises letter by letter, then one light sweep
     Advisory     the stack opens into its four layers
     Edge AI      AMX tiles: a row of A and a column of B fill one cell of C
     Research     THE SIGNATURE: a pinned pre-copy live migration
     Career       the timeline line draws as the reader descends
     Contact      the closing line fills with the accent once

   Every scene's default markup is its finished state. The script
   rewinds a scene and plays it on scroll; with reduced motion it leaves
   the finished state alone.
   ===================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* Safety net. If anything below throws or stalls, every start state is
   cleared and the page is complete and readable. */
const reveal = () => root.classList.remove('js-motion');
const failsafe = setTimeout(reveal, 4000);

const css = getComputedStyle(root);
const ms = n => (parseFloat(css.getPropertyValue(n)) || 0) / 1000;
const px = n => parseFloat(css.getPropertyValue(n)) || 0;

const D_MID = ms('--d-mid') || 0.7;
const D_REVEAL = ms('--d-reveal') || 1.2;
const T_LEAD = px('--m-travel-lead') || 44;
const NAV_H = px('--nav-h') || 64;

/* --ease from tokens.css, reproduced exactly. */
const EASE = CustomEase.create('token', 'M0,0 C0.16,1 0.3,1 1,1');
gsap.defaults({ ease: EASE, duration: D_MID });

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =====================================================================
   SMOOTH SCROLL. Lenis, tied to GSAP's clock so pinned scenes and the
   scroll position never disagree. Skipped entirely for reduced motion.
   ===================================================================== */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.11 });
  window.__lenis = lenis; // lets the review script drive the scroll
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

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

/* In-page links go through Lenis so the jump is smooth and lands below
   the fixed navigation. */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = id === '#top' ? document.body : $(id);
    if (!target) return;
    closeMenu();
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: id === '#top' ? 0 : -NAV_H });
    else target.scrollIntoView();
    history.replaceState(null, '', id);
    /* Keyboard focus moves with the jump, so the next Tab continues from
       the section, not from the link that was pressed (Sol 6.1 review). */
    const focusEl = id === '#top' ? $('.hero') : target;
    if (!focusEl.hasAttribute('tabindex')) focusEl.setAttribute('tabindex', '-1');
    focusEl.focus({ preventScroll: true });
  });
});

/* The current layer, shown in three places: nav link, stack slab, and
   the phone depth bar. Layers above it are marked as passed. */
const layers = $$('[data-layer]');
const order = layers.map(l => l.dataset.layer);

function setLayer(name) {
  const i = order.indexOf(name);
  const mark = (el, key) => {
    const j = order.indexOf(el.dataset[key]);
    el.classList.toggle('is-on', j === i);
    el.classList.toggle('is-past', j < i);
  };
  $$('[data-stack]').forEach(el => mark(el, 'stack'));
  $$('[data-depth]').forEach(el => mark(el, 'depth'));
  $$('[data-link]').forEach(el => {
    const on = el.dataset.link === name;
    el.classList.toggle('is-on', on);
    if (on) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
  });
}

/* Layer tracking is created in trackLayers(), after the scenes: a
   trigger made before the pin exists measures every later section
   without the pin's extra scroll length. */

/* =====================================================================
   SCENE BUILDERS. Cells and pages are generated here, in their
   finished state, so reduced motion simply shows them as built.
   ===================================================================== */
function fill(container, n, cls) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = cls;
    frag.appendChild(s);
  }
  container.appendChild(frag);
  return [...container.children];
}

/* --- AMX: 4x4 tiles. Cell k of C is row k/4 of A times column k%4 of B. */
const cellsA = fill($('[data-cells="a"]'), 16, 'cell');
const cellsB = fill($('[data-cells="b"]'), 16, 'cell');
const cellsC = fill($('[data-cells="c"]'), 16, 'cell');

function renderAmx(step) {
  /* step 0..16: how many cells of C are done. */
  const k = Math.min(step, 15);
  const r = Math.floor(k / 4);
  const c = k % 4;
  const live = step < 16;
  cellsA.forEach((el, i) => el.classList.toggle('is-src', live && Math.floor(i / 4) === r));
  cellsB.forEach((el, i) => el.classList.toggle('is-src', live && i % 4 === c));
  cellsC.forEach((el, i) => {
    el.classList.toggle('is-done', i < step);
    el.classList.toggle('is-src', live && i === k);
  });
}
renderAmx(16);

/* --- MIGRATION: 24 memory pages per machine. */
const PAGES = 24;
const pagesA = fill($('[data-pages="a"]'), PAGES, 'page');
const pagesB = fill($('[data-pages="b"]'), PAGES, 'page');
const vmA = $('[data-vm="a"]');
const vmB = $('[data-vm="b"]');
const labelA = $('[data-vm-state="a"]');
const labelB = $('[data-vm-state="b"]');
const pulse = $('[data-pulse]');
const steps = $$('[data-mig-steps] li');
const mig = $('[data-mig]');

/* Pages the machine writes while each round is being sent. Fixed sets,
   so the illustration is the same on every visit. Each round is smaller
   than the last: that shrinking is the point of pre-copy. */
const DIRTY_1 = [2, 5, 7, 9, 13, 16, 19, 22];
const DIRTY_2 = [5, 13, 19];
const DIRTY_3 = [13];

/* Phase boundaries along the pinned scroll, 0 to 1. */
const P = { r1: 0.30, r2: 0.50, r3: 0.64, stop: 0.82 };

const local = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));

function renderMig(p) {
  let step, copied, dirty, sending;

  if (p < P.r1) {
    const t = local(p, 0, P.r1);
    step = 0;
    copied = Math.round(PAGES * t);
    dirty = DIRTY_1.slice(0, Math.round(DIRTY_1.length * t));
    sending = t;
  } else if (p < P.r2) {
    const t = local(p, P.r1, P.r2);
    step = 1;
    copied = PAGES;
    /* Round-one changes are sent away; round-two changes appear. */
    dirty = DIRTY_1.slice(Math.round(DIRTY_1.length * t)).concat(DIRTY_2.slice(0, Math.round(DIRTY_2.length * t)));
    sending = t;
  } else if (p < P.r3) {
    const t = local(p, P.r2, P.r3);
    step = 2;
    copied = PAGES;
    dirty = DIRTY_2.slice(Math.round(DIRTY_2.length * t)).concat(DIRTY_3.slice(0, Math.round(DIRTY_3.length * t)));
    sending = t;
  } else if (p < P.stop) {
    const t = local(p, P.r3, P.stop);
    step = 3;
    copied = PAGES;
    dirty = t < 0.5 ? DIRTY_3 : [];
    sending = t;
  } else {
    step = 4;
    copied = PAGES;
    dirty = [];
    sending = -1;
  }

  pagesA.forEach((el, i) => el.classList.toggle('is-dirty', dirty.includes(i)));
  pagesB.forEach((el, i) => el.classList.toggle('is-copied', i < copied));

  vmA.classList.toggle('is-paused', step === 3);
  vmA.classList.toggle('is-gone', step === 4);
  labelA.textContent = step === 3 ? 'VM paused' : step === 4 ? 'Released' : 'VM running';
  labelB.textContent = step === 4 ? 'VM running' : 'Receiving';

  steps.forEach((li, i) => li.classList.toggle('is-on', i === step));

  if (sending < 0) {
    gsap.set(pulse, { opacity: 0 });
  } else {
    const wire = pulse.parentElement.clientWidth - pulse.clientWidth;
    gsap.set(pulse, { opacity: 1, x: wire * (sending % 1) });
  }
}

/* Finished state by default: host A released, host B running. */
renderMig(1);

/* =====================================================================
   REDUCED MOTION. Everything stays in its finished state.
   ===================================================================== */
if (reduced) {
  clearTimeout(failsafe);
  reveal();
} else {
  motion();
}
trackLayers();

function trackLayers() {
  layers.forEach(layer => {
    /* Which layer is current: the one crossing the middle of the screen. */
    ScrollTrigger.create({
      trigger: layer,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: self => { if (self.isActive) setLayer(layer.dataset.layer); }
    });
    /* Which ground the navigation sits on: the one under its bottom edge. */
    ScrollTrigger.create({
      trigger: layer,
      start: `top ${NAV_H}px`,
      end: `bottom ${NAV_H}px`,
      onToggle: self => {
        if (self.isActive) root.classList.toggle('on-dark', layer.dataset.theme === 'dark');
      }
    });
  });
  setLayer('top');
}

function motion() {
  /* --- HERO ------------------------------------------------------------
     The name rises letter by letter from behind its own baseline, the
     letters overlapping so it resolves as one phrase rather than a
     typewriter. Role, claim and buttons are readable from the first
     frame (Sol 6.1, round 2: supporting information stays readable).
     Then one band of light crosses the name, once (DIRECTION.md). */
  const nameEl = $('.hero-name-text');
  /* Words first, so the name only ever wraps between words. */
  const split = SplitText.create(nameEl, { type: 'words,chars', mask: 'chars' });
  root.classList.remove('js-motion');
  clearTimeout(failsafe);

  const hero = gsap.timeline({ defaults: { ease: 'expo.out' } });
  hero
    .from(split.chars, { yPercent: 110, duration: D_REVEAL, stagger: 0.035 }, 0.15)
    .from('.hero-portrait', { y: T_LEAD, opacity: 0, duration: D_REVEAL }, 0.35);

  const sweep = gsap.timeline({ paused: true })
    .set('.hero-sweep', { opacity: 1, maskPosition: '100% 0', webkitMaskPosition: '100% 0' })
    .to('.hero-sweep', { maskPosition: '0% 0', webkitMaskPosition: '0% 0', duration: 1.6, ease: 'power2.inOut' })
    .set('.hero-sweep', { opacity: 0 });
  hero.call(() => sweep.play(), null, '>-0.4');

  /* --- ADVISORY: the stack opens ------------------------------------
     The four slabs start pressed together, as one block, and separate
     into their layers as the section arrives. Scrubbed, so scrolling
     back closes them again. */
  const slabs = $$('.xslab');
  gsap.fromTo(slabs,
    { y: (i, el) => -i * (el.offsetHeight * 0.82) },
    {
      y: 0,
      ease: 'none',
      scrollTrigger: { trigger: '[data-xstack]', start: 'top 90%', end: 'top 40%', scrub: 0.6 }
    });
  gsap.from($$('.xslab span'), {
    opacity: 0,
    ease: 'none',
    stagger: 0.1,
    scrollTrigger: { trigger: '[data-xstack]', start: 'top 75%', end: 'top 40%', scrub: 0.6 }
  });

  /* --- EDGE AI: the AMX tiles ---------------------------------------
     Not pinned (Sol 6.1 round 2: one pinned scene on the page, the
     migration). The sixteen cells of C fill as the figure crosses the
     screen. */
  ScrollTrigger.create({
    trigger: '[data-amx]',
    start: 'top 80%',
    end: 'bottom 30%',
    onUpdate: self => renderAmx(Math.round(self.progress * 16)),
    onLeaveBack: () => renderAmx(0)
  });
  renderAmx(0);

  /* --- RESEARCH: the signature --------------------------------------
     Pinned below the navigation for two and a half screens of scroll.
     Only pinned when the screen is tall enough for the whole stage
     (Sol 6.1 round 1: every pinned stage must fit 657px). */
  vmB.classList.add('is-rewound');
  mig.classList.add('is-live');
  renderMig(0);

  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px) and (min-height: 560px)', () => {
    ScrollTrigger.create({
      trigger: mig,
      start: `top ${NAV_H + px('--s-4')}px`,
      end: () => `+=${innerHeight * 2.5}`,
      pin: true,
      scrub: true,
      onUpdate: self => renderMig(self.progress)
    });
  });
  mm.add('(max-width: 860px), (max-height: 559px)', () => {
    /* Phones and short screens: no pin. The scene plays as it scrolls
       past, all five steps stay on screen (DIRECTION.md). */
    ScrollTrigger.create({
      trigger: mig,
      start: 'top 70%',
      end: 'bottom 30%',
      onUpdate: self => renderMig(self.progress)
    });
  });

  /* --- CAREER: the line draws ---------------------------------------- */
  const timeline = $('[data-timeline]');
  gsap.fromTo(timeline, { '--draw': 0 }, {
    '--draw': 1,
    ease: 'none',
    scrollTrigger: { trigger: timeline, start: 'top 75%', end: 'bottom 55%', scrub: 0.4 }
  });
  gsap.from($$('.tl'), {
    opacity: 0,
    x: -px('--m-travel-fine'),
    stagger: 0.12,
    scrollTrigger: { trigger: timeline, start: 'top 75%' }
  });

  /* --- CONTACT: the closing line fills once ------------------------- */
  gsap.fromTo('.fill-top', { clipPath: 'inset(0 100% 0 0)' }, {
    clipPath: 'inset(0 0% 0 0)',
    ease: 'none',
    scrollTrigger: { trigger: '[data-fill]', start: 'top 85%', end: 'center 45%', scrub: 0.5 }
  });

  /* Fonts change line heights; recalculate every trigger once they land. */
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

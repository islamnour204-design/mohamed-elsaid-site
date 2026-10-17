/* =====================================================================
   Mohamed Elsaid, v3. One script for the home page.

     Navigation   active section, theme follows the ground, phone menu
     Introduction the name rises letter by letter, then the rest follows
     Sections     each block plays a short entrance once, when it is
                  first seen

   Every entrance runs on its own clock. Nothing is pinned and nothing
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

/* Safety net. If anything below throws or stalls, the hero start state
   is cleared and the page is complete and readable. */
const reveal = () => root.classList.remove('js-motion');
const failsafe = setTimeout(reveal, 4000);

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

/* =====================================================================
   MOTION
   ===================================================================== */
if (reduced) {
  clearTimeout(failsafe);
  reveal();
} else {
  try { motion(); } catch (err) { reveal(); throw err; }
}

/* Plays a timeline once, the first time its trigger comes into view.
   The timeline runs on time, not on scroll. */
function once(trigger, build, start = 'top 82%') {
  const tl = gsap.timeline({ paused: true });
  build(tl);
  ScrollTrigger.create({ trigger, start, once: true, onEnter: () => tl.play() });
}

function motion() {
  /* --- INTRODUCTION ------------------------------------------------- */
  const name = $('[data-hero-name]');
  const split = SplitText.create(name, { type: 'words,chars', mask: 'chars' });
  gsap.set(name, { opacity: 1 });

  const intro = gsap.timeline({
    delay: 0.15,
    onComplete: () => { clearTimeout(failsafe); reveal(); }
  });
  intro
    .from(split.chars, { yPercent: 110, duration: D_REVEAL, stagger: 0.035 })
    .fromTo('.hero-portrait', { opacity: 0, y: T_LEAD }, { opacity: 1, y: 0, duration: D_REVEAL }, 0.25)
    .fromTo('[data-rise]', { opacity: 0, y: T_BODY }, { opacity: 1, y: 0, stagger: 0.1 }, 0.55);

  /* --- SECTION HEADS: number, name and line arrive in turn ---------- */
  $$('[data-head]').forEach(head => {
    once(head, tl => tl.from(head.children, { opacity: 0, y: T_FINE, stagger: 0.08 }));
  });

  /* --- GENERIC BLOCKS: rise into place ------------------------------- */
  $$('[data-up]').forEach(el => {
    once(el, tl => tl.from(el, { opacity: 0, y: T_BODY }));
  });

  /* --- PRACTICE: the figures count up, the sectors follow ------------ */
  const figures = $('[data-figures]');
  once(figures, tl => {
    tl.from(figures, { opacity: 0, y: T_BODY });
    $$('[data-count]', figures).forEach((el, i) => {
      const end = +el.dataset.count;
      const n = { v: 0 };
      tl.to(n, {
        v: end,
        duration: D_REVEAL,
        onUpdate: () => { el.textContent = Math.round(n.v); }
      }, 0.1 + i * 0.15);
    });
  });
  const sectors = $('[data-sectors]');
  once(sectors, tl => tl.from(sectors.children, { opacity: 0, y: T_FINE, stagger: 0.07 }), 'top 90%');

  /* --- FOCUS: each row's rule draws, then its content arrives -------- */
  $$('[data-row]').forEach(row => {
    once(row, tl => tl
      .fromTo(row, { '--draw': 0 }, { '--draw': 1, duration: D_REVEAL })
      .from(row.children, { opacity: 0, y: T_BODY, stagger: 0.12 }, 0.2));
  });

  /* --- CAREER: the employer mark settles, then its roles -------------- */
  $$('[data-job]').forEach(job => {
    once(job, tl => tl
      .from($('.logo', job), { opacity: 0, scale: 1.12, transformOrigin: 'left center', duration: D_REVEAL })
      .from($$('.role', job), { opacity: 0, y: T_BODY, stagger: 0.15 }, 0.2));
  });

  /* --- RESEARCH: each group's heading, then its entries -------------- */
  $$('[data-group]').forEach(group => {
    const items = $$('.pub, .granted-row, .filed li, .base-col', group);
    once(group, tl => tl
      .from($('.group-head', group), { opacity: 0, y: T_FINE })
      .from(items, { opacity: 0, y: T_FINE, stagger: 0.06 }, 0.15));
  });

  /* Fonts change line heights; recalculate every trigger once they land. */
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

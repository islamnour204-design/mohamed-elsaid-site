/* =====================================================================
   Motion for layers 01 to 03.

   Built to docs/MOTION-INTENT.md, which Islam approved before any of it
   was written. If something here is not in that document, it should not
   be here.

   Three things happen on this page and nothing else:
     1. one focal sequence, the hero entrance
     2. scroll-driven continuity, the descent and its reveals
     3. quiet feedback, hover and focus, which is CSS not JavaScript

   impeccable animate.md: "Prefer one rehearsed focal sequence to
   repeated section reveals."
   ===================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

const root = document.documentElement;

/* Hard safety net. If anything below throws, or never finishes, the
   start states are cleared and the page is readable and complete.
   animate.md: "Keep content visible in the default state so failed
   scripts do not hide the page." */
const reveal = () => root.classList.remove('js-motion');
const failsafe = setTimeout(reveal, 4000);

/* --- Vocabulary, read from tokens.css -------------------------------
   Nothing invented here. tokens.css stays the single source of truth
   for duration and easing, so these cannot drift from the system. */
const css = getComputedStyle(root);
const ms = name => (parseFloat(css.getPropertyValue(name)) || 0) / 1000;

const D_BASE = ms('--d-base') || 0.34;
const D_SLOW = ms('--d-slow') || 0.76;

/* Travel distances come from the spacing scale, not from numbers picked
   here. How far a thing moves belongs to the same rhythm as how far
   things sit apart, and CLAUDE.md allows no invented values. */
const px = name => parseFloat(css.getPropertyValue(name)) || 0;
const LIFT_S = px('--s-1') || 8;    /* small: labels, buttons */
const LIFT_M = px('--s-2') || 16;   /* medium: prose blocks, rows */

/* --ease is cubic-bezier(.16, 1, .3, 1). CustomEase reproduces it
   exactly rather than approximating with a named GSAP ease. */
const EASE = CustomEase.create('token', 'M0,0 C0.16,1 0.3,1 1,1');
gsap.defaults({ ease: EASE, duration: D_BASE });

const mm = gsap.matchMedia();

/* =====================================================================
   REDUCED MOTION — nothing animates, page complete and still
   ===================================================================== */
mm.add('(prefers-reduced-motion: reduce)', () => {
  clearTimeout(failsafe);
  reveal();
});

/* =====================================================================
   FULL MOTION
   ===================================================================== */
mm.add('(prefers-reduced-motion: no-preference)', () => {
  const splits = [];

  /* Split the headline and lede into lines, each line wrapped so it can
     travel inside a mask. taste 2.B lists Kinetic typography as native
     CSS or GSAP with no extra library; SplitText ships with GSAP.

     overflow on the line, never clip-path: BUILD-BRIEF section 5
     records a clip-path reveal rendering as an empty box in a real
     browser when its trigger failed to fire. */
  const splitLines = selector => {
    const el = document.querySelector(selector);
    if (!el) return [];
    const split = new SplitText(el, { type: 'lines', linesClass: 'split-line' });
    splits.push(split);
    return split.lines.map(line => {
      const inner = document.createElement('span');
      inner.style.display = 'block';
      while (line.firstChild) inner.appendChild(line.firstChild);
      line.appendChild(inner);
      return inner;
    });
  };

  const claimLines = splitLines('.claim');
  const ledeLines = splitLines('.claim-lede');

  /* Lines are hidden by their own mask now, so the headline block can
     be made visible without showing anything. */
  gsap.set([...claimLines, ...ledeLines], { yPercent: 110 });
  gsap.set(['.claim', '.claim-lede'], { opacity: 1 });

  /* --- 1. THE FOCAL MOMENT ------------------------------------------
     The figure rises out of the ground while the type assembles
     downward, in the order the reader will descend the stack.

     animate.md, choose material by meaning: "Reveal and composition:
     masks, clip paths, cropping, or controlled occlusion." */
  const hero = gsap.timeline();

  hero
    .fromTo('.L1 .meta', { opacity: 0, y: LIFT_S }, { opacity: 1, y: 0 }, 0)
    .fromTo('.name', { opacity: 0, y: LIFT_S }, { opacity: 1, y: 0 }, 0.06)
    .to(claimLines, { yPercent: 0, duration: D_SLOW, stagger: 0.12 }, 0.08)
    /* The mask stop travels from 0% to 62%, so Mohamed emerges from the
       ground colour rather than fading in on top of it. One material
       idea, and it exists only because of this page's cut-out. */
    .fromTo('.portrait img',
      { '--mask-stop': '0%' },
      { '--mask-stop': '62%', duration: D_SLOW },
      0.12)
    .to(ledeLines, { yPercent: 0, duration: D_BASE, stagger: 0.08 }, 0.38)
    .fromTo('.sub', { opacity: 0, y: LIFT_M }, { opacity: 1, y: 0 }, 0.5)
    .fromTo('.act', { opacity: 0, y: LIFT_S }, { opacity: 1, y: 0 }, 0.58);

  /* Put the markup back once the entrance is over, so a resize
     re-wraps normally instead of against stale line boxes. */
  hero.eventCallback('onComplete', () => {
    splits.forEach(s => s.revert());
    gsap.set(['.claim', '.claim-lede'], { opacity: 1 });
    ScrollTrigger.refresh();
  });

  /* --- 2. THE FIGURES ------------------------------------------------
     Each figure is clipped by the rule above it and rises from behind
     it. Not a count-up: taste 5 asks what an animation communicates,
     and a counter animates a number without saying anything about it.
     This site's language is boundaries between layers, so a number
     arriving from a boundary is the section's own idea.

     Fires once. animate.md: "Sibling stagger is appropriate when a list
     appears as a list. Cap the total delay." */
  /* fromTo with both y and yPercent named explicitly. GSAP parses the
     CSS translateY(100%) into a pixel y, not into yPercent, so a plain
     to({yPercent: 0}) animated a value that was already 0 and the
     numbers never moved. */
  gsap.fromTo('.fig-n',
    { yPercent: 100, y: 0 },
    {
      yPercent: 0, y: 0,
      duration: D_BASE,
      stagger: 0.09,
      scrollTrigger: { trigger: '.figures', start: 'top 85%', once: true }
    });

  /* --- 3. TEXT REVEALS ON THE WAY DOWN -------------------------------
     One short move per block, once each. animate.md warns against
     reinterpreting every scrolled section as a staggered list, so this
     is deliberately small: one step of the spacing scale, and a fade. */
  gsap.utils.toArray('.L2 .anim, .L3 .anim').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: LIFT_M },
      {
        opacity: 1, y: 0, duration: D_BASE,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
  });

  /* --- 4. THE DESCENT ------------------------------------------------
     Layer 03's rows take the change with an offset expressed in scroll
     distance, not time.

     gsap-scrolltrigger.md: "With scrub: true, the animation progresses
     as the user scrolls through the start-end range." Inside a scrubbed
     timeline a millisecond value stretches or vanishes with scroll
     speed, so the rows are placed as fractions of the range: row 1
     across 0-60%, row 2 across 20-80%, row 3 across 40-100%. The
     overlap is what makes it a ripple rather than three switches.

     Two corrections after measuring the built page:

     clamp() on both ends. Layer 03 is the last section, so "top 25%"
     was a scroll position the page cannot reach and the ripple never
     finished: the rows rested at 1.00 / 0.91 / 0.66 at the very bottom.
     gsap-scrolltrigger.md: "Wrap in clamp() (v3.12+) to keep within
     page bounds."

     The opacity floor is 0.6, not 0.25. A scrub can be stopped
     anywhere, so its midpoint is a resting state a reader can sit in.
     At 0.25 this text measured about 2.5:1 against ground-3, and
     DESIGN.md A3 puts contrast floors above every other consideration.
     The movement carries the ripple; the fade only supports it. */
  const rows = gsap.utils.toArray('.frow');
  if (rows.length) {
    const ripple = gsap.timeline({
      scrollTrigger: {
        trigger: '.focus',
        start: 'clamp(top 85%)',
        end: 'clamp(bottom 65%)',
        scrub: 1
      }
    });
    rows.forEach((row, i) => {
      ripple.fromTo(row,
        { opacity: 0.6, y: LIFT_M },
        { opacity: 1, y: 0, duration: 0.6, ease: 'none' },
        i * 0.2);
    });
  }

  clearTimeout(failsafe);

  /* matchMedia reverts everything created in here automatically when
     the query stops matching; this clears our own start states too. */
  return () => {
    splits.forEach(s => s.revert());
    reveal();
  };
});

/* The layout settles after the font swaps. Without this the triggers
   are measured against the fallback face and fire in the wrong places. */
document.fonts.ready.then(() => ScrollTrigger.refresh());

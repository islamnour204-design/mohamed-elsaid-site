/* =====================================================================
   Motion for layers 01 to 03.

   Each layer has its own entrance material. craft-floor.md: "one
   authored moment, not scattered effects and not one identical
   entrance on every section." An earlier version of this file quoted
   that rule and then applied a single fade-and-rise to every block,
   which is exactly what it forbids.

     01  a mask travels down    the figure rises out of the ground
     02  a wipe crosses         the heading arrives in reading order,
                                and the figures count
     03  a rule draws           the boundary is drawn before the row

   Durations and travel distances are read from tokens.css. Nothing is
   invented here.
   ===================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

const root = document.documentElement;

/* Hard safety net. If anything below throws, or never finishes, every
   start state is cleared and the page is complete and readable.
   animate.md: "Keep content visible in the default state so failed
   scripts do not hide the page." */
const reveal = () => root.classList.remove('js-motion');
const failsafe = setTimeout(reveal, 4000);

const css = getComputedStyle(root);
const ms = n => (parseFloat(css.getPropertyValue(n)) || 0) / 1000;
const px = n => parseFloat(css.getPropertyValue(n)) || 0;

/* --- Durations -------------------------------------------------------
   motion-design's Premium archetype: Quick 350, Standard 500, Slow 800.
   --d-base is the quick tier, and using it for every entrance is why
   the first version read as hurried. Entrances use the standard and
   dramatic tiers now. */
const D_MID    = ms('--d-mid')    || 0.5;
const D_SLOW   = ms('--d-slow')   || 0.76;
const D_REVEAL = ms('--d-reveal') || 0.9;

/* --- Travel ----------------------------------------------------------
   From tokens.css, sized per element. Anything that must visibly travel
   does not slide at all: it uses a reveal, where the distance is the
   element's own height. A display line therefore travels roughly 84px
   and a caption 20px, because they are different things. */
const T_FINE = px('--m-travel-fine') || 20;
const T_BODY = px('--m-travel-body') || 28;
const T_LEAD = px('--m-travel-lead') || 44;

/* --ease is cubic-bezier(.16, 1, .3, 1). CustomEase reproduces it
   exactly rather than approximating with a named GSAP ease. */
const EASE = CustomEase.create('token', 'M0,0 C0.16,1 0.3,1 1,1');
gsap.defaults({ ease: EASE, duration: D_MID });

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

  /* Split into lines, each wrapped so it can travel inside a mask.
     taste 2.B lists Kinetic typography as native CSS or GSAP with no
     extra library; SplitText ships with GSAP. overflow on the line
     wrapper, never clip-path, per BUILD-BRIEF section 5. */
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

  gsap.set([...claimLines, ...ledeLines], { yPercent: 110 });
  gsap.set(['.claim', '.claim-lede'], { opacity: 1 });

  /* =====================================================================
     LAYER 01 — the focal moment
     The figure rises out of the ground while the type assembles
     downward, in the order the reader will descend the stack.

     animate.md, choose material by meaning: "Reveal and composition:
     masks, clip paths, cropping, or controlled occlusion." The mask is
     already there, holding the cut-out into the ground colour. The
     entrance animates that, so the material and the design agree.
     ===================================================================== */
  const hero = gsap.timeline();
  const fade = css.getPropertyValue('--portrait-fade').trim() || '84%';

  hero
    .fromTo('.L1 .meta', { opacity: 0, y: T_FINE }, { opacity: 1, y: 0, duration: D_MID }, 0)
    .fromTo('.name', { opacity: 0, y: T_FINE }, { opacity: 1, y: 0, duration: D_MID }, 0.08)
    /* The display line travels its own height, about 84px, which is why
       it reads as movement rather than as a fade. */
    .to(claimLines, { yPercent: 0, duration: D_REVEAL, stagger: 0.14 }, 0.14)
    .fromTo('.portrait img',
      { '--mask-stop': '0%' },
      { '--mask-stop': fade, duration: D_REVEAL },
      0.2)
    .to(ledeLines, { yPercent: 0, duration: D_MID, stagger: 0.1 }, 0.62)
    .fromTo('.sub', { opacity: 0, y: T_BODY }, { opacity: 1, y: 0, duration: D_MID }, 0.82)
    .fromTo('.act', { opacity: 0, y: T_FINE }, { opacity: 1, y: 0, duration: D_MID }, 0.94);

  hero.eventCallback('onComplete', () => {
    splits.forEach(s => s.revert());
    gsap.set(['.claim', '.claim-lede'], { opacity: 1 });
    ScrollTrigger.refresh();
  });

  /* =====================================================================
     LAYER 02 — the wipe, and the count
     ===================================================================== */

  /* The heading is a sentence, so it arrives the way a sentence is read.
     motion-design Reveal strategy: "L-to-R (reading order)". */
  gsap.fromTo('.l2-head',
    { '--wipe': '0%' },
    {
      '--wipe': '100%',
      duration: D_REVEAL,
      scrollTrigger: { trigger: '.l2-head', start: 'top 80%', once: true }
    });

  /* The figures count.

     This is a direct instruction from Islam, recorded in DESIGN.md A4.
     An earlier version of this file refused it on the grounds that taste
     calls a counter unmotivated. That inverted the precedence rule at
     the top of DESIGN.md: a direct client instruction outranks a skill
     default. The instruction stands and the counter is built.

     Each figure rises from behind the rule above it while its digits
     run up to the final value: one arrival, not two effects stacked.
     Zero-padded to the width of the written figure, so 16 counts
     through 00 to 16 rather than jumping a column. */
  const figures = gsap.utils.toArray('.fig-n');

  figures.forEach((el, i) => {
    const written = el.textContent.trim();
    const parsed = written.match(/^(\d+)(.*)$/);

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.figures', start: 'top 82%', once: true },
      delay: i * 0.12
    });

    tl.fromTo(el, { yPercent: 100, y: 0 }, { yPercent: 0, y: 0, duration: D_MID }, 0);

    if (parsed) {
      const target = Number(parsed[1]);
      const pad = parsed[1].length;
      const suffix = parsed[2];
      const counter = { n: 0 };
      tl.to(counter, {
        n: target,
        duration: D_REVEAL,
        ease: EASE,
        onUpdate: () => {
          el.textContent = String(Math.round(counter.n)).padStart(pad, '0') + suffix;
        },
        onComplete: () => { el.textContent = written; }
      }, 0);
    }
  });

  /* =====================================================================
     LAYER 03 — the rule draws, then the rows resolve
     ===================================================================== */

  /* The boundary is drawn before its row is legible. In a site whose
     whole language is hard boundaries between layers, that is the
     section's own idea rather than an effect borrowed from elsewhere. */
  gsap.utils.toArray('.frow').forEach((row, i) => {
    gsap.fromTo(row,
      { '--rule-draw': 0 },
      {
        '--rule-draw': 1,
        duration: D_SLOW,
        delay: i * 0.1,
        scrollTrigger: { trigger: row, start: 'top 88%', once: true }
      });
  });

  /* The rows themselves resolve on a scrubbed timeline.

     gsap-scrolltrigger.md: "With scrub: true, the animation progresses
     as the user scrolls through the start-end range." Position inside a
     scrubbed timeline is a fraction of a scroll range, so the rows are
     offset by 20% of the range each: row 1 across 0-60%, row 2 across
     20-80%, row 3 across 40-100%. The overlap is what makes it a ripple
     rather than three switches.

     clamp() on both ends because layer 03 is the last section and an
     unclamped end is a scroll position the page cannot reach: the rows
     rested at 1.00 / 0.91 / 0.66 at the very bottom.

     No opacity at all, only movement. A scrub can be stopped anywhere,
     so every frame of it is a resting state a reader can sit in. The
     supporting sentence is --ink-secondary at 15px: on ground-3 it
     measures 2.49:1 at 0.6 opacity and still only 4.01:1 at 0.85, both
     under the 4.5:1 floor. The shallowest fade that clears the floor is
     about 0.92, which is imperceptible and therefore pointless.

     DESIGN.md A3 does not bend, so the fade goes and the movement
     carries the ripple on its own. motion-design lists position as the
     primary property for an entrance in any case. */
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
        { y: T_LEAD },
        { y: 0, duration: 0.6, ease: 'none' },
        i * 0.2);
    });
  }

  clearTimeout(failsafe);

  return () => {
    splits.forEach(s => s.revert());
    reveal();
  };
});

/* The layout settles after the font swaps. Without this the triggers
   are measured against the fallback face and fire in the wrong places. */
document.fonts.ready.then(() => ScrollTrigger.refresh());

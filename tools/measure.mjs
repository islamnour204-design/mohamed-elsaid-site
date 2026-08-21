/* Reads the rendered page and reports the numbers that decide whether
 * a layout is finished: does it fit, how many lines did the headline
 * take, is any image being asked to stretch past its own resolution,
 * does every colour pair clear the contrast floor, is every tap target
 * big enough.
 *
 *   node tools/measure.mjs <url> [label] [<url> [label] ...]
 *
 * craft-floor.md: "Each of these is a check on the built result, not an
 * intention... Read the computed values."
 * ui-ux-pro-max priority 1: contrast 4.5:1 body, 3:1 large text.
 * ui-ux-pro-max priority 2: touch targets minimum 44x44px.
 */
import { chromium } from 'playwright-core';

const CONTRAST_BODY = 4.5;
const CONTRAST_LARGE = 3.0;
const TAP_MIN = 44;

const lum = c => {
  const [r, g, b] = c.match(/\d+/g).slice(0, 3).map(Number).map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (fg, bg) => {
  const [hi, lo] = [lum(fg), lum(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
};

const args = process.argv.slice(2);
const targets = [];
for (let i = 0; i < args.length; i += 2) targets.push([args[i], args[i + 1] ?? args[i]]);
if (!targets.length) targets.push(['http://localhost:5180/', 'page']);

const browser = await chromium.launch({ channel: 'chrome' });
let failures = 0;

for (const [url, label] of targets) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const data = await page.evaluate(() => {
    const lines = el => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight));

    /* Walk up for the nearest ancestor that actually paints a
     * background. Comparing text against a transparent parent is how
     * contrast audits end up reporting numbers that mean nothing. */
    const groundOf = el => {
      for (let n = el; n; n = n.parentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return bg;
      }
      return 'rgb(255, 255, 255)';
    };

    const headings = [...document.querySelectorAll('h1, h2, h3, .claim, .claim-lede, .name')];
    const texts = [...document.querySelectorAll('p, li, span, b, em, i, a, div, dt, dd')]
      .filter(el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));

    const seen = new Set();
    const contrast = [...headings, ...texts].map(el => {
      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      const weight = Number(cs.fontWeight) || 400;
      const key = `${el.className || el.tagName}|${cs.color}|${groundOf(el)}|${size}`;
      if (seen.has(key)) return null;
      seen.add(key);
      return {
        what: (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : el.tagName.toLowerCase()),
        color: cs.color,
        ground: groundOf(el),
        size,
        /* WCAG "large text": 18.66px bold, or 24px at any weight. */
        large: size >= 24 || (size >= 18.66 && weight >= 700)
      };
    }).filter(Boolean);

    /* Some controls only exist once focused, the skip link above all.
     * Measuring one in its hidden state reports the size of something
     * no user ever touches, so focus it first and measure that. */
    const taps = [...document.querySelectorAll('a[href], button')].map(el => {
      let r = el.getBoundingClientRect();
      let focused = false;
      if (r.left < 0 || r.top < 0 || r.width === 0) {
        el.focus();
        r = el.getBoundingClientRect();
        focused = true;
        el.blur();
      }
      return {
        what: el.textContent.trim().slice(0, 24) || el.className,
        w: Math.round(r.width),
        h: Math.round(r.height),
        focused
      };
    }).filter(t => t.w > 0);

    const imgs = [...document.querySelectorAll('img')].map(img => {
      const r = img.getBoundingClientRect();
      return {
        src: img.getAttribute('src').split('/').pop(),
        css: `${Math.round(r.width)}x${Math.round(r.height)}`,
        natural: `${img.naturalWidth}x${img.naturalHeight}`,
        upscale: img.naturalWidth ? (r.width * 2) / img.naturalWidth : 0
      };
    });

    /* Only the first section has to fit one viewport. Measuring the whole
     * document against 900px reports a failure for every page longer than
     * one screen, which is every page. */
    /* Selector order matters: querySelector with a comma list returns the
     * first match in DOCUMENT order, not the first selector that hits, so
     * "main > section, main" would return main every time. */
    const first = ['main > section', 'main', 'body']
      .map(s => document.querySelector(s)).find(Boolean);
    /* taste 4.7's actual requirement is "CTAs visible without scroll",
     * not a section that measures under one viewport. A section whose
     * padding spills a few pixels past the fold passes; a section whose
     * buttons are below it does not. Measure the rule, not the proxy. */
    const cta = document.querySelector('.act a, main a[class*="btn"]');

    return {
      firstSection: Math.round(first.getBoundingClientRect().height),
      ctaBottom: cta ? Math.round(cta.getBoundingClientRect().bottom) : null,
      pageHeight: document.documentElement.scrollHeight,
      headingLines: headings.filter(h => h.textContent.trim()).map(h => ({
        what: h.className ? '.' + h.className.split(' ')[0] : h.tagName.toLowerCase(),
        size: getComputedStyle(h).fontSize,
        lines: lines(h)
      })),
      contrast, taps, imgs
    };
  });

  console.log(`\n=== ${label} ===`);
  if (data.ctaBottom !== null) {
    const ctaVisible = data.ctaBottom <= 900;
    if (!ctaVisible) failures++;
    console.log(`primary CTA bottom at ${data.ctaBottom}px of 900  ${ctaVisible ? 'visible without scroll' : 'FAIL, below the fold'}`);
  }
  console.log(`first section ${data.firstSection}px (informational; ${data.firstSection > 900 ? (data.firstSection - 900) + 'px of it sits below the fold' : 'inside one viewport'})`);
  console.log(`whole page ${data.pageHeight}px`);

  console.log('headings:');
  data.headingLines.forEach(h => console.log(`  ${h.what.padEnd(14)} ${h.size.padStart(6)}  ${h.lines} line${h.lines === 1 ? '' : 's'}`));

  console.log('images:');
  data.imgs.forEach(i => {
    const soft = i.upscale > 1;
    if (soft) failures++;
    console.log(`  ${i.src}  ${i.css} css from ${i.natural} source  needs ${i.upscale.toFixed(2)}x its own pixels  ${soft ? 'WILL SOFTEN on a 2x screen' : 'ok'}`);
  });

  console.log('contrast:');
  data.contrast.forEach(c => {
    const r = ratio(c.color, c.ground);
    const floor = c.large ? CONTRAST_LARGE : CONTRAST_BODY;
    const pass = r >= floor;
    if (!pass) failures++;
    console.log(`  ${c.what.padEnd(14)} ${r.toFixed(2)}:1 against ${floor}:1 floor  ${pass ? 'pass' : 'FAIL'}${c.large ? '  (large text)' : ''}`);
  });

  console.log('tap targets:');
  data.taps.forEach(t => {
    const pass = t.h >= TAP_MIN;
    if (!pass) failures++;
    console.log(`  ${('"' + t.what + '"').padEnd(26)} ${t.w}x${t.h}  ${pass ? 'pass' : 'FAIL, floor is ' + TAP_MIN}${t.focused ? '  (measured focused)' : ''}`);
  });

  await page.close();
}

await browser.close();
console.log(`\n${failures === 0 ? 'all checks pass' : failures + ' check(s) failed'}`);
process.exit(failures === 0 ? 0 : 1);

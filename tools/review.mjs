/* v2 review shots. Five screen sizes from DELEGATION-PLAN 15.1, the
 * hero, each section, and the pinned migration at start, middle, end.
 *
 *   node tools/review.mjs [url] [outdir] [sizes] [reduced]
 *   sizes: comma list like 1366x657,390x750 (default: all five)
 *   reduced: 1 to emulate prefers-reduced-motion
 *
 * Logs console errors, horizontal overflow, and whether the footer is
 * reachable. Refuses to shoot a page that is not this site.
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] ?? 'http://127.0.0.1:3000/';
const out = process.argv[3] ?? 'shots/v2';
const sizes = (process.argv[4] ?? '1366x657,1536x730,1920x960,390x750,360x640')
  .split(',').map(s => s.split('x').map(Number));
const reduced = process.argv[5] === '1';

mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });

for (const [w, h] of sizes) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url, { waitUntil: 'networkidle' });
  if (!(await page.title()).includes('Mohamed Elsaid')) throw new Error('not the Elsaid site');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2600);
  const tag = `${w}x${h}${reduced ? '-rm' : ''}`;

  const go = async y => {
    await page.evaluate(v => {
      if (window.__lenis) window.__lenis.scrollTo(v, { immediate: true, force: true });
      else window.scrollTo(0, v);
    }, y);
    await page.waitForTimeout(700);
  };
  const shot = async name => page.screenshot({ path: `${out}/${tag}-${name}.png` });

  await shot('01-hero');

  const tops = await page.evaluate(() => Object.fromEntries(
    [...document.querySelectorAll('[data-layer]')].map(s => [s.id, s.getBoundingClientRect().top + scrollY])
  ));
  const nav = 64;
  /* Walk down so every scrubbed scene has passed through its range. */
  for (const id of ['advisory', 'edge-ai']) {
    await go(tops[id] - nav);
    await shot(`02-${id}`);
  }
  /* Edge AI figure mid-scene, and Advisory stack mid-open. */
  const amxY = await page.evaluate(() => document.querySelector('[data-amx]').getBoundingClientRect().top + scrollY);
  await go(amxY - h * 0.45);
  await shot('03-amx-mid');

  /* Migration: find the pin range from its spacer. */
  const pin = await page.evaluate(() => {
    const st = window.ScrollTrigger?.getAll?.();
    const el = document.querySelector('[data-mig]');
    const spacer = el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el;
    const top = spacer.getBoundingClientRect().top + scrollY;
    return { top, height: spacer.offsetHeight, own: el.offsetHeight };
  });
  const start = pin.top - nav - 32;
  const range = pin.height - pin.own;
  for (const [f, name] of [[0.04, 'start'], [0.22, 'round1'], [0.42, 'round2'], [0.72, 'pause'], [0.97, 'end']]) {
    await go(start + range * f);
    await shot(`04-mig-${name}`);
  }
  await go(start + range + h * 0.6);
  await shot('05-research-after');
  for (const id of ['career', 'contact']) {
    const t = await page.evaluate(i => document.getElementById(i).getBoundingClientRect().top + scrollY, id);
    await go(t - nav);
    await shot(`06-${id}`);
  }
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  await go(max);
  await shot('07-footer');

  const report = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - innerWidth,
    footerVisible: (() => { const r = document.querySelector('.foot').getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })(),
    wide: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest('.hero-portrait')).slice(0, 5).map(e => e.className || e.tagName)
  }));
  console.log(tag, JSON.stringify({ pin, ...report, errors }));
  await page.close();
}
await browser.close();

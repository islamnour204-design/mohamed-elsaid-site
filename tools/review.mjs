/* v3 review shots. Five screen sizes from DELEGATION-PLAN 15.1: the
 * introduction straight after load, each section from its top, and one
 * full-page image after every entrance has played.
 *
 *   node tools/review.mjs [url] [outdir] [sizes] [reduced]
 *   sizes: comma list like 1366x657,390x750 (default: all five)
 *   reduced: 1 to emulate prefers-reduced-motion
 *
 * Logs console errors, horizontal overflow, anything still hidden after
 * the walk, and whether the footer is reachable. Refuses to shoot a page
 * that is not this site.
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] ?? 'http://127.0.0.1:3000/';
const out = process.argv[3] ?? 'shots/v3';
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
  const shot = async (name, fullPage = false) => page.screenshot({ path: `${out}/${tag}-${name}.png`, fullPage });

  await shot('01-intro');

  /* Walk the page a screen at a time so every entrance fires and plays. */
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y <= max + h; y += Math.round(h * 0.6)) {
    await page.evaluate(v => window.scrollTo(0, v), y);
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(1600);

  const ids = ['practice', 'focus', 'career', 'research', 'contact'];
  for (const [i, id] of ids.entries()) {
    await page.evaluate(i => document.getElementById(i).scrollIntoView(), id);
    await page.waitForTimeout(400);
    await shot(`0${i + 2}-${id}`);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(400);
  await shot('07-footer');
  await shot('99-full', true);

  const report = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - innerWidth,
    footerVisible: (() => { const r = document.querySelector('.foot').getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })(),
    wide: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest('.hero-portrait')).slice(0, 5).map(e => e.className || e.tagName),
    stillHidden: [...document.querySelectorAll('main *')].filter(e => {
      let o = 1;
      for (let n = e; n && n !== document.body; n = n.parentElement) o *= +getComputedStyle(n).opacity;
      return o < 0.99 && e.getBoundingClientRect().height > 0;
    }).slice(0, 5).map(e => e.className || e.tagName),
    activeNav: document.querySelector('[data-link].is-on')?.dataset.link ?? null
  }));
  console.log(tag, JSON.stringify({ ...report, errors }));
  await page.close();
}
await browser.close();

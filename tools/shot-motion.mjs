/* Prove the motion actually moves.
 *
 * A settled screenshot only shows the end state, which is identical
 * whether the animation ran or the safety net fired. This captures the
 * entrance frame by frame, and walks the scroll positions where the
 * scroll-driven work happens.
 *
 *   node tools/shot-motion.mjs
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const URL = 'http://localhost:5180/';
const FRAMES = [120, 300, 550, 850, 1300];

mkdirSync('shots/motion', { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });

/* --- the hero entrance, frame by frame --- */
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: 'commit' });

const t0 = Date.now();
for (const at of FRAMES) {
  const wait = at - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  const file = `shots/motion/hero-${String(at).padStart(4, '0')}ms.png`;
  await page.screenshot({ path: file });
  const state = await page.evaluate(() => {
    const g = s => document.querySelector(s);
    const op = s => (g(s) ? getComputedStyle(g(s)).opacity : 'n/a');
    return {
      name: op('.name'),
      sub: op('.sub'),
      act: op('.act'),
      mask: g('.portrait img') ? getComputedStyle(g('.portrait img')).getPropertyValue('--mask-stop').trim() : 'n/a'
    };
  });
  console.log(`${file}  name ${state.name}  sub ${state.sub}  buttons ${state.act}  mask ${state.mask}`);
}
await page.close();

/* --- the scroll-driven work --- */
const sp = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await sp.goto(URL, { waitUntil: 'networkidle' });
await sp.evaluate(() => document.fonts.ready);
await sp.waitForTimeout(1600);

const total = await sp.evaluate(() => document.documentElement.scrollHeight);
for (const frac of [0, 0.25, 0.45, 0.6, 0.8, 1]) {
  const y = Math.round((total - 900) * frac);
  await sp.evaluate(v => window.scrollTo(0, v), y);
  await sp.waitForTimeout(700);
  const file = `shots/motion/scroll-${String(Math.round(frac * 100)).padStart(3, '0')}.png`;
  await sp.screenshot({ path: file });
  const state = await sp.evaluate(() => {
    const fig = document.querySelector('.fig-n');
    const rows = [...document.querySelectorAll('.frow')];
    return {
      figureY: fig ? getComputedStyle(fig).transform : 'n/a',
      rowOpacity: rows.map(r => Number(getComputedStyle(r).opacity).toFixed(2)).join(' / ')
    };
  });
  console.log(`${file}  scrollY ${y}  figures ${state.figureY}  rows ${state.rowOpacity}`);
}
await sp.close();

await browser.close();

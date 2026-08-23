/* Screenshots at the two widths BUILD-BRIEF.md requires.
 *
 *   node tools/shot.mjs [url] [label]
 *
 * Uses the Chrome already installed on this machine. Downloads nothing.
 *
 * IDENTITY GUARD: on 20 August this script photographed a completely
 * different project. Port 5173 was already in use by another site, Vite
 * moved itself to 5174 without failing, and the screenshot came back
 * showing someone else's app while both tools reported success. The
 * guard below refuses to save an image unless the page is really this
 * site. A screenshot you cannot trust is worse than no screenshot.
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:5180/';
const label = process.argv[3] ?? '';
const EXPECT = 'Mohamed Elsaid';

mkdirSync('shots', { recursive: true });

const VIEWS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '390', width: 390, height: 844 }
];

const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const v of VIEWS) {
    const page = await browser.newPage({
      viewport: { width: v.width, height: v.height },
      deviceScaleFactor: 2
    });
    await page.goto(url, { waitUntil: 'networkidle' });

    const title = await page.title();
    if (!title.includes(EXPECT)) {
      throw new Error(
        `Refusing to screenshot ${url}\n` +
        `  page title is "${title}"\n` +
        `  expected it to contain "${EXPECT}"\n` +
        `  This is not the Elsaid site. Check which port the dev server bound to.`
      );
    }

    await page.evaluate(() => document.fonts.ready);

    /* Settle pass. A fullPage screenshot scrolls the page to stitch it,
     * which fires every scroll-triggered animation mid-capture: the
     * result showed a half-wiped heading and figures with no numbers.
     * Walk the page once so every trigger has fired and finished, then
     * return to the top and let the hero settle before shooting. */
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 400) {
      await page.evaluate(v => window.scrollTo(0, v), y);
      await page.waitForTimeout(60);
    }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1600);

    /* Chrome cannot composite a texture past roughly 16384px, and a
     * fullPage capture beyond it silently repeats bands of the page
     * rather than failing. At 390px this page is over 10000px tall,
     * which at 2x is 20000 and produced a screenshot showing the hero
     * twice. Drop to 1x when the capture would cross the limit. */
    const pageH = await page.evaluate(() => document.documentElement.scrollHeight);
    const LIMIT = 16384;
    const oversize = pageH * 2 > LIMIT;
    if (oversize) console.log(`  (${v.name}: page ${pageH}px, capturing at 1x to stay under the ${LIMIT}px texture limit)`);

    const file = `shots/${label ? label + '-' : ''}${v.name}.png`;
    await page.screenshot({ path: file, fullPage: true, scale: oversize ? 'css' : 'device' });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(`${file}  ${v.width}x${v.height}  page height ${h}px  title "${title}"`);
    await page.close();
  }
} finally {
  await browser.close();
}

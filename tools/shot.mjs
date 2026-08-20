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
    const file = `shots/${label ? label + '-' : ''}${v.name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(`${file}  ${v.width}x${v.height}  page height ${h}px  title "${title}"`);
    await page.close();
  }
} finally {
  await browser.close();
}

/* Read the subject's real bounding box out of the portrait's alpha
 * channel, so the frame is derived from where Mohamed actually is in the
 * file rather than from a ratio someone liked the sound of.
 *
 * BUILD-BRIEF section 5: "Portrait cropping must be driven by the
 * subject's bounding box, never a fixed aspect ratio, or heads get cut
 * off."
 *
 *   node tools/portrait-bbox.mjs
 */
import { chromium } from 'playwright-core';

const URL = 'http://localhost:5180/assets/img/mohamed-elsaid.webp';
const ALPHA_FLOOR = 24;   // out of 255, ignores anti-aliased fringe

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.goto('http://localhost:5180/');

const box = await page.evaluate(async ({ url, floor }) => {
  const img = new Image();
  img.src = url;
  await img.decode();

  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, c.width, c.height);

  let minX = c.width, minY = c.height, maxX = -1, maxY = -1, opaque = 0;
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      if (data[(y * c.width + x) * 4 + 3] > floor) {
        opaque++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  /* Where is the head? Scan down for the first row with meaningful
   * width, then find where the silhouette widens into shoulders. */
  const rowWidth = [];
  for (let y = 0; y < c.height; y++) {
    let n = 0;
    for (let x = 0; x < c.width; x++) if (data[(y * c.width + x) * 4 + 3] > floor) n++;
    rowWidth.push(n);
  }
  const widest = Math.max(...rowWidth);
  const shoulderY = rowWidth.findIndex(w => w > widest * 0.9);

  return {
    source: { w: c.width, h: c.height },
    subject: { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 },
    coveragePct: +(100 * opaque / (c.width * c.height)).toFixed(1),
    shoulderY,
    transparentMargins: { left: minX, right: c.width - 1 - maxX, top: minY, bottom: c.height - 1 - maxY }
  };
}, { url: URL, floor: ALPHA_FLOOR });

const s = box.subject;
console.log('source            ', `${box.source.w}x${box.source.h}`);
console.log('subject bounding  ', `${s.w}x${s.h} at (${s.minX}, ${s.minY})`);
console.log('subject ratio     ', (s.w / s.h).toFixed(3), `(w/h)`);
console.log('transparent margin', JSON.stringify(box.transparentMargins));
console.log('opaque coverage   ', box.coveragePct + '%');
console.log('shoulders begin at', `y=${box.shoulderY}`);

/* What can this file actually carry on a 2x screen? */
for (const cssW of [260, 280, 300, 320, 340]) {
  const need = cssW * 2;
  const have = s.w;
  console.log(
    `  at ${cssW}px css, need ${need} device px, subject has ${have} -> ` +
    (have >= need ? 'sharp' : `${(have / need).toFixed(2)}x, soft`)
  );
}

await browser.close();

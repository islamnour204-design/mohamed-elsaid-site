/* One-shot: lift the portrait out of the reference build into a real file.
 *
 * The previous build pasted a 52KB image into the HTML as base64 text.
 * This pulls it out so the browser can cache it, so the file can be
 * replaced without touching markup, and so Phase 5 can swap in the
 * high-resolution original by overwriting one file.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SRC = 'elsaid-stack.html';
const OUT = 'src/assets/img/mohamed-elsaid.webp';

const html = readFileSync(SRC, 'utf8');
const m = html.match(/data:image\/webp;base64,([A-Za-z0-9+/=]+)/);
if (!m) throw new Error(`No base64 WebP found in ${SRC}`);

const buf = Buffer.from(m[1], 'base64');
mkdirSync('src/assets/img', { recursive: true });
writeFileSync(OUT, buf);

const riff = buf.toString('ascii', 0, 4);
const webp = buf.toString('ascii', 8, 12);
const vp8x = buf.toString('ascii', 12, 16) === 'VP8X';
if (riff !== 'RIFF' || webp !== 'WEBP') throw new Error('Extracted file is not a WebP');
if (!vp8x) throw new Error('No VP8X header, cannot read dimensions or alpha flag');

const width = 1 + buf.readUIntLE(24, 3);
const height = 1 + buf.readUIntLE(27, 3);
const hasAlpha = Boolean(buf[20] & 0x10);

console.log(`${OUT}  ${width}x${height}  ${buf.length} bytes  alpha=${hasAlpha}`);
if (!hasAlpha) {
  throw new Error('No alpha channel: the cut-out treatment is not possible from this file');
}

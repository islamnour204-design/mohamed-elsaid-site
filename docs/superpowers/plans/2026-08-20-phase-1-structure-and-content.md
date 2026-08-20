# Phase 1 — Structure and Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the five-layer Stack page as a real Vite project with correct content, colour, type and the cut-out portrait, verified by screenshots at 1440px and 390px, with no animation of any kind.

**Architecture:** A Vite multi-page static site rooted at `/src`. Three HTML pages, three stylesheets layered by responsibility (tokens → base → layers), one portrait file extracted from the reference build. Two Node scripts under `/tools` form the verification harness: one drives the installed Chrome to produce screenshots, the other scans the source for rule violations. The harness is built in Task 2, before any page work, because the documented failure mode of this project is work being declared finished without being looked at.

**Tech Stack:** Vite 7, vanilla HTML/CSS/JS, `playwright-core` (drives the already-installed Chrome, downloads no browser), `@fontsource-variable/geist` (build-time only; the font file is copied into the project and the dependency is not needed at runtime). No framework. No GSAP in this phase.

**Spec:** `DESIGN.md` and `BUILD-BRIEF.md` in the project root. Machine values in `tokens.css`. Both spec documents travel with this plan; read them before executing any task.

## Global Constraints

These apply to every task. They are copied verbatim from the spec.

- **No raw hex codes anywhere in the CSS except `tokens.css`.** Every colour reads from a token. Phase 1 gate condition.
- **Do not edit a value in `tokens.css`.** If a value is needed and is not there, add it there first.
- **No animation at all in this phase.** No transitions, no keyframes, no IntersectionObserver reveals, no GSAP. Static page.
- **`--radius: 0` everywhere, without exception.** Rounded corners are banned.
- **Banned:** gradient background washes, particle or dot fields, gradient text, eyebrow or kicker labels above headings, the hero-metric template, em-dashes in copy, emoji, unicode glyphs standing in for icons, Fraunces, Instrument Serif, navy and brass, orange, rounded corners, decorative geometry (floating triangles, confetti, half-circles).
- **Section numbers (01/02/03) are allowed.** In The Stack the numbers are the concept.
- **Never claim:** "technology executive", "nearly two decades", board-readiness, any board seat. **Never include:** date of birth, marital status, number of children, nationality.
- **The invented email `mohamed@elsaid.de` must never appear in `/src`.** Its layout row is built and visibly marked as awaiting a real address instead.
- **Placeholders must not ship.** `000` and `00%` render with a visible marker during development and hard-fail the release build.
- **Buttons:** `--on-accent` on `--accent`. Ink on petrol is 2.3:1 and FAILS. Never do it.
- **Accent discipline:** never use `--accent-light` on a light ground or `--accent` on a dark one.
- **Type:** one family, Geist. `--measure: 68ch` for body text.
- **Portrait treatment:** cut out, no frame, no border, no rectangle, no circle, merged into the ground, fading into the ground at its lower edge.
- **Every gate:** render in real Chrome and look at it. Check 1440px and 390px. If a screenshot cannot be produced, say so plainly rather than guessing.
- **Phase 1 sign-off is provisional.** Final layout confirmation happens at the end of Phase 2. Do not record Phase 1 approval as final agreement on the composition.

---

## File Structure

| Path | Responsibility |
|---|---|
| `package.json` | Scripts and the two dev dependencies |
| `vite.config.js` | Root `/src`, three-page input, output to `/dist` |
| `.gitignore` | `node_modules`, `dist`, `shots`, and the source PDFs |
| `tools/extract-portrait.mjs` | One-shot: base64 out of the reference build into a real file |
| `tools/shot.mjs` | Screenshots at 1440 and 390 via installed Chrome |
| `tools/check.mjs` | Rule scanner. `--dev` (hard bans) and `--release` (also placeholders) |
| `src/index.html` | Layers 01–05 plus contact |
| `src/publications.html` | Stub in Phase 1, real in Phase 4 |
| `src/cv.html` | Stub in Phase 1, real in Phase 4 |
| `src/styles/tokens.css` | Copied unchanged from the project root |
| `src/styles/base.css` | Font face, resets, type scale, links, focus, skip link, shell |
| `src/styles/layers.css` | The five layers and the four approved internal layouts |
| `src/assets/fonts/Geist-Variable.woff2` | Self-hosted font |
| `src/assets/img/mohamed-elsaid.webp` | The cut-out portrait |
| `docs/PHASE-1-NOTES.md` | What was dropped, what is outstanding, which portrait treatment was used |

`/src/scripts/` is deliberately absent in Phase 1. There is no JavaScript on the page. It arrives in Phase 2.

---

### Task 1: Project scaffold and first commit

**Files:**
- Create: `package.json`, `vite.config.js`, `.gitignore`, `src/index.html`, `src/publications.html`, `src/cv.html`
- Verify: dev server serves a page in a real browser

**Interfaces:**
- Consumes: nothing
- Produces: `npm run dev` (Vite dev server on port 5173), `npm run build` (writes `/dist`), Vite root at `src/`, three page entry points named `index`, `publications`, `cv`

- [ ] **Step 1: Initialise Git before anything else**

```bash
cd "C:/Users/Access/OneDrive/Desktop/Business/Mohamed essam website"
git init
```

- [ ] **Step 2: Write `.gitignore`**

The PDFs are excluded deliberately. They contain Mohamed's CV, a statement of purpose, and the two documents produced by the fraudulent recruiter. If this repository is ever pushed to GitHub, those must not travel with it.

```
node_modules/
dist/
shots/
*.pdf
```

- [ ] **Step 3: Write `package.json`**

```json
{
  "name": "elsaid-site",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "node tools/check.mjs --release && vite build",
    "preview": "vite preview --port 4173",
    "check": "node tools/check.mjs --dev",
    "shots": "node tools/shot.mjs"
  },
  "devDependencies": {
    "vite": "^7.0.0",
    "playwright-core": "^1.50.0",
    "@fontsource-variable/geist": "^5.0.0"
  }
}
```

- [ ] **Step 4: Write `vite.config.js`**

```js
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: 'src',
  publicDir: false,
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
        publications: resolve(__dirname, 'src/publications.html'),
        cv: resolve(__dirname, 'src/cv.html')
      }
    }
  }
});
```

`__dirname` is not defined in an ES module. Replace it with the two lines below at the top of the file, or the build fails with "__dirname is not defined":

```js
import { fileURLToPath } from 'node:url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
```

- [ ] **Step 5: Install**

```bash
npm install
```

Expected: `node_modules` created, no errors. If `@fontsource-variable/geist` fails to resolve, stop and report it — Task 4 depends on the file it ships and there is no silent fallback.

- [ ] **Step 6: Write three minimal valid pages**

`src/index.html` for now is a valid skeleton only. Content arrives in Tasks 5–8.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mohamed Elsaid</title>
</head>
<body>
  <p>Scaffold check.</p>
</body>
</html>
```

`src/publications.html` and `src/cv.html` are the same skeleton with titles `Publications — Mohamed Elsaid` and `Curriculum vitae — Mohamed Elsaid`. Note: the phrase in a `<title>` is not body copy, but the em-dash ban is checked across all of `/src`. Use a comma instead: `Publications, Mohamed Elsaid`.

- [ ] **Step 7: Run the dev server and confirm it actually serves**

```bash
npm run dev
```

Expected: `Local: http://localhost:5173/`. Open it. Expected: the words "Scaffold check." Do not proceed on the basis that the config looks correct.

- [ ] **Step 8: Confirm the build produces three pages**

```bash
npx vite build
```

Expected: `dist/index.html`, `dist/publications.html`, `dist/cv.html`. (`npm run build` will fail until Task 2 creates `check.mjs`; that is why this step calls Vite directly.)

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: vite scaffold, three pages, git init"
```

---

### Task 2: The verification harness

Built before any page work. This is the task that prevents the failure this project has already had six times.

**Files:**
- Create: `tools/check.mjs`, `tools/shot.mjs`
- Test against: `elsaid-stack.html` (a known-bad file — it contains raw hex, the invented email, and both placeholders)

**Interfaces:**
- Consumes: Vite dev server from Task 1
- Produces: `node tools/check.mjs --dev` (exit 1 on hard-ban violation), `node tools/check.mjs --release` (also exit 1 on any `data-placeholder` attribute), `node tools/shot.mjs [url]` (writes `shots/1440.png` and `shots/390.png`)

- [ ] **Step 1: Write `tools/check.mjs`**

```js
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const release = process.argv.includes('--release');
const SRC = 'src';
const failures = [];

function walk(dir) {
  return readdirSync(dir).flatMap(name => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(SRC).filter(p => ['.html', '.css', '.js'].includes(extname(p)));

const RULES = [
  {
    name: 'raw hex colour outside tokens.css',
    test: /#[0-9a-fA-F]{3,8}\b/g,
    skip: p => basename(p) === 'tokens.css'
  },
  { name: 'invented email address', test: /mohamed@elsaid\.de/g },
  { name: 'em-dash in copy', test: /—|&mdash;/g },
  { name: 'banned typeface', test: /Fraunces|Instrument Serif/gi },
  { name: 'gradient background wash', test: /background(-image)?\s*:[^;]*gradient/gi },
  { name: 'non-zero border radius', test: /border-radius\s*:\s*(?!0)(?!var\(--radius\))[^;]+/gi },
  { name: 'banned claim', test: /technology executive|nearly two decades|board.ready/gi }
];

if (release) {
  RULES.push({ name: 'placeholder left in a release build', test: /data-placeholder/g });
}

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const rule of RULES) {
    if (rule.skip?.(file)) continue;
    for (const m of text.matchAll(rule.test)) {
      const line = text.slice(0, m.index).split('\n').length;
      failures.push(`${file}:${line}  ${rule.name}  ->  ${m[0].trim().slice(0, 60)}`);
    }
  }
}

if (failures.length) {
  console.error(`\ncheck failed (${release ? 'release' : 'dev'} mode), ${failures.length} problem(s):\n`);
  failures.forEach(f => console.error('  ' + f));
  console.error('');
  process.exit(1);
}
console.log(`check passed (${release ? 'release' : 'dev'} mode), ${files.length} files scanned`);
```

- [ ] **Step 2: Prove the checker catches real violations before trusting it**

A checker that passes everything is worse than none. Point it at the known-bad reference build:

```bash
node -e "import('node:fs').then(fs=>fs.copyFileSync('elsaid-stack.html','src/__bad.html'))"
node tools/check.mjs --dev
```

Expected: **exit 1**, reporting raw hex codes, the invented email, and banned-claim or gradient hits from `src/__bad.html`. If it exits 0, the checker is broken — fix it before continuing.

- [ ] **Step 3: Remove the fixture and confirm a clean pass**

```bash
node -e "import('node:fs').then(fs=>fs.unlinkSync('src/__bad.html'))"
node tools/check.mjs --dev
```

Expected: `check passed (dev mode), 3 files scanned`.

- [ ] **Step 4: Write `tools/shot.mjs`**

`channel: 'chrome'` uses the Chrome already installed at `C:/Program Files/Google/Chrome/Application/chrome.exe`. No browser is downloaded.

```js
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:5173/';
const label = process.argv[3] ?? '';
mkdirSync('shots', { recursive: true });

const VIEWS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '390', width: 390, height: 844 }
];

const browser = await chromium.launch({ channel: 'chrome' });
for (const v of VIEWS) {
  const page = await browser.newPage({
    viewport: { width: v.width, height: v.height },
    deviceScaleFactor: 2
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const file = `shots/${label ? label + '-' : ''}${v.name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`${file}  ${v.width}x${v.height}  page height ${h}px`);
  await page.close();
}
await browser.close();
```

- [ ] **Step 5: Prove screenshots actually get produced**

With the dev server running from Task 1:

```bash
npm run shots
```

Expected: two lines of output and two real PNG files in `shots/`. **Open both and look at them.** They should show the words "Scaffold check." If the images are blank or the command errors, stop and fix the harness now — every gate in this plan depends on it.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test: verification harness, rule checker and Chrome screenshots"
```

---

### Task 3: Extract the portrait to a real file

**Files:**
- Create: `tools/extract-portrait.mjs`, `src/assets/img/mohamed-elsaid.webp`
- Read: `elsaid-stack.html` (the base64 blob lives on line 338)

**Interfaces:**
- Consumes: nothing
- Produces: `src/assets/img/mohamed-elsaid.webp`, 680×564, WebP with an alpha channel, referenced by Task 5

- [ ] **Step 1: Write `tools/extract-portrait.mjs`**

```js
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
if (!hasAlpha) throw new Error('No alpha channel: the cut-out treatment is not possible from this file');
```

- [ ] **Step 2: Run it**

```bash
node tools/extract-portrait.mjs
```

Expected exactly: `src/assets/img/mohamed-elsaid.webp  680x564  52254 bytes  alpha=true`

- [ ] **Step 3: Look at the extracted file**

Open it. Expected: Mohamed against a transparent background, cut out at the shoulders, no frame. Check the hair edge and the shoulder line at 200% zoom as DESIGN.md requires. A halo or a jagged shoulder is worse than not doing it — if either is present, switch to the masked-fade fallback in Task 5 and record which one was used.

- [ ] **Step 4: Record the size constraint**

680px wide is the ceiling. On screen it can carry roughly 340px at 2× device pixel ratio before it visibly softens. Write this into `docs/PHASE-1-NOTES.md`; it is why the large portrait Mohamed asked for stays blocked until the high-resolution original arrives.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: extract portrait from reference build into a real webp"
```

---

### Task 4: Tokens, font, and base stylesheet

**Files:**
- Create: `src/styles/tokens.css` (copy), `src/styles/base.css`, `src/assets/fonts/Geist-Variable.woff2`
- Modify: `src/index.html` (link the stylesheets)

**Interfaces:**
- Consumes: `npm install` from Task 1
- Produces: the class names `.shell`, `.skip`, `.layer`, `.meta`, `.body`, `.prose` used by Tasks 5–8; `--font` resolving to a self-hosted Geist

- [ ] **Step 1: Copy tokens.css unchanged**

```bash
node -e "import('node:fs').then(fs=>{fs.mkdirSync('src/styles',{recursive:true});fs.copyFileSync('tokens.css','src/styles/tokens.css')})"
```

Do not edit a single value in the copy. If a value is missing later, add it to **both** files so the root `tokens.css` stays the source of truth.

- [ ] **Step 2: Copy the font file out of node_modules**

```bash
node -e "const fs=require('fs');fs.mkdirSync('src/assets/fonts',{recursive:true});const d='node_modules/@fontsource-variable/geist/files/';const f=fs.readdirSync(d).filter(n=>n.includes('latin')&&n.endsWith('.woff2'));console.log(f);fs.copyFileSync(d+f[0],'src/assets/fonts/Geist-Variable.woff2')"
```

Expected: the array of matching filenames prints, and the file appears. If the directory does not exist, list `node_modules/@fontsource-variable/geist/` and adapt the path — do not fall back to the Google Fonts CDN, which Islam explicitly ruled out.

- [ ] **Step 3: Write `src/styles/base.css`**

Every colour is a token. No hex. No transitions in this phase.

```css
@font-face {
  font-family: "Geist";
  src: url("../assets/fonts/Geist-Variable.woff2") format("woff2-variations");
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
}

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background: var(--ground-1);
  color: var(--ink);
  font-family: var(--font);
  font-size: var(--t-body);
  font-weight: 400;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 { margin: 0; font-weight: 600; letter-spacing: var(--tracking-h); line-height: 1.1; }
h1 { font-size: var(--t-display); letter-spacing: var(--tracking-display); }
h2 { font-size: var(--t-h2); }
h3 { font-size: var(--t-h3); }
p { margin: 0; }

/* craft-floor.md, Spacing: "more space above a heading than below it".
   A heading belongs to the content beneath it. Even spacing above and
   below is what makes sections read as one continuous surface. */
h2 + *, h3 + * { margin-top: var(--s-3); }
* + h2 { margin-top: var(--s-6); }
* + h3 { margin-top: var(--s-5); }

a { color: inherit; text-decoration-thickness: 1px; text-underline-offset: .22em; }

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.shell {
  width: 100%;
  max-width: var(--max);
  margin-inline: auto;
  padding-inline: var(--gutter);
}

.prose { max-width: var(--measure); color: var(--ink-secondary); }
.prose p + p { margin-top: var(--s-2); }

.skip {
  position: absolute;
  left: -9999px;
}
.skip:focus {
  left: var(--gutter);
  top: var(--s-2);
  z-index: 10;
  background: var(--accent);
  color: var(--on-accent);
  padding: var(--s-1) var(--s-2);
}

/* Layer scaffolding. Dark grounds invert their ink. */
.layer { padding-block: var(--s-8); }
.layer .meta {
  display: flex;
  justify-content: space-between;
  font-size: var(--t-meta);
  text-transform: uppercase;
  letter-spacing: var(--tracking-meta);
  color: var(--ink-muted);
  padding-bottom: var(--s-4);
}
.layer .meta b { font-weight: 600; color: var(--ink-secondary); }

.L1 { background: var(--ground-1); }
.L2 { background: var(--ground-2); }
.L3 { background: var(--ground-3); }
.L4 { background: var(--ground-4); }
.L5 { background: var(--ground-5); }

.L4, .L5 { color: var(--ink-inv); }
.L4 .prose, .L5 .prose { color: var(--ink-inv-secondary); }
.L4 .meta, .L5 .meta { color: var(--ink-inv-secondary); }
.L4 .meta b, .L5 .meta b { color: var(--ink-inv); }
.L4 a, .L5 a { color: var(--accent-light); }
.L4 :focus-visible, .L5 :focus-visible { outline-color: var(--accent-light); }
```

- [ ] **Step 4: Link the stylesheets in all three pages**

In each of `src/index.html`, `src/publications.html`, `src/cv.html`, inside `<head>`:

```html
<link rel="preload" href="/assets/fonts/Geist-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles/tokens.css">
<link rel="stylesheet" href="/styles/base.css">
<link rel="stylesheet" href="/styles/layers.css">
```

`layers.css` does not exist yet. Create it now as an empty file with a single comment so the link does not 404:

```css
/* Layer layouts. Populated in tasks 5 to 8. */
```

- [ ] **Step 5: Confirm the font is actually loading, not silently falling back**

Start the dev server, then:

```bash
npm run shots
```

Look at `shots/1440.png`. Then confirm it is Geist rather than the system fallback:

```bash
node -e "import('playwright-core').then(async({chromium})=>{const b=await chromium.launch({channel:'chrome'});const p=await b.newPage();await p.goto('http://localhost:5173/');await p.evaluate(()=>document.fonts.ready);console.log(await p.evaluate(()=>getComputedStyle(document.body).fontFamily), await p.evaluate(()=>document.fonts.check('16px Geist')));await b.close()})"
```

Expected: `"Geist", system-ui, ... true`. A `false` means the `@font-face` src path is wrong and the page is rendering in a fallback face — fix it before styling anything.

- [ ] **Step 6: Run the checker**

```bash
node tools/check.mjs --dev
```

Expected: pass. `tokens.css` is skipped by rule; `base.css` must contain no hex at all.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: self-hosted geist, tokens, base stylesheet"
```

---

### Task 5: Layer 01 Outcome, with the portrait

**Files:**
- Modify: `src/index.html`, `src/styles/layers.css`
- Source content: `elsaid-stack.html` lines 330–347

**Interfaces:**
- Consumes: `.shell`, `.layer`, `.meta` from Task 4; `src/assets/img/mohamed-elsaid.webp` from Task 3
- Produces: `.L1`, `.portrait`, `.claim`, `.sub`, `.act`, `.btn`, `.btn-p`, `.btn-s`

- [ ] **Step 1: Write the layer 01 markup**

Port the copy exactly as written in the reference build. No eyebrow label above the heading. The `<u>` on "costs" is retained; it is the only emphasis in the hero.

```html
<a class="skip" href="#L1">Skip to content</a>

<main>
<section class="layer L1" id="L1">
  <div class="shell">
    <div class="meta"><span>Layer <b>01</b> Outcome</span><span>Mohamed Elsaid</span></div>
    <div class="l1-top">
      <div class="l1-text">
        <p class="who">Intel, Munich</p>
        <p class="name">Mohamed Elsaid</p>
        <h1 class="claim">The question is not whether to adopt AI. It is what the infrastructure underneath it <u>costs</u>.</h1>
        <p class="sub prose">I answer that question for enterprise and public sector organisations across Europe and the Middle East. Doctorate from the Hasso-Plattner Institute, four United States patents, thirteen peer reviewed papers.</p>
        <div class="act">
          <a href="#L4" class="btn btn-p">See the research</a>
          <a href="#contact" class="btn btn-s">Get in touch</a>
        </div>
      </div>
      <figure class="portrait">
        <img src="/assets/img/mohamed-elsaid.webp" width="680" height="564"
             alt="Mohamed Elsaid" decoding="async">
      </figure>
    </div>
  </div>
</section>
</main>
```

`width` and `height` are set now, not deferred to Phase 5, so the page does not jump while the image loads.

- [ ] **Step 2: Write the layer 01 styles, including the portrait treatment**

The portrait sits directly on the ground with no frame, no border, no background, and no radius. The `mask-image` gradient fades the shoulders into the ground at the base — this is a mask, not a background wash, so it does not violate the gradient ban.

```css
.l1-top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: var(--s-6);
  align-items: end;
}

.who {
  font-size: var(--t-meta);
  text-transform: uppercase;
  letter-spacing: var(--tracking-meta);
  color: var(--accent);
}
.name {
  margin-top: var(--s-1);
  font-size: var(--t-h3);
  font-weight: 500;
  letter-spacing: var(--tracking-h);
}
.claim { margin-top: var(--s-5); max-width: 20ch; }
.claim u { text-decoration-color: var(--accent); text-underline-offset: .1em; }
.sub { margin-top: var(--s-4); font-size: var(--t-small); }

.act { display: flex; gap: var(--s-2); margin-top: var(--s-5); flex-wrap: wrap; }
.btn {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 var(--s-3);
  border-radius: var(--radius);
  font-size: var(--t-small);
  font-weight: 500;
  text-decoration: none;
}
.btn-p { background: var(--accent); color: var(--on-accent); }
.btn-s { border: 1px solid var(--rule-strong); color: var(--ink); }

.portrait {
  margin: 0;
  align-self: end;
}
.portrait img {
  display: block;
  width: 100%;
  height: auto;
  mask-image: linear-gradient(to bottom, black 68%, transparent 100%);
}

@media (max-width: 860px) {
  .l1-top { grid-template-columns: 1fr; gap: var(--s-4); }
  .portrait { max-width: 280px; }
  .claim { max-width: none; }
}
```

The 44px minimum height on `.btn` is the tap-target floor.

- [ ] **Step 3: Look at it at both widths**

```bash
npm run shots
```

Open both PNGs. Check specifically: the portrait has no visible box, frame, edge or halo; the shoulders fade into the ground rather than stopping at a line; at 390px the portrait sits below the text rather than being squeezed beside it; nothing overlaps.

- [ ] **Step 4: Run the checker**

```bash
node tools/check.mjs --dev
```

Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: layer 01 outcome with cut-out portrait"
```

---

### Task 6: Layers 02 Advisory and 03 Platform

**Files:**
- Modify: `src/index.html`, `src/styles/layers.css`
- Source content: `elsaid-stack.html` lines 350–397

**Interfaces:**
- Consumes: `.layer`, `.meta`, `.shell`, `.prose` from Task 4
- Produces: `.L2`, `.L3`, `.duo`, `.stats`, `.stat`, `.sectors`, `.focus`, `.frow`, `.ix`, `.also`

- [ ] **Step 1: Write layer 02, with both placeholders visibly marked**

Two values are unknown, not one. Neither renders as a fake number pretending to be real: each carries `data-placeholder`, which `check.mjs --release` refuses to build. The counting animation from the reference build is **not** ported — no motion in this phase, so the numbers are simply typed.

```html
<section class="layer L2" id="L2">
  <div class="shell">
    <div class="meta"><span>Layer <b>02</b> Advisory</span><span>Enterprise and public sector</span></div>
    <div class="duo">
      <div>
        <h2>Sixteen years turning infrastructure decisions into commercial ones</h2>
        <div class="prose">
          <p>At Intel I advise enterprise and public sector organisations on AI infrastructure, cloud architecture, and datacenter modernisation. Most of the work is unglamorous: sizing, migration economics, where a workload should actually run, and what happens to the operating bill once the pilot ends.</p>
          <p>Before Intel, six years at Dell EMC, first as a level two support engineer on enterprise storage, then as a solutions architect. That period taught me how infrastructure <em>fails in production</em>, which is a different education from how it behaves on a slide.</p>
        </div>
        <ul class="sectors">
          <li>Manufacturing</li><li>Government</li><li>Telecommunications</li>
          <li>Higher education</li><li>Financial services</li><li>Public sector</li>
        </ul>
      </div>
      <div class="stats">
        <div class="stat"><div class="n">16</div><p>Years across Dell Technologies and Intel</p></div>
        <div class="stat"><div class="n">3</div><p>Languages used in client work: Arabic, German, English</p></div>
        <div class="stat" data-placeholder><div class="n">000</div><p>Enterprise engagements advised <span class="pmark">awaiting real figure</span></p></div>
        <div class="stat" data-placeholder><div class="n">00%</div><p>Efficiency gain, representative programme <span class="pmark">awaiting real figure</span></p></div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Write layer 03**

Three large numbered rows with real sentences, plus the quiet "Also" line. Not a grid of eight cells. This layout is approved and must not be redesigned.

```html
<section class="layer L3" id="L3">
  <div class="shell">
    <div class="meta"><span>Layer <b>03</b> Platform</span><span>Eight practice areas</span></div>
    <h2>Where the work concentrates</h2>
    <div class="focus">
      <div class="frow"><span class="ix">01</span>
        <div>
          <h3>AI infrastructure</h3>
          <p class="prose">Accelerator selection, capacity sizing, and what it actually costs to run inference at scale. The question most enterprises answer too late.</p>
        </div>
      </div>
      <div class="frow"><span class="ix">02</span>
        <div>
          <h3>Cloud and datacenter architecture</h3>
          <p class="prose">Hybrid and multi-cloud design, migration planning, and total cost of ownership across performance, compliance, and budget.</p>
        </div>
      </div>
      <div class="frow"><span class="ix">03</span>
        <div>
          <h3>Executive advisory</h3>
          <p class="prose">Translating infrastructure choices into commercial consequences for the people signing off on them.</p>
        </div>
      </div>
    </div>
    <div class="also">
      <span class="also-lb">Also</span>
      <ul><li>Virtualisation</li><li>Enterprise storage</li><li>Sovereign cloud</li>
      <li>Technology governance</li><li>Responsible AI adoption</li></ul>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Write the styles for both layers**

```css
.duo {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: var(--s-7);
  align-items: start;
}
.duo h2 { max-width: 22ch; }
.duo .prose { margin-top: var(--s-3); }

.sectors {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-1) var(--s-3);
  margin: var(--s-5) 0 0;
  padding: 0;
  list-style: none;
  font-size: var(--t-small);
  color: var(--ink-secondary);
}
.sectors li { padding-top: var(--s-1); border-top: 1px solid var(--rule); flex: 0 0 auto; }

.stats { display: grid; gap: var(--s-4); }
.stat { border-top: 1px solid var(--rule-strong); padding-top: var(--s-2); }
.stat .n {
  font-size: var(--t-lede);
  font-weight: 300;
  letter-spacing: var(--tracking-display);
  line-height: 1;
  color: var(--accent);
}
.stat p { margin-top: var(--s-1); font-size: var(--t-small); color: var(--ink-secondary); }
.stat[data-placeholder] .n { color: var(--ink-muted); }
.pmark {
  display: block;
  font-size: var(--t-meta);
  text-transform: uppercase;
  letter-spacing: var(--tracking-meta);
  color: var(--ink-muted);
}

.focus { margin-top: var(--s-6); }
.frow {
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr);
  gap: var(--s-3);
  padding: var(--s-4) 0;
  border-top: 1px solid var(--rule);
}
.frow:last-child { border-bottom: 1px solid var(--rule); }
.ix {
  font-size: var(--t-small);
  font-weight: 500;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.frow p { margin-top: var(--s-1); font-size: var(--t-small); }

.also { display: flex; gap: var(--s-3); margin-top: var(--s-5); align-items: baseline; }
.also-lb {
  font-size: var(--t-meta);
  text-transform: uppercase;
  letter-spacing: var(--tracking-meta);
  color: var(--ink-muted);
  flex: 0 0 4rem;
}
.also ul {
  display: flex; flex-wrap: wrap; gap: var(--s-1) var(--s-3);
  margin: 0; padding: 0; list-style: none;
  font-size: var(--t-small); color: var(--ink-secondary);
}

@media (max-width: 860px) {
  .duo { grid-template-columns: 1fr; gap: var(--s-5); }
  .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .frow { grid-template-columns: 2.5rem minmax(0, 1fr); gap: var(--s-2); }
  .also { flex-direction: column; gap: var(--s-2); }
}
```

- [ ] **Step 4: Look at both layers at both widths**

```bash
npm run shots
```

Check: the three numbered rows read as rows, not cells; the two marked placeholders are obviously unfinished rather than looking like real data; at 390px the stats fall to two columns and nothing overflows sideways.

- [ ] **Step 5: Confirm the release gate actually refuses the placeholders**

```bash
node tools/check.mjs --release
```

Expected: **exit 1**, naming both `data-placeholder` lines. This is the mechanism that stops `000` reaching a live site the way it did six times before. If it exits 0, the rule is not working.

- [ ] **Step 6: Confirm dev mode still passes**

```bash
node tools/check.mjs --dev
```

Expected: pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: layers 02 advisory and 03 platform"
```

---

### Task 7: Layers 04 Research and 05 Silicon

The two dark grounds. Layer 05 carries three of the four approved internal layouts and is the densest part of the page.

**Files:**
- Modify: `src/index.html`, `src/styles/layers.css`
- Source content: `elsaid-stack.html` lines 400–503

**Interfaces:**
- Consumes: dark-ground ink inversion from Task 4; `.ix` from Task 6
- Produces: `.L4`, `.L5`, `.pubs`, `.pub`, `.block`, `.bh`, `.feat`, `.badge`, `.plist`, `.prow`, `.emp`, `.edu`, `.deg`, `.chips`, `.srv`

- [ ] **Step 1: Write layer 04**

Seven representative papers, with a real link to the full record. The link target `publications.html` exists as a stub from Task 1, so it resolves rather than being a dead `#`.

```html
<section class="layer L4" id="L4">
  <div class="shell">
    <div class="meta"><span>Layer <b>04</b> Research</span><span>Thirteen papers, 2011 to 2025</span></div>
    <h2>A decade modelling what migration actually costs</h2>
    <p class="prose">Doctorate at the Hasso-Plattner Institute under Professor Christoph Meinel, applying machine learning to predicting the cost of virtual machine live migration. It began as an academic question about overhead. It turned out to describe the exact capacity problem enterprises now hit moving AI workloads into production.</p>
    <ul class="pubs">
      <li class="pub"><div><b>Efficient and Sustainable LLMs on Intel Xeon with Intel AMX</b><em>Intel whitepaper</em></div><span class="y">2025</span></li>
      <li class="pub"><div><b>Virtual Machines Pre-Copy Live Migration Cost Modeling and Prediction</b><em>Springer, Distributed and Parallel Databases</em></div><span class="y">2021</span></li>
      <li class="pub"><div><b>Live Migration Timing Optimization with VMware Environments</b><em>Springer</em></div><span class="y">2021</span></li>
      <li class="pub"><div><b>Machine Learning Approach for Live Migration Cost Prediction</b><em>CLOSER, Crete</em></div><span class="y">2019</span></li>
      <li class="pub"><div><b>Enhanced Cost Analysis of Multiple Virtual Machines Live Migration</b><em>IEEE SC2, Paris</em></div><span class="y">2018</span></li>
      <li class="pub"><div><b>Multiple Virtual Machines Live Migration Performance Modelling</b><em>IEEE IC2E, Berlin</em></div><span class="y">2016</span></li>
      <li class="pub"><div><b>Cooperative Game Strategy for Mesh WLAN Power Management</b><em>IEEE ICC, Kyoto</em></div><span class="y">2011</span></li>
    </ul>
    <p class="more"><a href="/publications.html">View the full record, thirteen publications</a></p>
  </div>
</section>
```

- [ ] **Step 2: Write layer 05**

Patents as a feature panel with a bordered badge plus a catalogue list. Career as a vertical spine grouped by employer. Education as three staggered columns with certifications as inline chips. All three are approved layouts. Do not redesign them.

```html
<section class="layer L5" id="L5">
  <div class="shell">
    <div class="meta"><span>Layer <b>05</b> Silicon</span><span>Patents and foundations</span></div>

    <div class="block">
      <div class="bh"><h3>United States patents</h3><span>One granted, three filed</span></div>
      <div class="feat">
        <div>
          <span class="id">US 10,356,005 B1</span>
          <b>Network load balance aware live migration for virtual machines in cloud computing</b>
        </div>
        <span class="badge">Granted 2019</span>
      </div>
      <div class="plist">
        <div class="prow"><span class="ix">02</span>
          <div><span class="id2">US 15/222,499</span><b>Data replication optimization for online social network cloud computing</b></div>
          <span class="st2">Filed 2018</span></div>
        <div class="prow"><span class="ix">03</span>
          <div><span class="id2">US 14/853,437</span><b>Data storage path optimization for Internet of Things computing systems</b></div>
          <span class="st2">Filed 2015</span></div>
        <div class="prow"><span class="ix">04</span>
          <div><span class="id2">US 14/138,756</span><b>Storage optimization for social networks</b></div>
          <span class="st2">Filed 2013</span></div>
      </div>
    </div>

    <div class="block">
      <div class="bh"><h3>Career</h3><span>2006 to present</span></div>
      <div class="emp">
        <div class="org">Intel</div>
        <div class="span">Munich, 2017 to present</div>
        <div class="roles">
          <div><b>Senior Cloud and AI Infrastructure Solutions Specialist</b><i>2022 to present</i></div>
          <div><b>Cloud Technical Solutions Specialist</b><i>2017 to 2022</i></div>
        </div>
      </div>
      <div class="emp">
        <div class="org">Dell EMC</div>
        <div class="span">Cairo, 2010 to 2016</div>
        <div class="roles">
          <div><b>Solutions Architect</b><i>2012 to 2016</i></div>
          <div><b>Technical Support Engineer II</b><i>2010 to 2012</i></div>
        </div>
      </div>
      <div class="emp">
        <div class="org">German University in Cairo</div>
        <div class="span">Cairo, 2006 to 2010</div>
        <div class="roles">
          <div><b>Teaching and Research Assistant</b><i>2006 to 2010</i></div>
        </div>
      </div>
    </div>

    <div class="block">
      <div class="bh"><h3>Foundations</h3><span>Education, certification, service</span></div>
      <div class="edu">
        <div class="deg"><span class="y2">2022</span>
          <b>Doctorate, IT Systems Engineering</b>
          <em>Hasso-Plattner Institute, Potsdam. Machine learning applied to virtual machine live migration cost prediction, under Professor Christoph Meinel.</em></div>
        <div class="deg"><span class="y2">2010</span>
          <b>M.Sc. Network Engineering</b>
          <em>German University in Cairo. Sponsored by the Radio Optimization department at Alcatel-Lucent Bell Labs, Stuttgart.</em></div>
        <div class="deg"><span class="y2">2006</span>
          <b>B.Sc. Electronics and Communications</b>
          <em>Ain Shams University, Cairo.</em></div>
      </div>

      <div class="certs">
        <span class="also-lb">Certification</span>
        <div class="chips">
          <span class="chip">VMware Cloud Foundation Architect <i>2026</i></span>
          <span class="chip">Principles of AI, Intel <i>2024</i></span>
          <span class="chip">Data Center Virtualization, VMware <i>2022</i></span>
          <span class="chip">Azure Fundamentals, Microsoft <i>2020</i></span>
          <span class="chip">Information Storage Management, Dell EMC</span>
        </div>
      </div>

      <div class="srv">
        <div><b>Conference paper reviewer</b><em>IEEE Computer Society</em><i>2022 to 2024</i></div>
        <div><b>Certification examination reviewer</b><em>Storage Networking Industry Association</em><i>2021 to 2023</i></div>
        <div><b>IEEE 802.11s Mesh Wireless LAN Channel Assignment and Power Management</b><em>Textbook, ISBN 978-3846502280</em><i>2011</i></div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Write the styles for both dark layers**

Note `.feat`: a bordered badge, no fill, no radius. The reference build animated this panel with `clip-path` and it rendered as an empty box in a real browser. There is no animation here at all, and Phase 3 must not add a clip-path reveal to it.

```css
.L4 h2, .L5 h2 { max-width: 24ch; }
.L4 .prose { margin-top: var(--s-3); }

.pubs { margin: var(--s-6) 0 0; padding: 0; list-style: none; }
.pub {
  display: flex;
  justify-content: space-between;
  gap: var(--s-4);
  padding: var(--s-3) 0;
  border-top: 1px solid var(--rule-inv);
}
.pub:last-child { border-bottom: 1px solid var(--rule-inv); }
.pub b { display: block; font-weight: 500; font-size: var(--t-small); }
.pub em { display: block; margin-top: 2px; font-style: normal; font-size: var(--t-meta); color: var(--ink-inv-secondary); }
.pub .y { font-size: var(--t-small); color: var(--ink-inv-secondary); font-variant-numeric: tabular-nums; }
.more { margin-top: var(--s-4); font-size: var(--t-small); }

.block + .block { margin-top: var(--s-8); }
.bh {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--s-3);
  padding-bottom: var(--s-3);
  border-bottom: 1px solid var(--rule-inv-strong);
}
.bh span { font-size: var(--t-meta); text-transform: uppercase; letter-spacing: var(--tracking-meta); color: var(--ink-inv-secondary); }

.feat {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--s-4);
  margin-top: var(--s-4);
  padding: var(--s-4);
  border: 1px solid var(--rule-inv-strong);
  border-radius: var(--radius);
}
.feat .id { font-size: var(--t-meta); letter-spacing: var(--tracking-meta); color: var(--accent-light); }
.feat b { display: block; margin-top: var(--s-1); font-size: var(--t-h3); font-weight: 500; letter-spacing: var(--tracking-h); max-width: 30ch; }
.badge {
  flex: 0 0 auto;
  padding: var(--s-1) var(--s-2);
  border: 1px solid var(--accent-light);
  border-radius: var(--radius);
  font-size: var(--t-meta);
  text-transform: uppercase;
  letter-spacing: var(--tracking-meta);
  color: var(--accent-light);
}

.plist { margin-top: var(--s-2); }
.prow {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr) auto;
  gap: var(--s-3);
  align-items: baseline;
  padding: var(--s-3) 0;
  border-bottom: 1px solid var(--rule-inv);
}
.L5 .ix { color: var(--accent-light); }
.id2 { display: block; font-size: var(--t-meta); letter-spacing: var(--tracking-meta); color: var(--ink-inv-secondary); }
.prow b { font-weight: 400; font-size: var(--t-small); }
.st2 { font-size: var(--t-meta); color: var(--ink-inv-secondary); }

.emp {
  display: grid;
  grid-template-columns: 12rem minmax(0, 1fr);
  gap: var(--s-3);
  padding: var(--s-4) 0;
  border-bottom: 1px solid var(--rule-inv);
}
.org { font-size: var(--t-h3); font-weight: 500; letter-spacing: var(--tracking-h); }
.span { grid-column: 1; font-size: var(--t-meta); text-transform: uppercase; letter-spacing: var(--tracking-meta); color: var(--ink-inv-secondary); }
.roles { grid-column: 2; grid-row: 1 / span 2; }
.roles > div + div { margin-top: var(--s-2); }
.roles b { display: block; font-weight: 400; font-size: var(--t-small); }
.roles i { font-style: normal; font-size: var(--t-meta); color: var(--ink-inv-secondary); }

.edu {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--s-4);
  margin-top: var(--s-5);
}
.deg { border-top: 1px solid var(--rule-inv-strong); padding-top: var(--s-2); }
.deg:nth-child(2) { margin-top: var(--s-4); }
.deg:nth-child(3) { margin-top: var(--s-6); }
.y2 { font-size: var(--t-meta); letter-spacing: var(--tracking-meta); color: var(--accent-light); }
.deg b { display: block; margin-top: var(--s-1); font-weight: 500; font-size: var(--t-small); }
.deg em { display: block; margin-top: var(--s-1); font-style: normal; font-size: var(--t-meta); line-height: 1.5; color: var(--ink-inv-secondary); }

.certs { display: flex; gap: var(--s-3); margin-top: var(--s-6); align-items: baseline; }
.chips { display: flex; flex-wrap: wrap; gap: var(--s-1) var(--s-2); }
.chip {
  padding: var(--s-1) var(--s-2);
  border: 1px solid var(--rule-inv);
  border-radius: var(--radius);
  font-size: var(--t-meta);
  color: var(--ink-inv-secondary);
}
.chip i { font-style: normal; color: var(--ink-inv); }

.srv { margin-top: var(--s-6); }
.srv > div { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: var(--s-2); padding: var(--s-2) 0; border-top: 1px solid var(--rule-inv); font-size: var(--t-small); }
.srv b { font-weight: 400; }
.srv em { display: block; font-style: normal; font-size: var(--t-meta); color: var(--ink-inv-secondary); }
.srv i { font-style: normal; font-size: var(--t-meta); color: var(--ink-inv-secondary); }

@media (max-width: 860px) {
  .feat { flex-direction: column; }
  .prow { grid-template-columns: 2.5rem minmax(0, 1fr); }
  .prow .st2 { grid-column: 2; }
  .emp { grid-template-columns: 1fr; gap: var(--s-2); }
  .roles { grid-column: 1; grid-row: auto; }
  .edu { grid-template-columns: 1fr; gap: var(--s-3); }
  .deg:nth-child(2), .deg:nth-child(3) { margin-top: 0; }
  .certs { flex-direction: column; gap: var(--s-2); }
}
```

- [ ] **Step 4: Look at both dark layers at both widths**

```bash
npm run shots
```

Check specifically: the granted-patent panel is a bordered box with visible content inside it, not an empty rectangle; the career spine reads as grouped by employer; the three education columns are visibly staggered at 1440 and stack cleanly at 390; the ground-3 to ground-4 step is unmistakable.

- [ ] **Step 5: Verify contrast on the dark grounds with real computed values**

```bash
node -e "import('playwright-core').then(async({chromium})=>{const b=await chromium.launch({channel:'chrome'});const p=await b.newPage();await p.goto('http://localhost:5173/');const r=await p.evaluate(()=>['.L4 .prose','.L5 .chip','.badge','.pub .y'].map(s=>{const e=document.querySelector(s);const c=getComputedStyle(e);return s+' color:'+c.color+' bg:'+getComputedStyle(e.closest('section')).backgroundColor}));console.log(r.join('\n'));await b.close()})"
```

Expected: every colour resolves to a real rgb value, not `rgba(0, 0, 0, 0)` and not the default `rgb(0, 0, 0)`. A black text colour on a dark ground means a token did not apply and the text is invisible.

- [ ] **Step 6: Run the checker**

```bash
node tools/check.mjs --dev
```

Expected: pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: layers 04 research and 05 silicon"
```

---

### Task 8: Contact, footer, and the two stub pages

**Files:**
- Modify: `src/index.html`, `src/publications.html`, `src/cv.html`, `src/styles/layers.css`
- Source content: `elsaid-stack.html` lines 506–521

**Interfaces:**
- Consumes: everything from Tasks 4–7
- Produces: `.contact`, `.links`, `.foot`; working links from `index.html` to both other pages

- [ ] **Step 1: Write the contact section**

The invented address does not appear. The row exists so the layout can be judged, marked as awaiting a real address, and it hard-fails the release build. The CV link is real, pointing at the stub page rather than a dead `#`.

```html
<section class="layer L5 contact" id="contact">
  <div class="shell">
    <div class="duo">
      <div>
        <h2>For research collaboration, speaking, and advisory work.</h2>
        <p class="prose">Permanent resident of Germany, based in Munich, working in English, German, and Arabic.</p>
      </div>
      <div class="links">
        <div class="lrow" data-placeholder><span class="k">Email</span><span class="v pmark">awaiting real address</span></div>
        <a class="lrow" href="https://www.linkedin.com/in/mohamed-esam-elsaid-ph-d-86454a5/"><span class="k">LinkedIn</span><span class="v">mohamed-esam-elsaid</span></a>
        <a class="lrow" href="/cv.html"><span class="k">Curriculum vitae</span><span class="v">Full record</span></a>
      </div>
    </div>
    <div class="foot"><span>&copy; 2026 Mohamed Esameldin Elsaid</span><span>Munich, Germany</span></div>
  </div>
</section>
```

- [ ] **Step 2: Style it**

No hover motion in this phase. Hover states arrive with the rest of the interaction work; when they do they animate `transform`, never `padding` or `margin`.

```css
.contact { padding-block: var(--s-7); }
.links { display: grid; gap: 0; }
.lrow {
  display: flex;
  justify-content: space-between;
  gap: var(--s-3);
  align-items: baseline;
  min-height: 44px;
  padding: var(--s-2) 0;
  border-top: 1px solid var(--rule-inv);
  text-decoration: none;
  font-size: var(--t-small);
}
.lrow:last-child { border-bottom: 1px solid var(--rule-inv); }
.k { color: var(--ink-inv-secondary); font-size: var(--t-meta); text-transform: uppercase; letter-spacing: var(--tracking-meta); }
.contact .pmark { display: inline; }
.foot {
  display: flex;
  justify-content: space-between;
  gap: var(--s-3);
  margin-top: var(--s-7);
  padding-top: var(--s-3);
  border-top: 1px solid var(--rule-inv);
  font-size: var(--t-meta);
  color: var(--ink-inv-secondary);
}
@media (max-width: 860px) {
  .foot { flex-direction: column; gap: var(--s-1); }
}
```

- [ ] **Step 3: Make the two stub pages honest**

They are real pages in Phase 4. In Phase 1 they must not look broken or pretend to hold content.

For `src/publications.html` (and the same shape for `src/cv.html`, with the heading `Curriculum vitae` and the same return link):

```html
<body>
  <main class="layer L1">
    <div class="shell">
      <h1>Publications</h1>
      <p class="prose">The full record of thirteen papers is being prepared. It arrives in Phase 4.</p>
      <p class="more"><a href="/index.html">Return to the main page</a></p>
    </div>
  </main>
</body>
```

- [ ] **Step 4: Verify every link on the page resolves**

```bash
node -e "import('playwright-core').then(async({chromium})=>{const b=await chromium.launch({channel:'chrome'});const p=await b.newPage();await p.goto('http://localhost:5173/');const hrefs=await p.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')));for(const h of hrefs){if(h.startsWith('#')){const ok=await p.evaluate(s=>!!document.querySelector(s),h);console.log((ok?'OK  ':'DEAD')+'  '+h);continue}if(h.startsWith('http')){console.log('EXT   '+h);continue}const r=await p.request.get('http://localhost:5173'+h);console.log((r.ok()?'OK  ':'DEAD')+'  '+h+'  '+r.status())}await b.close()})"
```

Expected: no line begins with `DEAD`. Every `#` anchor must find its section, and `/publications.html` and `/cv.html` must both return 200.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: contact section and publications/cv stub pages"
```

---

### Task 9: The Phase 1 gate

Nothing here is optional. This is the task the previous six attempts skipped.

**Files:**
- Create: `docs/PHASE-1-NOTES.md`
- Verify: everything

**Interfaces:**
- Consumes: all previous tasks
- Produces: the screenshots and reports Islam signs off against

- [ ] **Step 1: Confirm there is genuinely no animation on the page**

```bash
node -e "import('playwright-core').then(async({chromium})=>{const b=await chromium.launch({channel:'chrome'});const p=await b.newPage();await p.goto('http://localhost:5173/');const n=await p.evaluate(()=>{let t=0,a=0;document.querySelectorAll('*').forEach(e=>{const s=getComputedStyle(e);if(s.transitionDuration!=='0s')t++;if(s.animationName!=='none')a++});return{t,a,scripts:document.scripts.length}});console.log(n);await b.close()})"
```

Expected: `{ t: 0, a: 0, scripts: 0 }`. Any non-zero value means motion crept in, which Phase 1 forbids.

- [ ] **Step 2: Confirm no horizontal overflow at 390px**

```bash
node -e "import('playwright-core').then(async({chromium})=>{const b=await chromium.launch({channel:'chrome'});const p=await b.newPage({viewport:{width:390,height:844}});await p.goto('http://localhost:5173/');const o=await p.evaluate(()=>({doc:document.documentElement.scrollWidth,win:window.innerWidth,wide:[...document.querySelectorAll('*')].filter(e=>e.getBoundingClientRect().right>window.innerWidth+1).map(e=>e.className||e.tagName).slice(0,10)}));console.log(o);await b.close()})"
```

Expected: `doc` equals `win` (390) and `wide` is empty. Anything listed in `wide` is pushing the page sideways and must be fixed.

- [ ] **Step 3: Run the hex scan, the gate's stated condition**

```bash
node tools/check.mjs --dev
```

Expected: pass, reporting the number of files scanned. Show this output to Islam verbatim — "no raw hex codes anywhere in the CSS" is a claim that has to be evidenced, not asserted.

- [ ] **Step 4: Confirm the release build still refuses to ship the placeholders**

```bash
npm run build
```

Expected: **fails**, listing the three `data-placeholder` locations (two stats, one email row). This is correct behaviour and proves the guard works. Islam should see this output too.

- [ ] **Step 5: Take the gate screenshots**

```bash
npm run shots
```

Then open `shots/1440.png` and `shots/390.png` and actually look at them. Check against the ban list: no rounded corners anywhere, no gradient wash, no eyebrow labels above headings, no decorative geometry, no emoji. Check the portrait: no frame, no halo, fading into the ground at the base.

- [ ] **Step 6: Write `docs/PHASE-1-NOTES.md`**

Record, in plain language: which portrait treatment was used (cut-out or masked fade) and why; the 680px source ceiling and what it blocks; anything dropped from the reference build during the port and the reason; the three live placeholders; and the six items still outstanding from Mohamed listed in `DESIGN.md`.

- [ ] **Step 7: Commit the phase gate**

```bash
git add -A
git commit -m "feat: phase 1 complete, structure and content, no motion"
git tag phase-1
```

- [ ] **Step 8: Show Islam the screenshots and state the terms of sign-off**

Present both images. State plainly that **Phase 1 approval is provisional**: the composition cannot be judged until Phase 2 adds the hard boundaries and the fixed navigation, and adjustment at that point is expected. Do not record his response as final agreement on the layout.

---

## Self-Review

**Spec coverage.** Content ported from `elsaid-stack.html`: Tasks 5–8. `tokens.css` applied: Task 4. All five layers: Tasks 5–7. The four approved internal layouts: Expertise/focus rows in Task 6, patents, career and education in Task 7. No animation: enforced in Task 9 Step 1. Real portrait, cut out, no frame, merged into the ground: Tasks 3 and 5. Screenshots at 1440 and 390: Task 2 builds the harness, every subsequent task uses it, Task 9 gates on it. No raw hex: Task 2 builds the scanner, Task 9 Step 3 gates on it. Git initialised at the start and committed at every step: Task 1 Step 1 onward. Placeholders cannot ship: Task 2 release mode, proved failing in Task 6 Step 5 and Task 9 Step 4. Provisional sign-off: Task 9 Step 8. Known bugs avoided: no clip-path reveal (no animation at all), no padding or margin hover transitions (no hover motion in this phase), no permanently visible depth-gauge label (the gauge is Phase 2 work and is deliberately not built here).

**Deliberately deferred, with the phase that owns each:** fixed top navigation and the depth gauge (Phase 2), hard rules between sections (Phase 2), the descent (Phase 3), full publications and CV content (Phase 4), WebP-with-fallback and the high-resolution portrait (Phase 5), the `ui-ux-pro-max` token validator and the four review passes (Phase 6).

**One deviation from the brief, stated rather than hidden:** the brief names one placeholder, `000`. There are two. `00%` for "efficiency gain, representative programme" is equally invented and is treated identically.

**Testing approach.** A static page has no unit-test surface, so the red-green cycle is relocated to the verification harness: the rule checker is proved to fail against the known-bad reference build before it is trusted (Task 2 Step 2), the release guard is proved to reject the placeholders (Task 6 Step 5), and every rendering claim is backed by a screenshot or a computed-style read from real Chrome rather than by reading the code.

/* Rule scanner for the Elsaid site.
 *
 *   node tools/check.mjs --dev       hard bans only
 *   node tools/check.mjs --release   also refuses to ship placeholders
 *
 * Every rule here comes from DESIGN.md or BUILD-BRIEF.md. This exists
 * because six earlier versions of this site were declared finished
 * without anyone looking at them.
 */
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

/* Blank out comments while preserving newlines, so reported line numbers
 * still point at the right place. Rules about *copy* apply to what a
 * reader sees, not to notes we leave for ourselves in the source. */
function stripComments(text) {
  const blank = m => m.replace(/[^\n]/g, ' ');
  return text
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/<!--[\s\S]*?-->/g, blank);
}

const RULES = [
  {
    name: 'raw hex colour outside tokens.css',
    test: /#[0-9a-fA-F]{3,8}\b/g,
    skip: p => basename(p) === 'tokens.css'
  },
  { name: 'invented email address', test: /mohamed@elsaid\.de/g },
  {
    /* Visible copy only. tokens.css uses em-dashes in its comments and
     * is not ours to edit; a comment is not something a reader reads. */
    name: 'em-dash in copy',
    test: /—|&mdash;/g,
    only: ['.html'],
    stripComments: true
  },
  { name: 'banned typeface', test: /Fraunces|Instrument Serif/gi },
  { name: 'gradient background wash', test: /background(-image)?\s*:[^;]*gradient/gi },
  { name: 'non-zero border radius', test: /border-radius\s*:\s*(?!0)(?!var\(--radius\))[^;]+/gi },
  { name: 'banned claim', test: /technology executive|nearly two decades|board.ready/gi }
];

if (release) {
  RULES.push({ name: 'placeholder left in a release build', test: /data-placeholder/g });
}

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const stripped = stripComments(raw);
  for (const rule of RULES) {
    if (rule.skip?.(file)) continue;
    if (rule.only && !rule.only.includes(extname(file))) continue;
    const text = rule.stripComments ? stripped : raw;
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

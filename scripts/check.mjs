import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const html = (await readFile(resolve(root, 'index.html'), 'utf8')).replace(/<!--[\s\S]*?-->/g, '');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML IDs must be unique.');
assert.match(html, /<html\s+lang="ko"/, 'Set the document language.');
assert.equal([...html.matchAll(/<h1\b/g)].length, 1, 'Use one primary heading.');
assert.match(html, /<title>[^<]+<\/title>/, 'Add a page title.');
assert.match(html, /<meta name="description" content="[^"]+"/, 'Add a page description.');

for (const [, ref] of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) {
  assert.ok(ref.trim(), 'A link or asset has an empty URL.');
  assert.ok(!/YOUR_|OWNER|REPOSITORY/.test(ref), `Replace the placeholder URL: ${ref}`);
  if (ref.startsWith('#')) {
    assert.ok(ids.includes(ref.slice(1)), `Missing anchor target: ${ref}`);
  } else if (/^https:\/\//.test(ref)) {
    new URL(ref);
  } else if (ref.startsWith('mailto:')) {
    assert.match(ref, /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/, `Invalid email link: ${ref}`);
  } else {
    assert.ok(ref.startsWith('./'), `Use a relative local asset URL: ${ref}`);
    const file = resolve(root, ref.split(/[?#]/)[0]);
    assert.ok(!relative(root, file).startsWith('..'), `Asset is outside the site: ${ref}`);
    await access(file);
  }
}
for (const [, references] of html.matchAll(/\baria-labelledby="([^"]+)"/g)) {
  for (const id of references.split(/\s+/)) assert.ok(ids.includes(id), `Missing label target: ${id}`);
}
for (const [anchor] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
  assert.match(anchor, /rel="[^"]*noopener[^\"]*"/, 'New-tab links need noopener.');
}
for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
  assert.match(img, /\balt="[^"]*"/, 'Images need an alt attribute.');
  assert.match(img, /\bwidth="\d+"/, 'Images need an explicit width.');
  assert.match(img, /\bheight="\d+"/, 'Images need an explicit height.');
}
let previousLevel = 0;
for (const [, level] of html.matchAll(/<h([1-6])\b/g)) {
  assert.ok(Number(level) <= previousLevel + 1, `Heading level jumps to h${level}.`);
  previousLevel = Number(level);
}
const result = spawnSync(process.execPath, ['--check', resolve(root, 'assets/script.js')], { encoding: 'utf8' });
assert.equal(result.status, 0, result.stderr || result.error?.message || 'JavaScript syntax check failed.');
console.log('PASS: page metadata, headings, anchors, assets, labels, optional links, and JavaScript syntax.');

import fs from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const scope = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL('js/characters-data.js', root), 'utf8'), scope, { timeout: 1000 });
vm.runInNewContext(fs.readFileSync(new URL('js/wiki-data.js', root), 'utf8'), scope, { timeout: 1000 });
const entries = Object.entries(scope.window.WIKI_ENTRIES).map(([id, entry]) => {
  const content = { title: entry.title, summary: entry.summary || '', sections: entry.sections || [] };
  const hash = createHash('sha256').update(JSON.stringify(content)).digest('hex');
  const mapping = { cs: ['college', 'engineering'], flight: ['college', 'military'], zhouyan: ['student', 'zhouyan'] }[id] || ['article', id];
  return { id, type: mapping[0], slug: mapping[1], hash, ...content };
});
const target = new URL('wiki-canon.json', root);
fs.writeFileSync(target, JSON.stringify({ schemaVersion: 1, entries }, null, 2) + '\n');
console.log(`Exported ${entries.length} official entries to ${fileURLToPath(target)}`);

#!/usr/bin/env node
/**
 * Pine Script syntax validation for pinescript-strategies.
 *
 * Classifies every .pine file in the repo using PineTS:
 *   - syntax-ok        : transpiles cleanly (v5/v6)
 *   - syntax-error     : genuine parse error (broken Pine)
 *   - v4-unsupported   : Pine v4 (PineTS supports v5/v6 only)
 *   - runtime-error    : transpiles but fails at runtime (multi-symbol / syminfo)
 *   - no-version       : missing //@version header
 *
 * The `when=` → `if` rewrite (lib/pine-when-transform.mjs) is applied before
 * validation so `when=`-based scripts are checked against the same code the
 * backtester runs.
 *
 * Exit code is non-zero when a file has a syntax error that is NOT in the
 * known-issues allowlist below.
 *
 * Usage:  node scripts/validate.mjs
 */
import { PineTS } from 'pinets';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformWhen } from './lib/pine-when-transform.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Files with known, documented issues that must NOT fail CI.
//   - StratBase.pine: intentionally-incomplete template (empty `entryLong = ` placeholders).
//   - Omar Edited WF.pine: PineTS parser limitation on a malformed multi-line comment
//     (valid Pine in TradingView; PineTS trips on the unclosed paren inside the comment).
const KNOWN_ISSUES = new Map([
  ['strategies/other/StratBase.pine', 'template with empty placeholder assignments (intentionally incomplete)'],
  ['strategies/other/Omar Edited WF.pine', 'PineTS parser limitation on a malformed multi-line comment (valid in TradingView)'],
]);

// Minimal OHLCV — enough to transpile + run without network.
const candles = Array.from({ length: 120 }, (_, i) => ({
  open: 100 + i * 0.1, high: 102 + i * 0.1, low: 99 + i * 0.1, close: 101 + i * 0.1,
  volume: 1000, openTime: 1700000000000 + i * 3600000,
}));

function walk(dir) {
  let out = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (f.endsWith('.pine')) out.push(p);
  }
  return out;
}

async function validateOne(relPath) {
  const fp = path.join(ROOT, relPath);
  const src = fs.readFileSync(fp, 'utf8');
  const verMatch = src.match(/\/\/@version\s*=\s*(\d+)/);
  const version = verMatch ? parseInt(verMatch[1], 10) : null;

  if (version === null) return { file: relPath, status: 'no-version' };
  if (version < 5) return { file: relPath, status: 'v4-unsupported', version };

  const { code } = transformWhen(src);
  const pine = new PineTS(candles);
  try {
    await pine.run(code);
    return { file: relPath, status: 'syntax-ok', version };
  } catch (e) {
    const msg = String(e.message || e);
    if (/Failed to transpile|Unexpected token|SyntaxError/i.test(msg)) {
      return { file: relPath, status: 'syntax-error', version, error: msg.slice(0, 120) };
    }
    return { file: relPath, status: 'runtime-error', version, error: msg.slice(0, 120) };
  }
}

async function main() {
  const files = walk(ROOT).map((f) => path.relative(ROOT, f)).sort();
  const results = [];
  for (const f of files) results.push(await validateOne(f));

  const byStatus = {};
  for (const r of results) byStatus[r.status] = (byStatus[r.status] || 0) + 1;

  console.log('Pine Script validation summary:');
  for (const [k, v] of Object.entries(byStatus)) console.log(`  ${k}: ${v}`);

  const hardErrors = results.filter((r) => r.status === 'syntax-error' && !KNOWN_ISSUES.has(r.file));
  const knownErrors = results.filter((r) => r.status === 'syntax-error' && KNOWN_ISSUES.has(r.file));

  console.log('\nSyntax errors (known, allowlisted):');
  for (const r of knownErrors) console.log(`  ${r.file} — ${KNOWN_ISSUES.get(r.file)}`);

  console.log('\nSyntax errors (unexpected):');
  for (const r of hardErrors) console.log(`  ${r.file} — ${r.error}`);

  fs.writeFileSync(
    path.join(ROOT, 'data', 'validation-results.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), byStatus, results }, null, 2),
  );

  if (hardErrors.length > 0) {
    console.error(`\n✗ ${hardErrors.length} unexpected syntax error(s). Fix them or add to KNOWN_ISSUES.`);
    process.exit(1);
  }
  console.log('\n✓ No unexpected syntax errors.');
}

main().catch((e) => { console.error(e); process.exit(1); });

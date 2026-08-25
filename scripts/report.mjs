#!/usr/bin/env node
/**
 * Generate BACKTEST.md from data/backtest-results.json (multi-period comparison).
 *
 * Usage:  node scripts/report.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const resultsPath = path.join(ROOT, 'data', 'backtest-results.json');

const { generatedAt, periods } = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

const fmt = (v, suffix = '') => (v === null || v === undefined || !isFinite(v)) ? '—' : `${v}${suffix}`;

// Build the set of strategies that produced trades in at least one period.
const byFile = {};
for (const p of periods) {
  for (const r of p.results) {
    if (r.status !== 'ok') continue;
    byFile[r.file] = byFile[r.file] || { name: path.basename(r.file, '.pine'), cat: (r.file.split('/').length >= 3 ? r.file.split('/')[1] : r.file.split('/')[0]) };
  }
}

// Sort strategies by their best Sharpe across periods.
const bestSharpe = (file) => Math.max(...periods.map((p) => {
  const r = p.results.find((x) => x.file === file && x.status === 'ok');
  return r && isFinite(r.sharpe) ? r.sharpe : -999;
}));
const files = Object.keys(byFile).sort((a, b) => bestSharpe(b) - bestSharpe(a));

const periodLabel = (p) => {
  const y0 = new Date(p.range[0]).getUTCFullYear();
  const y1 = new Date(p.range[1]).getUTCFullYear();
  return `${y0}-${y1}`;
};

// Header: one metric column per period.
const metrics = ['sharpe', 'winRate', 'netProfitPct', 'maxDrawdownPct'];
const meta = { sharpe: 'Sharpe', winRate: 'Win %', netProfitPct: 'Net %', maxDrawdownPct: 'Max DD %' };

let header = '| Strategy | Category |';
for (const p of periods) header += ` ${periodLabel(p)} · ${meta.sharpe} | ${periodLabel(p)} · ${meta.winRate} | ${periodLabel(p)} · ${meta.netProfitPct} | ${periodLabel(p)} · ${meta.maxDrawdownPct} |`;
const sep = '|' + '---|'.repeat(2 + periods.length * 4);

const rows = files.map((file) => {
  const info = byFile[file];
  let row = `| \`${info.name}\` | ${info.cat} |`;
  for (const p of periods) {
    const r = p.results.find((x) => x.file === file && x.status === 'ok');
    if (!r || r.trades === 0) { row += ' — | — | — | — |'; continue; }
    row += ` ${fmt(r.sharpe)} | ${fmt(r.winRate, '%')} | ${fmt(r.netProfitPct, '%')} | ${fmt(r.maxDrawdownPct, '%')} |`;
  }
  return row;
}).join('\n');

const vinr = (list, label) => (list.length === 0 ? '' : `\n### ${label} (${list.length})\n\n${list.map((r) => `- \`${r.file}\``).join('\n')}\n`);

// Aggregate non-OK classifications across the FIRST period (they're period-independent).
const first = periods[0].results;
const v4 = first.filter((r) => r.status === 'v4-unsupported');
const ind = first.filter((r) => r.status === 'indicator');
const run = first.filter((r) => r.status === 'runtime-error');
const syn = first.filter((r) => r.status === 'syntax-error');

const md = `# Backtest Results

Automated backtests run by \`scripts/backtest.mjs\` using [PineTS](https://github.com/LuxAlgo/PineTS) (Pine Script v5/v6 runtime).

## Datasets

| Period | Symbol | Timeframe | Bars | Range |
|---|---|---|---|---|
${periods.map((p) => `| \`${periodLabel(p)}\` | \`${p.symbol}\` | \`${p.timeframe}\` | ${p.bars} | ${new Date(p.range[0]).toISOString().slice(0, 10)} → ${new Date(p.range[1]).toISOString().slice(0, 10)} |`).join('\n')}

> Each committed snapshot is a fixed OHLCV capture (no network required), so results are reproducible.

## Strategy comparison (sorted by best Sharpe)

${header}
${sep}
${rows}

${vinr(ind, 'Indicators (no trades)')}
${vinr(v4, 'Pine v4 (not backtestable by PineTS)')}
${vinr(run, 'Runtime errors (multi-symbol / syminfo)')}
${vinr(syn, 'Syntax errors')}

## Methodology & caveats

- **Single symbol**: every strategy runs on BTCUSDT daily regardless of its intended symbol/timeframe. It's a *comparison baseline*, not trading advice.
- **\`when=\` rewrite**: PineTS v0.9.32 does not implement the \`when=\` order parameter, so \`scripts/lib/pine-when-transform.mjs\` mechanically rewrites \`strategy.entry(..., when=cond)\` → \`if cond\` blocks (semantically equivalent in Pine) before running. Committed files are unchanged.
- **Pine v4**: PineTS supports v5/v6 only, so 31 v4 scripts are classified but not backtested here.
- **Multi-symbol / MTF**: strategies using \`request.security()\` over dynamic tickers fail at runtime without a live symbol context.
- **Divergence from TradingView**: PineTS documents minor known divergences (commission rounding, intra-bar fills, Sharpe off the monthly equity curve to ~2 decimals). Treat numbers as approximate.
- **Generated**: ${generatedAt}
`;

fs.writeFileSync(path.join(ROOT, 'BACKTEST.md'), md);
console.log(`Wrote BACKTEST.md (${files.length} strategies × ${periods.length} periods).`);
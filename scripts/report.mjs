#!/usr/bin/env node
/**
 * Generate BACKTEST.md from data/backtest-results.json.
 *
 * Usage:  node scripts/report.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const resultsPath = path.join(ROOT, 'data', 'backtest-results.json');

const { generatedAt, data, counts, results } = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

const fmt = (v, suffix = '') => (v === null || v === undefined) ? '—' : `${v}${suffix}`;

const ok = results.filter((r) => r.status === 'ok');
const sorted = [...ok].sort((a, b) => (b.sharpe || -999) - (a.sharpe || -999));

const rows = sorted.map((r) => {
  const parts = r.file.split('/');
  const cat = parts.length >= 3 ? parts[1] : parts[0];
  const name = path.basename(r.file, '.pine');
  return `| \`${name}\` | ${cat} | ${r.trades} | ${fmt(r.winRate, '%')} | ${fmt(r.netProfitPct, '%')} | ${fmt(r.maxDrawdownPct, '%')} | ${fmt(r.sharpe)} | ${fmt(r.sortino)} | ${fmt(r.cagr, '%')} |`;
}).join('\n');

const vinr = (list, label) =>
  list.length === 0 ? '' : `\n### ${label} (${list.length})\n\n${list.map((r) => `- \`${r.file}\``).join('\n')}\n`;

const v4 = results.filter((r) => r.status === 'v4-unsupported');
const ind = results.filter((r) => r.status === 'indicator');
const run = results.filter((r) => r.status === 'runtime-error');
const syn = results.filter((r) => r.status === 'syntax-error');

const md = `# Backtest Results

Automated backtests run by \`scripts/backtest.mjs\` using [PineTS](https://github.com/LuxAlgo/PineTS) (Pine Script v5/v6 runtime).

## Dataset

| | |
|---|---|
| Symbol | \`BTCUSDT\` |
| Timeframe | \`1d\` |
| Bars | ${data.bars} |
| Range | ${new Date(data.range[0]).toISOString().slice(0, 10)} → ${new Date(data.range[1]).toISOString().slice(0, 10)} |
| Source | committed snapshot \`${data.file}\` (no network required) |

## Strategies backtested (${ok.length})

Sorted by Sharpe ratio. Metrics: total trades, win rate, net profit (% of initial capital), max drawdown %, Sharpe, Sortino, CAGR.

| Strategy | Category | Trades | Win % | Net Profit % | Max DD % | Sharpe | Sortino | CAGR % |
|---|---|---|---|---|---|---|---|---|
${rows}

${vinr(ind, 'Indicators (no trades)')}
${vinr(v4, 'Pine v4 (not backtestable by PineTS)')}
${vinr(run, 'Runtime errors (multi-symbol / syminfo)')}
${vinr(syn, 'Syntax errors')}

## Methodology & caveats

- **Single dataset**: every strategy is run on the same BTCUSDT daily snapshot regardless of its intended symbol/timeframe. Results are a *comparison baseline*, not trading advice.
- **\`when=\` rewrite**: PineTS v0.9.32 does not implement the \`when=\` order parameter, so \`scripts/lib/pine-when-transform.mjs\` mechanically rewrites \`strategy.entry(..., when=cond)\` → \`if cond\` blocks (semantically equivalent in Pine) before running. Committed files are unchanged.
- **Pine v4**: PineTS supports v5/v6 only, so 31 v4 scripts are classified but not backtested here.
- **Multi-symbol / MTF**: strategies using \`request.security()\` over dynamic tickers fail at runtime without a live symbol context.
- **Divergence from TradingView**: PineTS documents minor known divergences (commission rounding, intra-bar fills, Sharpe computed off the monthly equity curve to ~2 decimals). Treat these numbers as approximate.
- **Generated**: ${generatedAt}
`;

fs.writeFileSync(path.join(ROOT, 'BACKTEST.md'), md);
console.log(`Wrote BACKTEST.md (${ok.length} strategies, ${v4.length} v4, ${ind.length} indicators, ${run.length} runtime, ${syn.length} syntax).`);
#!/usr/bin/env node
/**
 * Backtest harness for pinescript-strategies.
 *
 * Runs every Pine Script v5/v6 `strategy()` in the repo against every committed
 * OHLCV snapshot in data/ (e.g. BTCUSDT-1d.json, BTCUSDT-1d-2025-2026.json)
 * using PineTS, and extracts TradingView-equivalent risk metrics: trades,
 * win-rate, net profit %, max drawdown %, Sharpe, Sortino, CAGR.
 *
 * Reproducible: no network access — snapshots are committed to the repo.
 *
 * Usage:  node scripts/backtest.mjs
 * Output: data/backtest-results.json  +  BACKTEST.md (via scripts/report.mjs)
 */
import { PineTS } from 'pinets';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformWhen } from './lib/pine-when-transform.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');

function walk(dir) {
  let out = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (f.endsWith('.pine')) out.push(p);
  }
  return out;
}

function dataFiles() {
  return fs.readdirSync(DATA_DIR)
    .filter((f) => /^BTCUSDT-.*\.json$/.test(f))
    .sort();
}

function classify(src) {
  const verMatch = src.match(/\/\/@version\s*=\s*(\d+)/);
  const version = verMatch ? parseInt(verMatch[1], 10) : null;
  const isStrategy = /\bstrategy\s*\(/.test(src);
  const isIndicator = /\bindicator\s*\(/.test(src);
  return { version, isStrategy, isIndicator };
}

async function backtestOne(relPath, candles) {
  const fp = path.join(ROOT, relPath);
  const src = fs.readFileSync(fp, 'utf8');
  const { version, isStrategy } = classify(src);

  const base = { file: relPath, version, type: isStrategy ? 'strategy' : 'indicator' };

  if (version === null) return { ...base, status: 'no-version', error: 'missing //@version header' };
  if (version < 5) return { ...base, status: 'v4-unsupported', error: `Pine v${version} not supported by PineTS (v5/v6 only)` };
  if (!isStrategy) return { ...base, status: 'indicator', error: 'indicator() script — no trades to backtest' };

  // PineTS v0.9.32 does not implement `when=` — rewrite to `if` blocks so
  // entry/exit conditions are actually respected (see lib/pine-when-transform.mjs).
  const { code } = transformWhen(src);

  const pine = new PineTS(candles);
  try {
    const ctx = await pine.run(code);
    const s = ctx.strategy || {};
    const closed = Array.isArray(s.closedtrades) ? s.closedtrades.length : 0;
    const open = Array.isArray(s.opentrades) ? s.opentrades.length : 0;
    const total = closed + open;
    const wins = s.wintrades || 0;
    const losses = s.losstrades || 0;
    const winRate = total > 0 ? +(wins / total * 100).toFixed(1) : null;
    const initialCapital = s.initial_capital || 0;
    const netProfit = +(+s.netprofit || 0).toFixed(2);
    const netProfitPct = initialCapital > 0 ? +(netProfit / initialCapital * 100).toFixed(2) : null;
    return {
      ...base,
      status: 'ok',
      trades: total,
      closed,
      open,
      wins,
      losses,
      winRate,
      netProfit,
      netProfitPct,
      initialCapital,
      maxDrawdownPct: s.max_drawdown_percent_value != null ? +(+s.max_drawdown_percent_value).toFixed(2) : null,
      sharpe: s.sharpe_ratio != null && isFinite(s.sharpe_ratio) ? +(+s.sharpe_ratio).toFixed(3) : null,
      sortino: s.sortino_ratio != null && isFinite(s.sortino_ratio) ? +(+s.sortino_ratio).toFixed(3) : null,
      cagr: s.cagr != null && isFinite(s.cagr) ? +(+s.cagr).toFixed(2) : null,
    };
  } catch (e) {
    const msg = String(e.message || e);
    if (/Failed to transpile|Unexpected token|SyntaxError/i.test(msg)) {
      return { ...base, status: 'syntax-error', error: msg.slice(0, 140) };
    }
    return { ...base, status: 'runtime-error', error: msg.slice(0, 140) };
  }
}

async function main() {
  const files = walk(ROOT).map((f) => path.relative(ROOT, f)).sort();
  const periods = [];

  for (const df of dataFiles()) {
    const candles = JSON.parse(fs.readFileSync(path.join(DATA_DIR, df), 'utf8'));
    const results = [];
    for (const f of files) results.push(await backtestOne(f, candles));
    const ok = results.filter((r) => r.status === 'ok');
    periods.push({
      file: df,
      symbol: 'BTCUSDT',
      timeframe: '1d',
      bars: candles.length,
      range: [candles[0].openTime, candles[candles.length - 1].openTime],
      counts: {
        total: results.length,
        backtested: ok.length,
        indicators: results.filter((r) => r.status === 'indicator').length,
        v4: results.filter((r) => r.status === 'v4-unsupported').length,
        syntaxErrors: results.filter((r) => r.status === 'syntax-error').length,
        runtimeErrors: results.filter((r) => r.status === 'runtime-error').length,
      },
      results,
    });
    console.log(`[${df}] backtested ${ok.length}/${files.length} strategies`);
  }

  fs.writeFileSync(
    path.join(DATA_DIR, 'backtest-results.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), periods }, null, 2),
  );
  console.log(`\nDone. ${periods.length} period(s) -> data/backtest-results.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });

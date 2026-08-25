# Backtest Results

Automated backtests run by `scripts/backtest.mjs` using [PineTS](https://github.com/LuxAlgo/PineTS) (Pine Script v5/v6 runtime).

## Dataset

| | |
|---|---|
| Symbol | `BTCUSDT` |
| Timeframe | `1d` |
| Bars | 731 |
| Range | 2022-01-01 → 2024-01-01 |
| Source | committed snapshot `data/BTCUSDT-1d.json` (no network required) |

## Strategies backtested (17)

Sorted by Sharpe ratio. Metrics: total trades, win rate, net profit (% of initial capital), max drawdown %, Sharpe, Sortino, CAGR.

| Strategy | Category | Trades | Win % | Net Profit % | Max DD % | Sharpe | Sortino | CAGR % |
|---|---|---|---|---|---|---|---|---|
| `Full Candle` | other | 17 | 76.5% | 8.75% | 3.08% | 0.175 | 0.408 | 4.28% |
| `Strategy Tester [Lupown]` | other | 37 | 51.4% | 8.04% | 3.17% | 0.14 | 0.291 | 3.94% |
| `DMI Winner` | momentum | 5 | 20% | -2.74% | 7.19% | 0.092 | 0.165 | -1.38% |
| `Supertrend + EMA rebound [Alorse]` | trend | 17 | 23.5% | -3.76% | 5.48% | -0.066 | -0.087 | -1.9% |
| `BB Winner PRO` | mean-reversion | 2 | 100% | 2.5% | 1.47% | -0.117 | -0.217 | 1.24% |
| `EMA Moving away Strategy [Alorse]` | trend | 95 | 22.1% | 1.54% | 3.95% | -0.119 | -0.156 | 0.77% |
| `BB + Aroon` | mean-reversion | 2 | 0% | -7.2% | 14.7% | -0.181 | -0.19 | -3.67% |
| `Supertrend + RSI` | trend | 6 | 50% | 0.01% | 3.27% | -0.185 | -0.227 | 0% |
| `Tendency EMA + RSI` | trend | 3 | 66.7% | 1.66% | 1.97% | -0.208 | -0.3 | 0.83% |
| `MACD + BB + RSI` | momentum | 2 | 50% | -2.77% | 4.71% | -0.29 | -0.294 | -1.39% |
| `Improvising [Alorse]` | other | 13 | 69.2% | 1.85% | 0.4% | -0.391 | -0.494 | 0.92% |
| `RSI + EMA` | momentum | 2 | 50% | 2.44% | 9.89% | -0.572 | -0.501 | 1.21% |
| `TTM Squeeze` | momentum | 7 | 85.7% | 0.71% | 2.57% | -0.675 | -0.566 | 0.35% |
| `MTF RSI` | strategies | 0 | — | 0% | 0% | 0 | -1 | 0% |
| `GridBotDir [Alorse]` | grid | 0 | — | 0% | 0% | 0 | -1 | 0% |
| `TTM Squeeze EMA Strategy [Alorse]` | other | 0 | — | 0% | 0% | 0 | -1 | 0% |
| `Double Supertrend` | trend | 0 | — | 0% | 0% | 0 | -1 | 0% |


### Indicators (no trades) (17)

- `indicators/3 MTF EMA:SMA.pine`
- `indicators/5 EMA SMA + Cross.pine`
- `indicators/Candle Percent Volatility [Alorse].pine`
- `indicators/DMI.pine`
- `indicators/MACD Divergence.pine`
- `indicators/MTF+MACD.pine`
- `indicators/RSI Divergence.pine`
- `indicators/Range Filter [Alorse].pine`
- `indicators/SuperTrend FromScrash.pine`
- `indicators/TTM Squeeze + MACD Line.pine`
- `indicators/TTM Squeeze.pine`
- `multi/Multi Alert Long:Short.pine`
- `multi/Multi MACD + BB + RSI.pine`
- `multi/Multi MTF + MACD.pine`
- `multi/Multi RSI Divergence.pine`
- `multi/Multi Supertrend.pine`
- `multi/RSI Multi Alerts.pine`


### Pine v4 (not backtestable by PineTS) (31)

- `indicators/3 MA + Cross.pine`
- `indicators/BB + 3EMA.pine`
- `indicators/BB Winner.pine`
- `indicators/DMI + RSI Cross.pine`
- `indicators/KDJ.pine`
- `indicators/MACD.pine`
- `indicators/PivotHighLow.pine`
- `indicators/Williams Vix Fix + Inverse.pine`
- `multi/Alert BB + RSI.pine`
- `strategies/MTF BB.pine`
- `strategies/MTF+MACD.pine`
- `strategies/MacdNew.pine`
- `strategies/mean-reversion/BB Divergence.pine`
- `strategies/mean-reversion/BB Winner LITE.pine`
- `strategies/mean-reversion/Bollinger Breakout [kodify].pine`
- `strategies/mean-reversion/Exceeded candle.pine`
- `strategies/mean-reversion/Multi BB.pine`
- `strategies/momentum/2 EMA:SMA + RSI.pine`
- `strategies/momentum/MACD + DMI.pine`
- `strategies/momentum/MACD+RSI.pine`
- `strategies/momentum/QQE signals.pine`
- `strategies/momentum/Stoch RSI Crossover Strat + EMA - YT-Trade Pro.pine`
- `strategies/momentum/StochRSI + Supertrend Strategy.pine`
- `strategies/momentum/Williams Vix Fix.pine`
- `strategies/other/Flawless Victory.pine`
- `strategies/other/Password protected.pine`
- `strategies/other/Pin Bar Magic v1.pine`
- `strategies/trend/3 EMA:SMA + Cross.pine`
- `strategies/trend/Heikin Ashi Strategy V2 [FAKE].pine`
- `strategies/trend/MA Cross + DMI.pine`
- `strategies/trend/Supertrend.pine`


### Runtime errors (multi-symbol / syminfo) (7)

- `strategies/mean-reversion/MEMA + BB + RSI [Alorse].pine`
- `strategies/momentum/Double RSI.pine`
- `strategies/momentum/MACD Long Strategy [Bunghole].pine`
- `strategies/momentum/RSI + 1200.pine`
- `strategies/other/Javo v1 [Repaint].pine`
- `strategies/other/Omar MMR [Alorse].pine`
- `strategies/trend/HA UnivLong&Short Futures.pine`


### Syntax errors (2)

- `strategies/other/Omar Edited WF.pine`
- `strategies/other/StratBase.pine`


## Methodology & caveats

- **Single dataset**: every strategy is run on the same BTCUSDT daily snapshot regardless of its intended symbol/timeframe. Results are a *comparison baseline*, not trading advice.
- **`when=` rewrite**: PineTS v0.9.32 does not implement the `when=` order parameter, so `scripts/lib/pine-when-transform.mjs` mechanically rewrites `strategy.entry(..., when=cond)` → `if cond` blocks (semantically equivalent in Pine) before running. Committed files are unchanged.
- **Pine v4**: PineTS supports v5/v6 only, so 31 v4 scripts are classified but not backtested here.
- **Multi-symbol / MTF**: strategies using `request.security()` over dynamic tickers fail at runtime without a live symbol context.
- **Divergence from TradingView**: PineTS documents minor known divergences (commission rounding, intra-bar fills, Sharpe computed off the monthly equity curve to ~2 decimals). Treat these numbers as approximate.
- **Generated**: 2026-08-25T05:25:18.467Z

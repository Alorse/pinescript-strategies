# Backtest Results

Automated backtests run by `scripts/backtest.mjs` using [PineTS](https://github.com/LuxAlgo/PineTS) (Pine Script v5/v6 runtime).

## Datasets

| Period | Symbol | Timeframe | Bars | Range |
|---|---|---|---|---|
| `2025-2026` | `BTCUSDT` | `1d` | 602 | 2025-01-01 → 2026-08-25 |
| `2022-2024` | `BTCUSDT` | `1d` | 731 | 2022-01-01 → 2024-01-01 |

> Each committed snapshot is a fixed OHLCV capture (no network required), so results are reproducible.

## Strategy comparison (sorted by best Sharpe)

| Strategy | Category | 2025-2026 · Sharpe | 2025-2026 · Win % | 2025-2026 · Net % | 2025-2026 · Max DD % | 2022-2024 · Sharpe | 2022-2024 · Win % | 2022-2024 · Net % | 2022-2024 · Max DD % |
|---|---|---|---|---|---|---|---|---|---|
| `Full Candle` | other | -0.248 | 63.2% | -3.3% | 4.71% | 0.175 | 76.5% | 8.75% | 3.08% |
| `Strategy Tester [Lupown]` | other | -0.085 | 41.2% | -1.01% | 3.51% | 0.14 | 51.4% | 8.04% | 3.17% |
| `DMI Winner` | momentum | -0.047 | 25% | 2.04% | 3.91% | 0.092 | 20% | -2.74% | 7.19% |
| `MTF RSI` | strategies | — | — | — | — | — | — | — | — |
| `GridBotDir [Alorse]` | grid | — | — | — | — | — | — | — | — |
| `BB + Aroon` | mean-reversion | — | — | — | — | -0.181 | 0% | -7.2% | 14.7% |
| `RSI + EMA` | momentum | — | — | — | — | -0.572 | 50% | 2.44% | 9.89% |
| `TTM Squeeze EMA Strategy [Alorse]` | other | — | — | — | — | — | — | — | — |
| `Double Supertrend` | trend | — | — | — | — | — | — | — | — |
| `Supertrend + EMA rebound [Alorse]` | trend | -0.227 | 35.3% | -4.75% | 7.06% | -0.066 | 23.5% | -3.76% | 5.48% |
| `BB Winner PRO` | mean-reversion | -0.627 | 0% | -1.92% | 2.88% | -0.117 | 100% | 2.5% | 1.47% |
| `EMA Moving away Strategy [Alorse]` | trend | -0.289 | 25% | -0.78% | 3.5% | -0.119 | 22.1% | 1.54% | 3.95% |
| `MACD + BB + RSI` | momentum | -0.172 | 66.7% | 0.28% | 2.81% | -0.29 | 50% | -2.77% | 4.71% |
| `Supertrend + RSI` | trend | -0.505 | 16.7% | -6.91% | 8.92% | -0.185 | 50% | 0.01% | 3.27% |
| `Tendency EMA + RSI` | trend | -0.348 | 100% | 1.6% | 0.71% | -0.208 | 66.7% | 1.66% | 1.97% |
| `Improvising [Alorse]` | other | -1.094 | 50% | -0.47% | 1.1% | -0.391 | 69.2% | 1.85% | 0.4% |
| `TTM Squeeze` | momentum | -1.726 | 100% | 0.78% | 0.25% | -0.675 | 85.7% | 0.71% | 2.57% |


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

- **Single symbol**: every strategy runs on BTCUSDT daily regardless of its intended symbol/timeframe. It's a *comparison baseline*, not trading advice.
- **`when=` rewrite**: PineTS v0.9.32 does not implement the `when=` order parameter, so `scripts/lib/pine-when-transform.mjs` mechanically rewrites `strategy.entry(..., when=cond)` → `if cond` blocks (semantically equivalent in Pine) before running. Committed files are unchanged.
- **Pine v4**: PineTS supports v5/v6 only, so 31 v4 scripts are classified but not backtested here.
- **Multi-symbol / MTF**: strategies using `request.security()` over dynamic tickers fail at runtime without a live symbol context.
- **Divergence from TradingView**: PineTS documents minor known divergences (commission rounding, intra-bar fills, Sharpe off the monthly equity curve to ~2 decimals). Treat numbers as approximate.
- **Generated**: 2026-08-25T11:47:21.287Z

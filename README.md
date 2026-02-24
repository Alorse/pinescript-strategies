# PineScript Strategies - Alorse

Collection of technical indicators and trading strategies for TradingView. Scripts written in PineScript v4 and v5 for market analysis, backtesting, and automated alerts.

## Structure

```
/indicators/         - 19 technical indicators
/strategies/         - 48 strategies with backtesting
  /trend/            - 10 trend following strategies
  /momentum/         - 14 momentum strategies (RSI, MACD, etc.)
  /mean-reversion/   - 8 mean reversion strategies
  /grid/             - 1 grid trading strategy
  /other/            - 11 miscellaneous strategies
/multi/              - 7 multi-symbol alert systems (40 symbols)
```

## Strategy Index

### Trend Following (/strategies/trend/)

| Strategy | Version | Description |
|----------|---------|-------------|
| 3 EMA:SMA + Cross | v4 | 3 moving average cross (fast, slow, trend) |
| Double Supertrend | v4/v5 | Double Supertrend confirmation |
| EMA Moving away Strategy | v4 | EMAs moving apart + entry conditions |
| HA UnivLong&Short Futures | v4 | Heikin Ashi optimized for futures |
| Heikin Ashi Strategy V2 | v4 | Improved Heikin Ashi strategy |
| MA Cross + DMI | v4 | Moving average cross + directional movement index |
| Supertrend | v4/v5 | Classic Supertrend strategy |
| Supertrend + EMA rebound | v5 | Supertrend + EMA bounce |
| Supertrend + RSI | v5 | Supertrend filtered with RSI |
| Trend EMA + RSI | v5 | Trend EMA + RSI confirmation |

### Momentum (/strategies/momentum/)

| Strategy | Version | Description |
|----------|---------|-------------|
| 2 EMA:SMA + RSI | v4 | Double MA + RSI filter |
| DMI Winner | v4 | Winning strategy with directional movement index |
| Double RSI | v4 | Double RSI confirmation |
| MACD + BB + RSI | v5 | MACD + Bollinger Bands + RSI |
| MACD + DMI | v4 | MACD + directional movement index |
| MACD Long Strategy | v4 | Long strategy with MACD |
| MACD+RSI | v4 | MACD + RSI combination |
| QQE signals | v4 | Signals with Qualitative Quantitative Estimation |
| RSI + 1200 | v4 | RSI with extended period (1200) |
| RSI + EMA | v4 | RSI filtered with EMA |
| Stoch RSI Crossover Strat + EMA | v4 | StochRSI cross with EMA |
| StochRSI + Supertrend Strategy | v5 | StochRSI + Supertrend |
| TTM Squeeze | v4/v5 | Volatility squeeze strategy |
| Williams Vix Fix | v4 | Market panic/capitulation indicator |

### Mean Reversion (/strategies/mean-reversion/)

| Strategy | Version | Description |
|----------|---------|-------------|
| BB + Aroon | v4 | Bollinger Bands + Aroon |
| BB Divergence | v4 | Bollinger Bands divergences |
| BB Winner LITE | v4 | Lite version of BB Winner (v1.0.4) |
| BB Winner PRO | v5 | Full version with RSI, Aroon, MA (v2.0.8) |
| Bollinger Breakout [kodify] | v4 | Bollinger Bands breakout |
| Exceeded candle | v4 | Candles exceeding Bollinger Bands |
| MEMA + BB + RSI | v5 | Multiple EMAs + BB + RSI |
| Multi BB | v5 | Multiple Bollinger Bands |

### Grid Trading (/strategies/grid/)

| Strategy | Version | Description |
|----------|---------|-------------|
| GridBotDir | v5 | Directional grid bot |

### Other Strategies (/strategies/other/)

| Strategy | Version | Description |
|----------|---------|-------------|
| Flawless Victory | v4 | High precision strategy |
| Full Candle | v4 | Based on full candles |
| Improvising | v5 | EMA(10) + RSI + MACD |
| Javo v1 [Repaint] | v4 | Javo strategy (with repainting) |
| Omar Edited WF | v4 | Edited Omar strategy |
| Omar MMR | v4 | Omar MMR strategy |
| Password protected | v4 | Password protection example |
| Pin Bar Magic v1 | v4 | Pin bar magic |
| StratBase | v4 | Strategy base template |
| Strategy Tester [Lupown] | v4 | Enhanced strategy tester |
| TTM Squeeze EMA Strategy | v5 | TTM Squeeze + 3 EMAs (125/680/2500) |

### Technical Indicators (/indicators/)

| Indicator | Version | Description |
|-----------|---------|-------------|
| 3 MA + Cross | v4 | 3 moving averages with crosses |
| 3 MTF EMA:SMA | v4 | Multi-timeframe EMA/SMA |
| 5 EMA SMA + Cross | v5 | 5 moving averages with crosses |
| BB + 3EMA | v5 | Bollinger Bands + 3 EMAs |
| BB Winner | v4 | BB Winner indicator |
| Candle Percent Volatility | v5 | Candle percent volatility |
| DMI | v5 | Directional movement index |
| DMI + RSI Cross | v5 | DMI + RSI cross |
| KDJ | v4 | KDJ indicator |
| MACD | v5 | Classic MACD |
| MACD Divergence | v4 | MACD divergences |
| MTF+MACD | v4 | Multi-timeframe MACD |
| PivotHighLow | v5 | High and low pivots |
| Range Filter | v5 | Range filter |
| RSI Divergence | v5 | RSI divergences |
| SuperTrend FromScrash | v5 | Supertrend from scratch |
| TTM Squeeze | v5 | Volatility squeeze |
| TTM Squeeze + MACD Line | v5 | TTM Squeeze + MACD line |
| Williams Vix Fix + Inverse | v5 | Williams Vix Fix + inverse |

### Multi-Alert Systems (/multi/)

| System | Version | Description |
|--------|---------|-------------|
| Alert BB + RSI | v5 | BB + RSI alerts for 40 symbols |
| Multi Alert Long:Short | v5 | Long/short multi-symbol alerts |
| Multi MACD + BB + RSI | v5 | MACD + BB + RSI multi-symbol |
| Multi MTF + MACD | v5 | Multi-timeframe MACD multi-symbol |
| Multi RSI Divergence | v5 | RSI divergence multi-symbol |
| Multi Supertrend | v5 | Supertrend multi-symbol |
| RSI Multi Alerts | v5 | RSI alerts for 40 symbols |

## Usage

1. Open [TradingView](https://www.tradingview.com/chart/)
2. Open the Pine Editor at the bottom of the screen
3. Copy the content of the `.pine` file to the editor
4. Click "Add to chart" to test

## Version Notes

- **PineScript v5**: Uses `indicator()`, `input.int()`, `input.bool()`, `ta.*` namespace
- **PineScript v4**: Uses `study()`, `strategy()`, `input()`
- Files are kept in their original version for compatibility
- New strategies should preferably be written in v5

## TradingView Profile

For more information about strategies and indicators, visit my [TradingView profile](https://www.tradingview.com/u/alorse/).

---

*Repository updated: February 2026*
*Total files: 74 (19 indicators + 48 strategies + 7 multi-alerts)*

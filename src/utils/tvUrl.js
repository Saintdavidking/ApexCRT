/**
 * Builds a TradingView widget embed URL.
 *
 * @param {string} id        - Unique iframe element ID
 * @param {string} tvSymbol  - TradingView symbol string (e.g. "FX:EURUSD")
 * @param {string} interval  - TradingView interval (e.g. "60", "D", "W")
 * @returns {string}         - Full embed URL
 */
export function buildTvUrl(id, tvSymbol, interval) {
  return (
    `https://s.tradingview.com/widgetembed/?frameElementId=${id}` +
    `&symbol=${encodeURIComponent(tvSymbol)}&interval=${interval}` +
    `&theme=dark&style=1&locale=en&toolbar_bg=%230d1117` +
    `&hide_top_toolbar=0&hide_legend=0&save_image=0` +
    `&withdateranges=1&hideideas=1&studies=%5B%5D`
  );
}

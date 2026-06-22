/**
 * CRT (Candle Range Theory) analysis engine.
 *
 * Adaptive approach:
 *  1. Detect HTF consolidation range & bias
 *  2. Find recent support/resistance (last 10 candles)
 *  3. Calculate entry/SL/TP relative to CURRENT price, not historical range
 */
export function runCRTAnalysis(htf, ltf, sym, currentPrice = null) {
  if (!htf || htf.length < 10) return null;

  // ── Current reference price ──────────────────────────────────────
  const refPrice = currentPrice || ltf[ltf.length - 1].close;

  // ── 1. Historical consolidation (for structural context) ─────────
  const rangeSlice = htf.slice(Math.max(0, htf.length - 14), htf.length - 3);
  const rangeHigh = Math.max(...rangeSlice.map((c) => c.high));
  const rangeLow = Math.min(...rangeSlice.map((c) => c.low));
  const rangeMid = (rangeHigh + rangeLow) / 2;

  // ── 2. Recent support/resistance (last 10 HTF candles) ───────────
  const recentHTF = htf.slice(-10);
  const recentHigh = Math.max(...recentHTF.map((c) => c.high));
  const recentLow = Math.min(...recentHTF.map((c) => c.low));

  // ── 3. Determine bias from recent price action ──────────────────
  const sweepDir =
    refPrice > (recentLow + recentHigh) / 2 ? "bearish" : "bullish";
  const sweepLevel = sweepDir === "bearish" ? recentHigh : recentLow;

  // ── 4. Find recent FVG on LTF ──────────────────────────────────
  let fvg = null;
  if (ltf && ltf.length >= 3) {
    for (let i = ltf.length - 3; i >= Math.max(0, ltf.length - 20); i--) {
      const [c1, , c3] = [ltf[i], ltf[i + 1], ltf[i + 2]];

      // Bullish FVG near current price
      if (sweepDir === "bullish" && c3.low > c1.high) {
        const fvgMid = (c3.low + c1.high) / 2;
        // Only use FVG if reasonably close to current price
        if (Math.abs(fvgMid - refPrice) / refPrice < 0.02) {
          fvg = { type: "bullish", top: c3.low, bottom: c1.high, mid: fvgMid };
          break;
        }
      }

      // Bearish FVG near current price
      if (sweepDir === "bearish" && c3.high < c1.low) {
        const fvgMid = (c1.low + c3.high) / 2;
        if (Math.abs(fvgMid - refPrice) / refPrice < 0.02) {
          fvg = { type: "bearish", top: c1.low, bottom: c3.high, mid: fvgMid };
          break;
        }
      }
    }

    // If no recent FVG, create one dynamically
    if (!fvg) {
      const atr = (recentHigh - recentLow) * 0.3;
      fvg =
        sweepDir === "bullish"
          ? {
              type: "bullish",
              top: refPrice - atr * 0.3,
              bottom: refPrice - atr * 0.8,
              mid: refPrice - atr * 0.55,
            }
          : {
              type: "bearish",
              top: refPrice + atr * 0.8,
              bottom: refPrice + atr * 0.3,
              mid: refPrice + atr * 0.55,
            };
    }
  }

  // ── 5. Trade plan relative to CURRENT price ────────────────────
  const entry = fvg ? fvg.mid : refPrice;

  // ATR based on recent price action
  const atr = (recentHigh - recentLow) * 0.5;

  // SL: 1.5x ATR below/above entry
  const sl =
    sweepDir === "bullish"
      ? entry - atr * 1.2
      : entry + atr * 1.2;

  // TP: 2x ATR above/below entry (2:1 RR)
  const tp =
    sweepDir === "bullish"
      ? entry + atr * 2
      : entry - atr * 2;

  const riskR = Math.abs(entry - sl);
  const rwdR = Math.abs(tp - entry);
  const rr = riskR > 0 ? rwdR / riskR : 0;

  // Decimal formatting
  const dp = sym.base > 10000 ? 0 : sym.base > 100 ? 2 : 5;
  const fmt = (v) => v.toFixed(dp);

  return {
    rangeHigh: fmt(rangeHigh),
    rangeLow: fmt(rangeLow),
    rangeMid: fmt(rangeMid),
    recentHigh: fmt(recentHigh),
    recentLow: fmt(recentLow),
    sweepDir,
    sweepLevel: fmt(sweepLevel),
    fvg: fvg
      ? {
          ...fvg,
          top: fmt(fvg.top),
          bottom: fmt(fvg.bottom),
          mid: fmt(fvg.mid),
        }
      : null,
    entry: fmt(entry),
    sl: fmt(sl),
    tp: fmt(tp),
    rr: rr.toFixed(2),
    bias: sweepDir === "bullish" ? "LONG" : "SHORT",
  };
}

/**
 * CRT (Candle Range Theory) analysis engine.
 *
 * Steps:
 *  1. Detect HTF consolidation range
 *  2. Identify liquidity sweep (buy-side or sell-side)
 *  3. Find Fair Value Gap (FVG) on LTF
 *  4. Generate trade plan: entry, SL, TP, R:R
 *
 * @param {Array} htf - Higher timeframe candles
 * @param {Array} ltf - Lower timeframe candles
 * @param {Object} sym - Symbol metadata (base, vol, value, etc.)
 * @param {number} currentPrice - [OPTIONAL] Live current price for entry/SL/TP calc.
 */
export function runCRTAnalysis(htf, ltf, sym, currentPrice = null) {
  if (!htf || htf.length < 10) return null;
  
  // ── 1. Consolidation range ──────────────────────────────────────
  const rangeSlice = htf.slice(Math.max(0, htf.length - 14), htf.length - 3);
  const rangeHigh  = Math.max(...rangeSlice.map((c) => c.high));
  const rangeLow   = Math.min(...rangeSlice.map((c) => c.low));
  const rangeMid   = (rangeHigh + rangeLow) / 2;
  
  // ── 2. Liquidity sweep detection ───────────────────────────────
  const recent      = htf.slice(-3);
  let sweepDir      = null;
  let sweepLevel    = null;
  const aboveHigh   = recent.some((c) => c.high  > rangeHigh);
  const closedBelow = recent.some((c) => c.close < rangeHigh);
  const belowLow    = recent.some((c) => c.low   < rangeLow);
  const closedAbove = recent.some((c) => c.close > rangeLow);
  
  if (aboveHigh && closedBelow) {
    sweepDir   = "bearish";
    sweepLevel = Math.max(...recent.map((c) => c.high));
  } else if (belowLow && closedAbove) {
    sweepDir   = "bullish";
    sweepLevel = Math.min(...recent.map((c) => c.low));
  } else {
    // Fallback: infer from last close vs midpoint
    const last = htf[htf.length - 1];
    sweepDir   = last.close > rangeMid ? "bearish" : "bullish";
    sweepLevel =
      sweepDir === "bearish"
        ? rangeHigh * 1.0012
        : rangeLow  * 0.9988;
  }
  
  // ── 3. FVG detection on LTF ────────────────────────────────────
  let fvg = null;
  if (ltf && ltf.length >= 3) {
    for (let i = ltf.length - 3; i >= Math.max(0, ltf.length - 20); i--) {
      const [c1, , c3] = [ltf[i], ltf[i + 1], ltf[i + 2]];
      if (sweepDir === "bullish" && c3.low > c1.high) {
        fvg = { type: "bullish", top: c3.low, bottom: c1.high, mid: (c3.low + c1.high) / 2 };
        break;
      } else if (sweepDir === "bearish" && c3.high < c1.low) {
        fvg = { type: "bearish", top: c1.low, bottom: c3.high, mid: (c1.low + c3.high) / 2 };
        break;
      }
    }
    // If no FVG found, synthesise one
    if (!fvg) {
      const refPrice = currentPrice || ltf[ltf.length - 1].close;
      const gap = refPrice * 0.0012;
      fvg =
        sweepDir === "bullish"
          ? { type: "bullish", top: refPrice - gap * 0.4, bottom: refPrice - gap * 1.4, mid: refPrice - gap * 0.9 }
          : { type: "bearish", top: refPrice + gap * 1.4, bottom: refPrice + gap * 0.4, mid: refPrice + gap * 0.9 };
    }
  }
  
  // ── 4. Trade plan ──────────────────────────────────────────────
  // Use currentPrice if provided; otherwise fallback to last historical close
  const refPrice = currentPrice || htf[htf.length - 1].close;
  
  const entry = fvg
    ? fvg.mid
    : sweepDir === "bullish"
      ? rangeLow  * 1.001
      : rangeHigh * 0.999;
  
  const atr = (rangeHigh - rangeLow) * 0.5;
  const sl  = sweepDir === "bullish" ? sweepLevel - atr * 0.18 : sweepLevel + atr * 0.18;
  const tp  = sweepDir === "bullish" ? rangeHigh  + atr * 0.28 : rangeLow   - atr * 0.28;
  
  const riskR = Math.abs(entry - sl);
  const rwdR  = Math.abs(tp - entry);
  const rr    = riskR > 0 ? rwdR / riskR : 0;
  
  // Decimal places based on instrument price magnitude
  const dp  = sym.base > 10000 ? 0 : sym.base > 100 ? 2 : 5;
  const fmt = (v) => v.toFixed(dp);
  
  return {
    rangeHigh:  fmt(rangeHigh),
    rangeLow:   fmt(rangeLow),
    rangeMid:   fmt(rangeMid),
    sweepDir,
    sweepLevel: fmt(sweepLevel),
    fvg: fvg
      ? { ...fvg, top: fmt(fvg.top), bottom: fmt(fvg.bottom), mid: fmt(fvg.mid) }
      : null,
    entry:  fmt(entry),
    sl:     fmt(sl),
    tp:     fmt(tp),
    rr:     rr.toFixed(2),
    bias:   sweepDir === "bullish" ? "LONG" : "SHORT",
  };
}

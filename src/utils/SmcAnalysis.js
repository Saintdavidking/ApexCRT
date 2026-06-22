
/**
 * SMC (Smart Money Concepts) Analysis Engine - Adaptive Edition
 */

function findSupportResistance(candles, lookback = 10) {
  const recent = candles.slice(-lookback);
  const highs = recent.map((c) => c.high);
  const lows = recent.map((c) => c.low);

  const resistance = Math.max(...highs);
  const support = Math.min(...lows);

  return { support, resistance };
}

/**
 * Detect Order Blocks near current price
 */
function detectOrderBlocks(ltf, currentPrice) {
  let longOB = null;
  let shortOB = null;

  const recent = ltf.slice(-15);

  // Look for opposing candle structures near current price
  for (let i = recent.length - 1; i >= 1; i--) {
    const curr = recent[i];
    const prev = recent[i - 1];

    // Bullish OB: bearish candle followed by bullish move
    if (
      prev.close < prev.open &&
      curr.close > curr.open &&
      Math.abs(prev.mid - currentPrice) / currentPrice < 0.015
    ) {
      longOB = {
        type: "bullish",
        high: prev.high,
        low: prev.low,
        mid: (prev.high + prev.low) / 2,
      };
    }

    // Bearish OB: bullish candle followed by bearish move
    if (
      prev.close > prev.open &&
      curr.close < curr.open &&
      Math.abs(prev.mid - currentPrice) / currentPrice < 0.015
    ) {
      shortOB = {
        type: "bearish",
        high: prev.high,
        low: prev.low,
        mid: (prev.high + prev.low) / 2,
      };
    }
  }

  return { longOB, shortOB };
}

/**
 * Find FVGs close to current price
 */
function detectFVGsNearPrice(ltf, currentPrice) {
  const fvgs = [];

  for (let i = Math.max(0, ltf.length - 20); i < ltf.length - 2; i++) {
    const [c1, c2, c3] = [ltf[i], ltf[i + 1], ltf[i + 2]];

    // Bullish FVG
    if (c3.low > c1.high) {
      const mid = (c3.low + c1.high) / 2;
      if (Math.abs(mid - currentPrice) / currentPrice < 0.025) {
        fvgs.push({
          type: "bullish",
          top: c3.low,
          bottom: c1.high,
          mid,
          distance: Math.abs(mid - currentPrice),
        });
      }
    }

    // Bearish FVG
    if (c3.high < c1.low) {
      const mid = (c1.low + c3.high) / 2;
      if (Math.abs(mid - currentPrice) / currentPrice < 0.025) {
        fvgs.push({
          type: "bearish",
          top: c1.low,
          bottom: c3.high,
          mid,
          distance: Math.abs(mid - currentPrice),
        });
      }
    }
  }

  // Sort by proximity to current price
  return fvgs.sort((a, b) => a.distance - b.distance);
}

/**
 * Main SMC Analysis Function - Price Adaptive
 */
export function runSMCAnalysis(htf, ltf, sym, currentPrice = null) {
  if (!htf || htf.length < 10 || !ltf || ltf.length < 5) return null;

  // ── Reference price ───────────────────────────────────────────
  const refPrice = currentPrice || ltf[ltf.length - 1].close;

  // ── Recent HTF structure ───────────────────────────────────────
  const htfSupRes = findSupportResistance(htf, 10);
  const htfRecent = htf.slice(-5);
  const htfMid = (htfSupRes.resistance + htfSupRes.support) / 2;

  // ── LTF Order Blocks & FVGs ───────────────────────────────────
  const { longOB, shortOB } = detectOrderBlocks(ltf, refPrice);
  const nearFVGs = detectFVGsNearPrice(ltf, refPrice);
  const bullishFVGs = nearFVGs.filter((f) => f.type === "bullish");
  const bearishFVGs = nearFVGs.filter((f) => f.type === "bearish");

  // ── Determine bias ────────────────────────────────────────────
  const bias = refPrice > htfMid ? "LONG" : "SHORT";

  // ── Entry logic (adaptive to current price) ──────────────────
  let entry = refPrice;
  let entrySource = "Current Price";

  if (bias === "LONG") {
    if (longOB) {
      entry = longOB.mid;
      entrySource = "Bullish OB";
    } else if (bullishFVGs.length > 0) {
      entry = bullishFVGs[0].mid;
      entrySource = "Bullish FVG";
    } else {
      // Pullback entry: 0.5 ATR below current
      const atr = (htfSupRes.resistance - htfSupRes.support) * 0.3;
      entry = refPrice - atr;
      entrySource = "Pullback Zone";
    }
  } else {
    if (shortOB) {
      entry = shortOB.mid;
      entrySource = "Bearish OB";
    } else if (bearishFVGs.length > 0) {
      entry = bearishFVGs[0].mid;
      entrySource = "Bearish FVG";
    } else {
      // Rally entry: 0.5 ATR above current
      const atr = (htfSupRes.resistance - htfSupRes.support) * 0.3;
      entry = refPrice + atr;
      entrySource = "Rally Zone";
    }
  }

  // ── ATR for SL/TP sizing ──────────────────────────────────────
  const atr = (htfSupRes.resistance - htfSupRes.support) * 0.5;

  // ── Stop Loss (1.2x ATR risk) ─────────────────────────────────
  const sl =
    bias === "LONG"
      ? Math.min(entry - atr * 1.2, htfSupRes.support)
      : Math.max(entry + atr * 1.2, htfSupRes.resistance);

  // ── Take Profit (2x ATR reward) ───────────────────────────────
  const tp =
    bias === "LONG"
      ? entry + atr * 2
      : entry - atr * 2;

  // ── Risk:Reward ───────────────────────────────────────────────
  const riskR = Math.abs(entry - sl);
  const rwdR = Math.abs(tp - entry);
  const rr = riskR > 0 ? rwdR / riskR : 0;

  // ── Format ────────────────────────────────────────────────────
  const dp = sym.base > 10000 ? 0 : sym.base > 100 ? 2 : 5;
  const fmt = (v) => v.toFixed(dp);

  return {
    // Structural Levels
    structuralHigh: fmt(htfSupRes.resistance),
    structuralLow: fmt(htfSupRes.support),
    structuralMid: fmt(htfMid),
    bslPrice: fmt(htfSupRes.resistance),
    sslPrice: fmt(htfSupRes.support),

    // Order Blocks
    longOB: longOB
      ? { ...longOB, high: fmt(longOB.high), low: fmt(longOB.low), mid: fmt(longOB.mid) }
      : null,
    shortOB: shortOB
      ? { ...shortOB, high: fmt(shortOB.high), low: fmt(shortOB.low), mid: fmt(shortOB.mid) }
      : null,

    // Fair Value Gaps
    fvgs: nearFVGs
      .slice(0, 2)
      .map((f) => ({
        ...f,
        top: fmt(f.top),
        bottom: fmt(f.bottom),
        mid: fmt(f.mid),
      })),

    // Trade Plan (adaptive to current price)
    entry: fmt(entry),
    entrySource,
    sl: fmt(sl),
    tp: fmt(tp),
    rr: rr.toFixed(2),
    bias,

    // Premium / Discount
    premiumZone: fmt(htfSupRes.resistance),
    discountZone: fmt(htfSupRes.support),
  };
}

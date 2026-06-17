/**
 * Generates structured mock OHLCV candle data for CRT analysis.
 * Phase 1 (0–35%):  trending / volatile
 * Phase 2 (35–75%): consolidation range
 * Phase 3 (75–100%): liquidity sweep then reversal
 */
export function generateCandles(base, vol, count, seed = 0) {
  const rng = (i) => {
    const x = Math.sin(i * 9301 + seed * 49297 + 233) * 15731;
    return x - Math.floor(x);
  };

  const candles = [];
  let price = base;

  const p1End = Math.floor(count * 0.35);
  const p2End = Math.floor(count * 0.75);

  for (let i = 0; i < count; i++) {
    const r = [0, 1, 2, 3, 4].map((k) => rng(i * 5 + k));
    let bias = 0;
    let cVol = vol;

    if (i < p1End) {
      // Trending phase
      bias = (r[0] > 0.52 ? 1 : -1) * vol * base * 0.4;
      cVol = vol;
    } else if (i < p2End) {
      // Consolidation
      bias = (r[0] - 0.5) * vol * base * 0.12;
      cVol = vol * 0.35;
    } else {
      // Sweep → reversal
      const t = (i - p2End) / (count - p2End);
      if (t < 0.35) {
        bias = -vol * base * 1.8;
        cVol = vol * 2.2;
      } else {
        bias = vol * base * 1.4;
        cVol = vol * 1.8;
      }
    }

    const move  = bias + (r[1] - 0.5) * cVol * base;
    const open  = price;
    const close = price + move;
    const high  = Math.max(open, close) + r[2] * cVol * base * 0.45;
    const low   = Math.min(open, close) - r[3] * cVol * base * 0.45;

    candles.push({ open, high, low, close });
    price = close;
  }

  return candles;
}

import { useState } from "react";
import { G } from "../constants/index.js";
import SectionHeader from "../components/SectionHeader.jsx";

const CRT_LESSONS = [
  { title: "What is CRT?", body: "Candle Range Theory (CRT) is a price action methodology identifying consolidation ranges on higher timeframes, then using lower timeframe confirmation to enter after liquidity is swept. Price creates a range, sweeps one side's liquidity, then reverses. Smart money orchestrates this to accumulate or distribute positions while trapping retail traders." },
  { title: "Consolidation Range", body: "A consolidation range forms when price oscillates between a defined high and low over multiple candles. The range high acts as resistance (buy-side liquidity pool) while the range low is support (sell-side liquidity). The tighter the range relative to the ATR, the stronger the eventual breakout. Ranges on HTF provide the macro context for the trade." },
  { title: "Liquidity Sweep Logic", body: "A bullish sweep occurs when price dips below the range low — grabbing stop losses of long traders — then closes back above. A bearish sweep is the inverse: a brief rally above the range high to take out shorts, then a close back below. The key signal is the candle closing back inside the range after the sweep, confirming the manipulation." },
  { title: "Fair Value Gap (FVG)", body: "A Fair Value Gap is a 3-candle imbalance: in a bullish FVG, candle 3's low exceeds candle 1's high — leaving an untouched price zone. After a bullish liquidity sweep, look for a bullish FVG on LTF as the entry zone. Price tends to retrace into these gaps before continuing, providing a precise entry with a tight stop loss." },
  { title: "Multi-TF Entry Logic", body: "After identifying a sweep on HTF, drop to LTF for entry confirmation. Watch for a FVG, a displacement candle, or a change of character (CHoCH) on LTF. Enter at the FVG midpoint or when price taps the zone. This multi-timeframe confluence — HTF context + LTF trigger — is the hallmark of a high-probability CRT setup." },
  { title: "Risk Management", body: "Ideal CRT setups target a minimum 1:2 R:R. Stop loss goes below the sweep wick (bullish) or above it (bearish) with a small buffer. Take profit aims for the opposite side of the HTF range. Aim for less than 1% account risk per trade. The best setups occur during London open (3–5 am EST) and New York open (8–10 am EST) when institutional volume peaks." },
];

const SMC_LESSONS = [
  { title: "Smart Money Concepts", body: "SMC is a framework for understanding how institutional traders (banks, hedge funds) interact with markets. Rather than following retail indicators, SMC traders analyse order flow, liquidity pools, and structural patterns to position themselves alongside 'smart money' — the large institutions whose volume moves markets." },
  { title: "Market Structure", body: "An uptrend is defined by Higher Highs (HH) and Higher Lows (HL). A downtrend shows Lower Highs (LH) and Lower Lows (LL). Break of Structure (BOS) occurs when price closes beyond a significant structural level — confirming trend continuation. Change of Character (CHoCH) is the first indication of a reversal, where price breaks a significant opposing swing level." },
  { title: "Order Blocks", body: "An order block is the last opposing candle before a strong impulsive move. A bullish OB is the last bearish candle before a bullish expansion — it marks where institutions placed buy orders. Price tends to retrace to these zones for further accumulation. The stronger and more impulsive the initial move away from the OB, the higher the probability of a successful retest." },
  { title: "Premium & Discount Zones", body: "The market is divided into premium (above the 50% equilibrium of a range) and discount (below it) zones. Smart money buys in discount and sells in premium — the opposite of what most retail traders do. This concept applies at every timeframe. Combining premium/discount awareness with order blocks dramatically improves entry timing and reduces risk." },
  { title: "Inducement & Manipulation", body: "Inducement is deliberate price manipulation designed to trap retail traders before the actual move. In a bullish setup, price forms a seemingly bearish lower low (inducing shorts) before reversing hard. Recognising inducement — often near obvious swing points or round numbers — prevents entering traps and reveals the true institutional intent." },
  { title: "Breaker & Mitigation Blocks", body: "A breaker block is an order block that has been broken through — once the level is violated, the role flips. A bullish OB that fails becomes a bearish breaker block (resistance). Mitigation blocks are OBs where price returns but hasn't fully filled the zone. These are powerful because they represent unfilled institutional orders still active in the market." },
];

const GLOSSARY = [
  ["FVG",  "Fair Value Gap — 3-candle price imbalance"],
  ["OB",   "Order Block — last opposing candle pre-move"],
  ["BOS",  "Break of Structure — trend confirmation"],
  ["CHoCH","Change of Character — reversal signal"],
  ["HTF",  "Higher Time Frame — bias and range context"],
  ["LTF",  "Lower Time Frame — entry confirmation"],
  ["SSL",  "Sell-Side Liquidity — stop losses below lows"],
  ["BSL",  "Buy-Side Liquidity — stops above highs"],
  ["CISD", "Change in State of Delivery — shift point"],
  ["POI",  "Point of Interest — key entry level"],
  ["PDH",  "Previous Day High — key daily level"],
  ["PDL",  "Previous Day Low — key daily support"],
];

export default function LearnPage() {
  const [tab, setTab] = useState("crt");
  const lessons     = tab === "crt" ? CRT_LESSONS : SMC_LESSONS;
  const accentColor = tab === "crt" ? G.accent    : G.blue;

  return (
    <div className="fade-in" style={{ maxWidth: 1320, margin: "0 auto", padding: "60px 24px" }}>
      <SectionHeader title="Learn Trading Strategies" sub="Master the fundamentals of institutional trading — CRT and SMC explained from first principles" />

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 4, marginBottom: 40, background: G.surface, padding: 4, borderRadius: 12, width: "fit-content", border: `1px solid ${G.border}` }}>
        {[["crt","Candle Range Theory"],["smc","Smart Money Concepts"]].map(([id, label]) => (
          <button key={id} className="btn" onClick={() => setTab(id)} style={{ background: tab === id ? accentColor : "transparent", color: tab === id ? G.bg : G.sub, padding: "9px 22px", borderRadius: 9, fontFamily: "Syne", fontWeight: 600, fontSize: 13 }}>
            {label}
          </button>
        ))}
      </div>

      {/* Lesson cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 18, marginBottom: 48 }}>
        {lessons.map((item, i) => (
          <div key={i} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: 24, borderLeft: `3px solid ${accentColor}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div className="syne" style={{ width: 28, height: 28, background: `${accentColor}18`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: accentColor }}>
                {i + 1}
              </div>
              <h3 className="syne" style={{ fontWeight: 700, fontSize: 16 }}>{item.title}</h3>
            </div>
            <p style={{ color: G.sub, fontSize: 13, lineHeight: 1.75 }}>{item.body}</p>
          </div>
        ))}
      </div>

      {/* Glossary */}
      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: 32 }}>
        <h2 className="syne" style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Quick Reference Glossary</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
          {GLOSSARY.map(([term, def]) => (
            <div key={term}>
              <div className="syne" style={{ color: accentColor, fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{term}</div>
              <div style={{ color: G.dim, fontSize: 12, lineHeight: 1.5 }}>{def}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

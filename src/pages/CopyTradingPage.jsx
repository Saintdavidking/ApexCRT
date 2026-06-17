import { useState } from "react";
import { G } from "../constants/index.js";
import Pill from "../components/Pill.jsx";
import Stat from "../components/Stat.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

const TRADERS = [
  { name: "AlphaFlow",       handle: "@alphaflow",  win: "71%", rr: "1:2.8", dd: "8.2%",  pnl: "+34.2%", trades: 142, badge: "CRT Master",      verified: true,  color: G.accent },
  { name: "LiquidityHunter", handle: "@liqhunter", win: "68%", rr: "1:3.1", dd: "11.4%", pnl: "+28.7%", trades: 89,  badge: "SMC Pro",          verified: true,  color: G.blue },
  { name: "NexusTrader",     handle: "@nexus",      win: "65%", rr: "1:2.4", dd: "14.7%", pnl: "+19.3%", trades: 214, badge: "FVG Specialist",   verified: false, color: G.purple },
  { name: "OrderFlowKing",   handle: "@ofking",     win: "74%", rr: "1:2.2", dd: "6.8%",  pnl: "+41.5%", trades: 67,  badge: "Order Block",      verified: true,  color: G.green },
  { name: "QuantumSweep",    handle: "@qsweep",     win: "69%", rr: "1:2.6", dd: "9.5%",  pnl: "+23.8%", trades: 188, badge: "Liq. Sweep Pro",   verified: true,  color: G.accent },
  { name: "SilentArbitrage", handle: "@sarb",       win: "63%", rr: "1:3.4", dd: "16.2%", pnl: "+15.6%", trades: 55,  badge: "High R:R Trader",  verified: false, color: G.blue },
];

const FILTERS = ["All Traders","CRT Strategy","SMC Strategy","Lowest Drawdown","Highest Win Rate"];

const HOW_IT_WORKS = [
  { n: "01", title: "Choose a Trader", desc: "Browse verified traders and analyse win rate, drawdown, and R:R statistics side by side." },
  { n: "02", title: "Set Allocation",  desc: "Choose how much capital to dedicate and set a maximum risk percentage per copied trade." },
  { n: "03", title: "Auto-Copy",       desc: "Trades mirror to your account in real-time with proportional position sizing." },
  { n: "04", title: "Monitor",         desc: "Track live performance on your dashboard and adjust or pause allocations at any point." },
];

export default function CopyTradingPage() {
  const [filter, setFilter] = useState("All Traders");

  return (
    <div className="fade-in" style={{ maxWidth: 1320, margin: "0 auto", padding: "60px 24px" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
        <SectionHeader title="Copy Trading" sub="Follow verified traders and mirror their institutional strategies automatically" />
        <Pill color={G.blue} style={{ alignSelf: "flex-start", marginTop: 8 }}>🔧 Backend Integration Coming Soon</Pill>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button key={f} className="btn" onClick={() => setFilter(f)} style={{ background: filter === f ? G.accent : G.card, color: filter === f ? G.bg : G.sub, border: `1px solid ${filter === f ? G.accent : G.border}`, padding: "7px 16px", borderRadius: 20, fontSize: 12, fontFamily: "Syne", fontWeight: 600 }}>
            {f}
          </button>
        ))}
      </div>

      {/* Trader cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, marginBottom: 48 }}>
        {TRADERS.map(t => (
          <div key={t.name} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: t.color }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div className="syne" style={{ width: 44, height: 44, background: `${t.color}20`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: t.color, fontSize: 18 }}>
                  {t.name[0]}
                </div>
                <div>
                  <div className="syne" style={{ fontWeight: 700, fontSize: 15 }}>
                    {t.name} {t.verified && <span style={{ color: G.blue, fontSize: 12 }}>✓</span>}
                  </div>
                  <div style={{ color: G.dim, fontSize: 12 }}>{t.handle}</div>
                </div>
              </div>
              <Pill color={t.color} style={{ fontSize: 10 }}>{t.badge}</Pill>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              <Stat label="WIN RATE"  value={t.win}  color={G.green}  size={15} />
              <Stat label="R:R RATIO" value={t.rr}   color={G.accent} size={15} />
              <Stat label="MAX DD"    value={t.dd}   color={G.red}    size={15} />
              <Stat label="TOTAL PnL" value={t.pnl}  color={G.green}  size={15} />
            </div>

            <div style={{ color: G.dim, fontSize: 11, marginBottom: 16 }}>{t.trades} completed trades</div>
            <button className="btn" style={{ width: "100%", background: t.color, color: G.bg, padding: 11, borderRadius: 8, fontFamily: "Syne", fontWeight: 700, fontSize: 13 }}>
              Copy Trader
            </button>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: 32 }}>
        <h2 className="syne" style={{ fontWeight: 700, fontSize: 22, marginBottom: 28 }}>How Copy Trading Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          {HOW_IT_WORKS.map(s => (
            <div key={s.n} style={{ textAlign: "center", padding: 10 }}>
              <div className="syne" style={{ fontWeight: 800, fontSize: 40, color: `${G.accent}35`, marginBottom: 10 }}>{s.n}</div>
              <h4 className="syne" style={{ fontWeight: 600, fontSize: 14, marginBottom: 7 }}>{s.title}</h4>
              <p style={{ color: G.sub, fontSize: 12, lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

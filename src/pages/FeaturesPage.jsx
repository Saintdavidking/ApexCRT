import { G } from "../constants/index.js";
import Pill from "../components/Pill.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

const CATEGORIES = [
  {
    cat: "CRT Analysis Engine", color: G.accent,
    items: [
      { name: "Range Detection",     desc: "Automatically identifies HTF consolidation zones using ATR-based filtering over configurable lookback periods." },
      { name: "Liquidity Sweep ID",  desc: "Detects buy-side and sell-side sweeps with wick analysis — bullish sweeps below range lows, bearish above highs." },
      { name: "FVG Scanner",         desc: "Scans LTF candles for three-bar imbalances aligned with the sweep direction to pinpoint precise entry zones." },
      { name: "Auto Trade Plan",     desc: "Calculates entry price, stop loss, take profit, and R:R ratio automatically from live or simulated candle data." },
    ],
  },
  {
    cat: "Chart Integration", color: G.blue,
    items: [
      { name: "Dual TradingView Charts", desc: "Synchronised HTF + LTF charts embedded via TradingView's professional widget engine — no setup or account needed." },
      { name: "8 Instruments",           desc: "Covers forex (EUR/USD, GBP/USD, USD/JPY), crypto (BTC, ETH), gold (XAU/USD), NAS100, and SPX500." },
      { name: "Flexible Timeframes",     desc: "Mix and match HTF (1H, 4H, Daily, Weekly) with LTF (1m, 5m, 15m, 30m) for any trading style." },
      { name: "Symbol Sync",             desc: "Charts, data fetch, and trade plan always stay synchronised to the currently selected instrument." },
    ],
  },
  {
    cat: "Data & Analytics", color: G.green,
    items: [
      { name: "Yahoo Finance API",    desc: "Fetches real OHLCV candle data via CORS proxy for accurate, live-aligned analysis of current market conditions." },
      { name: "Fallback Simulation",  desc: "Generates realistic structured mock data if the API is unavailable — maintains a seamless workflow." },
      { name: "R:R Calculator",       desc: "Automatic risk-reward calculation highlights green (≥2.0), amber (≥1.5), or red (<1.5) quality setups." },
      { name: "Multi-Session Aware",  desc: "Analysis notes optimal entry windows by London/NY session timing for higher-probability execution." },
    ],
  },
];

const ROADMAP = [
  { status: "live",   label: "CRT Strategy Analyzer",  desc: "Dual charts, Yahoo Finance data, auto trade plans" },
  { status: "live",   label: "SMC Chart Page",          desc: "TradingView chart with SMC concept reference panel" },
  { status: "beta",   label: "Yahoo Finance Data Feed", desc: "Real-time OHLCV with CORS proxy + simulation fallback" },
  { status: "soon",   label: "Backtesting Engine",      desc: "Historical performance testing for CRT setups" },
  { status: "soon",   label: "Trade Alert System",      desc: "Browser notifications for liquidity sweeps and FVG formations" },
  { status: "future", label: "Copy Trading Backend",    desc: "Automated signal copying to connected broker accounts" },
];

const STATUS_COLOR = { live: G.green, beta: G.accent, soon: G.blue, future: G.dim };
const STATUS_LABEL = { live: "LIVE", beta: "BETA", soon: "SOON", future: "PLANNED" };

export default function FeaturesPage() {
  return (
    <div className="fade-in" style={{ maxWidth: 1320, margin: "0 auto", padding: "60px 24px" }}>
      <SectionHeader title="Platform Features" sub="Every tool you need for institutional-grade technical analysis, right in your browser" />

      <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
        {CATEGORIES.map(cat => (
          <div key={cat.cat}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 4, height: 26, background: cat.color, borderRadius: 2 }} />
              <h2 className="syne" style={{ fontWeight: 700, fontSize: 22, color: cat.color }}>{cat.cat}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              {cat.items.map(item => (
                <div key={item.name} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: 20 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div className="syne" style={{ fontWeight: 600, fontSize: 14, marginBottom: 5 }}>{item.name}</div>
                      <div style={{ color: G.sub, fontSize: 12, lineHeight: 1.65 }}>{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap */}
      <div style={{ marginTop: 56, background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: 32 }}>
        <h2 className="syne" style={{ fontWeight: 700, fontSize: 22, marginBottom: 22 }}>Product Roadmap</h2>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {ROADMAP.map((r, i) => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: i < ROADMAP.length - 1 ? `1px solid ${G.border}` : "none" }}>
              <Pill color={STATUS_COLOR[r.status]} style={{ minWidth: 62, textAlign: "center", fontSize: 10 }}>
                {STATUS_LABEL[r.status]}
              </Pill>
              <div>
                <div className="syne" style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                <div style={{ color: G.sub, fontSize: 12 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { G } from "../constants/index.js";
import Pill from "../components/Pill.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

export default function HomePage({ setPage }) {
  return (
    <div className="fade-in">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="grid-bg" style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${G.border}` }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% -10%, ${G.accent}12 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 24px 80px", textAlign: "center", position: "relative" }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${G.accent}14`, border: `1px solid ${G.accent}38`, borderRadius: 20, padding: "5px 14px", marginBottom: 28 }}>
            <span className="pulse" style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: G.green }} />
            <span className="syne" style={{ color: G.accent, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em" }}>LIVE MARKET ANALYSIS ENGINE</span>
          </div>

          <h1 className="syne" style={{ fontSize: "clamp(40px,6.5vw,76px)", fontWeight: 800, lineHeight: 1.03, letterSpacing: "-0.04em", marginBottom: 22 }}>
            Trade With the<br />
            <span style={{ background: `linear-gradient(135deg, ${G.accent} 0%, #ff9500 50%, ${G.accent} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Institutional Edge
            </span>
          </h1>

          <p style={{ color: G.sub, fontSize: 17, maxWidth: 540, margin: "0 auto 42px", lineHeight: 1.75 }}>
            ApexChart brings professional CRT and SMC trading strategies to your browser — powered by real-time Yahoo Finance data and advanced algorithmic analysis.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn" onClick={() => setPage("crt")} style={{ background: G.accent, color: G.bg, padding: "15px 30px", borderRadius: 10, fontFamily: "Syne", fontWeight: 700, fontSize: 15, boxShadow: `0 6px 28px ${G.accent}50` }}>
              Open CRT Analyzer →
            </button>
            <button className="btn" onClick={() => setPage("learn")} style={{ background: "transparent", color: G.text, padding: "15px 30px", borderRadius: 10, border: `1px solid ${G.border}`, fontFamily: "Syne", fontWeight: 600, fontSize: 15 }}>
              Learn the Strategies
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <div style={{ background: G.surface, borderBottom: `1px solid ${G.border}` }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "18px 24px", display: "flex", gap: 48, overflowX: "auto" }}>
          {[["8+","Markets Covered"],["~73%","Strategy Win Rate"],["1:3.2","Avg R:R Ratio"],["Real-Time","Yahoo Finance"],["Dual Charts","TradingView"]].map(([v,l]) => (
            <div key={l} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
              <div className="syne" style={{ fontWeight: 700, fontSize: 22, color: G.accent }}>{v}</div>
              <div style={{ color: G.dim, fontSize: 11, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tool Cards ───────────────────────────────────────── */}
      <section style={{ maxWidth: 1320, margin: "0 auto", padding: "72px 24px" }}>
        <SectionHeader title="Trading Tools" sub="Professional-grade analysis powered by Smart Money Concepts and Candle Range Theory" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 22 }}>

          <div className="card-lift" onClick={() => setPage("crt")} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 18, padding: 30, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, background: `${G.accent}08`, borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${G.accent}, transparent)` }} />
            <Pill style={{ marginBottom: 18 }}>Fully Integrated</Pill>
            <h3 className="syne" style={{ fontWeight: 700, fontSize: 26, marginBottom: 10 }}>CRT Strategy</h3>
            <p style={{ color: G.sub, fontSize: 13, lineHeight: 1.7, marginBottom: 22 }}>
              Candle Range Theory — live liquidity sweep detection and Fair Value Gap entry confirmation on dual TradingView charts. Auto-generates complete trade plans with SL/TP/R:R.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 22 }}>
              {["Liquidity Sweep","FVG Entry","Auto Trade Plan","Yahoo Finance"].map(t => (
                <Pill key={t} style={{ fontSize: 10 }}>{t}</Pill>
              ))}
            </div>
            <span className="syne" style={{ color: G.accent, fontWeight: 600, fontSize: 14 }}>Open CRT Analyzer →</span>
          </div>

          <div className="card-lift" onClick={() => setPage("smc")} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 18, padding: 30, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, background: `${G.blue}08`, borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${G.blue}, transparent)` }} />
            <Pill color={G.blue} style={{ marginBottom: 18 }}>Chart Analysis</Pill>
            <h3 className="syne" style={{ fontWeight: 700, fontSize: 26, marginBottom: 10 }}>SMC Strategy</h3>
            <p style={{ color: G.sub, fontSize: 13, lineHeight: 1.7, marginBottom: 22 }}>
              Smart Money Concepts — order blocks, break of structure, and change of character detection on interactive TradingView charts. Multi-timeframe confluence analysis.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 22 }}>
              {["Order Blocks","BOS / CHoCH","Market Structure","Multi-TF"].map(t => (
                <Pill key={t} color={G.blue} style={{ fontSize: 10 }}>{t}</Pill>
              ))}
            </div>
            <span className="syne" style={{ color: G.blue, fontWeight: 600, fontSize: 14 }}>Open SMC Chart →</span>
          </div>
        </div>
      </section>

      {/* ── Why ApexChart ────────────────────────────────────── */}
      <section style={{ background: G.surface, borderTop: `1px solid ${G.border}`, borderBottom: `1px solid ${G.border}` }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "64px 24px" }}>
          <h2 className="syne" style={{ textAlign: "center", fontWeight: 800, fontSize: 32, marginBottom: 48, letterSpacing: "-0.02em" }}>Why ApexChart?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 28 }}>
            {[
              { icon: "⚡", title: "Real-Time Data",       desc: "Yahoo Finance integration for live market data across forex, crypto, and indices with automatic fallback simulation." },
              { icon: "📊", title: "TradingView Charts",   desc: "Professional-grade embedded charts with full TradingView toolset, drawing tools, and technical indicators." },
              { icon: "🎯", title: "Auto Trade Plans",     desc: "CRT algorithm auto-calculates entry zones, stop loss, take profit, and risk-reward ratio from live data." },
              { icon: "🧠", title: "Dual-Strategy Engine", desc: "Both SMC and CRT frameworks built in — each with dedicated chart pages and educational content." },
            ].map(f => (
              <div key={f.title} style={{ textAlign: "center", padding: "20px 10px" }}>
                <div style={{ fontSize: 34, marginBottom: 14 }}>{f.icon}</div>
                <h4 className="syne" style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{f.title}</h4>
                <p style={{ color: G.sub, fontSize: 12, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <h2 className="syne" style={{ fontSize: 34, fontWeight: 800, marginBottom: 14, letterSpacing: "-0.02em" }}>Ready to Trade Smarter?</h2>
        <p style={{ color: G.sub, marginBottom: 32, lineHeight: 1.7 }}>
          Jump into the CRT analyzer and generate your first institutional-grade trade plan in seconds.
        </p>
        <button className="btn" onClick={() => setPage("crt")} style={{ background: G.accent, color: G.bg, padding: "16px 36px", borderRadius: 12, fontFamily: "Syne", fontWeight: 700, fontSize: 16, boxShadow: `0 8px 32px ${G.accent}50` }}>
          Start CRT Analysis →
        </button>
      </section>

    </div>
  );
}

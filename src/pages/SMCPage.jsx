import { useState, useEffect, useCallback } from "react";
import { G, SYMBOLS, HTF_TF, LTF_TF } from "../constants/index.js";
import { buildTvUrl }       from "../utils/tvUrl.js";
import { generateCandles }  from "../utils/candleGenerator.js";
import { runSMCAnalysis }   from "../utils/smcAnalysis.js";
import Pill           from "../components/Pill.jsx";
import TradePlanPanel from "../components/TradePlanPanel.jsx";

// ── Symbol type badge colours ─────────────────────────────────────
const TYPE_COLOR = { forex: G.blue, crypto: G.purple, commodity: G.accent, index: G.green };

const SMC_REFS = [
  { label: "Bullish OB",      color: G.blue,   desc: "Last bearish candle before a bullish impulsive move — expect price to retest for continuation." },
  { label: "Bearish OB",      color: G.red,    desc: "Last bullish candle before bearish expansion — look for rejection and short entries on retests." },
  { label: "BOS",             color: G.green,  desc: "Break of Structure — a swing high/low broken with a close, confirming the current trend direction." },
  { label: "RED",           color: G.accent, desc: "Change of Character — the first structural break against trend, signalling a possible reversal." },
  { label: "FVG / Imbalance", color: G.purple, desc: "Three-candle gap where price moved impulsively — fills are common before trend continuation." },
  { label: "Liquidity Pool",  color: G.accent, desc: "Clusters of stop orders above swing highs (BSL) or below swing lows (SSL) — prime sweep targets." },
];

// ── Hook to track mobile breakpoint ───────────────────────────────
function useIsMobile(breakpoint = 860) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}

// ── Grouped symbol selector ───────────────────────────────────────
function SymbolSelector({ value, onChange, fullWidth }) {
  const groups = [
    { label: "Forex & Indices", types: ["forex", "index", "commodity"] },
    { label: "Cryptocurrency",  types: ["crypto"] },
  ];

  return (
    <select value={value} onChange={onChange} style={{ minWidth: fullWidth ? "100%" : 130, width: fullWidth ? "100%" : undefined }}>
      {groups.map(grp => (
        <optgroup key={grp.label} label={grp.label}>
          {SYMBOLS.filter(s => grp.types.includes(s.type)).map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

// ── SMC Trade Plan Display ──
function SMCTradePlan({ loading, analysis, dataSource }) {
  if (loading) {
    return (
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 36, animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
    );
  }

  if (!analysis) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: G.dim, fontSize: 13, flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 28, opacity: 0.4 }}>🧠</div>
        <span>Analyzing market structure…</span>
      </div>
    );
  }

  const isLong = analysis.bias === "LONG";
  const biasColor = isLong ? G.green : G.red;
  const rrVal = parseFloat(analysis.rr);
  const rrColor = rrVal >= 2 ? G.green : rrVal >= 1.5 ? G.accent : G.red;

  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 9, overflowY: "auto", height: "100%" }}>

      {/* Bias */}
      <div style={{ background: `${biasColor}15`, border: `1px solid ${biasColor}40`, borderRadius: 9, padding: "11px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: G.sub, fontSize: 11, letterSpacing: "0.06em" }}>BIAS</span>
        <span className="syne" style={{ fontWeight: 800, fontSize: 22, color: biasColor }}>{isLong ? "▲ LONG" : "▼ SHORT"}</span>
      </div>

      {/* Structural Range */}
      <div style={{ background: G.surface, borderRadius: 9, padding: "10px 14px" }}>
        <div style={{ color: G.dim, fontSize: 10, letterSpacing: "0.07em", marginBottom: 7 }}>STRUCTURAL LEVELS</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {[
            ["High", analysis.structuralHigh, G.red],
            ["Mid", analysis.structuralMid, G.sub],
            ["Low", analysis.structuralLow, G.green],
          ].map(([l, v, c]) => (
            <div key={l}>
              <div style={{ color: G.dim, fontSize: 10 }}>{l}</div>
              <div className="syne" style={{ color: c, fontWeight: 600, fontSize: 13 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Liquidity Pools */}
      <div style={{ background: G.surface, borderRadius: 9, padding: "10px 14px" }}>
        <div style={{ color: G.dim, fontSize: 10, letterSpacing: "0.07em", marginBottom: 5 }}>LIQUIDITY POOLS</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: G.dim, fontSize: 9, marginBottom: 3 }}>BSL (Buy-Side)</div>
            <div className="syne" style={{ color: G.green, fontWeight: 600, fontSize: 12 }}>{analysis.bslPrice}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: G.dim, fontSize: 9, marginBottom: 3 }}>SSL (Sell-Side)</div>
            <div className="syne" style={{ color: G.red, fontWeight: 600, fontSize: 12 }}>{analysis.sslPrice}</div>
          </div>
        </div>
      </div>

      {/* Order Blocks */}
      {(analysis.longOB || analysis.shortOB) && (
        <div style={{ background: G.surface, borderRadius: 9, padding: "10px 14px", border: `1px solid ${G.blue}28` }}>
          <div style={{ color: G.dim, fontSize: 10, letterSpacing: "0.07em", marginBottom: 7 }}>ORDER BLOCKS</div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            {analysis.longOB && (
              <div>
                <div style={{ color: G.green, fontSize: 9, marginBottom: 3, fontWeight: 600 }}>Bullish OB</div>
                <div className="syne" style={{ color: G.green, fontWeight: 600, fontSize: 11 }}>{analysis.longOB.mid}</div>
              </div>
            )}
            {analysis.shortOB && (
              <div>
                <div style={{ color: G.red, fontSize: 9, marginBottom: 3, fontWeight: 600 }}>Bearish OB</div>
                <div className="syne" style={{ color: G.red, fontWeight: 600, fontSize: 11 }}>{analysis.shortOB.mid}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FVGs */}
      {analysis.fvgs && analysis.fvgs.length > 0 && (
        <div style={{ background: G.surface, borderRadius: 9, padding: "10px 14px", border: `1px solid ${G.purple}28` }}>
          <div style={{ color: G.dim, fontSize: 10, letterSpacing: "0.07em", marginBottom: 7 }}>FAIR VALUE GAPS</div>
          {analysis.fvgs.map((fvg, idx) => (
            <div key={idx} style={{ marginBottom: idx < analysis.fvgs.length - 1 ? 8 : 0, paddingBottom: idx < analysis.fvgs.length - 1 ? 8 : 0, borderBottom: idx < analysis.fvgs.length - 1 ? `1px solid ${G.border}` : "none" }}>
              <div style={{ fontSize: 9, color: G.dim, marginBottom: 3, textTransform: "uppercase" }}>
                {fvg.type} FVG
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {[["Top", fvg.top], ["Mid", fvg.mid], ["Bot", fvg.bottom]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ color: G.dim, fontSize: 9 }}>{l}</div>
                    <div className="syne" style={{ color: G.purple, fontWeight: 600, fontSize: 11 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Entry */}
      <div style={{ background: `${G.accent}12`, border: `1px solid ${G.accent}30`, borderRadius: 9, padding: "10px 14px" }}>
        <div style={{ color: G.dim, fontSize: 10, letterSpacing: "0.07em", marginBottom: 3 }}>ENTRY PRICE</div>
        <div style={{ color: G.dim, fontSize: 9, marginBottom: 4 }}>({analysis.entrySource})</div>
        <div className="syne" style={{ fontWeight: 700, fontSize: 20, color: G.accent }}>{analysis.entry}</div>
      </div>

      {/* SL / TP */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: `${G.red}10`, border: `1px solid ${G.red}30`, borderRadius: 9, padding: "10px 12px" }}>
          <div style={{ color: G.dim, fontSize: 10, marginBottom: 3 }}>STOP LOSS</div>
          <div className="syne" style={{ fontWeight: 700, fontSize: 15, color: G.red }}>{analysis.sl}</div>
        </div>
        <div style={{ background: `${G.green}10`, border: `1px solid ${G.green}30`, borderRadius: 9, padding: "10px 12px" }}>
          <div style={{ color: G.dim, fontSize: 10, marginBottom: 3 }}>TAKE PROFIT</div>
          <div className="syne" style={{ fontWeight: 700, fontSize: 15, color: G.green }}>{analysis.tp}</div>
        </div>
      </div>

      {/* R:R */}
      <div style={{ background: G.surface, borderRadius: 9, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="syne" style={{ color: G.sub, fontSize: 11, fontWeight: 600 }}>RISK : REWARD</span>
        <span className="syne" style={{ fontWeight: 800, fontSize: 20, color: rrColor }}>1 : {analysis.rr}</span>
      </div>

      {dataSource && (
        <div style={{ textAlign: "right", color: G.dim, fontSize: 10, paddingTop: 4 }}>Data: {dataSource}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  MAIN SMC PAGE
// ─────────────────────────────────────────────────────────────────
export default function SMCPage() {
  const [sym, setSym] = useState(SYMBOLS[0]);
  const [htfTf, setHtfTf] = useState(HTF_TF[0]);
  const [ltfTf, setLtfTf] = useState(LTF_TF[1]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState(null);

  const isMobile = useIsMobile(860);

  const chartUrl = buildTvUrl("smc_chart", sym.tv, htfTf.tv);
  const ltfUrl = buildTvUrl("smc_ltf", sym.tv, ltfTf.tv);

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    let htfC = null, ltfC = null, src = "Simulated";

    try {
      // corsproxy.io now requires the target URL to be passed as a `url=`
      // query param. The previous "append straight after ?" format is
      // deprecated and corsproxy.io rejects/mangles it, which made every
      // request silently fail and fall through to the mock generator below.
      const proxy = "https://corsproxy.io/?url=";
      const enc = (u) => proxy + encodeURIComponent(u);
      const base = "https://query1.finance.yahoo.com/v8/finance/chart/";

      const [hr, lr] = await Promise.all([
        fetch(enc(`${base}${sym.yf}?interval=${htfTf.yf}&range=${htfTf.range}`), { signal: AbortSignal.timeout(5000) }),
        fetch(enc(`${base}${sym.yf}?interval=${ltfTf.yf}&range=${ltfTf.range}`), { signal: AbortSignal.timeout(5000) }),
      ]);

      if (!hr.ok || !lr.ok) {
        throw new Error(`Proxy/Yahoo responded ${hr.status}/${lr.status}`);
      }

      const [hd, ld] = await Promise.all([hr.json(), lr.json()]);

      // Yahoo can return HTTP 200 with an error envelope (e.g. an expired/
      // missing "crumb" token) — catch that case explicitly too.
      const apiErr = hd?.chart?.error || ld?.chart?.error;
      if (apiErr) throw new Error(apiErr.description || "Yahoo chart API error");

      const parse = (d) => {
        const r = d?.chart?.result?.[0];
        if (!r) return null;
        const q = r.indicators.quote[0];
        return q.open
          .map((o, i) => ({ open: o || 0, high: q.high[i] || 0, low: q.low[i] || 0, close: q.close[i] || 0 }))
          .filter((c) => c.high && c.low && c.close);
      };

      const h = parse(hd), l = parse(ld);
      if (h && h.length > 5) {
        htfC = h;
        ltfC = l;
        src = "Yahoo Finance";
      }
    } catch (err) {
      // Surface the real reason in devtools instead of silently switching
      // to simulated data with no trace of why.
      console.warn("[SMC] Live data fetch failed, falling back to simulated candles:", err?.message || err);
    }

    if (!htfC) {
      // Use same seed so HTF and LTF follow same price path
      const commonSeed = sym.value.charCodeAt(0);
      htfC = generateCandles(sym.base, sym.vol, 30, commonSeed);
      ltfC = generateCandles(sym.base, sym.vol * 0.3, 50, commonSeed);
    }

    await new Promise((r) => setTimeout(r, 380));

    // Use SMC analysis engine
    const currentPrice = ltfC && ltfC.length > 0 ? ltfC[ltfC.length - 1].close : null;
    setAnalysis(runSMCAnalysis(htfC, ltfC, sym, currentPrice));
    setDataSource(src);
    setLoading(false);
  }, [sym, htfTf, ltfTf]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  const SMC_STEPS = [
    { n: "1", title: "Mark Structure", desc: "Identify swing highs/lows and BOS/CHoCH on HTF", color: G.accent },
    { n: "2", title: "Find OB", desc: "Locate the last opposing candle before the impulse move", color: G.blue },
    { n: "3", title: "Wait for Sweep", desc: "Price sweeps liquidity pool (BSL or SSL) on HTF", color: G.purple },
    { n: "4", title: "LTF Confirm", desc: "Look for CHoCH + FVG / OB retest on LTF", color: G.green },
    { n: "5", title: "Execute & Manage", desc: "Enter at OB/FVG, SL beyond wick, TP at next BOS", color: G.red },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "16px 12px" : "32px 24px" }}>

      {/* ── Header + Controls ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, flexWrap: "wrap" }}>
            <h1 className="syne" style={{ fontWeight: 800, fontSize: isMobile ? 22 : 28 }}>SMC Chart Analysis</h1>
            <Pill color={G.blue} filled>
              LIVE
            </Pill>
            {sym.type && (
              <Pill color={TYPE_COLOR[sym.type]} style={{ fontSize: 10 }}>
                {sym.type.toUpperCase()}
              </Pill>
            )}
          </div>
          <p style={{ color: G.sub, fontSize: 13 }}>Smart Money Concepts · Order Blocks · BOS / CHoCH · Market Structure · Trade Plan</p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: isMobile ? "stretch" : "flex-end", flexWrap: "wrap", width: isMobile ? "100%" : undefined, flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ display: isMobile ? "grid" : "flex", gridTemplateColumns: isMobile ? "1fr 1fr" : undefined, gap: 10, width: isMobile ? "100%" : undefined }}>
            {[
              { label: "SYMBOL", node: <SymbolSelector value={sym.value} onChange={(e) => setSym(SYMBOLS.find((s) => s.value === e.target.value) || SYMBOLS[0])} fullWidth={isMobile} /> },
              { label: "HTF", node: <select value={htfTf.label} onChange={(e) => setHtfTf(HTF_TF.find((t) => t.label === e.target.value) || HTF_TF[0])} style={{ width: isMobile ? "100%" : undefined }}>{HTF_TF.map((t) => <option key={t.label} value={t.label}>{t.label}</option>)}</select> },
              { label: "LTF ENTRY", node: <select value={ltfTf.label} onChange={(e) => setLtfTf(LTF_TF.find((t) => t.label === e.target.value) || LTF_TF[0])} style={{ width: isMobile ? "100%" : undefined }}>{LTF_TF.map((t) => <option key={t.label} value={t.label}>{t.label}</option>)}</select> },
            ].map((ctrl) => (
              <div key={ctrl.label} style={{ display: "flex", flexDirection: "column", gap: 3, gridColumn: ctrl.label === "SYMBOL" && isMobile ? "1 / -1" : undefined }}>
                <label style={{ color: G.dim, fontSize: 10, letterSpacing: "0.06em" }}>{ctrl.label}</label>
                {ctrl.node}
              </div>
            ))}
          </div>
          <button
            className="btn"
            onClick={runAnalysis}
            disabled={loading}
            style={{ background: G.blue, color: "#fff", padding: "8px 18px", borderRadius: 7, fontFamily: "Syne", fontWeight: 700, fontSize: 13, opacity: loading ? 0.65 : 1, width: isMobile ? "100%" : undefined }}
          >
            {loading ? <span className="spin" style={{ display: "inline-block" }}>↻</span> : "↻ Refresh"}
          </button>
        </div>
      </div>

      {/* ── Main grid: HTF chart | LTF chart | SMC Trade Plan ── */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 310px", gap: 14, marginBottom: 14 }}>

        {/* HTF Chart */}
        <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 13, overflow: "hidden" }}>
          <div style={{ padding: "9px 14px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.blue }} />
            <span className="syne" style={{ fontWeight: 600, fontSize: 13, color: G.blue }}>
              HTF — {htfTf.label}
            </span>
            <span style={{ color: G.dim, fontSize: 11 }}>{sym.label} · Structure & OBs</span>
          </div>
          <div style={{ height: isMobile ? 280 : 350 }}>
            <iframe key={`smc-htf-${sym.value}-${htfTf.tv}`} src={chartUrl} style={{ width: "100%", height: "100%", border: "none" }} title="SMC HTF Chart" />
          </div>
        </div>

        {/* LTF Chart */}
        <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 13, overflow: "hidden" }}>
          <div style={{ padding: "9px 14px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.purple }} />
            <span className="syne" style={{ fontWeight: 600, fontSize: 13, color: G.purple }}>
              LTF — {ltfTf.label}
            </span>
            <span style={{ color: G.dim, fontSize: 11 }}>{sym.label} · CHoCH + FVG Entry</span>
          </div>
          <div style={{ height: isMobile ? 280 : 350 }}>
            <iframe key={`smc-ltf-${sym.value}-${ltfTf.tv}`} src={ltfUrl} style={{ width: "100%", height: "100%", border: "none" }} title="SMC LTF Chart" />
          </div>
        </div>

        {/* SMC Trade Plan */}
        <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 13, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "9px 14px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div className={loading ? "pulse" : ""} style={{ width: 8, height: 8, borderRadius: "50%", background: loading ? G.blue : analysis?.bias === "LONG" ? G.green : G.red }} />
            <span className="syne" style={{ fontWeight: 600, fontSize: 13 }}>SMC Trade Plan</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", height: isMobile ? "auto" : 350, maxHeight: isMobile ? 500 : undefined }}>
            <SMCTradePlan loading={loading} analysis={analysis} dataSource={dataSource} />
          </div>
        </div>
      </div>

      {/* ── SMC Concept Reference ── */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 14 }}>
        {SMC_REFS.map((r) => (
          <div key={r.label} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, padding: 15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: r.color, flexShrink: 0 }} />
              <span className="syne" style={{ fontWeight: 600, fontSize: 13, color: r.color }}>
                {r.label}
              </span>
            </div>
            <p style={{ color: G.sub, fontSize: 11, lineHeight: 1.6 }}>{r.desc}</p>
          </div>
        ))}
      </div>

      {/* ── SMC Methodology ── */}
      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 13, padding: isMobile ? 16 : 22 }}>
        <div className="syne" style={{ color: G.sub, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 16 }}>
          SMC METHODOLOGY — 5 STEPS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(175px, 1fr))", gap: 14 }}>
          {SMC_STEPS.map((s) => (
            <div key={s.n} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div className="syne" style={{ width: 26, height: 26, borderRadius: "50%", background: `${s.color}18`, border: `1px solid ${s.color}50`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {s.n}
              </div>
              <div>
                <div className="syne" style={{ fontWeight: 600, fontSize: 12, color: s.color, marginBottom: 3 }}>
                  {s.title}
                </div>
                <div style={{ color: G.dim, fontSize: 11, lineHeight: 1.55 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

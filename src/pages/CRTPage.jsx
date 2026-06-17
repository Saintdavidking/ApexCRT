import { useState, useEffect, useCallback } from "react";
import { G, SYMBOLS, HTF_TF, LTF_TF } from "../constants/index.js";
import { generateCandles } from "../utils/candleGenerator.js";
import { runCRTAnalysis }  from "../utils/crtAnalysis.js";
import { buildTvUrl }      from "../utils/tvUrl.js";
import Pill            from "../components/Pill.jsx";
import TradePlanPanel  from "../components/TradePlanPanel.jsx";

const TYPE_COLOR = { forex: G.blue, crypto: G.purple, commodity: G.accent, index: G.green };

const CRT_STEPS = [
  { n: "1", title: "Identify Range",    desc: "Find HTF consolidation between clear high/low boundaries",           color: G.accent },
  { n: "2", title: "Wait for Sweep",    desc: "Price sweeps above highs (BSL) or below lows (SSL)",                color: G.blue   },
  { n: "3", title: "Spot FVG",          desc: "Switch to LTF — find 3-candle imbalance in sweep direction",        color: G.purple },
  { n: "4", title: "Enter at FVG",      desc: "Limit order at FVG midpoint or tap into the zone",                  color: G.green  },
  { n: "5", title: "Manage Trade",      desc: "SL below wick (long) or above (short); TP at range opposite side",  color: G.red    },
];

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

function SymbolSelector({ value, onChange, style }) {
  const groups = [
    { label: "Forex & Indices", types: ["forex", "index", "commodity"] },
    { label: "Cryptocurrency",  types: ["crypto"] },
  ];
  return (
    <select value={value} onChange={onChange} style={{ minWidth: 130, width: "100%", ...style }}>
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

export default function CRTPage() {
  const [sym,        setSym]        = useState(SYMBOLS[0]);
  const [htfTf,      setHtfTf]      = useState(HTF_TF[0]);
  const [ltfTf,      setLtfTf]      = useState(LTF_TF[1]);
  const [analysis,   setAnalysis]   = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [dataSource, setDataSource] = useState(null);

  const isMobile = useIsMobile();

  const htfUrl = buildTvUrl("crt_htf", sym.tv, htfTf.tv);
  const ltfUrl = buildTvUrl("crt_ltf", sym.tv, ltfTf.tv);

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    let htfC = null, ltfC = null, src = "Simulated";

    try {
      const proxy = "https://corsproxy.io/?";
      const enc   = (u) => proxy + encodeURIComponent(u);
      const base  = "https://query1.finance.yahoo.com/v8/finance/chart/";

      const [hr, lr] = await Promise.all([
        fetch(enc(`${base}${sym.yf}?interval=${htfTf.yf}&range=${htfTf.range}`), { signal: AbortSignal.timeout(5000) }),
        fetch(enc(`${base}${sym.yf}?interval=${ltfTf.yf}&range=${ltfTf.range}`), { signal: AbortSignal.timeout(5000) }),
      ]);
      const [hd, ld] = await Promise.all([hr.json(), lr.json()]);

      const parse = (d) => {
        const r = d?.chart?.result?.[0]; if (!r) return null;
        const q = r.indicators.quote[0];
        return q.open
          .map((o, i) => ({ open: o||0, high: q.high[i]||0, low: q.low[i]||0, close: q.close[i]||0 }))
          .filter(c => c.high && c.low && c.close);
      };

      const h = parse(hd), l = parse(ld);
      if (h && h.length > 5) { htfC = h; ltfC = l; src = "Yahoo Finance"; }
    } catch {}

    if (!htfC) {
      htfC = generateCandles(sym.base, sym.vol,       30, sym.value.charCodeAt(0));
      ltfC = generateCandles(sym.base, sym.vol * 0.3, 50, sym.value.charCodeAt(1));
    }

    await new Promise(r => setTimeout(r, 380));
    setAnalysis(runCRTAnalysis(htfC, ltfC, sym));
    setDataSource(src);
    setLoading(false);
  }, [sym, htfTf, ltfTf]);

  useEffect(() => { runAnalysis(); }, [runAnalysis]);

  return (
    <div className="fade-in" style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "16px 12px" : "32px 24px" }}>

      {/* ── Header + controls ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, flexWrap: "wrap" }}>
            <h1 className="syne" style={{ fontWeight: 800, fontSize: isMobile ? 22 : 28 }}>CRT Analyzer</h1>
            <Pill filled>LIVE</Pill>
            {sym.type && (
              <Pill color={TYPE_COLOR[sym.type]} style={{ fontSize: 10 }}>
                {sym.type.toUpperCase()}
              </Pill>
            )}
          </div>
          <p style={{ color: G.sub, fontSize: 13 }}>
            Candle Range Theory · Liquidity Sweep + FVG Entry Logic · Dual TradingView Charts
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: isMobile ? "stretch" : "flex-end",
            flexWrap: "wrap",
            width: isMobile ? "100%" : "auto",
          }}
        >
          {[
            { label: "SYMBOL",    node: <SymbolSelector value={sym.value} onChange={e => setSym(SYMBOLS.find(s => s.value === e.target.value) || SYMBOLS[0])} /> },
            { label: "HTF RANGE", node: <select style={{ width: "100%" }} value={htfTf.label} onChange={e => setHtfTf(HTF_TF.find(t => t.label === e.target.value) || HTF_TF[0])}>{HTF_TF.map(t => <option key={t.label}>{t.label}</option>)}</select> },
            { label: "LTF ENTRY", node: <select style={{ width: "100%" }} value={ltfTf.label} onChange={e => setLtfTf(LTF_TF.find(t => t.label === e.target.value) || LTF_TF[0])}>{LTF_TF.map(t => <option key={t.label}>{t.label}</option>)}</select> },
          ].map(ctrl => (
            <div
              key={ctrl.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                flex: isMobile ? "1 1 calc(50% - 5px)" : "initial",
                minWidth: isMobile ? "calc(50% - 5px)" : "auto",
              }}
            >
              <label style={{ color: G.dim, fontSize: 10, letterSpacing: "0.06em" }}>{ctrl.label}</label>
              {ctrl.node}
            </div>
          ))}
          <button
            className="btn"
            onClick={runAnalysis}
            disabled={loading}
            style={{
              background: G.accent,
              color: G.bg,
              padding: "8px 18px",
              borderRadius: 7,
              fontFamily: "Syne",
              fontWeight: 700,
              fontSize: 13,
              opacity: loading ? 0.65 : 1,
              width: isMobile ? "100%" : "auto",
              marginTop: isMobile ? 4 : 0,
            }}
          >
            {loading ? <span className="spin" style={{ display: "inline-block" }}>↻</span> : "↻ Refresh"}
          </button>
        </div>
      </div>

      {/* ── Charts + Trade Plan ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 310px",
          gap: 14,
          marginBottom: 14,
        }}
      >

        <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 13, overflow: "hidden" }}>
          <div style={{ padding: "9px 14px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.accent }} />
            <span className="syne" style={{ fontWeight: 600, fontSize: 13, color: G.accent }}>HTF — {htfTf.label}</span>
            <span style={{ color: G.dim, fontSize: 11 }}>{sym.label} · Range Analysis</span>
          </div>
          <div style={{ height: isMobile ? 280 : 350 }}>
            <iframe key={`htf-${sym.value}-${htfTf.tv}`} src={htfUrl} style={{ width: "100%", height: "100%", border: "none" }} title="HTF Chart" />
          </div>
        </div>

        <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 13, overflow: "hidden" }}>
          <div style={{ padding: "9px 14px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.blue }} />
            <span className="syne" style={{ fontWeight: 600, fontSize: 13, color: G.blue }}>LTF — {ltfTf.label}</span>
            <span style={{ color: G.dim, fontSize: 11 }}>{sym.label} · Entry Confirmation</span>
          </div>
          <div style={{ height: isMobile ? 280 : 350 }}>
            <iframe key={`ltf-${sym.value}-${ltfTf.tv}`} src={ltfUrl} style={{ width: "100%", height: "100%", border: "none" }} title="LTF Chart" />
          </div>
        </div>

        <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 13, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "9px 14px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div
              className={loading ? "pulse" : ""}
              style={{ width: 8, height: 8, borderRadius: "50%", background: loading ? G.accent : analysis?.bias === "LONG" ? G.green : G.red }}
            />
            <span className="syne" style={{ fontWeight: 600, fontSize: 13 }}>Live Trade Plan</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", height: isMobile ? "auto" : 350, maxHeight: isMobile ? 450 : "none" }}>
            <TradePlanPanel loading={loading} analysis={analysis} dataSource={dataSource} />
          </div>
        </div>
      </div>
      

      {/* ── CRT Methodology ── */}
      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 13, padding: isMobile ? 16 : 22 }}>
        <div className="syne" style={{ color: G.sub, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 16 }}>
          CRT METHODOLOGY — 5 STEPS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(175px, 1fr))", gap: 14 }}>
          {CRT_STEPS.map(s => (
            <div key={s.n} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div className="syne" style={{ width: 26, height: 26, borderRadius: "50%", background: `${s.color}18`, border: `1px solid ${s.color}50`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {s.n}
              </div>
              <div>
                <div className="syne" style={{ fontWeight: 600, fontSize: 12, color: s.color, marginBottom: 3 }}>{s.title}</div>
                <div style={{ color: G.dim, fontSize: 11, lineHeight: 1.55 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
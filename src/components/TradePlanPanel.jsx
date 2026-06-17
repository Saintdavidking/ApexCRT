import { G } from "../constants/index.js";

function PlanRow({ label, value, color }) {
  return (
    <div style={{ background: G.surface, borderRadius: 9, padding: "10px 14px" }}>
      <div style={{ color: G.dim, fontSize: 10, letterSpacing: "0.06em", marginBottom: 4 }}>
        {label}
      </div>
      <div className="syne" style={{ fontWeight: 700, fontSize: 15, color }}>
        {value}
      </div>
    </div>
  );
}

export default function TradePlanPanel({ loading, analysis, dataSource }) {
  // ── Loading skeleton ──────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: 14, height: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 36, animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────
  if (!analysis) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: G.dim,
          fontSize: 13,
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.4 }}>📊</div>
        <span>Generating trade plan…</span>
      </div>
    );
  }

  const isLong     = analysis.bias === "LONG";
  const biasColor  = isLong ? G.green : G.red;
  const rrVal      = parseFloat(analysis.rr);
  const rrColor    = rrVal >= 2 ? G.green : rrVal >= 1.5 ? G.accent : G.red;

  return (
    <div
      style={{
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 9,
        overflowY: "auto",
        height: "100%",
      }}
    >
      {/* ── Bias ── */}
      <div
        style={{
          background: `${biasColor}15`,
          border: `1px solid ${biasColor}40`,
          borderRadius: 9,
          padding: "11px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: G.sub, fontSize: 11, letterSpacing: "0.06em" }}>BIAS</span>
        <span className="syne" style={{ fontWeight: 800, fontSize: 22, color: biasColor }}>
          {isLong ? "▲ LONG" : "▼ SHORT"}
        </span>
      </div>

      {/* ── HTF Range ── */}
      <div style={{ background: G.surface, borderRadius: 9, padding: "10px 14px" }}>
        <div style={{ color: G.dim, fontSize: 10, letterSpacing: "0.07em", marginBottom: 7 }}>
          HTF RANGE
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {[
            ["High", analysis.rangeHigh, G.red],
            ["Mid",  analysis.rangeMid,  G.sub],
            ["Low",  analysis.rangeLow,  G.green],
          ].map(([lbl, val, col]) => (
            <div key={lbl}>
              <div style={{ color: G.dim, fontSize: 10 }}>{lbl}</div>
              <div className="syne" style={{ color: col, fontWeight: 600, fontSize: 13 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Liquidity Sweep ── */}
      <div style={{ background: G.surface, borderRadius: 9, padding: "10px 14px" }}>
        <div style={{ color: G.dim, fontSize: 10, letterSpacing: "0.07em", marginBottom: 5 }}>
          LIQUIDITY SWEEP
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="syne" style={{ color: biasColor, fontWeight: 600, fontSize: 13 }}>
            {isLong ? "↓ Sell-Side (SSL)" : "↑ Buy-Side (BSL)"}
          </span>
          <span style={{ color: G.sub, fontSize: 12 }}>{analysis.sweepLevel}</span>
        </div>
      </div>

      {/* ── FVG Zone ── */}
      {analysis.fvg && (
        <div
          style={{
            background: G.surface,
            borderRadius: 9,
            padding: "10px 14px",
            border: `1px solid ${G.blue}28`,
          }}
        >
          <div style={{ color: G.dim, fontSize: 10, letterSpacing: "0.07em", marginBottom: 5 }}>
            FVG ZONE ({analysis.fvg.type.toUpperCase()})
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {[
              ["Top", analysis.fvg.top],
              ["Mid", analysis.fvg.mid],
              ["Bot", analysis.fvg.bottom],
            ].map(([l, v]) => (
              <div key={l}>
                <div style={{ color: G.dim, fontSize: 10 }}>{l}</div>
                <div className="syne" style={{ color: G.blue, fontWeight: 600, fontSize: 12 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Entry ── */}
      <div
        style={{
          background: `${G.accent}12`,
          border: `1px solid ${G.accent}30`,
          borderRadius: 9,
          padding: "10px 14px",
        }}
      >
        <div style={{ color: G.dim, fontSize: 10, letterSpacing: "0.07em", marginBottom: 4 }}>
          ENTRY PRICE
        </div>
        <div className="syne" style={{ fontWeight: 700, fontSize: 20, color: G.accent }}>
          {analysis.entry}
        </div>
      </div>

      {/* ── SL / TP ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div
          style={{
            background: `${G.red}10`,
            border: `1px solid ${G.red}30`,
            borderRadius: 9,
            padding: "10px 12px",
          }}
        >
          <div style={{ color: G.dim, fontSize: 10, marginBottom: 3 }}>STOP LOSS</div>
          <div className="syne" style={{ fontWeight: 700, fontSize: 15, color: G.red }}>
            {analysis.sl}
          </div>
        </div>
        <div
          style={{
            background: `${G.green}10`,
            border: `1px solid ${G.green}30`,
            borderRadius: 9,
            padding: "10px 12px",
          }}
        >
          <div style={{ color: G.dim, fontSize: 10, marginBottom: 3 }}>TAKE PROFIT</div>
          <div className="syne" style={{ fontWeight: 700, fontSize: 15, color: G.green }}>
            {analysis.tp}
          </div>
        </div>
      </div>

      {/* ── Risk : Reward ── */}
      <div
        style={{
          background: G.surface,
          borderRadius: 9,
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span className="syne" style={{ color: G.sub, fontSize: 11, fontWeight: 600 }}>
          RISK : REWARD
        </span>
        <span className="syne" style={{ fontWeight: 800, fontSize: 20, color: rrColor }}>
          1 : {analysis.rr}
        </span>
      </div>

      {dataSource && (
        <div style={{ textAlign: "right", color: G.dim, fontSize: 10, paddingTop: 4 }}>
          Data: {dataSource}
        </div>
      )}
    </div>
  );
}

import { TICKER_DATA, G } from "../constants/index.js";

export default function TickerBar() {
  const str = TICKER_DATA.join("   ·   ");

  return (
    <div
      style={{
        background: G.surface,
        borderBottom: `1px solid ${G.border}`,
        padding: "6px 0",
        overflow: "hidden",
      }}
    >
      <div className="ticker-wrap">
        <span
          className="ticker-inner"
          style={{ color: G.sub, fontSize: 11, letterSpacing: "0.04em" }}
        >
          {`${str}   ·   ${str}`}
        </span>
      </div>
    </div>
  );
}

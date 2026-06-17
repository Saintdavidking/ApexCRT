import { G } from "../constants/index.js";

const FOOTER_LINKS = [
  ["home",     "Home"],
  ["learn",    "Learn"],
  ["features", "Features"],
  
];

export default function Footer({ setPage }) {
  return (
    <footer
      style={{
        borderTop: `1px solid ${G.border}`,
        background: G.surface,
        padding: "36px 24px",
        marginTop: 64,
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div className="syne" style={{ fontWeight: 700, fontSize: 18 }}>
          Apex<span style={{ color: G.accent }}>Chart</span>
        </div>

        <p style={{ color: G.dim, fontSize: 12, textAlign: "center" }}>
          © 2025 ApexChart · For educational purposes only · Not financial advice
        </p>

        <div style={{ display: "flex", gap: 20 }}>
          {FOOTER_LINKS.map(([id, label]) => (
            <span
              key={id}
              onClick={() => setPage(id)}
              style={{ color: G.dim, fontSize: 12, cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = G.accent)}
              onMouseLeave={(e) => (e.target.style.color = G.dim)}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

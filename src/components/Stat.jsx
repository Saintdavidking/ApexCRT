import { G } from "../constants/index.js";

/**
 * Single stat display box.
 *
 * Props: label, value, color, size
 */
export default function Stat({ label, value, color = G.text, size = 16 }) {
  return (
    <div style={{ background: G.surface, borderRadius: 8, padding: "10px 13px" }}>
      <div style={{ color: G.dim, fontSize: 10, letterSpacing: "0.06em", marginBottom: 3 }}>
        {label}
      </div>
      <div className="syne" style={{ color, fontSize: size, fontWeight: 700 }}>
        {value}
      </div>
    </div>
  );
}

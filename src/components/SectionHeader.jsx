/**
 * Reusable section heading with optional subtitle.
 */
export default function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2
        className="syne"
        style={{
          fontSize: "clamp(26px,4vw,38px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          marginBottom: 8,
        }}
      >
        {title}
      </h2>
      {sub && <p style={{ color: "#94a3b8", fontSize: 14 }}>{sub}</p>}
    </div>
  );
}

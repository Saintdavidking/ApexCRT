import { useState, useEffect } from "react";
import { G } from "../constants/index.js";

const NAV_LINKS = [
  ["home",     "Home"],
  ["learn",    "Learn"],
  ["features", "Features"],
  ["crt",      "CRT"],
  ["smc",      "SMC"],
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

export default function Navbar({ page, setPage }) {
  const isMobile = useIsMobile(860);
  const [open, setOpen] = useState(false);

  // Close menu whenever the page changes or viewport switches to desktop
  useEffect(() => { setOpen(false); }, [page, isMobile]);

  const handleNav = (id) => {
    setPage(id);
    setOpen(false);
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: `${G.surface}ee`,
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${G.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          height: 60,
          gap: 8,
        }}
      >
        {/* ── Logo ── */}
        <div
          onClick={() => handleNav("home")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 9, marginRight: 16 }}
        >
          <div
            style={{
              width: 32, height: 32,
              background: G.accent,
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Syne", fontWeight: 800, fontSize: 16, color: G.bg,
            }}
          >
            A
          </div>
          <span className="syne" style={{ fontWeight: 700, fontSize: 19, letterSpacing: "-0.02em" }}>
            Apex<span style={{ color: G.accent }}>Chart</span>
          </span>
        </div>

        {isMobile ? (
          /* ── Mobile: hamburger toggle pushed to the right ── */
          <button
            className="btn"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            style={{
              marginLeft: "auto",
              background: open ? `${G.accent}18` : "transparent",
              border: `1px solid ${G.border}`,
              borderRadius: 8,
              width: 40,
              height: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: 0,
            }}
          >
            <span style={{
              display: "block", width: 18, height: 2, borderRadius: 1,
              background: open ? G.accent : G.sub,
              transform: open ? "translateY(6px) rotate(45deg)" : "none",
              transition: "transform 0.2s ease, background 0.2s ease",
            }} />
            <span style={{
              display: "block", width: 18, height: 2, borderRadius: 1,
              background: open ? G.accent : G.sub,
              opacity: open ? 0 : 1,
              transition: "opacity 0.2s ease",
            }} />
            <span style={{
              display: "block", width: 18, height: 2, borderRadius: 1,
              background: open ? G.accent : G.sub,
              transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
              transition: "transform 0.2s ease, background 0.2s ease",
            }} />
          </button>
        ) : (
          <>
            {/* ── Desktop nav links ── */}
            <div style={{ display: "flex", gap: 2, flex: 1, flexWrap: "wrap" }}>
              {NAV_LINKS.map(([id, label]) => (
                <button
                  key={id}
                  className="btn"
                  onClick={() => handleNav(id)}
                  style={{
                    background: page === id ? `${G.accent}18` : "transparent",
                    color: page === id ? G.accent : G.sub,
                    border: "none",
                    padding: "6px 13px",
                    borderRadius: 6,
                    fontSize: 13,
                    borderBottom: page === id ? `1px solid ${G.accent}60` : "1px solid transparent",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── Desktop CTA ── */}
            <button
              className="btn"
              onClick={() => handleNav("crt")}
              style={{
                background: G.accent,
                color: G.bg,
                padding: "8px 18px",
                borderRadius: 8,
                fontFamily: "Syne",
                fontWeight: 700,
                fontSize: 13,
                boxShadow: `0 4px 20px ${G.accent}40`,
              }}
            >
              Launch App →
            </button>
          </>
        )}
      </div>

      {/* ── Mobile dropdown panel ── */}
      {isMobile && open && (
        <div
          style={{
            borderTop: `1px solid ${G.border}`,
            background: G.surface,
            padding: "12px 16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            animation: "navDrop 0.18s ease",
          }}
        >
          {NAV_LINKS.map(([id, label]) => (
            <button
              key={id}
              className="btn"
              onClick={() => handleNav(id)}
              style={{
                background: page === id ? `${G.accent}18` : "transparent",
                color: page === id ? G.accent : G.sub,
                border: "none",
                borderLeft: page === id ? `3px solid ${G.accent}` : "3px solid transparent",
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: 6,
                fontSize: 15,
                fontWeight: page === id ? 700 : 500,
              }}
            >
              {label}
            </button>
          ))}

          {/* ── Mobile CTA ── */}
          <button
            className="btn"
            onClick={() => handleNav("crt")}
            style={{
              background: G.accent,
              color: G.bg,
              padding: "12px 18px",
              borderRadius: 8,
              fontFamily: "Syne",
              fontWeight: 700,
              fontSize: 14,
              marginTop: 8,
              boxShadow: `0 4px 20px ${G.accent}40`,
            }}
          >
            Launch App →
          </button>
        </div>
      )}

      <style>{`
        @keyframes navDrop {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}
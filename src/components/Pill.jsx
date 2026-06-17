import { G } from "../constants/index.js";

/**
 * Small badge/tag component.
 *
 * Props:
 *  - children  : content
 *  - color     : accent color (defaults to G.accent)
 *  - filled    : solid background vs translucent
 *  - style     : additional inline styles
 */
export default function Pill({ children, color = G.accent, filled = false, style = {} }) {
  return (
    <span
      className="tag"
      style={{
        background: filled ? color : `${color}18`,
        color:      filled ? G.bg  : color,
        border:     `1px solid ${color}40`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

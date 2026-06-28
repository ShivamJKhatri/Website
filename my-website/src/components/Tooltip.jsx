export default function Tooltip({
  label,
  children,
  side = "top",
  block = false,
}) {
  if (!label) return children;

  return (
    <span
      className={`tooltip-wrap tooltip-wrap--${side}${block ? " tooltip-wrap--block" : ""}`}
    >
      {children}
      <span className="tooltip" role="tooltip">
        {label}
      </span>
    </span>
  );
}

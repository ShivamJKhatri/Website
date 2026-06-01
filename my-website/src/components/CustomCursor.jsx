import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [telemetry, setTelemetry] = useState({ x: 0, y: 0 });
  const [isLocked, setIsLocked] = useState(false);
  const [hoveredRect, setHoveredRect] = useState(null);
  const [activeLabel, setActiveLabel] = useState("");
  const [visible, setVisible] = useState(false);

  const cursorRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    // Show custom cursor only after first mouse movement
    const showCursor = () => setVisible(true);
    window.addEventListener("mousemove", showCursor, { once: true });

    const handleMouseMove = (e) => {
      cursorRef.current.targetX = e.clientX;
      cursorRef.current.targetY = e.clientY;
      
      // Update coordinates telemetry instantly on movement
      setTelemetry({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Global Hover / Lock-on Detection
    const handleMouseOver = (e) => {
      const interactive = e.target.closest("a, button, .proj-card, .exp-card, .contact-card, .sticky-ai-cta");
      if (interactive) {
        setIsLocked(true);
        const rect = interactive.getBoundingClientRect();
        setHoveredRect({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height
        });

        // Dynamic CAD status codes
        let label = "TGT_LKD";
        if (interactive.tagName === "A") {
          label = "LINK_NAV";
        } else if (interactive.tagName === "BUTTON") {
          label = "CMD_EXE";
        } else if (interactive.classList.contains("proj-card")) {
          label = "PRJ_DATA";
        } else if (interactive.classList.contains("exp-card")) {
          label = "EXP_DATA";
        } else if (interactive.classList.contains("contact-card")) {
          label = "CON_LINK";
        } else if (interactive.classList.contains("sticky-ai-cta")) {
          label = "AI_QUERY";
        }
        setActiveLabel(label);
      }
    };

    const handleMouseOut = (e) => {
      const interactive = e.target.closest("a, button, .proj-card, .exp-card, .contact-card, .sticky-ai-cta");
      if (interactive) {
        setIsLocked(false);
        setHoveredRect(null);
        setActiveLabel("");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    // Buttery Smooth Cursor Physics Interpolation Loop (60fps)
    const updatePosition = () => {
      const cur = cursorRef.current;
      
      if (isLocked && hoveredRect) {
        // Snap target to the absolute center of the hovered element!
        const centerX = hoveredRect.left + hoveredRect.width / 2;
        const centerY = hoveredRect.top + hoveredRect.height / 2;
        
        // Satisfying snap pull (faster drag)
        cur.x += (centerX - cur.x) * 0.28;
        cur.y += (centerY - cur.y) * 0.28;
      } else {
        // Clean fluid tracking physics
        cur.x += (cur.targetX - cur.x) * 0.2;
        cur.y += (cur.targetY - cur.y) * 0.2;
      }

      setPosition({ x: cur.x, y: cur.y });
      rafId.current = requestAnimationFrame(updatePosition);
    };

    rafId.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", showCursor);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(rafId.current);
    };
  }, [isLocked, hoveredRect]);

  // Disable on mobile/touchscreen devices
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div 
      className="cad-cursor-root"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`
      }}
    >
      {/* 1. Precision Center Crosshair */}
      <div className={`cad-cursor-crosshair ${isLocked ? "cad-cursor-crosshair--locked" : ""}`}>
        <div className="cad-cursor-dot" />
        <div className="cad-cursor-tick cad-cursor-tick--top" />
        <div className="cad-cursor-tick cad-cursor-tick--bottom" />
        <div className="cad-cursor-tick cad-cursor-tick--left" />
        <div className="cad-cursor-tick cad-cursor-tick--right" />
      </div>

      {/* 2. Coordinate HUD Telemetry */}
      <div className={`cad-cursor-hud ${isLocked ? "cad-cursor-hud--locked" : ""}`}>
        <span className="cad-hud-coordinates">{`X: ${telemetry.x.toString().padStart(4, "0")} Y: ${telemetry.y.toString().padStart(4, "0")}`}</span>
        {isLocked && <span className="cad-hud-status">{activeLabel}</span>}
      </div>

      {/* 3. Snapping Lock-On Framing Brackets */}
      {isLocked && hoveredRect && (
        <div 
          className="cad-lock-box"
          style={{
            position: "fixed",
            left: hoveredRect.left - position.x,
            top: hoveredRect.top - position.y,
            width: hoveredRect.width,
            height: hoveredRect.height
          }}
        >
          <div className="cad-lock-corner cad-lock-corner--tl" />
          <div className="cad-lock-corner cad-lock-corner--tr" />
          <div className="cad-lock-corner cad-lock-corner--bl" />
          <div className="cad-lock-corner cad-lock-corner--br" />
        </div>
      )}
    </div>
  );
}

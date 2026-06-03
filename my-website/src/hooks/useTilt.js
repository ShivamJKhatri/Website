import { useState, useRef, useCallback } from "react";

export function useTilt(ref, options = {}) {
  const { maxDeg = 5, maxShadow = 12, scale = 1.015 } = options;
  const [style, setStyle] = useState({ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" });
  const [spotStyle, setSpotStyle] = useState({});
  const rafId = useRef(null);

  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const rotateY = ((x - midX) / midX) * maxDeg;
      const rotateX = ((midY - y) / midY) * maxDeg;
      const shadowX = -((x - midX) / midX) * maxShadow;
      const shadowY = -((y - midY) / midY) * maxShadow;

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        boxShadow: `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.5), 0 0 35px rgba(var(--glow-rgb), 0.1)`,
      });

      setSpotStyle({
        opacity: 1,
        background: `radial-gradient(circle 280px at ${x}px ${y}px, rgba(var(--spotlight-rgb), 0.08), transparent 70%)`,
      });
    });
  }, [ref, maxDeg, maxShadow, scale]);

  const handleLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    });
    setSpotStyle({ opacity: 0 });
  }, []);

  return { style, spotStyle, handleMove, handleLeave };
}
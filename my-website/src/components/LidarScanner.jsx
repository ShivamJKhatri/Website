import { useEffect, useRef, useState } from "react";

export default function LidarScanner() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false, targetX: 0, targetY: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Telemetry HUD data state (to show live changing metrics)
  const [telemetry, setTelemetry] = useState({ rng: "0.00", azi: "0.0" });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle Resize
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      setDimensions({ width: rect.width, height: rect.height });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track Mouse
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const parent = canvas.parentElement;
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    // Initialize 3D point cloud simulation
    const points = [];
    const numPoints = 80;
    
    // Generate scattered structural nodes (representing objects / obstacles)
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random(), // percentage of canvas width
        y: Math.random(), // percentage of canvas height
        size: Math.random() * 2 + 1,
        // target coordinates
        tx: (Math.random() * 10 - 5).toFixed(2),
        ty: (Math.random() * 10 - 5).toFixed(2),
        tz: (Math.random() * 2).toFixed(2),
        label: `TGT-${Math.floor(Math.random() * 900) + 100}`
      });
    }

    let angle = 0;
    let pulseRadius = 0;
    let animationFrameId;

    // Smoothed mouse coordinates for interpolation (buttery smooth lag effect)
    mouseRef.current.x = parent.clientWidth / 2;
    mouseRef.current.y = parent.clientHeight / 2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Theme Configuration
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const primaryColor = isDarkMode ? "rgba(244, 244, 245, " : "rgba(24, 24, 27, ";
      const accentColor = isDarkMode ? "rgba(244, 244, 245, 0.4)" : "rgba(24, 24, 27, 0.4)";

      // Interpolate mouse position for smooth trailing
      const mouse = mouseRef.current;
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      } else {
        // Idle state: Auto scan in a circle around center of container
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.15;
        const targetX = cx + Math.cos(Date.now() * 0.001) * radius;
        const targetY = cy + Math.sin(Date.now() * 0.001) * radius;
        mouse.x += (targetX - mouse.x) * 0.05;
        mouse.y += (targetY - mouse.y) * 0.05;
      }

      // 2. Draw Sensor Grid Overlay (faint dots)
      ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)";
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }

      // 3. LiDAR Concentric Sweep Rings
      pulseRadius += 1.5;
      if (pulseRadius > 350) pulseRadius = 0;

      ctx.strokeStyle = `${primaryColor}0.02)`;
      ctx.lineWidth = 1;
      
      // Draw 3 static concentric rings around cursor
      for (let r = 80; r <= 240; r += 80) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw the expanding pulse ring
      ctx.strokeStyle = `${primaryColor}${Math.max(0, 0.08 * (1 - pulseRadius / 350))})`;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // 4. LiDAR Laser Rotary Sweep Line
      angle += 0.015;
      const maxDistance = 280;
      const sweepX = mouse.x + Math.cos(angle) * maxDistance;
      const sweepY = mouse.y + Math.sin(angle) * maxDistance;

      // Draw rotating sweep line
      const sweepGradient = ctx.createLinearGradient(mouse.x, mouse.y, sweepX, sweepY);
      sweepGradient.addColorStop(0, `${primaryColor}0.1)`);
      sweepGradient.addColorStop(1, `${primaryColor}0)`);
      ctx.strokeStyle = sweepGradient;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      // 5. Draw and Detect LiDAR Point Targets
      points.forEach((pt) => {
        const ptX = pt.x * canvas.width;
        const ptY = pt.y * canvas.height;

        const dx = ptX - mouse.x;
        const dy = ptY - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Radar Scan Sweep Detection Range
        if (distance < maxDistance) {
          // Angle between target and rotary scan line
          let ptAngle = Math.atan2(dy, dx);
          if (ptAngle < 0) ptAngle += Math.PI * 2;
          const sweepAngle = angle % (Math.PI * 2);
          const angleDiff = Math.abs(ptAngle - sweepAngle);

          // Calculate "excited" opacity when laser sweeps over the point
          let opacity = 0.03; // baseline faint ambient point
          if (angleDiff < 0.2) {
            opacity = 0.85; // highly excited
          } else if (distance < 120) {
            // General ambient excitation in near proximity
            opacity = Math.max(0.03, 0.45 * (1 - distance / 120));
          }

          if (opacity > 0.03) {
            // Draw Target Coordinate Box (minimalist wireframe)
            if (opacity > 0.2) {
              ctx.strokeStyle = `${primaryColor}${opacity * 0.25})`;
              ctx.setLineDash([2, 2]);
              ctx.strokeRect(ptX - 6, ptY - 6, 12, 12);
              ctx.setLineDash([]);

              // Text Telemetry Label
              ctx.fillStyle = `${primaryColor}${opacity * 0.7})`;
              ctx.font = "8px monospace";
              ctx.fillText(pt.label, ptX + 10, ptY - 2);
              ctx.fillText(`[${pt.tx}, ${pt.ty}, ${pt.tz}]`, ptX + 10, ptY + 6);
            }

            // Draw glowing target dot
            ctx.fillStyle = `${primaryColor}${opacity})`;
            ctx.beginPath();
            ctx.arc(ptX, ptY, pt.size * (opacity > 0.2 ? 1.5 : 1), 0, Math.PI * 2);
            ctx.fill();

            // Tiny connection truss line to the mouse center
            if (opacity > 0.3) {
              ctx.strokeStyle = `${primaryColor}${opacity * 0.1})`;
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(ptX, ptY);
              ctx.stroke();
            }
          } else {
            // Faint ambient background point (always visible but extremely subtle)
            ctx.fillStyle = `${primaryColor}0.02)`;
            ctx.beginPath();
            ctx.arc(ptX, ptY, pt.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // 6. Draw HUD Telemetry next to cursor
      if (mouse.active) {
        ctx.fillStyle = `${primaryColor}0.85)`;
        ctx.font = "9px monospace";
        
        // Dynamic stats calculations
        const rawDist = Math.sqrt(
          (mouse.x - canvas.width / 2) ** 2 + (mouse.y - canvas.height / 2) ** 2
        );
        const rng = (rawDist / 80).toFixed(2); // scaling factor
        let azi = (angle * (180 / Math.PI)) % 360;
        if (azi < 0) azi += 360;

        ctx.fillText("// SCANNER ACTIVE", mouse.x + 15, mouse.y + 15);
        ctx.fillText(`RNG: ${rng}m`, mouse.x + 15, mouse.y + 27);
        ctx.fillText(`AZI: ${azi.toFixed(1)}°`, mouse.x + 15, mouse.y + 39);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="lidar-canvas"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

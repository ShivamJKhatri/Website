import { useEffect, useRef, useState } from "react";

export default function KinematicLinkage() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false, targetX: 0, targetY: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle Resize - Stretch to absolute window width/height
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    const isMobileView = () =>
      window.matchMedia("(max-width: 768px)").matches;
    const prefersReducedMotion = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e) => {
      if (isMobileView() || prefersReducedMotion()) return;
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      if (isMobileView() || prefersReducedMotion()) return;
      mouseRef.current.active = false;
    };

    if (!prefersReducedMotion()) {
      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    // Initialize 3 Multi-Segment Robotic Arms (using FABRIK for natural fluid bends)
    // Arm 1: Bottom-Left
    // Arm 2: Top-Center (stemming from center of the top)
    // Arm 3: Bottom-Right
    const arms = [
      {
        id: "bottom-left",
        label: "ARM-L (4-DOF FLEX)",
        color: "primary",
        lengths: [80, 75, 70, 65], // Tapered segment lengths for realistic dynamics
        points: [] // [p0, p1, p2, p3, p4]
      },
      {
        id: "top-center",
        label: "ARM-C (4-DOF TRUSS)",
        color: "accent",
        lengths: [85, 80, 75, 70],
        points: []
      },
      {
        id: "bottom-right",
        label: "ARM-R (4-DOF ACTUATOR)",
        color: "primary",
        lengths: [80, 75, 70, 65],
        points: []
      }
    ];

    // Helper to initialize arm joints in a default position
    const initArmPoints = (arm, width, height) => {
      let bx = 0;
      let by = 0;

      if (arm.id === "bottom-left") {
        bx = 0;
        by = height;
      } else if (arm.id === "top-center") {
        bx = width / 2;
        by = 0;
      } else if (arm.id === "bottom-right") {
        bx = width;
        by = height;
      }

      arm.points = [{ x: bx, y: by }];
      let currentX = bx;
      let currentY = by;

      // Project joints outwards in a default straight vector
      const dirX = arm.id === "top-center" ? 0 : (arm.id === "bottom-left" ? 1 : -1);
      const dirY = arm.id === "top-center" ? 1 : -1;

      arm.lengths.forEach((len) => {
        currentX += dirX * len * 0.707;
        currentY += dirY * len * 0.707;
        arm.points.push({ x: currentX, y: currentY });
      });
    };

    // Initialize points
    arms.forEach((arm) => initArmPoints(arm, canvas.width, canvas.height));

    let animationFrameId;

    // Smooth cursor trailing
    mouseRef.current.x = window.innerWidth / 2;
    mouseRef.current.y = window.innerHeight / 2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const primaryColor = isDarkMode ? "rgba(244, 244, 245, " : "rgba(24, 24, 27, ";
      const accentColor = isDarkMode ? "rgba(244, 244, 245, " : "rgba(24, 24, 27, ";

      // Interpolate target point
      const mouse = mouseRef.current;
      const mobile = isMobileView();
      const reducedMotion = prefersReducedMotion();

      if (reducedMotion) {
        mouse.active = false;
        mouse.x = canvas.width / 2;
        mouse.y = canvas.height / 2;
      } else if (mobile) {
        mouse.active = false;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const swingX = Math.min(canvas.width, canvas.height) * 0.22;
        const swingY = Math.min(canvas.width, canvas.height) * 0.06;
        const t = Date.now() * 0.0008;
        const targetX = cx + Math.sin(t) * swingX;
        const targetY = cy + Math.sin(t * 0.65) * swingY;
        mouse.x += (targetX - mouse.x) * 0.03;
        mouse.y += (targetY - mouse.y) * 0.03;
      } else if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      } else {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.15;
        const targetX = cx + Math.sin(Date.now() * 0.0006) * radius;
        const targetY = cy + Math.cos(Date.now() * 0.0008) * radius;
        mouse.x += (targetX - mouse.x) * 0.03;
        mouse.y += (targetY - mouse.y) * 0.03;
      }

      // Content safe-zone: the centered page column. HUD text is only drawn
      // in the side gutters so it never overlaps the hero copy.
      const safeWidth = Math.min(1180, canvas.width * 0.94);
      const safeLeft = (canvas.width - safeWidth) / 2;
      const safeRight = safeLeft + safeWidth;
      const inGutter = (x) => x < safeLeft || x > safeRight;

      // Draw faint encoder background grid
      ctx.strokeStyle = isDarkMode ? "rgba(255, 255, 255, 0.012)" : "rgba(0, 0, 0, 0.012)";
      ctx.lineWidth = 1;
      const step = 80;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Render each Robotic Arm using FABRIK IK Solver
      arms.forEach((arm) => {
        // 1. Resolve base anchor position dynamically (e.g., if screen resized)
        let bx = 0;
        let by = 0;

        if (arm.id === "bottom-left") {
          bx = 0;
          by = canvas.height;
        } else if (arm.id === "top-center") {
          bx = canvas.width / 2;
          by = 0;
        } else if (arm.id === "bottom-right") {
          bx = canvas.width;
          by = canvas.height;
        }

        // Keep points array synced if size changed drastically
        if (arm.points.length === 0) {
          initArmPoints(arm, canvas.width, canvas.height);
        }
        arm.points[0] = { x: bx, y: by };

        const pts = arm.points;
        const len = arm.lengths;
        const numJoints = len.length; // 4 segments, 5 joints

        // 2. FABRIK Inverse Kinematics Algorithm
        // Solve iteratively (4 iterations is perfect for smooth natural organic bending)
        const iterations = 4;
        const totalLength = len.reduce((a, b) => a + b, 0);
        const dx = mouse.x - bx;
        const dy = mouse.y - by;
        const targetDist = Math.sqrt(dx * dx + dy * dy);

        if (targetDist >= totalLength) {
          // Out of reach: Arm stretches in a perfectly straight line pointing to mouse
          const angle = Math.atan2(dy, dx);
          for (let i = 1; i <= numJoints; i++) {
            pts[i] = {
              x: pts[i - 1].x + len[i - 1] * Math.cos(angle),
              y: pts[i - 1].y + len[i - 1] * Math.sin(angle)
            };
          }
        } else {
          // In reach: Apply FABRIK forward & backward passes
          for (let iter = 0; iter < iterations; iter++) {
            // Forward pass (set tip to target, compute backwards)
            pts[numJoints] = { x: mouse.x, y: mouse.y };
            for (let i = numJoints - 1; i >= 0; i--) {
              const dx = pts[i].x - pts[i + 1].x;
              const dy = pts[i].y - pts[i + 1].y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const scale = len[i] / dist;
              pts[i] = {
                x: pts[i + 1].x + dx * scale,
                y: pts[i + 1].y + dy * scale
              };
            }

            // Backward pass (set base to anchor, compute forwards)
            pts[0] = { x: bx, y: by };
            for (let i = 1; i <= numJoints; i++) {
              const dx = pts[i].x - pts[i - 1].x;
              const dy = pts[i].y - pts[i - 1].y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const scale = len[i - 1] / dist;
              pts[i] = {
                x: pts[i - 1].x + dx * scale,
                y: pts[i - 1].y + dy * scale
              };
            }
          }
        }

        // 3. Draw the Robotic Arm
        const opacity = mouse.active ? 0.35 : 0.12;
        const armColor = arm.color === "accent" ? accentColor : primaryColor;

        // Draw structural link bones (connecting the joints)
        for (let i = 0; i < numJoints; i++) {
          const pStart = pts[i];
          const pEnd = pts[i + 1];
          const angle = Math.atan2(pEnd.y - pStart.y, pEnd.x - pStart.x);
          const perpAngle = angle + Math.PI / 2;

          // Segment thickness tapers as we go from base to tip
          const thickness = 6 - i * 1.2; 
          const shellOffset = 5 - i * 0.8;

          // Draw main core link bone
          ctx.strokeStyle = `${armColor}${opacity * 0.45})`;
          ctx.lineWidth = thickness;
          ctx.beginPath();
          ctx.moveTo(pStart.x, pStart.y);
          ctx.lineTo(pEnd.x, pEnd.y);
          ctx.stroke();

          // Draw outer double outlines (aluminum link chassis)
          ctx.strokeStyle = `${armColor}${opacity * 0.18})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pStart.x + Math.cos(perpAngle) * shellOffset, pStart.y + Math.sin(perpAngle) * shellOffset);
          ctx.lineTo(pEnd.x + Math.cos(perpAngle) * shellOffset, pEnd.y + Math.sin(perpAngle) * shellOffset);
          ctx.moveTo(pStart.x - Math.cos(perpAngle) * shellOffset, pStart.y - Math.sin(perpAngle) * shellOffset);
          ctx.lineTo(pEnd.x - Math.cos(perpAngle) * shellOffset, pEnd.y - Math.sin(perpAngle) * shellOffset);
          ctx.stroke();

          // Draw inner diagonal trusses (engineering details)
          ctx.strokeStyle = `${armColor}${opacity * 0.12})`;
          ctx.beginPath();
          const numTrusses = 4;
          for (let j = 0; j <= numTrusses; j++) {
            const t = j / numTrusses;
            const tx = pStart.x + (pEnd.x - pStart.x) * t;
            const ty = pStart.y + (pEnd.y - pStart.y) * t;
            const side = j % 2 === 0 ? shellOffset : -shellOffset;
            ctx.lineTo(tx + Math.cos(perpAngle) * side, ty + Math.sin(perpAngle) * side);
          }
          ctx.stroke();
        }

        // Draw joint caps (mount encoder circles)
        for (let i = 0; i <= numJoints; i++) {
          const pt = pts[i];
          const radius = i === 0 ? 18 : (i === numJoints ? 6 : 10 - i * 1.5);
          
          ctx.fillStyle = isDarkMode ? "rgba(24, 24, 27, 0.95)" : "rgba(244, 244, 245, 0.95)";
          ctx.strokeStyle = `${armColor}${opacity * 0.75})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Center pin
          ctx.fillStyle = `${armColor}${opacity * 0.8})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }

        // 4. Draw Claw crosshairs on Tip
        const tip = pts[numJoints];
        ctx.strokeStyle = `${armColor}${opacity * 0.75})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 6, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(tip.x - 12, tip.y);
        ctx.lineTo(tip.x + 12, tip.y);
        ctx.moveTo(tip.x, tip.y - 12);
        ctx.lineTo(tip.x, tip.y + 12);
        ctx.stroke();
      });

      // Draw cursor coordinate tag — only when the cursor is in a gutter
      if (!reducedMotion && mouse.active && inGutter(mouse.x)) {
        ctx.fillStyle = `${accentColor}0.85)`;
        ctx.font = "9px monospace";
        const onLeft = mouse.x <= safeLeft;
        const tagX = onLeft ? mouse.x - 150 : mouse.x + 18;
        ctx.fillText(`CTRL_TARGET: [${mouse.x.toFixed(0)}, ${mouse.y.toFixed(0)}]`, tagX, mouse.y - 18);
      }

      if (reducedMotion) return;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const onResizeStatic = () => {
      resizeCanvas();
      if (prefersReducedMotion()) draw();
    };

    if (prefersReducedMotion()) {
      window.removeEventListener("resize", resizeCanvas);
      window.addEventListener("resize", onResizeStatic);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("resize", onResizeStatic);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="kinematic-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: -1, // Sits perfectly behind all copy, nav, and widgets!
      }}
    />
  );
}

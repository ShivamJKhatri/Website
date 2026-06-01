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

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track Mouse
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // Track globally on window so it follows mouse anywhere on the screen
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

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

      // Interpolate mouse
      const mouse = mouseRef.current;
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      } else {
        // Orbit center of screen ambiently
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.15;
        const targetX = cx + Math.sin(Date.now() * 0.0006) * radius;
        const targetY = cy + Math.cos(Date.now() * 0.0008) * radius;
        mouse.x += (targetX - mouse.x) * 0.03;
        mouse.y += (targetY - mouse.y) * 0.03;
      }

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

        // 5. Draw live multi-angle HUD readout (Recruiter wow factor!)
        if (mouse.active && targetDist < totalLength + 100) {
          ctx.fillStyle = `${armColor}0.65)`;
          ctx.font = "8px monospace";

          // Calculate joint relative angles
          const angles = [];
          for (let i = 0; i < numJoints; i++) {
            const p0 = pts[i];
            const p1 = pts[i + 1];
            let ang = Math.atan2(p1.y - p0.y, p1.x - p0.x) * (180 / Math.PI);
            if (ang < 0) ang += 360;
            angles.push(ang.toFixed(0));
          }

          let textX = tip.x + 20;
          let textY = tip.y - 10;

          // Adjust HUD placement quadrant to prevent overlaps
          if (arm.id === "bottom-right") {
            textX = tip.x - 125;
          } else if (arm.id === "top-center") {
            textY = tip.y + 24;
          }

          ctx.fillText(`[${arm.label}]`, textX, textY);
          ctx.fillText(`θ: [${angles.join("°, ")}°]`, textX, textY + 10);
          ctx.fillText(`EFF: [${tip.x.toFixed(0)}, ${tip.y.toFixed(0)}]`, textX, textY + 20);
        }
      });

      // 6. Draw central cursor coordinate tag
      if (mouse.active) {
        ctx.fillStyle = `${accentColor}0.85)`;
        ctx.font = "9px monospace";
        ctx.fillText(`CTRL_TARGET: [${mouse.x.toFixed(0)}, ${mouse.y.toFixed(0)}]`, mouse.x + 18, mouse.y - 18);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="kinematic-canvas"
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

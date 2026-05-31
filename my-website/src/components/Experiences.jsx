import { useState, useRef, useCallback, useEffect } from "react";

const experiences = [
  {
    id: 1,
    role: "Robotics & Control Systems Intern",
    company: "Tesla",
    location: "Palo Alto, CA",
    period: "Jan 2026 — Apr 2026",
    description: [
      "Developed and optimized embedded C++ firmware for next-generation battery management systems, improving telemetry reporting speed by 15%.",
      "Designed and calibrated high-frequency PID control loops for thermal regulation fixtures, resulting in more stable voltage testing environments.",
      "Collaborated with mechanical and validation teams to execute hardware-in-the-loop (HIL) testing, troubleshooting electrical noise and sensor calibration issues."
    ],
    tags: ["C++", "Embedded C", "PID Controls", "RTOS", "HIL Testing"]
  },
  {
    id: 2,
    role: "Autonomous Systems Software Intern",
    company: "Clearpath Robotics",
    location: "Waterloo, ON",
    period: "May 2025 — Aug 2025",
    description: [
      "Integrated and tuned the ROS2 navigation stack for heavy-payload autonomous mobile robots (AMRs) in industrial warehouse environments.",
      "Developed robust LiDAR and camera sensor fusion nodes in Python, reducing obstacle detection latency and improving reliability in dusty conditions.",
      "Built automated Gazebo simulation test suites to validate corner-case localization behaviors, saving engineering hours on physical testing."
    ],
    tags: ["ROS2", "Python", "C++", "LiDAR", "Gazebo", "Linux"]
  },
  {
    id: 3,
    role: "Mechatronics Research Assistant",
    company: "University of Waterloo",
    location: "Waterloo, ON",
    period: "Sep 2024 — Dec 2024",
    description: [
      "Designed and rapid-prototyped customized mechanical end-effectors for multi-axis robotic arms using SolidWorks and 3D printing.",
      "Programmed forward and inverse kinematic solvers in MATLAB to simulate robot trajectory planning and collision avoidance.",
      "Analyzed actuator torque telemetry from physical test runs, drafting a paper detailing mechanical efficiency improvements."
    ],
    tags: ["SolidWorks", "MATLAB", "Kinematics", "3D Printing", "Data Analysis"]
  }
];

/* ── 3D Tilt hook for Experience Cards ── */
function useTilt(ref) {
  const [style, setStyle] = useState({
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
  });
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

      // Subtle tilt: max ±5 degrees for ultra-minimalist feel
      const rotateY = ((x - midX) / midX) * 5;
      const rotateX = ((midY - y) / midY) * 5;

      const shadowX = -((x - midX) / midX) * 12;
      const shadowY = -((y - midY) / midY) * 12;

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`,
        boxShadow: `${shadowX}px ${shadowY}px 25px rgba(0, 0, 0, 0.35), 0 0 20px rgba(var(--glow-rgb), 0.05)`
      });
    });
  }, [ref]);

  const handleLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
    });
  }, []);

  return { style, handleMove, handleLeave };
}

/* ── Scroll Reveal hook ── */
function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function ExperienceCard({ exp, index }) {
  const cardRef = useRef(null);
  const { style: tiltStyle, handleMove, handleLeave } = useTilt(cardRef);
  const { ref: revealRef, visible } = useScrollReveal();

  return (
    <div
      ref={revealRef}
      className={`exp-card-wrapper ${visible ? "exp-card-wrapper--visible" : ""}`}
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <div className="exp-timeline-node">
        <div className="exp-node-dot" />
        <div className="exp-node-line" />
      </div>

      <article
        ref={cardRef}
        className="exp-card"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={tiltStyle}
      >
        <div className="exp-card-header">
          <div>
            <h3 className="exp-role">{exp.role}</h3>
            <div className="exp-company-group">
              <span className="exp-company">{exp.company}</span>
              <span className="exp-location">{exp.location}</span>
            </div>
          </div>
          <span className="exp-period">{exp.period}</span>
        </div>

        <ul className="exp-details">
          {exp.description.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>

        <div className="exp-tags">
          {exp.tags.map((tag) => (
            <span key={tag} className="exp-tag">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}

export default function Experiences() {
  return (
    <section className="exp-section" id="experiences">
      <div className="exp-inner">
        <p className="exp-label">My Journey</p>
        <h2 className="exp-heading">Experience</h2>
        <div className="exp-divider" />

        <div className="exp-timeline">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

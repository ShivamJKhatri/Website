import { useState, useRef, useCallback, useEffect } from "react";
import sortingRobotImg from "../assets/project_sorting_robot.png";
import erpDocsImg from "../assets/project_erp_docs.png";
import vexNotebookImg from "../assets/project_vex_notebook.png";

const projects = [
  {
    id: 1,
    title: "Autonomous Poker Robot",
    description:
      "Designed and programmed a fully autonomous robot capable of identifying, sorting, and stacking objects by color and size in real time. Implemented PID control loops for precise motor actuation and integrated a computer vision pipeline using OpenCV for object classification.",
    achievement: { icon: "🏆", label: "1st Place — Regional" },
    tags: ["Robotics", "CV", "Embedded"],
    image: sortingRobotImg,
    github: "#",
    live: "#",
    languages: [
      { name: "Python", pct: 45, color: "#3572A5" },
      { name: "C++", pct: 30, color: "#f34b7d" },
      { name: "Makefile", pct: 15, color: "#427819" },
      { name: "Other", pct: 10, color: "#888" },
    ],
  },
  {
    id: 2,
    title: "ERP Documentation System",
    description:
      "Built a scalable documentation framework to transition institutional trade knowledge into formal engineering SOPs for a custom van manufacturing company. Produced work instructions, BOMs, and 2D schematics at one complete package per 48 hours.",
    achievement: { icon: "📄", label: "40+ SOPs Produced" },
    tags: ["Manufacturing", "CAD", "ERP"],
    image: erpDocsImg,
    github: null,
    live: "#",
    languages: [
      { name: "Fusion 360", pct: 55, color: "#f5821f" },
      { name: "ClickUp", pct: 30, color: "#7b68ee" },
      { name: "CSV / BOM", pct: 15, color: "#4caf7d" },
    ],
  },
  {
    id: 3,
    title: "VEX Robotics Engineering Notebook",
    description:
      "Served as documentation lead for three consecutive seasons, producing a 300+ page engineering notebook. Covered mechanism design, iterative testing, match strategy, and post-competition retrospectives.",
    achievement: { icon: "📘", label: "300+ Page Notebook" },
    tags: ["Documentation", "Mechanical", "Strategy"],
    image: vexNotebookImg,
    github: null,
    live: null,
    languages: [
      { name: "CAD", pct: 40, color: "#00aacc" },
      { name: "Technical Writing", pct: 40, color: "#aaa" },
      { name: "Data Analysis", pct: 20, color: "#e8c44a" },
    ],
  },
];

/* ── 3D Tilt + Spotlight hook ── */
function useTilt(ref) {
  const [style, setStyle] = useState({
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
  });
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

      // Tilt: max ±10 degrees for enhanced 3D
      const rotateY = ((x - midX) / midX) * 10;
      const rotateX = ((midY - y) / midY) * 10;

      // Dynamic shadow: shifts in the opposite direction of the tilt
      const shadowX = -((x - midX) / midX) * 20;
      const shadowY = -((y - midY) / midY) * 20;

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`,
        boxShadow: `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.5), 0 0 35px rgba(var(--glow-rgb), 0.1)`,
      });

      // Spotlight: radial gradient follows cursor
      setSpotStyle({
        opacity: 1,
        background: `radial-gradient(circle 280px at ${x}px ${y}px, rgba(var(--spotlight-rgb), 0.08), transparent 70%)`,
      });
    });
  }, [ref]);

  const handleLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
    });
    setSpotStyle({ opacity: 0 });
  }, []);

  return { style, spotStyle, handleMove, handleLeave };
}

/* ── Scroll reveal hook ── */
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
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ── Sub-components ── */
function LanguageBar({ languages }) {
  return (
    <div className="proj-languages">
      <div className="proj-lang-bar">
        {languages.map((l) => (
          <div
            key={l.name}
            className="proj-lang-segment"
            style={{ flex: l.pct, background: l.color }}
          />
        ))}
      </div>
      <div className="proj-lang-labels">
        {languages.map((l) => (
          <span key={l.name} className="proj-lang-label">
            <span className="proj-lang-dot" style={{ background: l.color }} />
            {l.name} {l.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const { style: tiltStyle, spotStyle, handleMove, handleLeave } = useTilt(cardRef);
  const { ref: revealRef, visible } = useScrollReveal();

  return (
    <div
      ref={revealRef}
      className={`proj-card-wrapper ${visible ? "proj-card-wrapper--visible" : ""}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <article
        ref={cardRef}
        className="proj-card"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={tiltStyle}
      >
        {/* Spotlight overlay */}
        <div className="proj-card-spotlight" style={spotStyle} />

        {/* Glowing border on hover */}
        <div className="proj-card-glow" />

        {/* Image */}
        <div className="proj-card-image">
          <img src={project.image} alt={project.title} />
        </div>

        {/* Content */}
        <div className="proj-card-content">
          {/* Title + badge */}
          <div className="proj-card-header">
            <h3 className="proj-card-title">{project.title}</h3>
            <span className="proj-card-badge">
              <span className="proj-card-badge-icon">{project.achievement.icon}</span>
              {project.achievement.label}
            </span>
          </div>

          {/* Description */}
          <p className="proj-card-desc">{project.description}</p>

          {/* Language bar */}
          <LanguageBar languages={project.languages} />

          {/* Footer: tags + links */}
          <div className="proj-card-footer">
            <div className="proj-card-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="proj-card-tag">{tag}</span>
              ))}
            </div>
            <div className="proj-card-links">
              {project.github && (
                <a href={project.github} aria-label="GitHub" className="proj-card-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              )}
              {project.live && (
                <a href={project.live} aria-label="Live project" className="proj-card-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function Projects() {
  return (
    <section className="proj-section" id="projects">
      <div className="proj-inner">
        <p className="proj-label">Selected work</p>
        <h2 className="proj-heading">Projects</h2>
        <div className="proj-divider" />

        <div className="proj-stack">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState, useRef, useCallback, useEffect } from "react";
import sortingRobotImg from "../assets/project_sorting_robot.png";
import erpDocsImg from "../assets/project_erp_docs.png";
import vexNotebookImg from "../assets/project_vex_notebook.png";

import { FaGithub } from "react-icons/fa";
import { ExternalLink } from "lucide-react";

import { useTilt } from "../hooks/useTilt";
import { useScrollReveal } from "../hooks/useScrollReveal";

const projects = [
  {
    id: 1,
    title: "StabiliKnee - Active Knee Brace",
    description:
      "Designed and created an active knee brace which used an IMU sensor and a Flex Bend sensor in order to detect dangerous knee movements only 300ms within happening. I also used a servo motor to react to the detection and trigger an opposing force to support the knee. It resutled in a 70% reduction in simulated knee dislocations. ",
    achievement: { icon: "🏆", label: "3rd - Canadas Largest Hardware Hackathon" },
    tags: ["Embedded Systems", "Arduino", "IMU" , "Sensor Integration"],
    image: sortingRobotImg,
    github: "https://github.com/ShivamJKhatri/StabiliKnee",
    live: "https://devpost.com/software/stabiliknee",
    languages: [
      { name: "C++", pct: 30, color: "#e8c44a" },

    ],
  },
  {
    id: 2,
    title: "Autonomous Page Navigator",
    description:
      "Created an autonomous page naivgation system which allowed users to enter in simple prompts like “go to math 135 assignments page”. The Gemini API then parses the information received in a JSON file and then sequentially executes multiple commands using DOM Manipulation in order to reroute the user to that portion of the website within just a few seconds",
    achievement: { icon: "📄", label: "Redirection time < 3ms" },
    tags: ["Javascript", "DOM Manipulation", "API Integration" , "AI"],
    image: erpDocsImg,
    github: "https://github.com/ShivamJKhatri/learn-ai",
    live: null,
    languages: [
      { name: "JavaScript", pct: 79.2, color: "#f5821f" },
      { name: "CSS", pct: 15.7, color: "#7b68ee" },
      { name: "HTML", pct: 5.1, color: "#4caf7d" },
    ],
  },
  {
    id: 3,
    title: "Autonomous Poker Bot",
    description:
      "Created an autonomous poker bot which used 5 sensors, in total, to deal cards one by one, for up to 9 players. It is also capable of tracking bets, and folds, while using a card detection system to allow players to raise, call and fold. Acheived ±5% placement accuracy at 20 cm range and 95% single-card dispense reliability across 50 full-game test",
    achievement: { icon: "📘", label: "95% Single-Card Dispense Reliability" },
    tags: ["Sensor Integration", "Firmware", "Documentation", "Mechanical", "Strategy"],
    image: vexNotebookImg,
    github: null,
    live: null,
    languages: [
      { name: "C++", pct: 100, color: "#e8c44a" },
    ],
  },
];

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
  const { style: tiltStyle, spotStyle, handleMove, handleLeave } = useTilt(cardRef, { maxDeg: 10, maxShadow: 20, scale: 1.03 });  const { ref: revealRef, visible } = useScrollReveal();

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
                  <FaGithub size={16} />
                </a>
              )}
              {project.live && (
                <a href={project.live} aria-label="Live project" className="proj-card-link">
                  <ExternalLink size={16} strokeWidth={1.5} />
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
        {/* <div className="proj-divider" /> */}

        <div className="proj-stack">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

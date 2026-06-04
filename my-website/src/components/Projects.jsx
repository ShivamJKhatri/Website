import { useRef } from "react";
import sortingRobotImg from "../assets/project_sorting_robot.png";
import erpDocsImg from "../assets/project_erp_docs.png";
import vexNotebookImg from "../assets/project_vex_notebook.png";

import { FaGithub } from "react-icons/fa";
import { ExternalLink, Trophy, Zap, Target } from "lucide-react";

import { useTilt } from "../hooks/useTilt";
import { useScrollReveal } from "../hooks/useScrollReveal";

const ACHIEVEMENT_ICONS = {
  trophy: Trophy,
  zap: Zap,
  target: Target,
};

/* One color per label — no overlap between language % bars and stack bars */
const BAR_COLORS = {
  JavaScript: "#f0db4f",
  CSS: "#2965f1",
  HTML: "#e44d26",
  "C++": "#4a9fd4",
  ESP32: "#14b8a6",
  IMU: "#a855f7",
  Firmware: "#f97316",
  Mechanical: "#78716c",
};

const projects = [
  {
    id: 1,
    title: "StabiliKnee - Active Knee Brace",
    description:
      "Designed and created an active knee brace which used an IMU sensor and a Flex Bend sensor in order to detect dangerous knee movements only 300ms within happening. I also used a servo motor to react to the detection and trigger an opposing force to support the knee. It resutled in a 70% reduction in simulated knee dislocations. ",
    achievement: {
      icon: "trophy",
      label: "3rd · Canada's Largest Hardware Hackathon",
    },
    stack: [
      { name: "C++", color: BAR_COLORS["C++"] },
      { name: "ESP32", color: BAR_COLORS.ESP32 },
      { name: "IMU", color: BAR_COLORS.IMU },
    ],
    tags: ["Embedded Systems", "Arduino", "IMU", "Sensor Integration"],
    image: sortingRobotImg,
    github: "https://github.com/ShivamJKhatri/StabiliKnee",
    live: "https://devpost.com/software/stabiliknee",
  },
  {
    id: 2,
    title: "Autonomous Page Navigator",
    description:
      "Created an autonomous page naivgation system which allowed users to enter in simple prompts like “go to math 135 assignments page”. The Gemini API then parses the information received in a JSON file and then sequentially executes multiple commands using DOM Manipulation in order to reroute the user to that portion of the website within just a few seconds",
    achievement: { icon: "zap", label: "Sub-3s page redirection" },
    languages: [
      { name: "JavaScript", pct: 79.2, color: BAR_COLORS.JavaScript },
      { name: "CSS", pct: 15.7, color: BAR_COLORS.CSS },
      { name: "HTML", pct: 5.1, color: BAR_COLORS.HTML },
    ],
    tags: ["Javascript", "DOM Manipulation", "API Integration", "AI"],
    image: erpDocsImg,
    github: "https://github.com/ShivamJKhatri/learn-ai",
    live: null,
  },
  {
    id: 3,
    title: "Autonomous Poker Bot",
    description:
      "Created an autonomous poker bot which used 5 sensors, in total, to deal cards one by one, for up to 9 players. It is also capable of tracking bets, and folds, while using a card detection system to allow players to raise, call and fold. Acheived ±5% placement accuracy at 20 cm range and 95% single-card dispense reliability across 50 full-game test",
    achievement: { icon: "target", label: "95% dispense reliability" },
    stack: [
      { name: "C++", color: BAR_COLORS["C++"] },
      { name: "Firmware", color: BAR_COLORS.Firmware },
      { name: "Mechanical", color: BAR_COLORS.Mechanical },
    ],
    tags: ["Sensor Integration", "Firmware", "Documentation", "Mechanical", "Strategy"],
    image: vexNotebookImg,
    github: null,
    live: null,
  },
];

function StackBar({ stack }) {
  if (!stack?.length) return null;

  return (
    <div className="proj-languages">
      <div className="proj-lang-bar">
        {stack.map((item) => (
          <div
            key={item.name}
            className="proj-lang-segment"
            style={{ flex: 1, background: item.color }}
          />
        ))}
      </div>
      <div className="proj-lang-labels">
        {stack.map((item) => (
          <span key={item.name} className="proj-lang-label">
            <span className="proj-lang-dot" style={{ background: item.color }} />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function LanguageBar({ languages }) {
  if (!languages || languages.length < 2) return null;

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

function AchievementBadge({ achievement }) {
  const Icon = ACHIEVEMENT_ICONS[achievement.icon];
  if (!Icon) return null;

  return (
    <span className="proj-card-badge">
      <Icon size={13} strokeWidth={2} className="proj-card-badge-icon" aria-hidden="true" />
      {achievement.label}
    </span>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const { style: tiltStyle, spotStyle, handleMove, handleLeave } = useTilt(cardRef, {
    maxDeg: 10,
    maxShadow: 20,
    scale: 1.03,
  });
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
        <div className="proj-card-spotlight" style={spotStyle} />
        <div className="proj-card-glow" />

        <div className="proj-card-image">
          <img src={project.image} alt={project.title} />
        </div>

        <div className="proj-card-content">
          <div className="proj-card-header">
            <h3 className="proj-card-title">{project.title}</h3>
            <AchievementBadge achievement={project.achievement} />
          </div>

          <p className="proj-card-desc">{project.description}</p>

          <StackBar stack={project.stack} />
          <LanguageBar languages={project.languages} />

          <div className="proj-card-footer">
            <div className="proj-card-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="proj-card-tag">
                  {tag}
                </span>
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

        <div className="proj-stack">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

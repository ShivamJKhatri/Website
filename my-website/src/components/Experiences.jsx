import { useState, useRef, useCallback, useEffect } from "react";

import { useTilt } from "../hooks/useTilt";
import { useScrollReveal } from "../hooks/useScrollReveal";

const experiences = [
  {
    id: 1,
    role: "Firmware Engineer",
    company: "Electrium Mobility",
    location: "Waterloo, ON",
    period: "Sep 2025 — Jan 2026",
    description: [
      "Created an electric bike that used a custom ESP32-based control board to interface with a VESC motor controller, enabling precise speed and torque control for a smooth riding experience",
      "Bridged a UART integration layer between ESP32 and VESC, enabling control of 10+ motor parameters",
      "Developed a TFT dashboard displaying real-time telemetry data including speed, and battery percentage"
    ],
    tags: ["C++", "Embedded C", "ESP32", "VESC", "Motor Control", "Firmware"]
  },
  {
    id: 2,
    role: "Front End Developer",
    company: "STEM Unites",
    location: null,
    period: "May 2025 — Aug 2025",
    description: [
      "Created a website to showcase the work of STEM Unites and increase thier reach to students across the world",
      "Increased member engagement by 25% by redesigning the front end and implementing optimized components using JavaScript, HTML, and CSS while using Git version control to allow for seamless collaboration",
      " Improved page load performance by 35% by refactoring front-end and back-end code, debugging performance bottlenecks, and implementing modular components"
    ],
    tags: ["JavaScript", "HTML", "CSS", "Git" , "Performance Optimization"]
  },
  {
    id: 3,
    role: "Engineering Team Lead",
    company: "VEX Robotics",
    location: null,
    period: "Sep 2022 — Apr 2025",
    description: [
      "Created a robot that was capable of autonomously navigating a field, picking up objects, and placing them in designated zones using a combination of mechanical design and sensor integration",
      "Increased scoring by 14% by designing and optimizing motion algorithms using PID and iterative testing cycles",
      " Won 4 Design Awards by creating a 300+ page documentation file, 3  time semi-finalists, and 4th in Alberta"
    ],
    tags: ["Fusion 360", "C++", "Documentation", "Mechanical Design", "PID Control"]
  }
];

function ExperienceCard({ exp, index }) {
  const cardRef = useRef(null);
  const { style: tiltStyle, handleMove, handleLeave } = useTilt(cardRef, { maxDeg: 5, maxShadow: 12, scale: 1.015 });  const { ref: revealRef, visible } = useScrollReveal();

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
        {/* <div className="exp-divider" /> */}

        <div className="exp-timeline">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

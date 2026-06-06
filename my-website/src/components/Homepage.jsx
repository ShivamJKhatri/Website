import { useEffect, useState } from "react";
import KinematicLinkage from "./KinematicLinkage.jsx";
import { Download, Briefcase, MapPin, GraduationCap } from "lucide-react";
import { downloadResume, RESUME_PATH, RESUME_FILENAME } from "../utils/downloadResume.js";

export default function Homepage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Smooth reveal entrance
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-viewport-wrapper" style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
      <KinematicLinkage />

      <main className={`home-container ${visible ? "home-container--visible" : ""}`}>
      {/* 1. Status Capsule */}
      <div className="home-status-wrapper">
        <div className="home-status-capsule">
          <span className="home-status-dot" />
          <span className="home-status-text">Open to internships · Winter 2027</span>
        </div>
      </div>

      {/* 2. Main Title */}
      <h1 className="home-title">
        Shivam <br />
        Khatri<span className="home-title-dot">.</span>
      </h1>

      {/* 3. Description Sub-headline */}
      <p className="home-subheadline">
        Mechatronics Engineering student at UWaterloo. I love new tech and building cool things.
      </p>

      {/* 4. Call to Action Buttons */}
      <div className="home-cta-group">
        <a href="/projects" className="home-btn home-btn--primary">
          View my work
        </a>
        <a
          href={RESUME_PATH}
          download={RESUME_FILENAME}
          onClick={downloadResume}
          className="home-btn home-btn--outline"
          aria-label="Download resume PDF"
        >
          <Download size={16} strokeWidth={2} className="home-btn-icon" />
          Resume
        </a>
      </div>

      {/* 5. Statistics Grid Row */}
      <div className="home-stats-row">
        <div className="home-stat-item">
          <span className="home-stat-num">2+ Yrs</span>
          <span className="home-stat-label">Software and Hardware Development</span>
        </div>
        <div className="home-stat-item">
          <span className="home-stat-num">Top 4</span>
          <span className="home-stat-label">Hackathon and Robotics Placements</span>
        </div>
        <div className="home-stat-item">
          <span className="home-stat-num">5</span>
          <span className="home-stat-label">Mechatronics Projects</span>
        </div>
        <div className="home-stat-item">
          <span className="home-stat-num">4</span>
          <span className="home-stat-label">Robotics Awards</span>
        </div>
      </div>

      {/* 6. Detailed Intro & Skills Matrix */}
      <div className="home-details-section">
        <div className="home-intro-col">
          <p>
            I'm Shivam, a Waterloo Eng student interested in the intersection of mechanical systems and software. Whether you want to connect, collaborate, or just talk about something interesting, feel free to reach out.
 
          </p>
        </div>
        <div className="home-skills-col">
          <div className="home-skills-grid">
            <span className="home-skill-tag">Python</span>
            <span className="home-skill-tag">React</span>
            <span className="home-skill-tag">C++</span>
            <span className="home-skill-tag">Javascript</span>
            <span className="home-skill-tag">HTML/CSS</span>
            <span className="home-skill-tag">Solidworks</span>
            <span className="home-skill-tag">Embedded Systems</span>

          </div>
        </div>
      </div>

      {/* 7. Footer Info Bar */}
      <footer className="home-footer-info">
        <div className="home-footer-segment home-footer-segment--label">
          <span>CURRENTLY</span>
        </div>
        
        <div className="home-footer-segment">
          <span className="home-org-badge home-org-badge--yama" aria-hidden="true">YV</span>
          <Briefcase size={14} strokeWidth={1.75} className="home-footer-icon" />
          <span>Eng. Intern @ Yama Vans</span>
        </div>

        <div className="home-footer-segment">
          <MapPin size={14} strokeWidth={1.75} className="home-footer-icon" />
          <span>Calgary, AB</span>
        </div>

        <div className="home-footer-segment">
          <span className="home-org-badge home-org-badge--uw" aria-hidden="true">UW</span>
          <GraduationCap size={14} strokeWidth={1.75} className="home-footer-icon" />
          <span>UWaterloo · 2A Mechatronics</span>
        </div>
      </footer>
    </main>
  </div>
  );
}
import { useEffect, useState } from "react";
// import LidarScanner from "./LidarScanner.jsx";
import KinematicLinkage from "./KinematicLinkage.jsx";
import Resume from "../assets/Resume.pdf";

export default function Homepage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Smooth reveal entrance
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-viewport-wrapper" style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
      {/* Premium 3D LiDAR Scanner Background (Preserved but commented out) */}
      {/* <LidarScanner /> */}

      {/* Live 3D-styled Robotic Kinematic Linkage Background */}
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
        <a href={Resume} download className="home-btn home-btn--outline">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="home-btn-icon"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
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
            I'm a builder focused on the intersection of mechanical systems and
            software. Currently interning at Yama Vans, turning trade knowledge
            into formal engineering documentation and feeding it into a live ERP
            system.
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
          <svg className="home-footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <span>Eng. Intern @ Yama Vans</span>
        </div>

        <div className="home-footer-segment">
          <svg className="home-footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Calgary, AB</span>
        </div>

        <div className="home-footer-segment">
          <svg className="home-footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2.5 3 6 3s6-1 6-3v-5" />
          </svg>
          <span>UWaterloo · 2A Mechatronics</span>
        </div>
      </footer>
    </main>
  </div>
  );
}
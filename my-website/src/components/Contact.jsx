import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowUpRight, Download, Briefcase } from "lucide-react";
import { FaLinkedinIn, FaGithub, FaRegEnvelope } from "react-icons/fa";

import { useTilt } from "../hooks/useTilt";
import { useScrollReveal } from "../hooks/useScrollReveal";

import resumePdf from "../assets/Resume.pdf";



export default function Contact() {
  const emailCardRef = useRef(null);
  const linkedinCardRef = useRef(null);
  const githubCardRef = useRef(null);

  const emailTilt = useTilt(emailCardRef, { maxDeg: 3, maxShadow: 8, scale: 1.01 });  const linkedinTilt = useTilt(linkedinCardRef, { maxDeg: 3, maxShadow: 8, scale: 1.01 });
  const githubTilt = useTilt(githubCardRef, { maxDeg: 3, maxShadow: 8, scale: 1.01 });

  const { ref: revealRef, visible } = useScrollReveal();

  return (
    <section className="contact-section" id="contact">
      <div 
        ref={revealRef}
        className={`contact-inner ${visible ? "contact-inner--visible" : ""}`}
      >
        <p className="contact-label">Get in touch</p>
        <h2 className="contact-heading">Contact</h2>
        <div className="contact-divider" />

        <p className="contact-desc">
          I'm always open to new opportunities, collaborations, or just a good
          conversation about engineering and tech. Drop me a line and I'll get
          back to you.
        </p>

        {/* Status Badges */}
        <div className="contact-status-group">
          <div className="contact-status-capsule">
            <span className="contact-status-dot" />
            <span className="contact-status-text">Open to internships · Winter 2027</span>
          </div>

          <div className="contact-current-job">
            
            <Briefcase size={16} strokeWidth={1.75} className="contact-job-icon" />
            <span>Currently @ Yama Vans · Calgary, AB</span>
          </div>
        </div>

        {/* Contact Channels */}
        <div className="contact-channels">
          {/* Email Card */}
          <a 
            href="mailto:sjkhatri182@gmail.com" 
            className="contact-card-link-wrapper"
          >
            <article
              ref={emailCardRef}
              className="contact-card"
              onMouseMove={emailTilt.handleMove}
              onMouseLeave={emailTilt.handleLeave}
              style={emailTilt.style}
            >
              <div className="contact-card-left">
                <div className="contact-icon-box">
                  <FaRegEnvelope size={18} />
                </div>
                <div className="contact-card-info">
                  <span className="contact-card-label">Email</span>
                  <span className="contact-card-val">sjkhatri182@gmail.com</span>
                </div>
              </div>
              <span className="contact-card-note">Replies within 24h</span>
            </article>
          </a>

          {/* LinkedIn Card */}
          <a 
            href="https://www.linkedin.com/in/khatri-shivam/" 
            target="_blank" 
            rel="noreferrer"
            className="contact-card-link-wrapper"
          >
            <article
              ref={linkedinCardRef}
              className="contact-card"
              onMouseMove={linkedinTilt.handleMove}
              onMouseLeave={linkedinTilt.handleLeave}
              style={linkedinTilt.style}
            >
              <div className="contact-card-left">
                <div className="contact-icon-box">
                  <FaLinkedinIn size={18} />
                </div>
                <div className="contact-card-info">
                  <span className="contact-card-label">LinkedIn</span>
                  <span className="contact-card-val">Shivam Khatri</span>
                </div>
              </div>
              <div className="contact-card-arrow">
                <ArrowUpRight size={18} strokeWidth={1.75} />
              </div>
            </article>
          </a>

          {/* GitHub Card */}
          <a 
            href="https://github.com/ShivamJKhatri" 
            target="_blank" 
            rel="noreferrer"
            className="contact-card-link-wrapper"
          >
            <article
              ref={githubCardRef}
              className="contact-card"
              onMouseMove={githubTilt.handleMove}
              onMouseLeave={githubTilt.handleLeave}
              style={githubTilt.style}
            >
              <div className="contact-card-left">
                <div className="contact-icon-box">
                  <FaGithub size={18} />
                </div>
                <div className="contact-card-info">
                  <span className="contact-card-label">GitHub</span>
                  <span className="contact-card-val">@ShivamJKhatri</span>
                </div>
              </div>
              <div className="contact-card-arrow">
                <ArrowUpRight size={18} strokeWidth={1.75} />
              </div>
            </article>
          </a>
        </div>

        {/* Download Resume Button */}
        <a
          href={resumePdf}
          download="Shivam Khatri - Resume.pdf"
          className="contact-resume-btn"
        >
          <Download size={18} strokeWidth={2} className="contact-resume-icon" />
          Download resume
        </a>
      </div>
    </section>
  );
}

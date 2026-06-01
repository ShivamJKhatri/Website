import { useState, useRef, useCallback, useEffect } from "react";
import resumePdf from "../assets/Resume.pdf";

/* ── 3D Tilt hook for Contact Cards ── */
function useTilt(ref) {
  const [style, setStyle] = useState({
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)"
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

      // Subtle tilt: max ±3 degrees for ultra-minimal contact cards
      const rotateY = ((x - midX) / midX) * 3;
      const rotateX = ((midY - y) / midY) * 3;

      const shadowX = -((x - midX) / midX) * 8;
      const shadowY = -((y - midY) / midY) * 8;

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`,
        boxShadow: `${shadowX}px ${shadowY}px 20px rgba(0, 0, 0, 0.35), 0 0 15px rgba(var(--glow-rgb), 0.04)`
      });
    });
  }, [ref]);

  const handleLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)"
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

export default function Contact() {
  const emailCardRef = useRef(null);
  const linkedinCardRef = useRef(null);
  const githubCardRef = useRef(null);

  const emailTilt = useTilt(emailCardRef);
  const linkedinTilt = useTilt(linkedinCardRef);
  const githubTilt = useTilt(githubCardRef);

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
            <svg 
              className="contact-job-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </div>
                <div className="contact-card-info">
                  <span className="contact-card-label">LinkedIn</span>
                  <span className="contact-card-val">Shivam Khatri</span>
                </div>
              </div>
              <div className="contact-card-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7,7 17,7 17,17" />
                </svg>
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </div>
                <div className="contact-card-info">
                  <span className="contact-card-label">GitHub</span>
                  <span className="contact-card-val">@ShivamJKhatri</span>
                </div>
              </div>
              <div className="contact-card-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7,7 17,7 17,17" />
                </svg>
              </div>
            </article>
          </a>
        </div>

        {/* Download Resume Button */}
        <a
          href={resumePdf}
          download
          className="contact-resume-btn"
          target="_blank"
          rel="noreferrer"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="contact-resume-icon"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download resume
        </a>
      </div>
    </section>
  );
}

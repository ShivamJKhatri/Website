import { FaLinkedinIn, FaGithub, FaEnvelope } from "react-icons/fa";
import { Mail } from "lucide-react";
import { FaRegEnvelope } from "react-icons/fa";


export default function Sidebar() {
  return (
    <aside className="sidebar">
      <a
        href="https://www.linkedin.com/in/khatri-shivam/"
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
      >
        <FaLinkedinIn size={18} />
      </a>
      <a
        href="mailto:sjkhatri182@gmail.com"
        aria-label="Email"
      >
        <FaRegEnvelope size={18} />
      </a>
      <a
        href="https://github.com/ShivamJKhatri"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
      >
        <FaGithub size={18} />
      </a>
    </aside>
  );
};
    

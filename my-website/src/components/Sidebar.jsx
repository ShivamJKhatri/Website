import { FaLinkedinIn, FaGithub, FaRegEnvelope } from "react-icons/fa";
import Tooltip from "./Tooltip.jsx";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Tooltip label="LinkedIn profile" side="right">
        <a
          href="https://www.linkedin.com/in/khatri-shivam/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn size={18} />
        </a>
      </Tooltip>
      <Tooltip label="Send email" side="right">
        <a href="mailto:sjkhatri182@gmail.com" aria-label="Email">
          <FaRegEnvelope size={18} />
        </a>
      </Tooltip>
      <Tooltip label="GitHub profile" side="right">
        <a
          href="https://github.com/ShivamJKhatri"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <FaGithub size={18} />
        </a>
      </Tooltip>
    </aside>
  );
}

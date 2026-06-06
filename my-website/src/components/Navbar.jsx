import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/experiences", label: "Experiences" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar({ navigate = () => {}, path = "/" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const go = (e, to) => {
    e.preventDefault();
    navigate(to);
    setOpen(false);
  };

  return (
    <nav className={`navbar${open ? " navbar--open" : ""}`}>
      <button
        type="button"
        className="navbar-toggle"
        aria-expanded={open}
        aria-controls="navbar-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X size={20} strokeWidth={2} aria-hidden="true" /> : <Menu size={20} strokeWidth={2} aria-hidden="true" />}
      </button>

      <button
        type="button"
        className="navbar-backdrop"
        aria-label="Close menu"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
      />

      <ul id="navbar-menu" className="navbar-links" aria-hidden={!open}>
        {LINKS.map((link) => {
          const isActive = path === link.to;
          return (
            <li key={link.to}>
              <a
                href={link.to}
                onClick={(e) => go(e, link.to)}
                className={isActive ? "is-active" : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

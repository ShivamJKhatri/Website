const LINKS = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/experiences', label: 'Experiences' },
    { to: '/contact', label: 'Contact' },
]

export default function Navbar({ navigate = () => {}, path = '/' }) {
    const go = (e, to) => {
        e.preventDefault()
        navigate(to)
    }

    return (
        <nav className="navbar">
            <ul className="navbar-links">
                {LINKS.map((link) => {
                    const isActive = path === link.to
                    return (
                        <li key={link.to}>
                            <a
                                href={link.to}
                                onClick={(e) => go(e, link.to)}
                                className={isActive ? 'is-active' : undefined}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {link.label}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

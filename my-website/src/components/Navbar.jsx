export default function Navbar({ navigate = () => {} }) {
    const go = (e, to) => {
        e.preventDefault()
        navigate(to)
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">SK</div>
                <ul className="navbar-links">
                    <li>
                        <a href="/" onClick={(e) => go(e, '/')}>Home</a>
                    </li>
                    <li>
                        <a href="/projects" onClick={(e) => go(e, '/projects')}>Projects</a>
                    </li>
                    <li>
                        <a href="/experiences" onClick={(e) => go(e, '/experiences')}>Experiences</a>
                    </li>
                    <li>
                        <a href="#skills">Skills</a>
                    </li>
                    <li>
                        <a href="#contact">Contact</a>
                    </li>
                </ul>
                <div className="navbar-cta">Ask my AI something!</div>
            </nav>
        </>
    )
}
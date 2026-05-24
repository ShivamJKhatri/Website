export default function Navbar() {
  return (
    <>
        <nav className="navbar">
            <div className="navbar-logo">Shivam Khatri</div>
            <ul className="navbar-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">Projects</a></li>
                <li><a href="#services">Experiences</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <div className="navbar-cta">Ask my AI something!</div>
        </nav>
    </>
    )
};
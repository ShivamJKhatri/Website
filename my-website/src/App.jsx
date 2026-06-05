import './App.css'
import Navbar from './components/Navbar.jsx'
import Homepage from './components/Homepage.jsx'
import Projects from './components/Projects.jsx'
import Experiences from './components/Experiences.jsx'
import Contact from './components/Contact.jsx'
import Sidebar from './components/Sidebar.jsx'
import SplineRobot from './SplineRobot.jsx'
import { useState, useEffect } from 'react'
import { usePageMeta } from './hooks/usePageMeta.js'

function App() {
  const [path, setPath] = useState(window.location.pathname || '/')

  usePageMeta(path)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || '/')
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    const page = path === '/' ? 'home' : path.replace(/^\//, '')
    document.body.dataset.page = page
    return () => {
      delete document.body.dataset.page
    }
  }, [path])

  const navigate = (to) => {
    if (to === path) return
    window.history.pushState({}, '', to)
    setPath(to)
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar navigate={navigate} path={path} />
      <div id="main-content">
        {path === '/' && <Homepage />}
        {path === '/projects' && <Projects />}
        {path === '/experiences' && <Experiences />}
        {path === '/contact' && <Contact />}
      </div>
      <Sidebar />
      {/* <SplineRobot /> */}
      
      {/* <button className="sticky-ai-cta" aria-label="Ask my AI">
        <span className="sticky-ai-sparkle">✨</span> Ask my AI something!
      </button> */}
    </>
  )
}

export default App

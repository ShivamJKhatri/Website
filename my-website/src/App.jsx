import './App.css'
import Navbar from './components/Navbar.jsx'
import Homepage from './components/Homepage.jsx'
import Projects from './components/Projects.jsx'
import Experiences from './components/Experiences.jsx'
import Contact from './components/Contact.jsx'
import Sidebar from './components/Sidebar.jsx'
import SplineRobot from './SplineRobot.jsx'
import { useState, useEffect } from 'react'

function App() {
  const [path, setPath] = useState(window.location.pathname || '/')

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || '/')
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (to) => {
    if (to === path) return
    window.history.pushState({}, '', to)
    setPath(to)
  }

  return (
    <>
      <Navbar navigate={navigate} />
      {path === '/' && <Homepage />}
      {path === '/projects' && <Projects />}
      {path === '/experiences' && <Experiences />}
      {path === '/contact' && <Contact />}
      <Sidebar />
      {/* <SplineRobot /> */}
      
      <button className="sticky-ai-cta" aria-label="Ask my AI">
        <span className="sticky-ai-sparkle">✨</span> Ask my AI something!
      </button>
    </>
  )
}

export default App

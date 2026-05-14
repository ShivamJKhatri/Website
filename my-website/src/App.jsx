import './App.css'
import './head-tracking.js'

function App() {
  return (
    <main id="lego-output">
      <div className="lego-man" id="anchor">
        <div className="lego-head">
          <img src="/head.png" alt="Lego Head" />
        </div>
        <div className="lego-body">
          <img src="/body.png" alt="Lego Body" />
        </div>
      </div>
    </main>
  )
}

export default App

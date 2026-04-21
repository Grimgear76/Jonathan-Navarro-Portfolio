import './About.css'

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <h2 className="section-label">// ABOUT</h2>
        <div className="about-grid">
          <div className="about-bio">
            <p>
              I'm a Computer Science student at UTRGV with a passion for building things —
              from reinforcement learning bots to full-stack web apps to 2D games.
              I thrive at the intersection of engineering and creativity, and I love
              competitions: two hackathon placements (1st and 2nd) in 2024.
            </p>
            <p>
              When I'm not coding, I'm designing, gaming, or thinking about
              how AI is changing the way we build software.
            </p>
          </div>
          <div className="terminal-card">
            <div className="terminal-header">
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-dot" />
            </div>
            <div className="terminal-body">
              <p><span className="terminal-prompt">$ whoami</span></p>
              <p className="terminal-output">Jonathan Navarro</p>
              <p><span className="terminal-prompt">$ cat info.txt</span></p>
              <p className="terminal-output">📍 Rio Grande Valley, TX</p>
              <p className="terminal-output">🎓 CS @ UTRGV</p>
              <p className="terminal-output">🏆 2× Hackathon winner</p>
              <p className="terminal-output">⚡ ML · Web · Game Dev</p>
              <p><span className="terminal-cursor">_</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

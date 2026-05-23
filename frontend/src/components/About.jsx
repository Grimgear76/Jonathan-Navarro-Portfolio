import './About.css'

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <h2 className="section-label">// ABOUT</h2>
        <div className="about-grid">
          <div className="about-bio">
            <p>
              I'm a Computer Science graduate from UTRGV — Magna Cum Laude — with deep
              expertise across full-stack development, machine learning, and game engineering.
              I build things end-to-end: reinforcement learning bots, production web apps,
              2D games, and everything in between.
            </p>
            <p>
              I also love a good hackathon — grabbed <strong>1st place</strong> at the Frontera
              Gemini Hackathon (2024) and <strong>2nd place</strong> at an AI/ML Hackathon (2026).
              Outside of that I'm usually deep in a side project or thinking about how AI
              is changing the way we build things.
            </p>
            <div className="about-stack">
              {['Python','JavaScript','C++','C#','Java','React','Node.js','Express','Flutter','Unity','MongoDB','Stable-Baselines3','Figma','AWS','Azure'].map(t => (
                <span key={t} className="about-stack-tag">{t}</span>
              ))}
            </div>
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
              <p className="terminal-output">🎓 CS @ UTRGV — Magna Cum Laude</p>
              <p className="terminal-output">🏆 2× Hackathon Finalist (1st + 2nd)</p>
              <p className="terminal-output">⚡ ML · Full-Stack · Game Dev</p>
              <p><span className="terminal-cursor">_</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

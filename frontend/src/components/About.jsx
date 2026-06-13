import './About.css'

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <h2 className="section-label">// ABOUT</h2>
        <div className="about-grid">
          <div className="about-bio">
            <p>
              I'm a Computer Science graduate from UTRGV — Magna Cum Laude — who ships
              end-to-end across full-stack development, machine learning, and game engineering:
              reinforcement-learning bots, production web apps, and 2D games.
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
              <p className="terminal-output">[loc] Rio Grande Valley, TX</p>
              <p className="terminal-output">[edu] CS @ UTRGV — Magna Cum Laude</p>
              <p className="terminal-output">[ach] Dean's List '23–'24 · President's List '24–'26</p>
              <p className="terminal-output">[win] 2× Award-Winning Hackathons — 1st + 2nd Place</p>
              <p className="terminal-output">[foc] ML · Full-Stack · Game Dev</p>
              <p><span className="terminal-cursor">_</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

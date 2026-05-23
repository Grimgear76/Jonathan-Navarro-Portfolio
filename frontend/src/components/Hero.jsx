import './Hero.css'

export default function Hero() {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">// HELLO, I AM</p>

        <h1 className="hero-name">
          <span className="glitch" data-text="Jonathan">Jonathan</span>
          <br />
          <span className="glitch" data-text="Navarro">Navarro</span>
          <span className="cursor">_</span>
        </h1>
        <p className="hero-title">Full-Stack Developer · ML Engineer · 2× Hackathon Winner</p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={() => scrollTo('projects')}>
            VIEW PROJECTS
          </button>
          <a className="btn-secondary" href="/resume.pdf" download="Jonathan_Navarro_Resume.pdf">
            DOWNLOAD RESUME
          </a>
        </div>
        <div className="hero-social">
          <a href="https://github.com/Grimgear76" target="_blank" rel="noopener noreferrer" className="hero-social-link">
            GitHub ↗
          </a>
          <span className="hero-social-sep">/</span>
          <a href="https://linkedin.com/in/jonathan-navarro-44923b307" target="_blank" rel="noopener noreferrer" className="hero-social-link">
            LinkedIn ↗
          </a>
          <span className="hero-social-sep">/</span>
          <span className="hero-available">● Open to opportunities</span>
        </div>
      </div>

      <button
        className="hero-scroll-hint"
        onClick={() => scrollTo('about')}
        aria-label="Scroll to about"
      >
        <span className="scroll-label">SCROLL</span>
        <div className="scroll-line" />
      </button>
    </section>
  )
}

import './Hero.css'

export default function Hero() {
  function scrollToProjects() {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">HELLO, I AM</p>
        <h1 className="hero-name">
          Jonathan<br />Navarro<span className="cursor">_</span>
        </h1>
        <p className="hero-title">CS Student · Developer · Builder</p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={scrollToProjects}>
            VIEW PROJECTS
          </button>
          <a className="btn-secondary" href="/resume.pdf" download="Jonathan_Navarro_Resume.pdf">
            DOWNLOAD RESUME
          </a>
        </div>
      </div>
    </section>
  )
}

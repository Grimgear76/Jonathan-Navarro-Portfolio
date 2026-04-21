import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="https://github.com/Grimgear76" target="_blank" rel="noopener noreferrer">GITHUB</a>
        <span className="footer-sep">/</span>
        <a href="https://linkedin.com/in/YOUR_LINKEDIN_SLUG" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
        <span className="footer-sep">/</span>
        <a href="mailto:YOUR_EMAIL@example.com">EMAIL</a>
      </div>
      <p className="footer-copy">© 2025 Jonathan Navarro</p>
    </footer>
  )
}

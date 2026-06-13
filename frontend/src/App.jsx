import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ColorProvider } from './context/ColorContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AmbientOverlay from './components/AmbientOverlay'
import ParticleBackground from './components/ParticleBackground'
import Toast from './components/Toast'
import ScrollZoneWatcher from './components/ScrollZoneWatcher'
import ThemeEvolution from './components/ThemeEvolution'
import './styles/globals.css'

// Detail pages are lazy-loaded so they don't weigh down the homepage's first paint.
const ProjectDetail       = lazy(() => import('./pages/ProjectDetail'))
const PokemonDetail       = lazy(() => import('./pages/PokemonDetail'))
const Rapp956Detail       = lazy(() => import('./pages/Rapp956Detail'))
const RgvTutorDetail      = lazy(() => import('./pages/RgvTutorDetail'))
const ActionRpgDetail     = lazy(() => import('./pages/ActionRpgDetail'))
const FronteraDetail      = lazy(() => import('./pages/FronteraDetail'))
const CollegeSocialDetail = lazy(() => import('./pages/CollegeSocialDetail'))
const RobloxDetail        = lazy(() => import('./pages/RobloxDetail'))

function RouteFallback() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.2em', fontSize: '0.8rem',
    }}>
      LOADING<span className="cursor">_</span>
    </div>
  )
}

function HomePage() {
  useEffect(() => {
    const section = sessionStorage.getItem('scrollTo')
    if (section) {
      sessionStorage.removeItem('scrollTo')
      setTimeout(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }), 80)
    }
  }, [])

  return (
    <main id="main-content">
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Footer />
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ColorProvider>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <ThemeEvolution />
        <ParticleBackground />
        <AmbientOverlay />
        <Navbar />
        <Toast />
        <ScrollZoneWatcher />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/pokemon-battle-bot" element={<PokemonDetail />} />
            <Route path="/projects/rgv-tutor" element={<RgvTutorDetail />} />
            <Route path="/projects/rapp956" element={<Rapp956Detail />} />
            <Route path="/projects/2d-action-rpg" element={<ActionRpgDetail />} />
            <Route path="/projects/frontera-hackathon" element={<FronteraDetail />} />
            <Route path="/projects/college-social-app" element={<CollegeSocialDetail />} />
            <Route path="/projects/roblox-ux-redesign" element={<RobloxDetail />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
          </Routes>
        </Suspense>
      </ColorProvider>
    </BrowserRouter>
  )
}

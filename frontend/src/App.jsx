import { useEffect } from 'react'
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
import ProjectDetail from './pages/ProjectDetail'
import PokemonDetail from './pages/PokemonDetail'
import Rapp956Detail from './pages/Rapp956Detail'
import RgvTutorDetail from './pages/RgvTutorDetail'
import ActionRpgDetail from './pages/ActionRpgDetail'
import FronteraDetail from './pages/FronteraDetail'
import CollegeSocialDetail from './pages/CollegeSocialDetail'
import RobloxDetail from './pages/RobloxDetail'
import ThemeEvolution from './components/ThemeEvolution'
import './styles/globals.css'

function HomePage() {
  useEffect(() => {
    const section = sessionStorage.getItem('scrollTo')
    if (section) {
      sessionStorage.removeItem('scrollTo')
      setTimeout(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }), 80)
    }
  }, [])

  return (
    <main>
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
        <ThemeEvolution />
        <ParticleBackground />
        <AmbientOverlay />
        <Navbar />
        <Toast />
        <ScrollZoneWatcher />
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
      </ColorProvider>
    </BrowserRouter>
  )
}

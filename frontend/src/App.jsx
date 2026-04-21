import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ColorProvider } from './context/ColorContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AmbientOverlay from './components/AmbientOverlay'
import Toast from './components/Toast'
import ScrollZoneWatcher from './components/ScrollZoneWatcher'
import ProjectDetail from './pages/ProjectDetail'
import './styles/globals.css'

function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
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
        <AmbientOverlay />
        <Navbar />
        <Toast />
        <ScrollZoneWatcher />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </ColorProvider>
    </BrowserRouter>
  )
}

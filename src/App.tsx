import './i18n'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Hours from './components/Hours'
import Location from './components/Location'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import SEO from './components/SEO'

export default function App() {
  return (
    <HelmetProvider>
      <SEO />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Hours />
        <Location />
      </main>
      <Footer />
      <CookieBanner />
    </HelmetProvider>
  )
}

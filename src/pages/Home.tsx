import Hero from '../components/Hero'
import AboutCompany from '../components/AboutCompany'
import About from '../components/About'
import Services from '../components/Services'
import Techniques from '../components/Techniques'
import SectionDivider from '../components/SectionDivider'
import WhyChooseUs from '../components/WhyChooseUs'
import FAQ from '../components/FAQ'
import Information from '../components/Information'
import Location from '../components/Location'

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutCompany />
      <About />
      <Services />
      <Techniques />
      <SectionDivider
        src="/dividers/6x2a2260.jpg"
        alt="Massagebehandling hos Let Us Massage på Stora Södergatan i Lund"
      />
      <WhyChooseUs />
      <SectionDivider
        src="/dividers/6x2a2269.jpg"
        alt="Detalj från terapeutisk massageterapi i Lund"
      />
      <FAQ />
      <Information />
      <Location />
    </main>
  )
}

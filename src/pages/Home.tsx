import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import Techniques from '../components/Techniques'
import WhyChooseUs from '../components/WhyChooseUs'
import FAQ from '../components/FAQ'
import Hours from '../components/Hours'
import Location from '../components/Location'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Techniques />
      <WhyChooseUs />
      <FAQ />
      <Hours />
      <Location />
    </main>
  )
}

import Hero from './components/Hero'
import AboutSection from './components/AboutSection'
import ReelSection from './components/ReelSection'
import './index.css'

function App() {
  return (
    <div className="bg-[#f5f5f5]">
      <Hero />
      <AboutSection />
      <ReelSection />
    </div>
  )
}

export default App
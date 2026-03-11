/* ============================================================
   FLAMA RESTAURANTE — Página Principal
   Importa todos los componentes de sección en orden de aparición.
   ============================================================ */
import EmberBackground from './components/EmberBackground'
import Navbar        from './components/Navbar'
import Hero          from './components/Hero'
import About         from './components/About'
import Dishes        from './components/Dishes'
import Menu          from './components/Menu'
import Gallery       from './components/Gallery'
import Testimonials  from './components/Testimonials'
import Location      from './components/Location'
import ClosingCta    from './components/ClosingCta'
import Footer        from './components/Footer'
import WhatsAppFab   from './components/WhatsAppFab'

export default function HomePage() {
  return (
    <>
      <EmberBackground />
      <Navbar />

      <main>
        <Hero />
        <About />
        <Dishes />
        <Menu />
        <Gallery />
        <Testimonials />
        <Location />
        <ClosingCta />
      </main>

      <Footer />
      <WhatsAppFab />
    </>
  )
}

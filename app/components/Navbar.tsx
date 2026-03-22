'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

/* ============================================================
   NAVBAR
   - Transparente al tope, opaca (blur) al hacer scroll
   - Links de navegación desktop
   - Menú hamburguesa overlay para mobile
   ============================================================ */

const WA_URL =
  'https://wa.me/527541086431?text=Hola%2C%20me%20gustar%C3%ADa%20reservar%20una%20mesa%20en%20Flama%20Restaurante.%20%C2%BFTienen%20disponibilidad%3F'

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)

  /* Detectar scroll para cambiar fondo del nav */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Bloquear scroll del body cuando el menú está abierto */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* Cerrar menú con Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <style>{`
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1.4rem 1.5rem;
          transition: background var(--transition), backdrop-filter var(--transition),
                      box-shadow var(--transition), padding var(--transition);
        }
        .nav.scrolled {
          background: rgba(15,14,11,0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 var(--color-border);
          padding: 0.9rem 1.5rem;
        }
        .nav__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav__logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--color-cream);
          text-decoration: none;
        }
        .nav__logo-img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          filter: brightness(1.05);
          transition: opacity var(--transition);
        }
        .nav.scrolled .nav__logo-img {
          opacity: 0.92;
        }
        .nav__links {
          display: none;
          gap: 2.5rem;
        }
        .nav__links a {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          transition: color var(--transition);
          position: relative;
        }
        .nav__links a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--color-amber);
          transition: width var(--transition);
        }
        .nav__links a:hover { color: var(--color-cream); }
        .nav__links a:hover::after { width: 100%; }
        .nav__cta { display: none; }
        .nav__hamburger {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
          min-width: 44px;
          min-height: 44px;
          align-items: center;
          justify-content: center;
        }
        .nav__hamburger span {
          display: block;
          width: 22px;
          height: 1px;
          background: var(--color-cream);
          transition: var(--transition);
          transform-origin: center;
        }
        .nav__hamburger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .nav__hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav__hamburger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
        .nav__mobile {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(15,14,11,0.98);
          z-index: 999;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2.5rem;
        }
        .nav__mobile.open { display: flex; }
        .nav__mobile a {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 300;
          color: var(--color-text-muted);
          letter-spacing: 0.04em;
          transition: color var(--transition);
        }
        .nav__mobile a:hover { color: var(--color-cream); }
        .nav__mobile .btn-primary { font-size: 0.8rem; margin-top: 1rem; }
        @media (min-width: 1024px) {
          .nav__links     { display: flex; }
          .nav__cta       { display: block; }
          .nav__hamburger { display: none; }
        }
      `}</style>

      {/* Nav principal */}
      <nav
        className={`nav${scrolled ? ' scrolled' : ''}`}
        id="nav"
        aria-label="Navegacion principal"
      >
        <div className="nav__inner">
          <a href="#hero" className="nav__logo" aria-label="Flama — ir al inicio">
            <Image
              src="/logo.png"
              alt="Flama logo"
              width={36}
              height={36}
              className="nav__logo-img"
              priority
            />
            Flama
          </a>

          <div className="nav__links" role="list">
            <a href="#about"          role="listitem">Nosotros</a>
            <a href="#dishes"         role="listitem">Platillos</a>
            <a href="#menu"           role="listitem">Menu</a>
            <a href="#gallery"        role="listitem">Galeria</a>
            <a href="#location"       role="listitem">Ubicacion</a>
            <a href="#reservaciones"  role="listitem">Reservar</a>
            <a href="#eventos"        role="listitem">Eventos Flama</a>
          </div>

          <a
            href="#reservaciones"
            className="btn-primary nav__cta"
            aria-label="Ir al formulario de reservaciones"
          >
            Reservar Mesa
          </a>

          <button
            className={`nav__hamburger${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Menú overlay mobile */}
      <nav
        className={`nav__mobile${menuOpen ? ' open' : ''}`}
        id="mobileMenu"
        aria-label="Menu movil"
        role="dialog"
        aria-modal="true"
      >
        <a href="#about"          onClick={close}>Nosotros</a>
        <a href="#dishes"         onClick={close}>Platillos</a>
        <a href="#menu"           onClick={close}>Menu</a>
        <a href="#gallery"        onClick={close}>Galeria</a>
        <a href="#testimonials"   onClick={close}>Resenas</a>
        <a href="#location"       onClick={close}>Ubicacion</a>
        <a href="#reservaciones"  onClick={close}>Reservar</a>
        <a href="#eventos"        onClick={close}>Eventos Flama</a>
        <a
          href="#reservaciones"
          className="btn-primary"
          style={{ marginTop: '1rem' }}
          onClick={close}
        >
          Reservar Mesa
        </a>
      </nav>
    </>
  )
}

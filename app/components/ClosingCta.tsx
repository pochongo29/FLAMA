'use client'

import { useEffect, useRef } from 'react'

/* ============================================================
   CLOSING CTA — Sección de cierre con llamado a la acción
   - Gradiente de fondo + detalle de luz vertical
   - Dos botones: llamada y WhatsApp
   ============================================================ */

const WA_URL =
  'https://wa.me/527471234567?text=Hola%2C%20me%20gustar%C3%ADa%20reservar%20una%20mesa%20en%20Flama%20Restaurante.%20%C2%BFTienen%20disponibilidad%3F'

export default function ClosingCta() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const els = section.querySelectorAll<HTMLElement>('.reveal')
    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .closing-cta {
          padding: var(--space-xl) 0;
          text-align: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, var(--color-surface) 0%, var(--color-bg) 100%);
        }
        .closing-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 80px;
          background: linear-gradient(180deg, var(--color-olive), transparent);
          opacity: 0.4;
        }
        .closing-cta__accent {
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-olive);
          display: block;
          margin-bottom: 1.5rem;
          padding-top: 1rem;
        }
        .closing-cta__title {
          font-family: var(--font-heading);
          font-size: clamp(2rem, 6vw, 3.5rem);
          font-weight: 300;
          line-height: 1.15;
          color: var(--color-cream);
          margin-bottom: 1rem;
        }
        .closing-cta__title em { font-style: italic; color: var(--color-amber-light); }
        .closing-cta__desc {
          font-size: 0.95rem;
          font-weight: 300;
          color: var(--color-text-muted);
          max-width: 440px;
          margin: 0 auto 2.5rem;
          line-height: 1.8;
        }
        .closing-cta__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <section className="closing-cta" aria-label="Llamado a la accion final" ref={sectionRef}>
        <div className="container">
          <span className="closing-cta__accent reveal">Tu mesa te espera</span>
          <h2 className="closing-cta__title reveal reveal-delay-1">
            Una experiencia que<br /><em>no olvidaras</em>
          </h2>
          <p className="closing-cta__desc reveal reveal-delay-2">
            Reserva hoy y descubre por que Flama es el lugar donde
            cada cena se convierte en un recuerdo que vale la pena vivir.
          </p>
          <div className="closing-cta__actions reveal reveal-delay-3">
            <a href="tel:+527471234567" className="btn-call">
              Llamar y Reservar
            </a>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              aria-label="Reservar mesa por WhatsApp"
            >
              Reservar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

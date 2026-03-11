'use client'

import { useEffect, useRef } from 'react'

/* ============================================================
   ABOUT — Presentación del restaurante
   - Historia y propuesta de valor
   - 3 prop-cards con iconos SVG inline
   - Visual placeholder (reemplazar con <img> real)
   ============================================================ */

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  /* Scroll reveal mediante IntersectionObserver */
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
        .about {
          padding: var(--space-xl) 0;
          background: transparent;
        }
        .about__inner {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }
        .about__text { max-width: 580px; }
        .about__desc {
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 300;
          color: var(--color-text-muted);
          line-height: 1.85;
          margin-bottom: 1rem;
        }
        .about__desc strong { color: var(--color-cream); font-weight: 400; }
        .about__props {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          margin-top: 2rem;
        }
        .prop-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.2rem 1.4rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: border-color var(--transition), background var(--transition);
        }
        .prop-card:hover {
          border-color: rgba(107,124,78,0.35);
          background: var(--color-surface-2);
        }
        .prop-card__icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(107,124,78,0.12);
          border: 1px solid rgba(107,124,78,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--color-olive);
        }
        .prop-card__title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--color-cream);
          margin-bottom: 3px;
        }
        .prop-card__desc {
          font-size: 0.82rem;
          font-weight: 300;
          color: var(--color-text-muted);
          line-height: 1.55;
        }
        .about__visual {
          position: relative;
          border-radius: var(--radius-xl);
          overflow: hidden;
          min-height: 340px;
          background:
            radial-gradient(ellipse 60% 70% at 40% 60%, rgba(74,94,56,0.55) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 75% 25%, rgba(107,124,78,0.3) 0%, transparent 55%),
            linear-gradient(145deg, #141810 0%, #1e2618 40%, #0f1209 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .about__visual::after {
          content: '';
          position: absolute;
          top: 10%;
          right: 0;
          width: 1px;
          height: 80%;
          background: linear-gradient(180deg, transparent, rgba(138,158,106,0.3), transparent);
        }
        .about__visual-placeholder {
          text-align: center;
          padding: 2rem;
        }
        .about__visual-placeholder .icon {
          font-size: 4rem;
          opacity: 0.4;
          display: block;
          margin-bottom: 1rem;
        }
        .about__visual-placeholder p {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 300;
          font-style: italic;
          color: var(--color-beige);
          opacity: 0.6;
        }
        @media (min-width: 640px) {
          .about__props { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .about__inner {
            flex-direction: row;
            align-items: center;
            gap: 5rem;
          }
          .about__text   { flex: 1; }
          .about__visual { flex: 1; min-height: 520px; }
        }
      `}</style>

      <section className="about" id="about" aria-labelledby="about-title" ref={sectionRef}>
        <div className="container">
          <div className="about__inner">

            <div className="about__text">
              <span className="section-label reveal">Nuestra historia</span>
              <h2 className="section-title reveal reveal-delay-1" id="about-title">
                El arte de cocinar<br /><span>con fuego vivo</span>
              </h2>
              <div className="olive-line reveal reveal-delay-2" />
              <p className="about__desc reveal reveal-delay-2">
                Flama nació de una obsesión: encontrar el punto exacto donde el fuego{' '}
                <strong>transforma un ingrediente en una experiencia que se recuerda.</strong>{' '}
                En el corazón de Chilpancingo, creamos un espacio donde la naturaleza entra
                a la sala: vegetación tropical desbordante, luz ámbar cálida y el aroma
                inconfundible de la brasa viva.
              </p>
              <p className="about__desc reveal reveal-delay-3">
                Cada detalle fue pensado para que te olvides del mundo exterior —
                los sillones de piel café, la madera honey live-edge de las mesas,
                el verde que lo abraza todo. Aquí no se viene solo a comer.{' '}
                <strong>Se viene a vivir algo.</strong>
              </p>

              <div className="about__props">
                {/* Prop card 1 — Fuego Vivo */}
                <div className="prop-card reveal reveal-delay-2">
                  <div className="prop-card__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C6 8 4 13 6 17c1 2 3 3 6 3s5-1 6-3c2-4 0-9-6-15z"/>
                      <path d="M12 22c-2 0-4-1-4-3 0-2 2-4 4-4s4 2 4 4c0 2-2 3-4 3z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="prop-card__title">Fuego Vivo</div>
                    <div className="prop-card__desc">Coccion en carbon y lena seleccionada. El fuego es nuestro ingrediente principal.</div>
                  </div>
                </div>

                {/* Prop card 2 — Temporada & Origen */}
                <div className="prop-card reveal reveal-delay-3">
                  <div className="prop-card__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 22c0-8 5-14 11-16-1 6 1 11 5 14-3 1-6 2-9 2H2z"/>
                      <path d="M12 6c0 5-2 10-6 14"/>
                    </svg>
                  </div>
                  <div>
                    <div className="prop-card__title">Temporada &amp; Origen</div>
                    <div className="prop-card__desc">Ingredientes de productores locales de Guerrero. Frescos, honestos, de la tierra.</div>
                  </div>
                </div>

                {/* Prop card 3 — Cocina de Autor */}
                <div className="prop-card reveal reveal-delay-4">
                  <div className="prop-card__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="prop-card__title">Cocina de Autor</div>
                    <div className="prop-card__desc">Recetas desarrolladas con tecnica contemporanea y un caracter que solo Flama tiene.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual placeholder — reemplazar con <img> real cuando haya fotos */}
            <div className="about__visual reveal reveal-delay-3" aria-hidden="true">
              <div className="about__visual-placeholder">
                <span className="icon">&#127807;</span>
                <p>La experiencia Flama</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

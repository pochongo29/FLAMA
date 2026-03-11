'use client'

import { useEffect, useRef } from 'react'

/* ============================================================
   TESTIMONIALS — Reseñas de clientes
   - 3 tarjetas con estrellas, texto en cursiva Cormorant,
     separador oliva y avatar con inicial
   - Para agregar reseñas: edita el array REVIEWS
   ============================================================ */

interface Review {
  text:    string
  name:    string
  source:  string
  initial: string
  delay:   string
}

const REVIEWS: Review[] = [
  {
    text:    '"El Ribeye al carbon es, sin exageracion, el mejor que he probado en mi vida. La coccion perfecta, los sabores increibles. Ya tenemos mesa fija los viernes."',
    name:    'Marina R.',
    source:  'Google Reviews',
    initial: 'M',
    delay:   '',
  },
  {
    text:    '"Celebramos nuestro aniversario aqui y fue magico. La atencion, el ambiente, los platillos... todo 10 de 10. El pulpo es una experiencia en si mismo."',
    name:    'Carlos & Diana',
    source:  'Instagram',
    initial: 'C',
    delay:   'reveal-delay-1',
  },
  {
    text:    '"Vine por recomendacion y volvi tres veces ese mismo mes. El coulant de chocolate es pecado divino. El servicio, impecable. Flama es referente."',
    name:    'Luisa M.',
    source:  'TripAdvisor',
    initial: 'L',
    delay:   'reveal-delay-2',
  },
]

export default function Testimonials() {
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
        .testimonials {
          padding: var(--space-xl) 0;
          background: transparent;
        }
        .testimonials__header { text-align: center; margin-bottom: 3.5rem; }
        .testimonials__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .testimonial-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          position: relative;
          transition: border-color var(--transition);
        }
        .testimonial-card:hover { border-color: rgba(107,124,78,0.28); }
        .testimonial-card::before {
          content: '\\201C';
          position: absolute;
          top: 1rem;
          left: 1.8rem;
          font-family: var(--font-heading);
          font-size: 4.5rem;
          color: var(--color-olive);
          line-height: 1;
          opacity: 0.18;
        }
        .testimonial-card__sep {
          width: 32px;
          height: 1px;
          background: var(--color-olive);
          opacity: 0.5;
          margin-bottom: 1.2rem;
        }
        .testimonial-card__stars {
          display: flex;
          gap: 3px;
          margin-bottom: 1rem;
        }
        .star { color: var(--color-amber); font-size: 0.9rem; }
        .testimonial-card__text {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 300;
          font-style: italic;
          color: var(--color-text-muted);
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }
        .testimonial-card__author {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .testimonial-card__avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-moss), var(--color-olive));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--color-cream);
          flex-shrink: 0;
        }
        .testimonial-card__name {
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 0.88rem;
          color: var(--color-cream);
        }
        .testimonial-card__handle {
          font-size: 0.75rem;
          font-weight: 300;
          color: var(--color-text-muted);
        }
        @media (min-width: 640px) {
          .testimonials__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .testimonials__grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <section className="testimonials" id="testimonials" aria-labelledby="testimonials-title" ref={sectionRef}>
        <div className="container">
          <div className="testimonials__header">
            <span className="section-label reveal">Nuestros comensales</span>
            <h2 className="section-title reveal reveal-delay-1" id="testimonials-title">
              Lo que dicen <span>de Flama</span>
            </h2>
            <div className="olive-line center reveal reveal-delay-2" />
          </div>

          <div className="testimonials__grid">
            {REVIEWS.map((review) => (
              <article key={review.name} className={`testimonial-card reveal ${review.delay}`}>
                <div className="testimonial-card__sep" />
                <div className="testimonial-card__stars" aria-label="5 de 5 estrellas">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="star" aria-hidden="true">&#9733;</span>
                  ))}
                </div>
                <p className="testimonial-card__text">{review.text}</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar" aria-hidden="true">
                    {review.initial}
                  </div>
                  <div>
                    <div className="testimonial-card__name">{review.name}</div>
                    <div className="testimonial-card__handle">{review.source}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

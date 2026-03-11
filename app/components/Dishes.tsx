'use client'

import { useEffect, useRef } from 'react'

/* ============================================================
   DISHES — Platillos Destacados
   - 6 tarjetas de platillos estrella
   - Gradientes de imagen placeholder por platillo
   - Badges de categoría, precio en ámbar
   - Para reemplazar placeholder: cambiar .dish-card__img por
     <img loading="lazy" src="/FOTOS/nombre.jpg" alt="..." />
   ============================================================ */

interface Dish {
  name: string
  desc: string
  price: string
  tag: string
  badge?: string
  bgClass: string
  emoji: string
}

const DISHES: Dish[] = [
  {
    name:    'Ribeye al Carbon',
    desc:    'Corte prime sellado en las brasas, terminado con mantequilla de hierbas y flor de sal.',
    price:   '$480',
    tag:     'Principal',
    badge:   'Firma',
    bgClass: 'dish-bg-1',
    emoji:   '&#129385;',
  },
  {
    name:    'Pulpo a la Plancha',
    desc:    'Pulpo gallego asado, sobre pure de papa ahumada y aceite de pimenton.',
    price:   '$320',
    tag:     'Del mar',
    badge:   'Popular',
    bgClass: 'dish-bg-2',
    emoji:   '&#127839;',
  },
  {
    name:    'Salmon en Costra',
    desc:    'Filete de salmon con costra de pistache y miel de agave sobre cama de quinoa.',
    price:   '$295',
    tag:     'Del mar',
    bgClass: 'dish-bg-3',
    emoji:   '&#127843;',
  },
  {
    name:    'Costilla BBQ Flama',
    desc:    'Costilla de res 12 horas al horno, glaseada con nuestra salsa secreta de la casa.',
    price:   '$410',
    tag:     'Principal',
    badge:   'Nuevo',
    bgClass: 'dish-bg-4',
    emoji:   '&#127858;',
  },
  {
    name:    'Carpaccio de Res',
    desc:    'Laminado fino con trufa negra, parmesano viejo y aceite de oliva extra virgen.',
    price:   '$210',
    tag:     'Entrada',
    bgClass: 'dish-bg-5',
    emoji:   '&#127804;',
  },
  {
    name:    'Coulant de Chocolate',
    desc:    'Volcan de chocolate oscuro 70% con centro liquido y helado de vainilla artesanal.',
    price:   '$145',
    tag:     'Postre',
    badge:   'Postre',
    bgClass: 'dish-bg-6',
    emoji:   '&#127854;',
  },
]

const DELAY_CLASSES = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3']

export default function Dishes() {
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
        .dishes {
          padding: var(--space-xl) 0;
          background: var(--color-bg);
        }
        .dishes__header { text-align: center; margin-bottom: 3.5rem; }
        .dishes__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .dish-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
        }
        .dish-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-card);
          border-color: rgba(196,144,58,0.2);
        }
        .dish-card__img {
          height: 210px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dish-card__img-label {
          position: absolute;
          font-size: 3.2rem;
          opacity: 0.35;
          transition: transform 0.4s ease;
        }
        .dish-card:hover .dish-card__img-label { transform: scale(1.08); }
        .dish-card__badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(107,124,78,0.18);
          border: 1px solid rgba(107,124,78,0.45);
          color: var(--color-sage);
          font-family: var(--font-body);
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .dish-card__body { padding: 1.2rem 1.4rem 1.4rem; }
        .dish-card__name {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--color-cream);
          margin-bottom: 0.4rem;
          letter-spacing: 0.01em;
        }
        .dish-card__desc {
          font-size: 0.83rem;
          font-weight: 300;
          color: var(--color-text-muted);
          line-height: 1.55;
          margin-bottom: 1rem;
        }
        .dish-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dish-card__price {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 400;
          color: var(--color-amber);
        }
        .dish-card__tag {
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 400;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        /* Gradientes de imagen por platillo — reemplazar con foto real */
        .dish-bg-1 { background: linear-gradient(145deg, #1a1209, #2e2010, #1a1209); }
        .dish-bg-2 { background: linear-gradient(145deg, #0d1208, #1a2210, #0d1208); }
        .dish-bg-3 { background: linear-gradient(145deg, #0e1210, #1a2018, #0e1210); }
        .dish-bg-4 { background: linear-gradient(145deg, #18100a, #2a1c0e, #18100a); }
        .dish-bg-5 { background: linear-gradient(145deg, #0f0e0d, #1e1c18, #0f0e0d); }
        .dish-bg-6 { background: linear-gradient(145deg, #100f0a, #1e1c12, #100f0a); }
        @media (min-width: 640px) {
          .dishes__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .dishes__grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <section className="dishes" id="dishes" aria-labelledby="dishes-title" ref={sectionRef}>
        <div className="container">
          <div className="dishes__header">
            <span className="section-label reveal">Lo mejor de la casa</span>
            <h2 className="section-title reveal reveal-delay-1" id="dishes-title">
              Platillos <span>Estrella</span>
            </h2>
            <div className="olive-line center reveal reveal-delay-2" />
          </div>

          <div className="dishes__grid">
            {DISHES.map((dish, i) => (
              <article key={dish.name} className={`dish-card reveal ${DELAY_CLASSES[i]}`}>
                <div className={`dish-card__img ${dish.bgClass}`}>
                  <span
                    className="dish-card__img-label"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: dish.emoji }}
                  />
                  {dish.badge && (
                    <span className="dish-card__badge">{dish.badge}</span>
                  )}
                </div>
                <div className="dish-card__body">
                  <h3 className="dish-card__name">{dish.name}</h3>
                  <p className="dish-card__desc">{dish.desc}</p>
                  <div className="dish-card__footer">
                    <span className="dish-card__price">{dish.price}</span>
                    <span className="dish-card__tag">{dish.tag}</span>
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

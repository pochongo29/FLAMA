'use client'

import { useEffect, useRef } from 'react'

/* ============================================================
   GALLERY — Grid editorial asimétrico
   - 9 ítems con gradientes placeholder
   - Items wide (span 2 columnas) y tall (span 2 filas)
   - Hover overlay con caption desde data-caption
   - Para reemplazar placeholders: cambiar .gallery__placeholder
     por <img loading="lazy" src="/FOTOS/foto.jpg" alt="..." />
   ============================================================ */

interface GalleryItem {
  caption:   string
  ariaLabel: string
  bgClass:   string
  img:       string
  wide?:     boolean
  tall?:     boolean
  delay:     string
}

const ITEMS: GalleryItem[] = [
  {
    caption:   'Salón principal — luz ámbar, piel y selva',
    ariaLabel: 'Salon principal con iluminacion ambar calida y vegetacion tropical',
    bgClass:   'gb-1',
    img:       'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=600&fit=crop&q=85',
    wide:      true,
    delay:     '',
  },
  {
    caption:   'Vegetación tropical que respira dentro',
    ariaLabel: 'Vegetacion tropical exuberante en el interior del restaurante',
    bgClass:   'gb-2',
    img:       'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=900&fit=crop&q=85',
    tall:      true,
    delay:     'reveal-delay-1',
  },
  {
    caption:   'Cada platillo, una obra de fuego',
    ariaLabel: 'Presentacion premium de platillo principal en Flama',
    bgClass:   'gb-3',
    img:       'https://images.unsplash.com/photo-1544025162-d76538bef3aa?w=600&h=500&fit=crop&q=85',
    delay:     'reveal-delay-2',
  },
  {
    caption:   'La mesa perfecta te espera',
    ariaLabel: 'Mesa elegantemente servida con iluminacion cenital calida',
    bgClass:   'gb-4',
    img:       'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=500&fit=crop&q=85',
    delay:     'reveal-delay-3',
  },
  {
    caption:   'Maridaje para cada momento',
    ariaLabel: 'Cocteles artesanales y vinos seleccionados en la barra de Flama',
    bgClass:   'gb-5',
    img:       'https://images.unsplash.com/photo-1551024709-8f23befc548e?w=600&h=500&fit=crop&q=85',
    delay:     'reveal-delay-1',
  },
  {
    caption:   'Un espacio donde el tiempo se detiene',
    ariaLabel: 'Vista panoramica del salon con muebles de piel y vegetacion exuberante',
    bgClass:   'gb-6',
    img:       'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop&q=85',
    wide:      true,
    delay:     'reveal-delay-2',
  },
  {
    caption:   'El fuego que da vida a todo',
    ariaLabel: 'Cocina de fuego vivo — el carbon como instrumento principal',
    bgClass:   'gb-7',
    img:       'https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=500&fit=crop&q=85',
    delay:     'reveal-delay-3',
  },
  {
    caption:   'La noche empieza en Flama',
    ariaLabel: 'Ambiente nocturno del bar con iluminacion ambar intima',
    bgClass:   'gb-8',
    img:       'https://images.unsplash.com/photo-1552566626-52f8b828a9b6?w=600&h=500&fit=crop&q=85',
    delay:     'reveal-delay-4',
  },
  {
    caption:   'Madera, piel y naturaleza en cada rincón',
    ariaLabel: 'Detalle de materiales naturales — madera honey live-edge y cuero artesanal',
    bgClass:   'gb-9',
    img:       'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=500&fit=crop&q=85',
    delay:     'reveal-delay-5',
  },
]

export default function Gallery() {
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
        .gallery {
          padding: var(--space-xl) 0;
          background: transparent;
        }
        .gallery__header { text-align: center; margin-bottom: 3.5rem; }
        .gallery__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-auto-rows: 200px;
          gap: 5px;
        }
        .gallery__item--wide { grid-column: span 2; }
        .gallery__item--tall { grid-row: span 2; }
        .gallery__item {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-md);
          cursor: pointer;
          isolation: isolate;
        }
        .gallery__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.65s ease;
        }
        .gallery__item:hover .gallery__img { transform: scale(1.06); }
        .gallery__item::after {
          content: attr(data-caption);
          position: absolute;
          inset: 0;
          background: rgba(15,14,11,0);
          color: var(--color-cream);
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 300;
          font-style: italic;
          display: flex;
          align-items: flex-end;
          padding: 1.2rem;
          opacity: 0;
          transition: background 0.35s ease, opacity 0.35s ease;
        }
        .gallery__item:hover::after {
          background: rgba(15,14,11,0.52);
          opacity: 1;
        }
        /* Gradientes editoriales — reemplazar con foto real */
        .gb-1 {
          background:
            radial-gradient(ellipse 60% 70% at 30% 70%, rgba(139,99,64,0.6) 0%, transparent 60%),
            radial-gradient(ellipse 40% 50% at 75% 20%, rgba(196,144,58,0.3) 0%, transparent 55%),
            linear-gradient(160deg, #1a140a 0%, #2a1e0e 50%, #1a140a 100%);
        }
        .gb-2 {
          background:
            radial-gradient(ellipse 70% 60% at 40% 60%, rgba(74,94,56,0.7) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 80% 30%, rgba(107,124,78,0.4) 0%, transparent 55%),
            linear-gradient(150deg, #0d1209 0%, #1a2012 50%, #0d1209 100%);
        }
        .gb-3 {
          background:
            radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139,99,64,0.5) 0%, transparent 65%),
            linear-gradient(135deg, #160f08 0%, #2a1c0e 60%, #160f08 100%);
        }
        .gb-4 {
          background:
            radial-gradient(ellipse 50% 60% at 50% 30%, rgba(212,168,85,0.35) 0%, transparent 60%),
            radial-gradient(ellipse 80% 50% at 50% 80%, rgba(34,31,24,0.9) 0%, transparent 70%),
            linear-gradient(175deg, #18160f 0%, #221f15 100%);
        }
        .gb-5 {
          background:
            radial-gradient(ellipse 40% 80% at 70% 50%, rgba(107,124,78,0.25) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 20% 60%, rgba(196,144,58,0.2) 0%, transparent 55%),
            linear-gradient(145deg, #0f0e0b 0%, #1e1c14 100%);
        }
        .gb-6 {
          background:
            radial-gradient(ellipse 80% 50% at 50% 40%, rgba(200,185,154,0.12) 0%, transparent 65%),
            linear-gradient(170deg, #14130f 0%, #1e1c15 50%, #14130f 100%);
        }
        .gb-7 {
          background:
            radial-gradient(ellipse 55% 55% at 45% 55%, rgba(139,99,64,0.35) 0%, transparent 60%),
            linear-gradient(135deg, #100f0a 0%, #1e1b12 60%, #100f0a 100%);
        }
        .gb-8 {
          background:
            radial-gradient(ellipse 60% 60% at 55% 45%, rgba(196,144,58,0.28) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 20% 70%, rgba(139,99,64,0.2) 0%, transparent 50%),
            linear-gradient(155deg, #15120a 0%, #22180d 60%, #15120a 100%);
        }
        .gb-9 {
          background:
            radial-gradient(ellipse 70% 60% at 35% 65%, rgba(74,94,56,0.55) 0%, transparent 65%),
            radial-gradient(ellipse 50% 45% at 75% 30%, rgba(107,124,78,0.3) 0%, transparent 55%),
            linear-gradient(145deg, #0e1208 0%, #1a1f10 60%, #0e1208 100%);
        }
        @media (min-width: 640px) {
          .gallery__grid {
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: 200px;
          }
          .gallery__item--wide { grid-column: span 2; }
          .gallery__item--tall { grid-row: span 2; }
        }
        @media (min-width: 1024px) {
          .gallery__grid {
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 220px;
          }
        }
      `}</style>

      <section className="gallery" id="gallery" aria-labelledby="gallery-title" ref={sectionRef}>
        <div className="container">
          <div className="gallery__header">
            <span className="section-label reveal">Momentos Flama</span>
            <h2 className="section-title reveal reveal-delay-1" id="gallery-title">
              La <span>Experiencia</span> Visual
            </h2>
            <div className="olive-line center reveal reveal-delay-2" />
          </div>

          <div className="gallery__grid" aria-label="Galeria de fotos del restaurante">
            {ITEMS.map((item) => (
              <div
                key={item.caption}
                className={[
                  'gallery__item',
                  'reveal',
                  item.delay,
                  item.wide ? 'gallery__item--wide' : '',
                  item.tall ? 'gallery__item--tall' : '',
                ].filter(Boolean).join(' ')}
                data-caption={item.caption}
              >
                <img
                  className="gallery__img"
                  src={item.img}
                  alt={item.ariaLabel}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

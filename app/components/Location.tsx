'use client'

import { useEffect, useRef } from 'react'

/* ============================================================
   LOCATION — Ubicación y horarios
   - Mapa embebido de Google Maps (URL-based, sin API key)
   - Info de dirección, teléfono y horarios
   - Fila del día actual resaltada dinámicamente
   - Para usar iframe real: obtener código en Google Maps >
     Compartir > Insertar un mapa y reemplazar el src del iframe
   ============================================================ */

const WA_URL =
  'https://wa.me/527541086431?text=Hola%2C%20me%20gustar%C3%ADa%20reservar%20una%20mesa%20en%20Flama%20Restaurante.%20%C2%BFTienen%20disponibilidad%3F'

/* Filas de la tabla de horarios
   data-days: array de días (0=dom, 1=lun, ... 6=sab) */
const HOURS = [
  { label: 'Lunes',           hours: 'Cerrado',          days: [1],       closed: true  },
  { label: 'Martes – Jueves', hours: '1:00 pm – 11:00 pm', days: [2,3,4], closed: false },
  { label: 'Viernes – Sábado',hours: '1:00 pm – 1:00 am',  days: [5,6],   closed: false },
  { label: 'Domingo',         hours: '1:00 pm – 9:00 pm',  days: [0],     closed: false },
]

export default function Location() {
  const sectionRef = useRef<HTMLElement>(null)
  const tableRef   = useRef<HTMLTableSectionElement>(null)

  /* Scroll reveal */
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

  /* Resaltar fila del día actual */
  useEffect(() => {
    const tbody = tableRef.current
    if (!tbody) return
    const today = new Date().getDay()
    const rows  = tbody.querySelectorAll<HTMLTableRowElement>('tr[data-days]')
    rows.forEach((row) => {
      const raw  = row.getAttribute('data-days') || ''
      const days = raw.split(',').map(Number)
      if (days.includes(today)) row.classList.add('today')
    })
  }, [])

  return (
    <>
      <style>{`
        .location {
          padding: var(--space-xl) 0;
          background: transparent;
        }
        .location__inner {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }
        .map-wrapper {
          position: relative;
          min-height: 380px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--color-border);
        }
        .map-wrapper iframe {
          width: 100%;
          height: 100%;
          min-height: 380px;
          display: block;
          border: 0;
          filter: saturate(0.7) brightness(0.85);
        }
        .map-open-link {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background: var(--color-surface);
          color: var(--color-amber);
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          transition: background var(--transition), color var(--transition);
        }
        .map-open-link:hover {
          background: var(--color-amber);
          color: var(--color-bg);
        }
        .location__detail {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.75rem;
        }
        .location__detail-icon {
          font-size: 1.1rem;
          flex-shrink: 0;
          margin-top: 2px;
          width: 32px;
          height: 32px;
          background: rgba(107,124,78,0.1);
          border: 1px solid rgba(107,124,78,0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-olive);
        }
        .location__detail-title {
          font-family: var(--font-body);
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-olive);
          margin-bottom: 4px;
        }
        .location__detail-text {
          font-size: 0.92rem;
          font-weight: 300;
          color: var(--color-cream);
          line-height: 1.55;
        }
        .hours-table {
          width: 100%;
          border-collapse: collapse;
        }
        .hours-table tr { border-bottom: 1px solid var(--color-border); }
        .hours-table tr:last-child { border-bottom: none; }
        .hours-table tr:nth-child(even) td { background: rgba(200,185,154,0.03); }
        .hours-table td {
          padding: 0.65rem 0;
          font-size: 0.88rem;
          font-weight: 300;
          color: var(--color-text-muted);
        }
        .hours-table td:last-child {
          text-align: right;
          color: var(--color-amber-light);
          font-weight: 400;
        }
        .hours-table .today td { color: var(--color-cream); font-weight: 400; }
        .hours-table .today td:last-child { color: var(--color-sage); }
        .closed-day td { opacity: 0.4; }
        .closed-day td:last-child { color: var(--color-text-muted) !important; font-weight: 300 !important; }
        @media (min-width: 1024px) {
          .location__inner { flex-direction: row; gap: 5rem; }
          .map-wrapper      { flex: 1.3; min-height: 440px; }
          .map-wrapper iframe { min-height: 440px; }
          .location__info   { flex: 1; }
        }
      `}</style>

      <section className="location" id="location" aria-labelledby="location-title" ref={sectionRef}>
        <div className="container">
          <div className="location__inner">

            {/* Mapa embebido */}
            <div className="map-wrapper reveal" aria-label="Mapa de ubicacion de Flama Restaurante">
              <iframe
                src="https://maps.google.com/maps?q=Av.+Lazaro+Cardenas+71+Chilpancingo+Guerrero+Mexico&output=embed&z=15"
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicacion de Flama Restaurante en Chilpancingo, Guerrero"
              />
              <a
                href="https://maps.google.com/?q=Av+Lazaro+Cardenas+71+Chilpancingo+de+los+Bravo+Guerrero+Mexico"
                target="_blank"
                rel="noopener noreferrer"
                className="map-open-link"
                aria-label="Abrir en Google Maps"
              >
                Abrir en Google Maps &#8599;
              </a>
            </div>

            {/* Info y horarios */}
            <div className="location__info reveal reveal-delay-2">
              <span className="section-label">Encontranos</span>
              <h2 className="section-title" id="location-title">
                Ven a <span>Flama</span>
              </h2>
              <div className="olive-line" />

              {/* Dirección */}
              <div className="location__detail">
                <span className="location__detail-icon" aria-hidden="true">&#128205;</span>
                <div>
                  <div className="location__detail-title">Direccion</div>
                  <div className="location__detail-text">
                    Plaza Cárdenas Local E<br />
                    Av. Lázaro Cárdenas No. 71<br />
                    Chilpancingo de los Bravo, Gro.
                  </div>
                </div>
              </div>

              {/* Teléfono */}
              <div className="location__detail">
                <span className="location__detail-icon" aria-hidden="true">&#128222;</span>
                <div>
                  <div className="location__detail-title">Reservaciones</div>
                  <div className="location__detail-text">
                    <a
                      href="tel:+527541086431"
                      style={{ color: 'var(--color-amber)' }}
                    >
                      +52 754 108 6431
                    </a>
                    <br />
                    <small style={{ color: 'var(--color-text-muted)', fontWeight: 300 }}>
                      Tambien por WhatsApp
                    </small>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div className="location__detail">
                <span className="location__detail-icon" aria-hidden="true">&#128336;</span>
                <div>
                  <div className="location__detail-title">Horarios de atencion</div>
                  <table
                    className="hours-table"
                    aria-label="Horarios del restaurante"
                    id="hours-table"
                  >
                    <tbody ref={tableRef}>
                      {HOURS.map((row) => (
                        <tr
                          key={row.label}
                          className={row.closed ? 'closed-day' : ''}
                          data-days={row.days.join(',')}
                        >
                          <td>{row.label}</td>
                          <td>{row.hours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

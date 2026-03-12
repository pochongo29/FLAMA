/* ============================================================
   FOOTER
   - Logo, tagline, redes sociales
   - Links de navegación
   - Columna de contacto con dirección, teléfono y WhatsApp
   - Copyright
   ============================================================ */

const WA_URL =
  'https://wa.me/527541086431?text=Hola%2C%20me%20gustar%C3%ADa%20reservar%20una%20mesa%20en%20Flama%20Restaurante.%20%C2%BFTienen%20disponibilidad%3F'

export default function Footer() {
  return (
    <>
      <style>{`
        .footer {
          padding: var(--space-lg) 0 var(--space-md);
          background: #0a0907;
          border-top: 1px solid var(--color-border);
        }
        .footer__inner {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .footer__logo {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 400;
          color: var(--color-cream);
          letter-spacing: 0.06em;
        }
        .footer__tagline {
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 300;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-top: 5px;
        }
        .footer__socials {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.25rem;
        }
        .social-link {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(196,144,58,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          transition: all var(--transition);
        }
        .social-link svg {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }
        .social-link:hover {
          border-color: var(--color-amber);
          color: var(--color-amber);
          background: rgba(196,144,58,0.08);
          transform: translateY(-2px);
        }
        .footer__links {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem 2rem;
        }
        .footer__links a {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
          transition: color var(--transition);
        }
        .footer__links a:hover { color: var(--color-cream); }
        .footer__contact-label {
          font-family: var(--font-body);
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-olive);
          margin-bottom: 0.85rem;
        }
        .footer__contact-item {
          font-size: 0.82rem;
          font-weight: 300;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: 0.65rem;
        }
        .footer__contact-item a { transition: opacity var(--transition); }
        .footer__contact-item a:hover { opacity: 0.8; }
        .footer__bottom {
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
          text-align: center;
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 300;
          color: var(--color-text-muted);
          opacity: 0.6;
        }
        @media (min-width: 1024px) {
          .footer__inner {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 3rem;
          }
          .footer__brand     { flex: 1; }
          .footer__links-col { flex: 1; }
        }
      `}</style>

      <footer className="footer" aria-label="Pie de pagina">
        <div className="container">
          <div className="footer__inner">

            {/* Brand */}
            <div className="footer__brand">
              <div className="footer__logo">Flama</div>
              <div className="footer__tagline">Donde el fuego se convierte en arte</div>
              <div className="footer__socials" aria-label="Redes sociales">
                <a href="https://www.instagram.com/flama.mx" className="social-link" aria-label="Instagram de Flama" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/FlamaSteakHouse.MX" className="social-link" aria-label="Facebook de Flama" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Nav links */}
            <div className="footer__links-col">
              <nav className="footer__links" aria-label="Links del footer">
                <a href="#about">Nosotros</a>
                <a href="#dishes">Platillos</a>
                <a href="#menu">Menu</a>
                <a href="#gallery">Galeria</a>
                <a href="#location">Contacto</a>
              </nav>
            </div>

            {/* Contacto */}
            <div className="footer__links-col footer__contact-col">
              <p className="footer__contact-label">Contacto &amp; Ubicacion</p>
              <p className="footer__contact-item">
                <a href="tel:+527541086431" style={{ color: 'var(--color-amber)' }}>
                  +52 754 108 6431
                </a>
              </p>
              <p className="footer__contact-item">
                Plaza Cárdenas Local E<br />
                Av. Lázaro Cárdenas No. 71<br />
                Chilpancingo de los Bravo, Gro.
              </p>
              <p className="footer__contact-item">
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-olive)' }}
                >
                  Escribir por WhatsApp &#8599;
                </a>
              </p>
            </div>

          </div>

          <div className="footer__bottom">
            &copy; 2026 Flama Restaurante. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </>
  )
}

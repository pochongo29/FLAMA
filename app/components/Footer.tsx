/* ============================================================
   FOOTER
   - Logo, tagline, redes sociales
   - Links de navegación
   - Columna de contacto con dirección, teléfono y WhatsApp
   - Copyright
   ============================================================ */

const WA_URL =
  'https://wa.me/527471234567?text=Hola%2C%20me%20gustar%C3%ADa%20reservar%20una%20mesa%20en%20Flama%20Restaurante.%20%C2%BFTienen%20disponibilidad%3F'

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
          width: 40px;
          height: 40px;
          border: 1px solid var(--color-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: var(--color-text-muted);
          transition: all var(--transition);
        }
        .social-link:hover {
          border-color: rgba(107,124,78,0.5);
          color: var(--color-cream);
          background: rgba(107,124,78,0.08);
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
                {/* EDITAR: reemplaza los href con los links reales de tus redes */}
                <a href="https://www.instagram.com/flamarestaurante" className="social-link" aria-label="Instagram de Flama" target="_blank" rel="noopener noreferrer">&#128247;</a>
                <a href="https://www.facebook.com/flamarestaurante"  className="social-link" aria-label="Facebook de Flama"  target="_blank" rel="noopener noreferrer">&#128100;</a>
                <a href="#" className="social-link" aria-label="TikTok de Flama" rel="noopener">&#127926;</a>
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
                <a href="tel:+527471234567" style={{ color: 'var(--color-amber)' }}>
                  +52 747 123 4567
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

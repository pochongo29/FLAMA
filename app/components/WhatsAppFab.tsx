/* ============================================================
   WHATSAPP FAB — Botón flotante de WhatsApp
   - Siempre visible en la esquina inferior derecha
   - Pulso sutil con @keyframes
   - Tooltip "Reservar por WhatsApp" en hover (desktop)
   - EDITAR: reemplaza el número de WhatsApp en WA_URL
   ============================================================ */

const WA_URL =
  'https://wa.me/527541086431?text=Hola%2C%20me%20gustar%C3%ADa%20reservar%20una%20mesa%20en%20Flama%20Restaurante.%20%C2%BFTienen%20disponibilidad%3F'

export default function WhatsAppFab() {
  return (
    <>
      <style>{`
        .whatsapp-fab {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 900;
          width: 56px;
          height: 56px;
          background: var(--color-olive);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(74,94,56,0.35);
          transition: transform var(--transition), box-shadow var(--transition);
        }
        .whatsapp-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 28px rgba(74,94,56,0.55);
        }
        .whatsapp-fab svg { width: 28px; height: 28px; fill: var(--color-cream); }
        .whatsapp-fab::before {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px solid rgba(107,124,78,0.35);
          animation: fabPulse 3s ease infinite;
        }
        @keyframes fabPulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .whatsapp-fab__tooltip {
          position: absolute;
          right: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          background: var(--color-surface-2);
          color: var(--color-cream);
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          white-space: nowrap;
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }
        .whatsapp-fab__tooltip::after {
          content: '';
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-left-color: var(--color-surface-2);
        }
        .whatsapp-fab:hover .whatsapp-fab__tooltip { opacity: 1; }
      `}</style>

      <a
        href={WA_URL}
        className="whatsapp-fab"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
      >
        <span className="whatsapp-fab__tooltip" aria-hidden="true">
          Reservar por WhatsApp
        </span>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'

/* ============================================================
   RESERVATIONS — Formulario de reservación vía WhatsApp
   - Validación de campos requeridos con mensajes inline
   - Selección de turno con tarjetas visuales (Comida / Cena)
   - Hora deshabilitada hasta elegir turno
   - Bloqueo de lunes (día de cierre) con mensaje de error
   - Al enviar: construye mensaje y abre WhatsApp en nueva pestaña
   - Estado de éxito con folio aleatorio y opción de reset
   ============================================================ */

const WA_NUMBER = '527541086431'

/* Slots de hora por turno
   Editar aqui para cambiar los horarios disponibles */
const COMIDA_SLOTS = [
  '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30',
]
const CENA_SLOTS = [
  '19:00','19:30','20:00','20:30','21:00','21:30','22:00',
]

/* Opciones de ocasión especial */
const OCASIONES = [
  'Sin ocasión especial',
  'Cumpleaños',
  'Aniversario',
  'Reunión de negocios',
  'Propuesta',
  'Graduación',
  'Otra celebración',
]

/* Calcula el valor mínimo para el input date (mañana) */
function getTomorrow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

/* Convierte "2026-03-20" a "Viernes 20 de marzo de 2026" */
function formatFechaLegible(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* Genera folio de reservación tipo FL-XXX */
function genFolio(): string {
  return 'FL-' + String(Math.floor(100 + Math.random() * 900))
}

/* ── Tipos ───────────────────────────────────────────────── */
interface FormState {
  nombre:   string
  telefono: string
  personas: string
  fecha:    string
  turno:    'comida' | 'cena' | ''
  hora:     string
  ocasion:  string
  notas:    string
}

interface FormErrors {
  nombre?:   string
  telefono?: string
  personas?: string
  fecha?:    string
  turno?:    string
  hora?:     string
}

const INITIAL_FORM: FormState = {
  nombre:   '',
  telefono: '',
  personas: '',
  fecha:    '',
  turno:    '',
  hora:     '',
  ocasion:  'Sin ocasión especial',
  notas:    '',
}

/* ─────────────────────────────────────────────────────────── */

export default function Reservations() {
  const sectionRef = useRef<HTMLElement>(null)

  const [form,    setForm]    = useState<FormState>(INITIAL_FORM)
  const [errors,  setErrors]  = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)
  const [folio,   setFolio]   = useState('')

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

  /* Cuando cambia el turno, resetear la hora */
  function handleTurno(val: 'comida' | 'cena') {
    setForm((f) => ({ ...f, turno: val, hora: '' }))
    setErrors((e) => ({ ...e, turno: undefined, hora: undefined }))
  }

  /* Handler genérico para inputs/selects/textarea */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: undefined }))
  }

  /* Validación completa del formulario */
  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!form.nombre.trim())   errs.nombre   = 'Ingresa tu nombre completo'
    if (!form.telefono.trim()) errs.telefono = 'Ingresa tu número de teléfono'
    if (!form.personas)        errs.personas = 'Selecciona el número de personas'
    if (!form.fecha) {
      errs.fecha = 'Selecciona una fecha'
    } else {
      const [y, m, d] = form.fecha.split('-').map(Number)
      const dayOfWeek = new Date(y, m - 1, d).getDay()
      if (dayOfWeek === 1) errs.fecha = 'Los lunes estamos cerrados'
    }
    if (!form.turno) errs.turno = 'Selecciona un turno'
    if (!form.hora)  errs.hora  = 'Selecciona un horario'
    return errs
  }

  /* Envío del formulario */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      /* Scroll al primer campo con error */
      const firstErrKey = Object.keys(errs)[0]
      const el = document.querySelector<HTMLElement>(`[name="${firstErrKey}"], [data-field="${firstErrKey}"]`)
      el?.focus()
      return
    }

    const turnoLabel  = form.turno === 'comida' ? 'Comida' : 'Cena'
    const fechaLeg    = formatFechaLegible(form.fecha)
    const notasVal    = form.notas.trim() || 'Ninguna'

    const msg = [
      '🔥 *Solicitud de Reservación — Flama*',
      '',
      `👤 *Nombre:* ${form.nombre}`,
      `👥 *Personas:* ${form.personas}`,
      `📅 *Fecha:* ${fechaLeg}`,
      `🕒 *Turno:* ${turnoLabel} — ${form.hora} hrs`,
      `📱 *Teléfono:* ${form.telefono}`,
      `🎉 *Ocasión:* ${form.ocasion}`,
      `📝 *Notas:* ${notasVal}`,
      '',
      'Por favor confirmen mi reservación. ¡Gracias!',
    ].join('\n')

    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,
      '_blank'
    )

    setFolio(genFolio())
    setSuccess(true)
  }

  /* Reset al estado inicial */
  function handleReset() {
    setForm(INITIAL_FORM)
    setErrors({})
    setSuccess(false)
    setFolio('')
  }

  /* Slots de hora según turno activo */
  const horaSlots = form.turno === 'comida' ? COMIDA_SLOTS : form.turno === 'cena' ? CENA_SLOTS : []

  return (
    <>
      <style>{`
        /* ── Sección contenedora ─────────────────────────────── */
        .reservations {
          padding: var(--space-xl) 0;
          background:
            linear-gradient(
              180deg,
              var(--color-bg)      0%,
              var(--color-surface) 50%,
              var(--color-bg)      100%
            );
          position: relative;
        }

        /* Línea decorativa vertical superior */
        .reservations::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 64px;
          background: linear-gradient(180deg, var(--color-olive), transparent);
          opacity: 0.4;
        }

        .reservations__header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        /* ── Barra informativa sobre el formulario ───────────── */
        .res-info-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }
        .res-info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 0.55rem 1.1rem;
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
        }
        .res-info-item__icon {
          font-size: 0.9rem;
          color: var(--color-amber);
        }

        /* ── Tarjeta del formulario ──────────────────────────── */
        .res-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 2.5rem;
          box-shadow: var(--shadow-card);
          max-width: 860px;
          margin: 0 auto;
        }

        /* ── Grid del formulario ─────────────────────────────── */
        .res-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 640px) {
          /* Campos 1-2: lado a lado */
          .res-field--nombre   { grid-column: 1; }
          .res-field--telefono { grid-column: 2; }
          /* Campos 3-4: lado a lado */
          .res-field--personas { grid-column: 1; }
          .res-field--fecha    { grid-column: 2; }
          /* Turno y hora: ancho completo */
          .res-field--turno    { grid-column: 1 / -1; }
          .res-field--hora     { grid-column: 1 / -1; }
          /* Campos 7-8: lado a lado */
          .res-field--ocasion  { grid-column: 1; }
          .res-field--notas    { grid-column: 2; }

          .res-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* ── Etiqueta de campo ───────────────────────────────── */
        .res-label {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: 0.5rem;
          display: block;
        }
        .res-label .res-required {
          color: var(--color-amber);
          margin-left: 2px;
        }

        /* ── Inputs, selects, textarea ───────────────────────── */
        .res-input,
        .res-select,
        .res-textarea {
          width: 100%;
          background: var(--color-surface-2);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          color: var(--color-cream);
          font-family: var(--font-body);
          font-size: 0.92rem;
          font-weight: 300;
          padding: 0.75rem 1rem;
          min-height: 48px;
          transition: border-color var(--transition), box-shadow var(--transition);
          appearance: none;
          -webkit-appearance: none;
        }
        .res-input::placeholder,
        .res-textarea::placeholder {
          color: var(--color-text-muted);
        }
        .res-input:focus,
        .res-select:focus,
        .res-textarea:focus {
          border-color: var(--color-amber);
          outline: none;
          box-shadow: 0 0 0 3px rgba(196,128,42,0.12);
        }
        .res-input--error,
        .res-select--error {
          border-color: #C4502A;
          box-shadow: 0 0 0 3px rgba(196,80,42,0.10);
        }

        /* Select con flecha personalizada */
        .res-select-wrap {
          position: relative;
        }
        .res-select-wrap::after {
          content: '';
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid var(--color-text-muted);
          pointer-events: none;
        }
        .res-select {
          padding-right: 2.5rem;
          cursor: pointer;
        }
        .res-select:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        /* Color de opción en select (solo algunos navegadores) */
        .res-select option {
          background: var(--color-surface-2);
          color: var(--color-cream);
        }

        /* ── Mensaje de error inline ─────────────────────────── */
        .res-error {
          color: #C4502A;
          font-size: 0.75rem;
          margin-top: 0.35rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-family: var(--font-body);
          font-weight: 400;
        }

        /* ── Tarjetas de turno ───────────────────────────────── */
        .res-turno-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.875rem;
        }
        .res-turno-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 1rem 0.75rem;
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          cursor: pointer;
          transition:
            border-color var(--transition),
            background var(--transition),
            color var(--transition),
            box-shadow var(--transition);
          min-height: 80px;
          /* unselected */
          border: 1px solid var(--color-border);
          background: var(--color-surface-2);
          color: var(--color-text-muted);
        }
        .res-turno-card:hover {
          border-color: rgba(196,128,42,0.45);
          color: var(--color-cream);
        }
        .res-turno-card.selected {
          border-color: var(--color-amber);
          background: rgba(196,128,42,0.10);
          color: var(--color-amber);
          box-shadow: 0 0 0 3px rgba(196,128,42,0.12);
        }
        .res-turno-card__icon {
          font-size: 1.35rem;
          line-height: 1;
        }
        .res-turno-card__title {
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .res-turno-card__hours {
          font-size: 0.72rem;
          font-weight: 300;
          opacity: 0.75;
          letter-spacing: 0.04em;
        }
        /* Error en turno — borde en ambas tarjetas */
        .res-turno-group--error .res-turno-card {
          border-color: rgba(196,80,42,0.55);
        }

        /* ── Textarea ────────────────────────────────────────── */
        .res-textarea {
          min-height: 48px;
          resize: vertical;
        }

        /* ── Botón de envío ──────────────────────────────────── */
        .res-submit {
          width: 100%;
          background: var(--color-amber);
          color: var(--color-bg);
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          border: none;
          border-radius: var(--radius-sm);
          min-height: 52px;
          padding: 0 2rem;
          cursor: pointer;
          transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          margin-top: 0.5rem;
        }
        .res-submit:hover {
          background: var(--color-amber-light);
          transform: translateY(-2px);
          box-shadow: var(--shadow-amber);
        }
        .res-submit:active {
          transform: translateY(0);
        }

        /* ── Estado de éxito ─────────────────────────────────── */
        .res-success {
          text-align: center;
          padding: 3rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .res-success__check {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(90,122,56,0.15);
          border: 1px solid var(--color-olive);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          animation: resCheckIn 0.5s ease both;
        }
        @keyframes resCheckIn {
          from { transform: scale(0.6); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        .res-success__title {
          font-family: var(--font-heading);
          font-size: clamp(1.7rem, 4vw, 2.4rem);
          font-weight: 400;
          color: var(--color-cream);
          line-height: 1.2;
        }
        .res-success__desc {
          font-size: 0.92rem;
          font-weight: 300;
          color: var(--color-text-muted);
          max-width: 420px;
          line-height: 1.8;
        }
        .res-success__folio {
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          background: var(--color-surface-2);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 0.45rem 1.1rem;
        }
        .res-success__folio span {
          color: var(--color-amber);
          margin-left: 0.4rem;
        }
        .res-success__reset {
          margin-top: 0.5rem;
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: var(--radius-sm);
          padding: 0.65rem 1.5rem;
          cursor: pointer;
          transition: border-color var(--transition), color var(--transition);
          min-height: 44px;
        }
        .res-success__reset:hover {
          border-color: var(--color-olive);
          color: var(--color-cream);
        }

        /* ── Mobile adjustments ──────────────────────────────── */
        @media (max-width: 639px) {
          .res-card {
            padding: 1.5rem;
          }
          .res-turno-group {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 400px) {
          .res-turno-group {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section
        className="reservations"
        id="reservaciones"
        aria-labelledby="reservations-title"
        ref={sectionRef}
      >
        <div className="container">

          {/* Encabezado de sección */}
          <div className="reservations__header reveal">
            <span className="section-label">Reservaciones</span>
            <h2 className="section-title" id="reservations-title">
              Reserva tu <span>mesa</span>
            </h2>
            <div className="olive-line center" />
          </div>

          {/* Barra informativa */}
          <div className="res-info-bar reveal reveal-delay-1" aria-label="Informacion de reservacion">
            <div className="res-info-item">
              <span className="res-info-item__icon" aria-hidden="true">&#9679;</span>
              Confirmacion en 30 min
            </div>
            <div className="res-info-item">
              <span className="res-info-item__icon" aria-hidden="true">&#9679;</span>
              Mar – Dom
            </div>
            <div className="res-info-item">
              <span className="res-info-item__icon" aria-hidden="true">&#9679;</span>
              Sin costo de reserva
            </div>
          </div>

          {/* Tarjeta principal */}
          <div className="res-card reveal reveal-delay-2">

            {/* ── Estado de éxito ──────────────────────────────── */}
            {success ? (
              <div className="res-success" role="alert" aria-live="polite">
                <div className="res-success__check" aria-hidden="true">&#10003;</div>
                <h3 className="res-success__title">&#161;Solicitud enviada!</h3>
                <p className="res-success__desc">
                  WhatsApp se abrio con todos tus datos. Envia el mensaje para
                  completar tu reservacion. Te confirmaremos en menos de 30 minutos
                  durante horario de atencion.
                </p>
                <div className="res-success__folio" aria-label={`Numero de folio ${folio}`}>
                  Folio <span>{folio}</span>
                </div>
                <button
                  type="button"
                  className="res-success__reset"
                  onClick={handleReset}
                >
                  Hacer otra reservacion
                </button>
              </div>
            ) : (

              /* ── Formulario ────────────────────────────────── */
              <form onSubmit={handleSubmit} noValidate aria-label="Formulario de reservacion">
                <div className="res-grid">

                  {/* 1. Nombre completo */}
                  <div className="res-field--nombre">
                    <label htmlFor="res-nombre" className="res-label">
                      Nombre completo <span className="res-required" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="res-nombre"
                      name="nombre"
                      type="text"
                      autoComplete="name"
                      className={`res-input${errors.nombre ? ' res-input--error' : ''}`}
                      placeholder="Tu nombre completo"
                      value={form.nombre}
                      onChange={handleChange}
                      aria-required="true"
                      aria-describedby={errors.nombre ? 'err-nombre' : undefined}
                    />
                    {errors.nombre && (
                      <p className="res-error" id="err-nombre" role="alert">
                        <span aria-hidden="true">&#9679;</span> {errors.nombre}
                      </p>
                    )}
                  </div>

                  {/* 2. Teléfono */}
                  <div className="res-field--telefono">
                    <label htmlFor="res-telefono" className="res-label">
                      Telefono <span className="res-required" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="res-telefono"
                      name="telefono"
                      type="tel"
                      autoComplete="tel"
                      className={`res-input${errors.telefono ? ' res-input--error' : ''}`}
                      placeholder="Ej. 747 123 4567"
                      value={form.telefono}
                      onChange={handleChange}
                      aria-required="true"
                      aria-describedby={errors.telefono ? 'err-telefono' : undefined}
                    />
                    {errors.telefono && (
                      <p className="res-error" id="err-telefono" role="alert">
                        <span aria-hidden="true">&#9679;</span> {errors.telefono}
                      </p>
                    )}
                  </div>

                  {/* 3. Número de personas */}
                  <div className="res-field--personas">
                    <label htmlFor="res-personas" className="res-label">
                      Personas <span className="res-required" aria-hidden="true">*</span>
                    </label>
                    <div className="res-select-wrap">
                      <select
                        id="res-personas"
                        name="personas"
                        className={`res-select${errors.personas ? ' res-select--error' : ''}`}
                        value={form.personas}
                        onChange={handleChange}
                        aria-required="true"
                        aria-describedby={errors.personas ? 'err-personas' : undefined}
                      >
                        <option value="" disabled>Selecciona</option>
                        {['1','2','3','4','5','6'].map((n) => (
                          <option key={n} value={n}>{n} persona{n !== '1' ? 's' : ''}</option>
                        ))}
                        <option value="7 o más">7 o más personas</option>
                      </select>
                    </div>
                    {errors.personas && (
                      <p className="res-error" id="err-personas" role="alert">
                        <span aria-hidden="true">&#9679;</span> {errors.personas}
                      </p>
                    )}
                  </div>

                  {/* 4. Fecha */}
                  <div className="res-field--fecha">
                    <label htmlFor="res-fecha" className="res-label">
                      Fecha <span className="res-required" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="res-fecha"
                      name="fecha"
                      type="date"
                      className={`res-input${errors.fecha ? ' res-input--error' : ''}`}
                      min={getTomorrow()}
                      value={form.fecha}
                      onChange={handleChange}
                      aria-required="true"
                      aria-describedby={errors.fecha ? 'err-fecha' : undefined}
                    />
                    {errors.fecha && (
                      <p className="res-error" id="err-fecha" role="alert">
                        <span aria-hidden="true">&#9679;</span> {errors.fecha}
                      </p>
                    )}
                  </div>

                  {/* 5. Turno — ocupa todo el ancho */}
                  <div className="res-field--turno">
                    <span
                      className="res-label"
                      id="turno-label"
                    >
                      Turno <span className="res-required" aria-hidden="true">*</span>
                    </span>
                    <div
                      className={`res-turno-group${errors.turno ? ' res-turno-group--error' : ''}`}
                      role="group"
                      aria-labelledby="turno-label"
                      data-field="turno"
                    >
                      <button
                        type="button"
                        className={`res-turno-card${form.turno === 'comida' ? ' selected' : ''}`}
                        onClick={() => handleTurno('comida')}
                        aria-pressed={form.turno === 'comida'}
                        aria-label="Turno Comida de 1pm a 5pm"
                      >
                        <span className="res-turno-card__icon" aria-hidden="true">&#127829;</span>
                        <span className="res-turno-card__title">Comida</span>
                        <span className="res-turno-card__hours">1pm – 5pm</span>
                      </button>
                      <button
                        type="button"
                        className={`res-turno-card${form.turno === 'cena' ? ' selected' : ''}`}
                        onClick={() => handleTurno('cena')}
                        aria-pressed={form.turno === 'cena'}
                        aria-label="Turno Cena de 7pm a 11pm"
                      >
                        <span className="res-turno-card__icon" aria-hidden="true">&#127769;</span>
                        <span className="res-turno-card__title">Cena</span>
                        <span className="res-turno-card__hours">7pm – 11pm</span>
                      </button>
                    </div>
                    {errors.turno && (
                      <p className="res-error" id="err-turno" role="alert">
                        <span aria-hidden="true">&#9679;</span> {errors.turno}
                      </p>
                    )}
                  </div>

                  {/* 6. Hora — ocupa todo el ancho, deshabilitado sin turno */}
                  <div className="res-field--hora">
                    <label htmlFor="res-hora" className="res-label">
                      Hora <span className="res-required" aria-hidden="true">*</span>
                    </label>
                    <div className="res-select-wrap">
                      <select
                        id="res-hora"
                        name="hora"
                        className={`res-select${errors.hora ? ' res-select--error' : ''}`}
                        value={form.hora}
                        onChange={handleChange}
                        disabled={!form.turno}
                        aria-required="true"
                        aria-disabled={!form.turno}
                        aria-describedby={errors.hora ? 'err-hora' : 'hint-hora'}
                      >
                        <option value="" disabled>
                          {form.turno ? 'Selecciona un horario' : 'Primero elige un turno'}
                        </option>
                        {horaSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot} hrs</option>
                        ))}
                      </select>
                    </div>
                    {!form.turno && !errors.hora && (
                      <p className="res-error" id="hint-hora" style={{ color: 'var(--color-text-muted)' }}>
                        Elige un turno para ver los horarios disponibles
                      </p>
                    )}
                    {errors.hora && (
                      <p className="res-error" id="err-hora" role="alert">
                        <span aria-hidden="true">&#9679;</span> {errors.hora}
                      </p>
                    )}
                  </div>

                  {/* 7. Ocasión especial */}
                  <div className="res-field--ocasion">
                    <label htmlFor="res-ocasion" className="res-label">
                      Ocasion especial
                    </label>
                    <div className="res-select-wrap">
                      <select
                        id="res-ocasion"
                        name="ocasion"
                        className="res-select"
                        value={form.ocasion}
                        onChange={handleChange}
                      >
                        {OCASIONES.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 8. Notas */}
                  <div className="res-field--notas">
                    <label htmlFor="res-notas" className="res-label">
                      Notas adicionales
                    </label>
                    <textarea
                      id="res-notas"
                      name="notas"
                      className="res-textarea"
                      rows={3}
                      placeholder="Alergias, preferencia de mesa, decoracion especial..."
                      value={form.notas}
                      onChange={handleChange}
                    />
                  </div>

                </div>{/* /res-grid */}

                {/* Botón de envío */}
                <button type="submit" className="res-submit">
                  <span aria-hidden="true">&#128172;</span>
                  Solicitar reservacion por WhatsApp
                </button>

              </form>
            )}

          </div>{/* /res-card */}
        </div>{/* /container */}
      </section>
    </>
  )
}

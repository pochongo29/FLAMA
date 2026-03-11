'use client'

import { useState, useEffect, useRef } from 'react'

/* ============================================================
   MENU — Carta completa con tabs
   ============================================================ */

interface MenuItem { name: string; desc: string; price: string }
interface MenuCategory { id: string; label: string; items: MenuItem[] }

const MENU_DATA: MenuCategory[] = [
  {
    id: 'entradas', label: 'Entradas',
    items: [
      { name: 'Carpaccio de Res',         desc: 'Trufa negra, parmesano, aceite de oliva',                       price: '$210' },
      { name: 'Ceviche de Camaron',        desc: 'Citricos, cilantro, aguacate, tostadas',                        price: '$185' },
      { name: 'Bruschetta Flama',          desc: 'Pan artesanal, tomate asado, queso de cabra, reduccion de vino', price: '$145' },
      { name: 'Tabla de Embutidos',        desc: 'Seleccion de quesos y carnes curadas importadas',                price: '$320' },
      { name: 'Sopa de Cebolla Gratinada', desc: 'Estilo frances, gruyere fundido, costron de pan',               price: '$155' },
    ],
  },
  {
    id: 'principales', label: 'Principales',
    items: [
      { name: 'Ribeye al Carbon — 400g',      desc: 'Mantequilla de hierbas, papa gratinada, ensalada verde', price: '$480' },
      { name: 'Costilla BBQ Flama',            desc: 'Salsa secreta de la casa, coleslaw, elote asado',        price: '$410' },
      { name: 'Pulpo a la Plancha',            desc: 'Pure de papa ahumada, pimenton, micro hierbas',          price: '$320' },
      { name: 'Salmon en Costra de Pistache',  desc: 'Miel de agave, quinoa, esparragos',                      price: '$295' },
      { name: 'Pechuga Rellena',               desc: 'Espinacas, queso manchego, salsa de champiñones',        price: '$255' },
      { name: 'Pasta al Ajillo con Mariscos',  desc: 'Camarones, almejas, calamar, vino blanco',               price: '$275' },
    ],
  },
  {
    id: 'postres', label: 'Postres',
    items: [
      { name: 'Coulant de Chocolate',   desc: 'Centro liquido, helado de vainilla artesanal',          price: '$145' },
      { name: 'Creme Brulee',           desc: 'Vainilla de Papantla, caramelo quemado en mesa',         price: '$125' },
      { name: 'Tarta de Queso Ricotta', desc: 'Frutos rojos frescos, coulis de frambuesa',              price: '$135' },
      { name: 'Helados Artesanales',    desc: '3 bolas a elegir — vainilla, chocolate, pistache, fresa', price: '$95' },
    ],
  },
  {
    id: 'bebidas', label: 'Bebidas',
    items: [
      { name: 'Coctel Flama',           desc: 'Mezcal, citricos, chile ancho, sal de gusano',                 price: '$145' },
      { name: 'Vino Tinto Copa',        desc: 'Seleccion del sommelier — Malbec o Tempranillo',               price: '$120' },
      { name: 'Vino Blanco Copa',       desc: 'Chardonnay o Sauvignon Blanc de temporada',                    price: '$110' },
      { name: 'Agua Mineral / Natural', desc: '500ml',                                                        price: '$45'  },
      { name: 'Cafe de Olla Flama',     desc: 'Preparado con canela y piloncillo, grano de origen',           price: '$65'  },
    ],
  },
]

/* ============================================================
   Perlin noise (módulo local)
   ============================================================ */
const _P = new Uint8Array(512)
;(() => {
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [p[i], p[j]] = [p[j], p[i]] }
  for (let i = 0; i < 512; i++) _P[i] = p[i & 255]
})()
function _f(t: number) { return t*t*t*(t*(t*6-15)+10) }
function _l(a: number, b: number, t: number) { return a+t*(b-a) }
function _g(h: number, x: number, y: number) { const g=h&3,u=g<2?x:y,v=g<2?y:x; return ((g&1)?-u:u)+((g&2)?-v:v) }
function _n(x: number, y: number) {
  const X=Math.floor(x)&255,Y=Math.floor(y)&255,xf=x-Math.floor(x),yf=y-Math.floor(y)
  const u=_f(xf),v=_f(yf),a=_P[X]+Y,b=_P[X+1]+Y
  return _l(_l(_g(_P[a],xf,yf),_g(_P[b],xf-1,yf),u),_l(_g(_P[a+1],xf,yf-1),_g(_P[b+1],xf-1,yf-1),u),v)
}

/* ============================================================
   Renderizado de flama premium sobre canvas 2D
   ============================================================ */
function renderFlame(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  t: number,
  masterAlpha: number
) {
  const cx    = W / 2
  const baseY = H * 0.75
  const fw    = W * 0.38
  const fh    = H * 0.65

  const breath = 0.88 + 0.12 * Math.sin(t * 1.4)
  const A      = masterAlpha * breath
  const sway   = _n(t * 0.28, 0.0) * fw * 0.22

  ctx.save()
  ctx.globalCompositeOperation = 'source-over'

  /* ── Pool de calor basal ── */
  const gBase = ctx.createRadialGradient(cx, baseY, 0, cx, baseY, fw * 1.4)
  gBase.addColorStop(0,   `rgba(220,100,10,${0.55 * A})`)
  gBase.addColorStop(0.45,`rgba(160, 60, 6,${0.28 * A})`)
  gBase.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.save(); ctx.scale(1, 0.22)
  ctx.beginPath(); ctx.arc(cx, baseY/0.22, fw*1.4, 0, Math.PI*2)
  ctx.fillStyle = gBase; ctx.fill(); ctx.restore()

  /* ── Capas de volumen (exterior → núcleo) ── */
  const layers = [
    // yFrac  rxF   ryF     r    g   b   maxA  swF
    [0.00,  0.62, 0.20,  210,  85, 10, 0.52, 0.10],
    [0.10,  0.50, 0.18,  225, 108, 14, 0.60, 0.14],
    [0.22,  0.40, 0.16,  238, 132, 20, 0.65, 0.20],
    [0.34,  0.31, 0.14,  248, 158, 28, 0.68, 0.26],
    [0.46,  0.23, 0.13,  252, 180, 36, 0.65, 0.32],
    [0.57,  0.17, 0.12,  254, 200, 52, 0.60, 0.38],
    [0.67,  0.11, 0.11,  255, 218, 78, 0.52, 0.43],
    [0.77,  0.07, 0.10,  255, 234,115, 0.40, 0.47],
    [0.86,  0.045,0.09,  255, 248,162, 0.28, 0.49],
  ]

  ctx.globalCompositeOperation = 'lighter'

  for (let i = 0; i < layers.length; i++) {
    const [yF, rxF, ryF, r, g, b, mA, swF] = layers[i]
    const py = baseY - fh * (yF as number)
    const sw = sway + _n(t*0.40 + i*0.9, i*0.7) * fw * (swF as number)
    const rx = fw * (rxF as number)
    const ry = fh * (ryF as number)

    const grd = ctx.createRadialGradient(cx+sw, py, 0, cx+sw, py, rx)
    grd.addColorStop(0,    `rgba(${r},${g},${b},${(mA as number)*A})`)
    grd.addColorStop(0.40, `rgba(${r},${g},${b},${(mA as number)*A*0.5})`)
    grd.addColorStop(1,    `rgba(${r},${g},${b},0)`)

    ctx.save()
    ctx.translate(cx+sw, py)
    ctx.scale(1, ry/rx)
    ctx.beginPath(); ctx.arc(0, 0, rx, 0, Math.PI*2)
    ctx.fillStyle = grd; ctx.fill()
    ctx.restore()
  }

  /* ── Núcleo luminoso ── */
  const coreY = baseY - fh * 0.32
  const cr    = fw * 0.15
  const cg2   = ctx.createRadialGradient(cx+sway*0.3, coreY, 0, cx+sway*0.3, coreY, cr)
  cg2.addColorStop(0,   `rgba(255,252,210,${0.80*A})`)
  cg2.addColorStop(0.5, `rgba(255,230,140,${0.38*A})`)
  cg2.addColorStop(1,   'rgba(255,190,70,0)')
  ctx.beginPath(); ctx.arc(cx+sway*0.3, coreY, cr, 0, Math.PI*2)
  ctx.fillStyle = cg2; ctx.fill()

  ctx.restore()
}

/* ============================================================
   COMPONENTE
   ============================================================ */
export default function Menu() {
  const [activeTab, setActiveTab] = useState('entradas')

  /* 'idle' → 'burning' → 'out' → 'done' */
  const [phase, setPhase] = useState<'idle'|'burning'|'out'|'done'>('idle')
  const phaseRef   = useRef<'idle'|'burning'|'out'|'done'>('idle')
  const introFired = useRef(false)

  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)

  /* ── Reveal animations (sin cambios) ── */
  useEffect(() => {
    const section = sectionRef.current; if (!section) return
    const els = section.querySelectorAll<HTMLElement>('.reveal'); if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  /* ── Disparo de la intro al entrar al viewport ── */
  useEffect(() => {
    const section = sectionRef.current; if (!section) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !introFired.current) {
            introFired.current = true
            obs.disconnect()
            phaseRef.current = 'burning'
            setPhase('burning')
          }
        })
      },
      { threshold: 0.08 }          /* 8% visible ya es suficiente */
    )
    obs.observe(section)
    return () => obs.disconnect()
  }, [])

  /* ── Animación de la flama ── */
  useEffect(() => {
    if (phase !== 'burning') return

    /* Espera un frame para que el canvas esté en el DOM con layout */
    const raf = requestAnimationFrame(() => {
      const canvas = canvasRef.current; if (!canvas) return
      const ctx    = canvas.getContext('2d'); if (!ctx) return

      /* Canvas fijo: 320×460 CSS px. El attr width/height ya está puesto en JSX. */
      const CW = 320, CH = 460
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width  = CW * dpr
      canvas.height = CH * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const FADE_IN  = 420    // ms
      const BURN     = 1000   // ms
      const FADE_OUT = 460    // ms
      const TOTAL    = FADE_IN + BURN + FADE_OUT   // 1880 ms

      let animId: number
      let start = 0

      function loop(now: number) {
        if (!start) start = now
        const el = now - start
        ctx!.clearRect(0, 0, CW, CH)

        let alpha: number
        if (el < FADE_IN) {
          alpha = 1 - Math.pow(1 - el / FADE_IN, 2.8)
        } else if (el < FADE_IN + BURN) {
          alpha = 1
        } else if (el < TOTAL) {
          alpha = Math.pow(1 - (el - FADE_IN - BURN) / FADE_OUT, 2)
        } else {
          ctx!.clearRect(0, 0, CW, CH)
          cancelAnimationFrame(animId)
          phaseRef.current = 'out'
          setPhase('out')
          return
        }

        renderFlame(ctx!, CW, CH, el * 0.001, alpha)
        animId = requestAnimationFrame(loop)
      }

      animId = requestAnimationFrame(loop)
      return () => cancelAnimationFrame(animId)
    })

    return () => cancelAnimationFrame(raf)
  }, [phase])

  /* ── Transición out → done (tiempo de fade-out CSS del overlay) ── */
  useEffect(() => {
    if (phase !== 'out') return
    const t = setTimeout(() => setPhase('done'), 550)
    return () => clearTimeout(t)
  }, [phase])

  /* Opacidad del overlay */
  const overlayOpacity = phase === 'burning' ? 1 : 0

  return (
    <>
      <style>{`
        .menu {
          position: relative;
          padding: var(--space-xl) 0;
          background: var(--color-bg-2);
          overflow: hidden;
        }
        .menu__header { text-align: center; margin-bottom: 3.5rem; }
        .menu__tabs {
          display: flex; overflow-x: auto; gap: 0;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 2.5rem; scrollbar-width: none;
        }
        .menu__tabs::-webkit-scrollbar { display: none; }
        .tab-btn {
          flex-shrink: 0; padding: 0.75rem 1.6rem;
          font-family: var(--font-body); font-size: 0.78rem; font-weight: 400;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--color-text-muted); border-bottom: 2px solid transparent;
          margin-bottom: -1px; min-height: 44px; background: transparent;
          transition: color var(--transition), border-color var(--transition);
        }
        .tab-btn.active { color: var(--color-cream); border-bottom-color: var(--color-amber); }
        .tab-btn:hover:not(.active) { color: var(--color-cream); }
        .menu__list { display: flex; flex-direction: column; }
        .menu-item {
          display: flex; align-items: center; justify-content: space-between;
          gap: 1.5rem; padding: 1.2rem 0;
          border-bottom: 1px solid var(--color-border);
        }
        .menu-item:last-child { border-bottom: none; }
        .menu-item__info { flex: 1; }
        .menu-item__name {
          font-family: var(--font-heading); font-size: 1.05rem; font-weight: 500;
          color: var(--color-cream); margin-bottom: 3px; letter-spacing: 0.01em;
        }
        .menu-item__desc { font-size: 0.8rem; font-weight: 300; color: var(--color-text-muted); line-height: 1.45; }
        .menu-item__price {
          font-family: var(--font-heading); font-size: 1.1rem; font-weight: 400;
          color: var(--color-amber-light); white-space: nowrap; flex-shrink: 0;
        }

        /* ── Overlay de intro ── */
        .menu__intro {
          position: absolute; inset: 0; z-index: 20;
          display: flex; align-items: center; justify-content: center;
          background: var(--color-bg-2);
          pointer-events: none;
          transition: opacity 0.50s ease;
        }
        .menu__intro canvas {
          display: block;
          /* Blur CSS: difumina la llama para bordes completamente suaves */
          filter: blur(16px);
          will-change: filter;
        }
      `}</style>

      <section className="menu" id="menu" aria-labelledby="menu-title" ref={sectionRef}>

        {/* Overlay — presente en DOM desde 'burning' hasta 'done' */}
        {phase !== 'idle' && phase !== 'done' && (
          <div
            className="menu__intro"
            aria-hidden="true"
            style={{ opacity: overlayOpacity, pointerEvents: phase === 'burning' ? 'all' : 'none' }}
          >
            <canvas
              ref={canvasRef}
              width={640}   /* 320 × 2dpr — tamaño fijo en attrs para evitar offsetWidth=0 */
              height={920}  /* 460 × 2dpr */
              style={{ width: '320px', height: '460px' }}
            />
          </div>
        )}

        <div className="container">
          <div className="menu__header">
            <span className="section-label reveal">Toda la carta</span>
            <h2 className="section-title reveal reveal-delay-1" id="menu-title">
              Nuestro <span>Menu</span>
            </h2>
            <div className="olive-line center reveal reveal-delay-2" />
          </div>

          <div className="menu__tabs" role="tablist" aria-label="Categorias del menu">
            {MENU_DATA.map((cat) => (
              <button
                key={cat.id}
                className={`tab-btn${activeTab === cat.id ? ' active' : ''}`}
                role="tab"
                aria-selected={activeTab === cat.id}
                aria-controls={`tab-${cat.id}`}
                id={`btn-${cat.id}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div id={`tab-${MENU_DATA.find(c=>c.id===activeTab)!.id}`} role="tabpanel" aria-labelledby={`btn-${activeTab}`}>
            <ul className="menu__list">
              {MENU_DATA.find(c=>c.id===activeTab)!.items.map((item) => (
                <li key={item.name} className="menu-item">
                  <div className="menu-item__info">
                    <div className="menu-item__name">{item.name}</div>
                    <div className="menu-item__desc">{item.desc}</div>
                  </div>
                  <span className="menu-item__price">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

'use client'

import { useEffect, useRef } from 'react'

const WA_URL =
  'https://wa.me/527541086431?text=Hola%2C%20me%20gustar%C3%ADa%20reservar%20una%20mesa%20en%20Flama%20Restaurante.%20%C2%BFTienen%20disponibilidad%3F'

/* ─── Ruido Perlin ─────────────────────────────────────────── */
const perm = new Uint8Array(512)
;(() => {
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]]
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
})()

function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10) }
function lerpN(a: number, b: number, t: number) { return a + t * (b - a) }
function grad2(h: number, x: number, y: number) {
  const g = h & 3; const u = g < 2 ? x : y; const v = g < 2 ? y : x
  return ((g & 1) ? -u : u) + ((g & 2) ? -v : v)
}
function noise(x: number, y: number) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255
  const xf = x - Math.floor(x), yf = y - Math.floor(y)
  const u = fade(xf), v = fade(yf)
  const a = perm[X] + Y, b = perm[X + 1] + Y
  return lerpN(
    lerpN(grad2(perm[a],     xf,     yf),     grad2(perm[b],     xf - 1, yf),     u),
    lerpN(grad2(perm[a + 1], xf,     yf - 1), grad2(perm[b + 1], xf - 1, yf - 1), u),
    v
  )
}

/* ─── Flama luxury ─────────────────────────────────────────────
   Técnica: gradientes radiales apilados sin paths duros.
   El canvas tiene filter:blur(28px) en CSS → bordes completamente
   difuminados, nunca un contorno visible.
   Composición aditiva para que las capas de luz se sumen
   orgánicamente, igual que una llama real.
   ────────────────────────────────────────────────────────────── */
function drawLuxuryFlame(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  w: number,      // ancho de referencia
  h: number,      // alto de referencia
  t: number,
  alpha: number   // masterAlpha (idle = 1.0)
) {
  /* Respiración: pulsación muy sutil de la intensidad */
  const breath = 0.88 + 0.12 * Math.sin(t * 1.1)
  const A = alpha * breath

  /* Vaivén global — muy lento, orgánico */
  const swayMain = noise(t * 0.22, 0.0) * w * 0.18

  ctx.save()
  /* Composición aditiva: las capas de luz se suman como fuego real */
  ctx.globalCompositeOperation = 'lighter'

  /* ── Capa 0: pool de calor en la base (más ancho que la llama) ── */
  {
    const rx = w * 1.1, ry = h * 0.14
    const g = ctx.createRadialGradient(cx, baseY, 0, cx, baseY, rx)
    g.addColorStop(0,   `rgba(200, 100, 15, ${0.20 * A})`)
    g.addColorStop(0.5, `rgba(160,  70, 10, ${0.10 * A})`)
    g.addColorStop(1,   'rgba(0,0,0,0)')
    ctx.save()
    ctx.scale(1, ry / rx)
    ctx.beginPath()
    ctx.arc(cx, baseY * (rx / ry), rx, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()
    ctx.restore()
  }

  /* ── Capas principales: 9 "volúmenes" de luz apilados ──
     Cada uno es una elipse radial. Suben desde la base a la punta.
     El ancho disminuye y el desplazamiento aumenta hacia arriba.
     CAMBIO: alphas casi doblados respecto a la versión anterior.
  ── */
  const volumes = [
    //  yFrac   rxFac  ryFac   r    g    b    maxA    swayFac
    [0.00,  0.62, 0.20, 210,  95,  15,  0.28,  0.10 ],
    [0.10,  0.50, 0.18, 220, 110,  18,  0.32,  0.12 ],
    [0.22,  0.42, 0.16, 230, 130,  22,  0.36,  0.16 ],
    [0.34,  0.34, 0.14, 240, 150,  28,  0.36,  0.22 ],
    [0.46,  0.26, 0.13, 248, 170,  35,  0.32,  0.28 ],
    [0.57,  0.20, 0.12, 252, 190,  50,  0.28,  0.34 ],
    [0.67,  0.14, 0.11, 254, 210,  75,  0.22,  0.40 ],
    [0.77,  0.09, 0.10, 255, 228, 110,  0.16,  0.45 ],
    [0.87,  0.055,0.09, 255, 242, 160,  0.10,  0.48 ],
  ]

  for (let i = 0; i < volumes.length; i++) {
    const [yFrac, rxFac, ryFac, r, g, b, maxA, swayFac] = volumes[i]
    const py = baseY - h * (yFrac as number)

    /* Cada capa tiene su propio ruido para movimiento independiente */
    const sway = swayMain + noise(t * 0.35 + i * 0.7, i * 0.5) * w * (swayFac as number)

    const rx = w * (rxFac as number)
    const ry = h * (ryFac as number)

    const grd = ctx.createRadialGradient(cx + sway, py, 0, cx + sway, py, rx)
    grd.addColorStop(0,    `rgba(${r},${g},${b},${(maxA as number) * A})`)
    grd.addColorStop(0.45, `rgba(${r},${g},${b},${(maxA as number) * A * 0.55})`)
    grd.addColorStop(1,    `rgba(${r},${g},${b},0)`)

    /* Escala vertical para conseguir elipse alargada */
    ctx.save()
    ctx.translate(cx + sway, py)
    ctx.scale(1, ry / rx)
    ctx.beginPath()
    ctx.arc(0, 0, rx, 0, Math.PI * 2)
    ctx.fillStyle = grd
    ctx.fill()
    ctx.restore()
  }

  /* ── Núcleo luminoso: destello central brillante ──
     CAMBIO: alpha de 0.22 → 0.50 para hacerlo claramente visible
  ── */
  {
    const coreY = baseY - h * 0.28
    const coreSway = swayMain * 0.5
    const coreR = w * 0.12
    const cg = ctx.createRadialGradient(cx + coreSway, coreY, 0, cx + coreSway, coreY, coreR)
    cg.addColorStop(0,    `rgba(255, 245, 200, ${0.50 * A})`)
    cg.addColorStop(0.5,  `rgba(255, 220, 130, ${0.22 * A})`)
    cg.addColorStop(1,    'rgba(255,180,60,0)')
    ctx.beginPath()
    ctx.arc(cx + coreSway, coreY, coreR, 0, Math.PI * 2)
    ctx.fillStyle = cg
    ctx.fill()
  }

  ctx.restore()
}

export default function Hero() {
  const flameRef = useRef<HTMLCanvasElement>(null)

  /* phaseRef solo se usa internamente en el loop — ya no necesitamos
     setState para mostrar contenido. El contenido aparece con CSS
     animation independiente del canvas. */
  const phaseRef   = useRef<'intro' | 'settling' | 'idle'>('intro')
  const phaseStart = useRef<number>(0)

  /* ── Canvas flama ── */
  useEffect(() => {
    const canvas = flameRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let startTime = 0
    const INTRO_DUR  = 1800
    const SETTLE_DUR = 900

    /* CAMBIO: fallback a window.innerWidth/Height si offsetWidth es 0
       (ocurre cuando el canvas aún no tiene layout calculado) */
    function resize() {
      if (!canvas) return
      canvas.width  = canvas.offsetWidth  || window.innerWidth
      canvas.height = canvas.offsetHeight || window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function loop(now: number) {
      if (!startTime) startTime = now
      const elapsed = now - startTime
      const W = canvas!.width, H = canvas!.height
      const cx = W / 2, baseY = H * 0.62
      ctx!.clearRect(0, 0, W, H)
      const t = elapsed * 0.001

      if (phaseRef.current === 'intro') {
        const p  = Math.min(elapsed / INTRO_DUR, 1)
        const e  = 1 - Math.pow(1 - p, 3)
        /* La llama crece desde 0 durante el intro — el texto ya es visible */
        drawLuxuryFlame(ctx!, cx, baseY, W * 0.18 * e, H * 0.52 * e, t, e)
        if (elapsed >= INTRO_DUR) {
          phaseRef.current = 'settling'; phaseStart.current = now
        }

      } else if (phaseRef.current === 'settling') {
        const p  = Math.min((now - phaseStart.current) / SETTLE_DUR, 1)
        const e  = 1 - Math.pow(1 - p, 3)
        /* CAMBIO: settling va de alpha 1 → 1 (ya no bajamos a 0.6) */
        drawLuxuryFlame(ctx!, cx,
          lerpN(baseY,   H * 0.56, e),
          lerpN(W * 0.18, W * 0.13, e),
          lerpN(H * 0.52, H * 0.34, e),
          t, lerpN(1, 1, e)
        )
        if (p >= 1) { phaseRef.current = 'idle'; phaseStart.current = now }

      } else {
        /* CAMBIO: idle usa alpha 1.0 en lugar de 0.6 — llama siempre intensa */
        drawLuxuryFlame(ctx!, cx, H * 0.56, W * 0.13, H * 0.34, t, 1.0)
      }

      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <>
      <style>{`
        .hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
        }
        .hero__overlay {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(180deg,transparent 0%,transparent 45%,rgba(10,14,8,.55) 80%,rgba(10,14,8,.8) 100%);
        }

        /* ── Flama: blur CSS para bordes completamente difuminados ── */
        #flame-canvas {
          position: absolute; inset: 0; width: 100%; height: 100%;
          z-index: 2; pointer-events: none;
          filter: blur(28px);
          will-change: filter;
        }

        /* Zona logo + flama */
        .hero__flame-logo {
          position: relative; z-index: 3;
          display: flex; align-items: center; justify-content: center;
          width: 300px; height: 180px;
          margin-bottom: 0.25rem;
        }

        /* ── CAMBIO: logo aparece con su propia animación CSS,
           independiente del estado del canvas ── */
        .hero__logo {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          z-index: 4;
          animation: fadeUp 0.8s ease forwards;
        }
        .hero__logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(3rem, 7.5vw, 4.8rem);
          letter-spacing: 0.4em;
          padding-right: 0.4em;
          color: rgba(237,229,212,0.92);
          text-shadow:
            0 0 25px rgba(255,190,50,0.55),
            0 0 55px rgba(220,120,15,0.30),
            0 0 85px rgba(180,70,5,0.15);
          user-select: none;
        }

        /* Contenido principal — aparece con fadeUp propio, sin esperar al canvas */
        .hero__content {
          position: relative; z-index: 3;
          padding: 0 1.5rem var(--space-md);
          max-width: 680px;
          animation: fadeUp 0.8s ease 0.15s both;
        }

        .hero__eyebrow {
          font-family: var(--font-body);
          font-size: 0.68rem; font-weight: 500;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--color-olive); display: block; margin-bottom: 1.2rem;
        }
        .hero__title {
          font-family: var(--font-heading);
          font-size: clamp(2.4rem, 7vw, 4.8rem);
          font-weight: 300; line-height: 1.08;
          color: var(--color-cream); margin-bottom: 1.4rem; letter-spacing: .01em;
        }
        .hero__title em { font-style: italic; color: var(--color-amber-light); }
        .hero__sub {
          font-family: var(--font-body);
          font-size: clamp(.88rem, 2.2vw, 1.05rem);
          color: var(--color-text-muted); font-weight: 300;
          max-width: 440px; margin: 0 auto 2.5rem; line-height: 1.8;
        }
        .hero__ctas {
          display: flex; flex-wrap: wrap; gap: .75rem;
          justify-content: center; align-items: center;
        }

        /* Scroll indicator — aparece con fadeUp, ligero delay */
        .hero__scroll {
          position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
          z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 8px;
          animation: fadeUp 0.8s ease 0.3s both;
        }
        .hero__scroll span {
          font-family: var(--font-body); font-size: .62rem;
          letter-spacing: .2em; text-transform: uppercase;
          color: var(--color-text-muted); opacity: .6;
        }
        .hero__scroll-line {
          width: 1px; height: 44px;
          background: linear-gradient(180deg, var(--color-olive), transparent);
          animation: scrollPulse 2.4s ease infinite;
        }

        /* ── Keyframes compartidos ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%,100%{opacity:.3;transform:scaleY(1)} 50%{opacity:.8;transform:scaleY(1.2)}
        }
      `}</style>

      <section className="hero" id="hero" aria-label="Bienvenida a Flama">
        <div className="hero__overlay" aria-hidden="true" />

        {/* Flama luxury — z-index 2, blur 28px via CSS */}
        <canvas ref={flameRef} id="flame-canvas" aria-hidden="true" />

        {/* Logo encima — aparece con CSS animation, no espera al canvas */}
        <div className="hero__flame-logo">
          <div className="hero__logo">
            <span className="hero__logo-text">FLAMA</span>
          </div>
        </div>

        {/* Contenido — CSS animation propia, visible desde el primer render */}
        <div className="hero__content">
          <span className="hero__eyebrow">Restaurante — Chilpancingo, Guerrero</span>
          <h1 className="hero__title">
            Donde el fuego<br />
            se convierte en <em>arte</em>
          </h1>
          <p className="hero__sub">
            Una experiencia gastronómica pensada para quienes buscan algo más que comer.
            Ingredientes vivos, atmósfera íntima, momentos que perduran.
          </p>
          <div className="hero__ctas">
            <a href="#reservaciones" className="btn-primary">
              Reservar Mesa
            </a>
            <a href="#menu" className="btn-secondary">
              Ver Menú
            </a>
          </div>
        </div>

        <div className="hero__scroll" aria-hidden="true">
          <div className="hero__scroll-line" />
          <span>Descubrir</span>
        </div>
      </section>
    </>
  )
}

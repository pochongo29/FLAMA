'use client'

import { useEffect, useRef } from 'react'

/* ============================================================
   EMBER BACKGROUND — Brasas flotantes premium
   Canvas fixed a pantalla completa, z-index -1.

   Capas (de atrás hacia adelante):
   1. Fondo casi negro con cálido resplandor radial suave
   2. GlowOrb   — orbes grandes, muy difusos, profundidad trasera
   3. Ember      — partículas medias con halo suave
   4. MicroSpark — chispas finas y nítidas, primer plano

   Técnica de calidad:
   - devicePixelRatio para renderizado nítido en 4K / HiDPI
   - shadowBlur diferenciado por capa (profundidad cinematográfica)
   - Distribución gaussiana en X: más densidad en el centro
   - Velocidad y drift orgánico por partícula individual
   ============================================================ */

/* ── Paleta incandescente (nunca saturada, siempre cálida) ── */
type RGBA = [number, number, number, number]

const PALETTE_MICRO: RGBA[] = [
  [210,  68,  8,  0.85],
  [195,  82, 10,  0.80],
  [175,  48,  6,  0.75],
  [225,  90, 12,  0.90],
  [160,  38,  5,  0.70],
  [190,  60,  8,  0.78],
]

const PALETTE_EMBER: RGBA[] = [
  [230,  95, 14,  1.0],
  [215, 110, 18,  1.0],
  [200,  78, 10,  1.0],
  [245, 120, 20,  1.0],
  [185,  58,  8,  1.0],
]

const PALETTE_ORB: RGBA[] = [
  [180,  60,  8,  1.0],
  [155,  45,  6,  1.0],
  [200,  80, 12,  1.0],
  [165,  52,  7,  1.0],
]

/* ── Distribución tipo-gaussiana (suma de 3 uniformes) ── */
function gaussian(): number {
  return (Math.random() + Math.random() + Math.random()) / 3
}

/* ─────────────────────────────────────────────────────────────
   CLASE BASE
   ───────────────────────────────────────────────────────────── */
abstract class Particle {
  x = 0; y = 0; vx = 0; vy = 0
  radius = 0; life = 0; maxLife = 0
  r = 0; g = 0; b = 0; peakA = 0
  driftPhase = 0; driftAmp = 0; driftFreq = 0

  protected W = 0; protected H = 0

  constructor(W: number, H: number) {
    this.W = W; this.H = H
    this.spawn(true)
  }

  protected abstract pickColor(): RGBA
  protected abstract pickSize(): number
  protected abstract pickLife(): number
  protected abstract pickSpeed(): number

  spawn(init: boolean) {
    const [r, g, b, a] = this.pickColor()
    this.r = r; this.g = g; this.b = b; this.peakA = a

    this.radius    = this.pickSize()
    this.maxLife   = this.pickLife()
    this.life      = init ? Math.random() * this.maxLife : 0

    /* X: distribución campaniforme centrada, con bias hacia el centro inferior */
    const spread   = this.W * 0.38
    this.x = this.W * 0.5 + (gaussian() * 2 - 1) * spread

    /* Y: spawn en tercio inferior, más denso en la base */
    this.y = init
      ? this.H * (0.3 + Math.random() * 0.7)
      : this.H * (0.75 + Math.random() * 0.35)

    this.vy = -this.pickSpeed()
    this.vx = (Math.random() - 0.5) * 0.12

    this.driftPhase = Math.random() * Math.PI * 2
    this.driftAmp   = Math.random() * 0.35 + 0.05
    this.driftFreq  = Math.random() * 0.018 + 0.006
  }

  update() {
    this.life++
    this.driftPhase += this.driftFreq
    this.x  += this.vx + Math.sin(this.driftPhase) * this.driftAmp
    this.y  += this.vy
    /* Micro-turbulencia vertical */
    this.vy += (Math.random() - 0.5) * 0.004

    if (this.x < -10) this.x = this.W + 10
    if (this.x > this.W + 10) this.x = -10
    if (this.y < -20 || this.life > this.maxLife) this.spawn(false)
  }

  alpha(): number {
    const p = this.life / this.maxLife
    if (p < 0.12) return (p / 0.12) * this.peakA
    if (p > 0.65) return ((1 - p) / 0.35) * this.peakA
    return this.peakA
  }

  abstract draw(ctx: CanvasRenderingContext2D): void
}

/* ─────────────────────────────────────────────────────────────
   MICRO SPARK — nítida, sin blur, muy pequeña
   ───────────────────────────────────────────────────────────── */
class MicroSpark extends Particle {
  pickColor() { return PALETTE_MICRO[Math.floor(Math.random() * PALETTE_MICRO.length)] }
  pickSize()  { return Math.random() * 0.9 + 0.25 }
  pickLife()  { return Math.random() * 110 + 55 }
  pickSpeed() { return Math.random() * 0.55 + 0.18 }

  draw(ctx: CanvasRenderingContext2D) {
    const a = this.alpha()
    if (a <= 0) return
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${a.toFixed(3)})`
    ctx.fill()
  }
}

/* ─────────────────────────────────────────────────────────────
   EMBER — brasa media con halo suave
   ───────────────────────────────────────────────────────────── */
class Ember extends Particle {
  blur = 0

  pickColor() { return PALETTE_EMBER[Math.floor(Math.random() * PALETTE_EMBER.length)] }
  pickSize()  { return Math.random() * 2.0 + 0.9 }
  pickLife()  { return Math.random() * 180 + 90 }
  pickSpeed() { return Math.random() * 0.38 + 0.10 }

  spawn(init: boolean) {
    super.spawn(init)
    this.blur = Math.random() * 8 + 3
  }

  draw(ctx: CanvasRenderingContext2D) {
    const a = this.alpha()
    if (a <= 0) return
    ctx.save()
    ctx.shadowBlur  = this.blur
    ctx.shadowColor = `rgba(${this.r},${this.g},${this.b},${(a * 0.6).toFixed(3)})`
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${a.toFixed(3)})`
    ctx.fill()
    ctx.restore()
  }
}

/* ─────────────────────────────────────────────────────────────
   GLOW ORB — orbe grande, muy difuso, simula profundidad
   ───────────────────────────────────────────────────────────── */
class GlowOrb extends Particle {
  blur = 0

  pickColor() { return PALETTE_ORB[Math.floor(Math.random() * PALETTE_ORB.length)] }
  pickSize()  { return Math.random() * 5 + 3 }
  pickLife()  { return Math.random() * 320 + 160 }
  pickSpeed() { return Math.random() * 0.18 + 0.04 }

  spawn(init: boolean) {
    super.spawn(init)
    this.blur = Math.random() * 22 + 18
    this.peakA *= 0.45   /* mucho más tenue que las brasas */
    this.driftAmp *= 0.5 /* se mueve más suavemente */
  }

  draw(ctx: CanvasRenderingContext2D) {
    const a = this.alpha()
    if (a <= 0) return
    ctx.save()
    ctx.shadowBlur  = this.blur
    ctx.shadowColor = `rgba(${this.r},${this.g},${this.b},${(a * 0.5).toFixed(3)})`
    /* Gradiente radial para el halo difuso */
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3.5)
    grd.addColorStop(0,   `rgba(${this.r},${this.g},${this.b},${a.toFixed(3)})`)
    grd.addColorStop(0.4, `rgba(${this.r},${this.g},${this.b},${(a * 0.45).toFixed(3)})`)
    grd.addColorStop(1,   `rgba(${this.r},${this.g},${this.b},0)`)
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius * 3.5, 0, Math.PI * 2)
    ctx.fillStyle = grd
    ctx.fill()
    ctx.restore()
  }
}

/* ─────────────────────────────────────────────────────────────
   COMPONENTE
   ───────────────────────────────────────────────────────────── */
export default function EmberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let W = 0, H = 0
    let dpr = 1
    /* Lógico = dimensiones CSS; canvas.width/height = resolución real */
    let lW = 0, lH = 0

    /* ── Gradiente de calor dibujado en canvas (no CSS) ──────── */
    function drawHeat() {
      /* Base — casi negro con tinte cálido muy leve */
      ctx!.fillStyle = '#080509'
      ctx!.fillRect(0, 0, W, H)

      /* Zona central inferior: resplandor principal */
      const g1 = ctx!.createRadialGradient(
        W * 0.5, H * 0.88, 0,
        W * 0.5, H * 0.88, W * 0.72
      )
      g1.addColorStop(0,    'rgba(115, 44, 8,  0.22)')
      g1.addColorStop(0.28, 'rgba( 88, 30, 6,  0.14)')
      g1.addColorStop(0.55, 'rgba( 62, 18, 4,  0.07)')
      g1.addColorStop(1,    'rgba(  0,  0, 0,  0)')
      ctx!.fillStyle = g1
      ctx!.fillRect(0, 0, W, H)

      /* Resplandor secundario asimétrico (más natural) */
      const g2 = ctx!.createRadialGradient(
        W * 0.42, H * 0.78, 0,
        W * 0.42, H * 0.78, W * 0.50
      )
      g2.addColorStop(0,    'rgba(130, 55, 10, 0.14)')
      g2.addColorStop(0.4,  'rgba( 95, 35,  7, 0.07)')
      g2.addColorStop(1,    'rgba(  0,  0,  0, 0)')
      ctx!.fillStyle = g2
      ctx!.fillRect(0, 0, W, H)

      /* Tercer foco: lado contrario para asimetría */
      const g3 = ctx!.createRadialGradient(
        W * 0.62, H * 0.95, 0,
        W * 0.62, H * 0.95, W * 0.35
      )
      g3.addColorStop(0,   'rgba(100, 38, 7, 0.11)')
      g3.addColorStop(1,   'rgba(  0,  0, 0, 0)')
      ctx!.fillStyle = g3
      ctx!.fillRect(0, 0, W, H)

      /* Vignette superior — refuerza el negro absoluto en los bordes */
      const gTop = ctx!.createLinearGradient(0, 0, 0, H * 0.55)
      gTop.addColorStop(0,    'rgba(4, 2, 6, 0.78)')
      gTop.addColorStop(0.55, 'rgba(4, 2, 6, 0)')
      ctx!.fillStyle = gTop
      ctx!.fillRect(0, 0, W, H)

      /* Vignette lateral izquierda */
      const gL = ctx!.createLinearGradient(0, 0, W * 0.22, 0)
      gL.addColorStop(0,   'rgba(4, 2, 6, 0.50)')
      gL.addColorStop(1,   'rgba(4, 2, 6, 0)')
      ctx!.fillStyle = gL
      ctx!.fillRect(0, 0, W, H)

      /* Vignette lateral derecha */
      const gR = ctx!.createLinearGradient(W, 0, W * 0.78, 0)
      gR.addColorStop(0,   'rgba(4, 2, 6, 0.50)')
      gR.addColorStop(1,   'rgba(4, 2, 6, 0)')
      ctx!.fillStyle = gR
      ctx!.fillRect(0, 0, W, H)
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2.5)
      lW  = canvas!.offsetWidth
      lH  = canvas!.offsetHeight
      canvas!.width  = Math.round(lW * dpr)
      canvas!.height = Math.round(lH * dpr)
      /* Resetea la transformación antes de escalar (evita acumulación en resize) */
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      /* Toda la lógica usa dimensiones CSS (lógicas) */
      W = lW; H = lH
    }
    resize()
    window.addEventListener('resize', resize)

    /* ── Instanciar partículas ────────────────────────────────── */
    /* Conteos pensados para densidad orgánica pero no excesiva */
    const particles: Particle[] = [
      ...Array.from({ length: 14 }, () => new GlowOrb(W, H)),
      ...Array.from({ length: 72 }, () => new Ember(W, H)),
      ...Array.from({ length: 260 }, () => new MicroSpark(W, H)),
    ]

    /* ── Loop principal ─────────────────────────────────────── */
    function animate() {
      drawHeat()

      /* Capa 1 — GlowOrbs (muy difusos, fondo) */
      for (let i = 0; i < 14; i++) {
        particles[i].update()
        particles[i].draw(ctx!)
      }

      /* Capa 2 — Embers (halo suave, plano medio) */
      for (let i = 14; i < 86; i++) {
        particles[i].update()
        particles[i].draw(ctx!)
      }

      /* Capa 3 — MicroSparks (nítidas, primer plano) */
      for (let i = 86; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw(ctx!)
      }

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      <style>{`
        #ember-bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
          display: block;
        }
      `}</style>
      <canvas ref={canvasRef} id="ember-bg" aria-hidden="true" />
    </>
  )
}

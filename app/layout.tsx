import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

/* ============================================================
   FUENTES — Google Fonts con display=swap para performance
   ============================================================ */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
})

/* ============================================================
   METADATOS SEO — Open Graph + Twitter Card
   Actualiza la URL canonical y og:image cuando tengas dominio real
   ============================================================ */
export const metadata: Metadata = {
  title: 'Flama — Restaurante Premium en Chilpancingo, Guerrero',
  description:
    'Flama Restaurante — Chilpancingo, Guerrero. Cocina de fuego vivo, ingredientes de temporada y atmosfera intima. Reserva tu mesa hoy.',
  keywords:
    'restaurante Chilpancingo, restaurante premium Guerrero, Flama restaurante, cena especial Chilpancingo, cocina de autor Guerrero',
  authors: [{ name: 'Flama Restaurante' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://flamarestaurante.mx/',
  },
  openGraph: {
    type: 'website',
    url: 'https://flamarestaurante.mx/',
    siteName: 'Flama Restaurante',
    title: 'Flama — Restaurante Premium en Chilpancingo',
    description:
      'Cocina de fuego vivo, atmosfera de selva tropical y muebles de piel. Una experiencia gastronómica que no olvidaras. Plaza Cardenas, Chilpancingo.',
    images: [
      {
        url: 'https://flamarestaurante.mx/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Flama Restaurante — Chilpancingo, Guerrero',
      },
    ],
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flama — Restaurante Premium en Chilpancingo',
    description:
      'Cocina de fuego vivo, atmosfera de selva tropical y muebles de piel. Plaza Cardenas, Chilpancingo, Guerrero.',
    images: ['https://flamarestaurante.mx/og-image.jpg'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

/* ============================================================
   SCHEMA.ORG — JSON-LD para SEO local (Restaurant / LocalBusiness)
   ============================================================ */
const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Flama Restaurante',
  description:
    'Restaurante premium con cocina de fuego vivo, vegetacion tropical y muebles de piel. Experiencia gastronómica de autor en Chilpancingo, Guerrero.',
  url: 'https://flamarestaurante.mx/',
  telephone: '+527541086431',
  priceRange: '$$$$',
  servesCuisine: ['Mexicana contemporanea', 'Cocina de autor', 'Parrilla'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Plaza Cardenas Local E, Av. Lazaro Cardenas No. 71',
    addressLocality: 'Chilpancingo de los Bravo',
    addressRegion: 'Guerrero',
    postalCode: '39000',
    addressCountry: 'MX',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 17.5506,
    longitude: -99.5001,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday'],
      opens: '13:00',
      closes: '23:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday', 'Saturday'],
      opens: '13:00',
      closes: '01:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '13:00',
      closes: '21:00',
    },
  ],
  hasMap:
    'https://maps.google.com/?q=Plaza+Cardenas+Av+Lazaro+Cardenas+71+Chilpancingo+Guerrero',
  sameAs: [
    'https://www.instagram.com/flamarestaurante',
    'https://www.facebook.com/FlamaSteakHouse.MX',
  ],
}

/* ============================================================
   ROOT LAYOUT
   ============================================================ */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

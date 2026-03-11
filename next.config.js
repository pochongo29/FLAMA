/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite al iframe de Google Maps cargarse sin restricciones
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

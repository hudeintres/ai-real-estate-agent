/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // API calls and static files are proxied to the FastAPI backend
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/offers/:path*',
        destination: `${backendUrl}/offers/:path*`,
      },
    ]
  },
}

module.exports = nextConfig


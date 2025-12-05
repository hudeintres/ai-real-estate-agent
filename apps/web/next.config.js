/** @type {import('next').NextConfig} */
const path = require('path')
const { config } = require('dotenv')

// Load .env file from the root of the monorepo
// This ensures DATABASE_URL and other env vars are available
config({ path: path.resolve(__dirname, '../../.env') })

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@real-estate/db'],
}

module.exports = nextConfig


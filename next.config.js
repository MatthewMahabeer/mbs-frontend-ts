require("dotenv").config()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}
module.exports = nextConfig;

module.exports = {
  env: {
    JWT_SECRET: "mbsapplication2022"
  }
}

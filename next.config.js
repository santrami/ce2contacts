/** @type {import('next').NextConfig} */
const nextConfig = {
    //reactStrictMode: false
    env: {
      USER:process.env.NEXT_PUBLIC_USER,
      PASS:process.env.NEXT_PUBLIC_PASS,
      }
}

module.exports = nextConfig

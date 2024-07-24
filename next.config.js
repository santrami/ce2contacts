/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      USER:process.env.EMAIL_SERVER_USER,
      PASS:process.env.EMAIL_SERVER_USER,
      }, 
    
}

module.exports = nextConfig

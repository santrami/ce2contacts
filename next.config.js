/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
      USER:process.env.EMAIL_SERVER_USER,
      PASS:process.env.EMAIL_SERVER_USER,
      }, 
    
}

module.exports = nextConfig
